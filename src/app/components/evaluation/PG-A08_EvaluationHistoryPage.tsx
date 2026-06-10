import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Filter,
  History,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type AiEvaluationResult = "MATCH" | "CHECK_REQUIRED" | "NOT_MATCH";
type ReviewStatusFilter =
  | "SAVED"
  | "DECLINED";

type EvaluationHistoryApiResponse = {
  id: number;
  grantCaseId: number;
  aiSuitability: string;
  aiRecommendationLevel: string;
  aiReason: string;
  aiEvidence: string;
  organizationSnapshot: string | null;
  charterSnapshot: string | null;
  activitySnapshot: string | null;
  grantSnapshot: string | null;
  aiRawResponse: string | null;
  evaluatedAt: string | null;
  reviewStatus: string;
  reviewMemo: string | null;
  reviewedAt: string | null;
};

type GrantCaseApiResponse = {
  id: number;
  caseName: string;
  grantMasterId: number;
};

type EvaluationHistoryView = {
  id: number;
  historyCode: string;
  grantCaseId: number;
  grantName: string;
  provider: string;
  evaluatedAt: string;
  fiscalYear: string;
  evaluatorName: string;
  aiResult: AiEvaluationResult;
  recommendationLevel: string;
  aiReason: string;
  aiEvidence: string;
  reviewStatus: string;
  reviewMemo: string;
  reviewedAt: string;
};

const aiResultLabel: Record<AiEvaluationResult, string> = {
  MATCH: "適合",
  CHECK_REQUIRED: "要確認",
  NOT_MATCH: "不適合",
};

const aiResultStyle: Record<AiEvaluationResult, string> = {
  MATCH: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  CHECK_REQUIRED: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  NOT_MATCH: "border-slate-500/40 bg-slate-500/20 text-slate-300",
};

const API_BASE_URL = "http://localhost:8080";

const normalizeAiResult = (value: string): AiEvaluationResult => {
  if (value === "SUITABLE" || value === "MATCH") {
    return "MATCH";
  }

  if (value === "UNSUITABLE" || value === "NOT_MATCH") {
    return "NOT_MATCH";
  }

  return "CHECK_REQUIRED";
};

const formatDate = (value: string | null): string => {
  if (!value) {
    return "未設定";
  }

  return value.slice(0, 10);
};

const getFiscalYearLabel = (value: string | null): string => {
  if (!value) {
    return "年度不明";
  }

  return `${value.slice(0, 4)}年度`;
};

const getReviewStatusLabel = (reviewStatus: string): string => {
  switch (reviewStatus) {
    case "SAVED":
      return "検討中";
    case "DECLINED":
      return "見送り";
    default:
      return "未判断";
  }
};

const convertEvaluationHistoryToView = (
  history: EvaluationHistoryApiResponse,
  grantCaseMap: Map<number, GrantCaseApiResponse>
): EvaluationHistoryView => {
  const grantCase = grantCaseMap.get(history.grantCaseId);

  return {
    id: history.id,
    historyCode: `EH-${String(history.id).padStart(4, "0")}`,
    grantCaseId: history.grantCaseId,
    grantName: grantCase?.caseName ?? `関連案件ID: ${history.grantCaseId}`,
    provider: "関連案件詳細で確認",
    evaluatedAt: formatDate(history.evaluatedAt),
    fiscalYear: getFiscalYearLabel(history.evaluatedAt),
    evaluatorName: "AI判定",
    aiResult: normalizeAiResult(history.aiSuitability),
    recommendationLevel: history.aiRecommendationLevel,
    aiReason: history.aiReason,
    aiEvidence: history.aiEvidence,
    reviewStatus: history.reviewStatus,
    reviewMemo: history.reviewMemo ?? "",
    reviewedAt: formatDate(history.reviewedAt),
  };
};

const fiscalYearOptions = ["すべて", "2026年度", "2025年度"] as const;

export function PGA08EvaluationHistoryPage() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [selectedFiscalYear, setSelectedFiscalYear] =
    useState<(typeof fiscalYearOptions)[number]>("すべて");
  const [selectedAiResult, setSelectedAiResult] =
    useState<AiEvaluationResult | "ALL">("ALL");
  const [selectedReviewStatus, setSelectedReviewStatus] =
    useState<ReviewStatusFilter>("SAVED");
  const [evaluationHistories, setEvaluationHistories] =
    useState<EvaluationHistoryView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchEvaluationHistories = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(`${API_BASE_URL}/api/evaluation-histories`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("AI判定履歴一覧APIエラー:", errorText);
          throw new Error("AI判定履歴一覧の取得に失敗しました。");
        }

        const histories: EvaluationHistoryApiResponse[] = await response.json();

        const latestDisplayHistoryMap = new Map<number, EvaluationHistoryApiResponse>();

        const historiesByGrantCase = new Map<number, EvaluationHistoryApiResponse[]>();

        histories.forEach((history) => {
          const list = historiesByGrantCase.get(history.grantCaseId) ?? [];
          list.push(history);
          historiesByGrantCase.set(history.grantCaseId, list);
        });

        historiesByGrantCase.forEach((caseHistories, grantCaseId) => {
          const sortedHistories = [...caseHistories].sort(
            (a, b) => b.id - a.id
          );

          const latestHistory = sortedHistories[0];

          if (latestHistory.reviewStatus === "PROCEEDED") {
            return;
          }

          if (
            latestHistory.reviewStatus === "SAVED" ||
            latestHistory.reviewStatus === "DECLINED"
          ) {
            latestDisplayHistoryMap.set(grantCaseId, latestHistory);
            return;
          }

          const latestReviewedHistory = sortedHistories.find(
            (history) =>
              history.reviewStatus === "SAVED" ||
              history.reviewStatus === "DECLINED"
          );

          if (latestReviewedHistory) {
            latestDisplayHistoryMap.set(grantCaseId, latestReviewedHistory);
          }
        });

        const visibleHistories = Array.from(
          latestDisplayHistoryMap.values()
        );

        const uniqueGrantCaseIds = Array.from(
          new Set(visibleHistories.map((history) => history.grantCaseId))
        );

        const grantCases = await Promise.all(
          uniqueGrantCaseIds.map(async (grantCaseId) => {
            const grantCaseResponse = await fetch(
              `${API_BASE_URL}/api/grant-cases/${grantCaseId}`
            );

            if (!grantCaseResponse.ok) {
              return null;
            }

            const grantCase: GrantCaseApiResponse = await grantCaseResponse.json();
            return grantCase;
          })
        );

        const grantCaseMap = new Map<number, GrantCaseApiResponse>();

        grantCases.forEach((grantCase) => {
          if (grantCase) {
            grantCaseMap.set(grantCase.id, grantCase);
          }
        });

        setEvaluationHistories(
          visibleHistories.map((history) =>
            convertEvaluationHistoryToView(history, grantCaseMap)
          )
        );
      } catch (error) {
        console.error(error);
        setErrorMessage("AI判定履歴一覧の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluationHistories();
  }, []);

  const filteredHistories = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return evaluationHistories.filter((history) => {
      if (history.reviewStatus !== selectedReviewStatus) {
        return false;
      }

      if (
        selectedFiscalYear !== "すべて" &&
        history.fiscalYear !== selectedFiscalYear
      ) {
        return false;
      }

      if (
        selectedAiResult !== "ALL" &&
        history.aiResult !== selectedAiResult
      ) {
        return false;
      }

      const searchableText = [
        history.historyCode,
        history.grantName,
        history.provider,
        history.evaluatorName,
        history.aiReason,
        history.aiEvidence,
        aiResultLabel[history.aiResult],
        history.recommendationLevel,
      ]
        .join(" ")
        .toLowerCase();

      if (
        normalizedKeyword !== "" &&
        !searchableText.includes(normalizedKeyword)
      ) {
        return false;
      }

      return true;
    });
  }, [
    evaluationHistories,
    keyword,
    selectedFiscalYear,
    selectedAiResult,
    selectedReviewStatus,
  ]);

  const totalCount = filteredHistories.length;
  const matchCount = filteredHistories.filter(
    (history) => history.aiResult === "MATCH"
  ).length;
  const checkRequiredCount = filteredHistories.filter(
    (history) => history.aiResult === "CHECK_REQUIRED"
  ).length;
  const notMatchCount = filteredHistories.filter(
    (history) => history.aiResult === "NOT_MATCH"
  ).length;

  const handleOpenDetail = (historyId: number) => {
    navigate(`/evaluation-histories/${historyId}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 py-8">
        <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-slate-950/60 backdrop-blur">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              <Sparkles size={16} />
              PG-A08 AI判定履歴
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white">
              AI判定履歴
            </h1>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                icon={<History size={20} />}
                label="表示対象件数"
                value={`${totalCount}件`}
                cardClassName="border-cyan-500/30 bg-cyan-500/10"
                iconClassName="bg-cyan-500/20 text-cyan-200"
              />

              <SummaryCard
                icon={<BadgeCheck size={20} />}
                label="適合"
                value={`${matchCount}件`}
                cardClassName="border-emerald-500/30 bg-emerald-500/10"
                iconClassName="bg-emerald-500/20 text-emerald-200"
              />

              <SummaryCard
                icon={<CalendarClock size={20} />}
                label="要確認"
                value={`${checkRequiredCount}件`}
                cardClassName="border-amber-500/30 bg-amber-500/10"
                iconClassName="bg-amber-500/20 text-amber-200"
              />

              <SummaryCard
                icon={<ShieldCheck size={20} />}
                label="不適合"
                value={`${notMatchCount}件`}
                cardClassName="border-rose-500/30 bg-rose-500/10"
                iconClassName="bg-rose-500/20 text-rose-200"
              />
            </div>
          </div>
        </section>

        {isLoading && (
          <section className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300 backdrop-blur">
            AI判定履歴を読み込み中です。
          </section>
        )}

        {errorMessage && (
          <section className="mb-6 rounded-[1.5rem] border border-rose-400/30 bg-rose-500/10 p-5 text-sm text-rose-200 backdrop-blur">
            {errorMessage}
          </section>
        )}

        <section className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="relative w-full">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="助成金名・提供元・検討メモで検索"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Filter size={18} className="text-slate-400" />

              <SelectFilter
                value={selectedReviewStatus}
                ariaLabel="判断状態で絞り込み"
                onChange={(value) =>
                  setSelectedReviewStatus(value as ReviewStatusFilter)
                }
                options={[
                  { label: "未確認", value: "UNREVIEWED" },
                  { label: "検討中", value: "SAVED" },
                  { label: "見送り", value: "DECLINED" },
                ]}
              />

              <SelectFilter
                value={selectedFiscalYear}
                ariaLabel="年度で絞り込み"
                onChange={(value) =>
                  setSelectedFiscalYear(value as (typeof fiscalYearOptions)[number])
                }
                options={fiscalYearOptions.map((year) => ({
                  label: year,
                  value: year,
                }))}
              />

              <SelectFilter
                value={selectedAiResult}
                ariaLabel="AI判定で絞り込み"
                onChange={(value) =>
                  setSelectedAiResult(value as AiEvaluationResult | "ALL")
                }
                options={[
                  { label: "AI判定すべて", value: "ALL" },
                  { label: "適合", value: "MATCH" },
                  { label: "要確認", value: "CHECK_REQUIRED" },
                  { label: "不適合", value: "NOT_MATCH" },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5">
            {!isLoading && !errorMessage && filteredHistories.length === 0 && (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-slate-300">
                条件に一致するAI判定履歴はありません。
              </div>
            )}

            {filteredHistories.map((history) => (
              <article
                key={history.id}
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80 shadow-xl shadow-slate-950/40 transition hover:border-cyan-300/30 hover:bg-slate-900"
              >
                <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="p-6">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <Badge className={aiResultStyle[history.aiResult]}>
                        AI判定：{aiResultLabel[history.aiResult]}
                      </Badge>
                    </div>

                    <h2 className="text-2xl font-bold text-white">
                      {history.grantName}
                    </h2>

                    <div className="mt-3 space-y-1 text-sm text-slate-400">
                      <p>提供元：{history.provider}</p>
                      <p>履歴番号：{history.historyCode}</p>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-300">
                      {history.aiReason}
                    </p>
                  </div>

                  <div className="flex border-t border-white/10 bg-slate-950/50 p-6 lg:border-l lg:border-t-0">
                    <div className="flex w-full flex-col justify-between gap-5">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-sm font-semibold text-white">
                          判定情報
                        </p>

                        <div className="mt-3 space-y-2 text-sm text-slate-300">
                          <p>判断状態：{getReviewStatusLabel(history.reviewStatus)}</p>
                          <p>判断メモ：{history.reviewMemo || "未入力"}</p>
                          <p>判断日：{history.reviewedAt === "未設定" ? "未更新" : history.reviewedAt}</p>
                          <p>判定日：{history.evaluatedAt}</p>
                          <p>年度：{history.fiscalYear}</p>
                          <p>{history.grantName}</p>
                          <p>推奨度：{history.recommendationLevel}</p>
                          <p>判定者：{history.evaluatorName}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenDetail(history.id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95"
                      >
                        履歴詳細を見る
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
              <h2 className="text-lg font-semibold text-white">
                画面ガイド
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <GuideLine text="保存されたAI判定結果と見送り判断を確認します。" />
                <GuideLine text="検討中のものは詳細画面から再確認できます。" />
                <GuideLine text="申請に進んだものは案件管理画面で扱います。" />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
              <h2 className="text-lg font-semibold text-white">
                監査証跡ポリシー
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <GuideLine text="AI判定履歴そのものは編集しません。" />
                <GuideLine text="判断状態と判断メモは担当者の検討記録として保存します。" />
                <GuideLine text="申請に進んだものはこの一覧から外れ、案件管理へ移動します。" />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-6">
              <h2 className="text-lg font-semibold text-white">
                履歴の扱い
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <GuideLine text="保存するを選択したものは検討中に表示されます。" />
                <GuideLine text="見送るを選択したものは見送りに表示されます。" />
                <GuideLine text="申請に進むを選択したものはPG-A09 / PG-A10で管理します。" />
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

type SummaryCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  cardClassName?: string;
  iconClassName?: string;
};

const SummaryCard = ({
  icon,
  label,
  value,
  cardClassName = "border-white/10 bg-slate-950/50",
  iconClassName = "bg-white/10 text-cyan-200",
}: SummaryCardProps) => {
  return (
    <div className={`rounded-2xl border p-4 ${cardClassName}`}>
      <div className={`mb-3 inline-flex rounded-xl p-2 ${iconClassName}`}>
        {icon}
      </div>

      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
};

type BadgeProps = {
  children: React.ReactNode;
  className: string;
};

const Badge = ({ children, className }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${className}`}
    >
      {children}
    </span>
  );
};

type SelectFilterProps = {
  value: string;
  ariaLabel: string;
  onChange: (value: string) => void;
  options: {
    label: string;
    value: string;
  }[];
};

const SelectFilter = ({
  value,
  ariaLabel,
  onChange,
  options,
}: SelectFilterProps) => {
  return (
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-300/50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

type GuideLineProps = {
  text: string;
};

const GuideLine = ({ text }: GuideLineProps) => {
  return (
    <div className="flex gap-2">
      <ShieldCheck size={16} className="mt-1 shrink-0 text-cyan-200" />
      <p>{text}</p>
    </div>
  );
};
