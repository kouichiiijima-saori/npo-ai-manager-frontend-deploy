import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  FileCheck2,
  FileText,
  Filter,
  Layers3,
  Search,
  Sparkles,
  Timer,
} from "lucide-react";

type CaseStage =
  | "APPLY_PREPARATION"
  | "APPLIED"
  | "UNDER_REVIEW"
  | "ADOPTED"
  | "IN_PROGRESS"
  | "INTERIM_REPORT"
  | "FINAL_REPORT"
  | "SETTLEMENT"
  | "COMPLETED";

type StageGroup =
  | "ALL"
  | "PREPARATION"
  | "AFTER_APPLY"
  | "RESULT"
  | "IMPLEMENTATION_REPORT"
  | "COMPLETED";

type EvaluationHistoryApiResponse = {
  id: number;
  grantCaseId: number;
  reviewStatus: string;
};

type GrantCaseApiResponse = {
  id: number;
  organizationId: number;
  grantMasterId: number;
  caseName: string;
  caseStage: CaseStage;
  examinationStatus: string;
  externalAuditStatus: string;
  examinationMemo: string | null;
  nextAction: string | null;
  nextActionDueDate: string | null;
  archived: boolean;
  archivedAt: string | null;
  archiveReason: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type GrantCaseView = {
  id: number;
  caseName: string;
  grantName: string;
  provider: string;
  stage: CaseStage;
  deadline: string;
  nextAction: string;
  nextActionDueDate: string;
  reviewMemo: string;
  updatedAt: string;
  archived: boolean;
  archiveReason: string | null;
};

const stageLabel: Record<CaseStage, string> = {
  APPLY_PREPARATION: "申請準備中",
  APPLIED: "申請済",
  UNDER_REVIEW: "審査中",
  ADOPTED: "採択",
  IN_PROGRESS: "事業実施中",
  INTERIM_REPORT: "中間報告",
  FINAL_REPORT: "実績報告",
  SETTLEMENT: "精算中",
  COMPLETED: "完了",
};

const stageStyle: Record<CaseStage, string> = {
  APPLY_PREPARATION: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
  APPLIED: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  UNDER_REVIEW: "border-violet-400/40 bg-violet-400/10 text-violet-200",
  ADOPTED: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  IN_PROGRESS: "border-teal-400/40 bg-teal-400/10 text-teal-200",
  INTERIM_REPORT: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  FINAL_REPORT: "border-orange-400/40 bg-orange-400/10 text-orange-200",
  SETTLEMENT: "border-rose-400/40 bg-rose-400/10 text-rose-200",
  COMPLETED: "border-slate-500/40 bg-slate-500/20 text-slate-300",
};

const API_BASE_URL = "http://localhost:8080";

const convertGrantCaseToView = (
  grantCase: GrantCaseApiResponse
): GrantCaseView => {
  return {
    id: grantCase.id,
    caseName: grantCase.caseName,
    grantName: `助成金ID: ${grantCase.grantMasterId}`,
    provider: "公募情報は詳細画面で確認",
    stage: grantCase.caseStage,
    deadline: "詳細画面で確認",
    nextAction: grantCase.nextAction ?? "次アクション未設定",
    nextActionDueDate: grantCase.nextActionDueDate ?? "",
    reviewMemo: grantCase.examinationMemo ?? "検討メモ未入力",
    updatedAt: grantCase.updatedAt ?? "",
    archived: grantCase.archived,
    archiveReason: grantCase.archiveReason,
  };
};

const stageGroupLabel: Record<StageGroup, string> = {
  ALL: "すべて",
  PREPARATION: "準備中",
  AFTER_APPLY: "申請済",
  RESULT: "採択",
  IMPLEMENTATION_REPORT: "実施・報告",
  COMPLETED: "完了",
};

const stageGroupMap: Record<Exclude<StageGroup, "ALL">, CaseStage[]> = {
  PREPARATION: ["APPLY_PREPARATION"],
  AFTER_APPLY: ["APPLIED", "UNDER_REVIEW"],
  RESULT: ["ADOPTED"],
  IMPLEMENTATION_REPORT: [
    "IN_PROGRESS",
    "INTERIM_REPORT",
    "FINAL_REPORT",
    "SETTLEMENT",
  ],
  COMPLETED: ["COMPLETED"],
};

const isDueSoon = (date: string) => {
  const today = new Date();
  const dueDate = new Date(`${date}T00:00:00`);

  today.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 && diffDays <= 7;
};

export function PGA09GrantCaseListPage() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [selectedStageGroup, setSelectedStageGroup] =
    useState<StageGroup>("ALL");
  const [grantCases, setGrantCases] = useState<GrantCaseView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const fetchGrantCases = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [response, historiesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/grant-cases`),
          fetch(`${API_BASE_URL}/api/evaluation-histories`)
        ]);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("助成金案件一覧APIエラー:", errorText);
          throw new Error("助成金案件一覧の取得に失敗しました。");
        }

        const data: GrantCaseApiResponse[] = await response.json();

        const proceededGrantCaseIds = new Set<number>();
        if (historiesResponse.ok) {
          const histories: EvaluationHistoryApiResponse[] = await historiesResponse.json();
          histories.forEach((history) => {
            if (history.reviewStatus === "PROCEEDED") {
              proceededGrantCaseIds.add(history.grantCaseId);
            }
          });
        }

        const latestGrantCaseMap = new Map<number, GrantCaseApiResponse>();

        data.forEach((grantCase) => {
          if (!proceededGrantCaseIds.has(grantCase.id)) {
            return;
          }

          const current = latestGrantCaseMap.get(grantCase.grantMasterId);

          if (!current || grantCase.id > current.id) {
            latestGrantCaseMap.set(grantCase.grantMasterId, grantCase);
          }
        });

        const latestGrantCases = Array.from(latestGrantCaseMap.values());

        setGrantCases(latestGrantCases.map(convertGrantCaseToView));
      } catch (error) {
        console.error(error);
        setErrorMessage("助成金案件一覧の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrantCases();
  }, []);

  const filteredGrantCases = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return grantCases.filter((grantCase) => {
      if (!showArchived && grantCase.archived) {
        return false;
      }

      if (selectedStageGroup !== "ALL") {
        const stages = stageGroupMap[selectedStageGroup];

        if (!stages.includes(grantCase.stage)) {
          return false;
        }
      }

      const searchableText = [
        grantCase.caseName,
        grantCase.grantName,
        grantCase.provider,
        grantCase.nextAction,
        grantCase.reviewMemo,
        stageLabel[grantCase.stage],
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
  }, [grantCases, keyword, selectedStageGroup, showArchived]);

  const activeGrantCases = grantCases.filter(
    (grantCase) => !grantCase.archived
  );

  const preparationCount = activeGrantCases.filter(
    (grantCase) => grantCase.stage === "APPLY_PREPARATION"
  ).length;

  const afterApplyCount = activeGrantCases.filter((grantCase) =>
    stageGroupMap.AFTER_APPLY.includes(grantCase.stage)
  ).length;

  const adoptedCount = activeGrantCases.filter(
    (grantCase) => grantCase.stage === "ADOPTED"
  ).length;

  const implementationReportCount = activeGrantCases.filter((grantCase) =>
    stageGroupMap.IMPLEMENTATION_REPORT.includes(grantCase.stage)
  ).length;

  const dueSoonCount = activeGrantCases.filter((grantCase) =>
    grantCase.nextActionDueDate !== "" && isDueSoon(grantCase.nextActionDueDate)
  ).length;

  const handleOpenDetail = (caseId: number) => {
    navigate(`/grant-cases/${caseId}`);
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
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                <Sparkles size={16} />
                PG-A09 助成金案件一覧
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white">
                助成金案件一覧
              </h1>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <SummaryCard
                  icon={<ClipboardList size={20} />}
                  label="申請準備中"
                  value={`${preparationCount}件`}
                  cardClassName="border-cyan-500/30 bg-cyan-500/10"
                  iconClassName="bg-cyan-500/20 text-cyan-200"
                />

                <SummaryCard
                  icon={<FileCheck2 size={20} />}
                  label="申請済"
                  value={`${afterApplyCount}件`}
                  cardClassName="border-violet-500/30 bg-violet-500/10"
                  iconClassName="bg-violet-500/20 text-violet-200"
                />

                <SummaryCard
                  icon={<FileText size={20} />}
                  label="採択"
                  value={`${adoptedCount}件`}
                  cardClassName="border-emerald-500/30 bg-emerald-500/10"
                  iconClassName="bg-emerald-500/20 text-emerald-200"
                />

                <SummaryCard
                  icon={<Layers3 size={20} />}
                  label="実施・報告"
                  value={`${implementationReportCount}件`}
                  cardClassName="border-amber-500/30 bg-amber-500/10"
                  iconClassName="bg-amber-500/20 text-amber-200"
                />

                <SummaryCard
                  icon={<Timer size={20} />}
                  label="締切注意"
                  value={`${dueSoonCount}件`}
                  cardClassName="border-rose-500/30 bg-rose-500/10"
                  iconClassName="bg-rose-500/20 text-rose-200"
                />
              </div>
            </div>
          </div>
        </section>

        {isLoading && (
          <section className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300 backdrop-blur">
            助成金案件一覧を読み込み中です。
          </section>
        )}

        {errorMessage && (
          <section className="mb-6 rounded-[1.5rem] border border-rose-400/30 bg-rose-500/10 p-5 text-sm text-rose-200 backdrop-blur">
            {errorMessage}
          </section>
        )}

        <section className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xl">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="案件名・助成金名・提供元・次アクションで検索"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Filter size={18} className="text-slate-400" />

                {(
                  [
                    "ALL",
                    "PREPARATION",
                    "AFTER_APPLY",
                    "RESULT",
                    "IMPLEMENTATION_REPORT",
                    "COMPLETED",
                  ] as StageGroup[]
                ).map((group) => (
                  <FilterButton
                    key={group}
                    active={selectedStageGroup === group}
                    label={stageGroupLabel[group]}
                    onClick={() => setSelectedStageGroup(group)}
                  />
                ))}
              </div>

              <div className="h-6 w-px bg-white/10" />

              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300 transition hover:text-white">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(event) => setShowArchived(event.target.checked)}
                  className="rounded border-white/20 bg-slate-950/70 text-cyan-500 focus:ring-cyan-500/50"
                />
                アーカイブ済みを表示
              </label>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5">
            {!isLoading && !errorMessage && filteredGrantCases.length === 0 && (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-slate-300">
                条件に一致する助成金案件はありません。
              </div>
            )}

            {filteredGrantCases.map((grantCase) => (
              <article
                key={grantCase.id}
                className={`overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80 shadow-xl shadow-slate-950/40 transition hover:border-cyan-300/30 hover:bg-slate-900 ${grantCase.archived ? "opacity-60" : ""
                  }`}
              >
                <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="p-6">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <Badge className={stageStyle[grantCase.stage]}>
                        {stageLabel[grantCase.stage]}
                      </Badge>

                      {grantCase.nextActionDueDate !== "" &&
                        isDueSoon(grantCase.nextActionDueDate) && (
                          <Badge className="border-rose-400/40 bg-rose-400/10 text-rose-200">
                            締切注意
                          </Badge>
                        )}

                      {grantCase.archived && (
                        <Badge className="border-slate-500/40 bg-slate-500/20 text-slate-300">
                          アーカイブ済み
                        </Badge>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-white">
                      {grantCase.caseName}
                    </h2>

                    <div className="mt-3 space-y-1 text-sm text-slate-400">
                      <p>
                        助成金名：{grantCase.grantName}
                      </p>

                      <p>
                        提供元：{grantCase.provider}
                      </p>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-300">
                      {grantCase.reviewMemo}
                    </p>

                    {grantCase.archived && grantCase.archiveReason && (
                      <p className="mt-2 text-xs text-slate-400">
                        アーカイブ理由：{grantCase.archiveReason}
                      </p>
                    )}
                  </div>

                  <div className="flex border-t border-white/10 bg-slate-950/50 p-6 lg:border-l lg:border-t-0">
                    <div className="flex w-full flex-col justify-between gap-5">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-sm font-semibold text-white">
                          次アクション
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {grantCase.nextAction}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                          <CalendarClock size={16} />
                          期限：{grantCase.nextActionDueDate || "未設定"}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenDetail(grantCase.id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95"
                      >
                        詳細へ進む
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
                <p>
                  AI判定後に「進める」とした助成金案件を管理します。
                </p>

                <p>
                  PG-A09では一覧確認に徹し、次アクションや案件名の編集はPG-A10で行います。
                </p>

                <p>
                  採択後の実施・報告・精算まで、案件のライフサイクルを追跡します。
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
              <h2 className="text-lg font-semibold text-white">
                ステージ説明
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <StageGuide
                  title="準備中"
                  description="申請資料を集め、応募前の確認を行う段階です。"
                />

                <StageGuide
                  title="申請済"
                  description="申請が完了し、審査結果を待っている段階です。"
                />

                <StageGuide
                  title="実施・報告"
                  description="採択後の事業実施、中間報告、実績報告、精算を管理する段階です。"
                />

                <StageGuide
                  title="完了"
                  description="報告・精算まで完了した案件です。"
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-6">
              <h2 className="text-lg font-semibold text-white">
                注意事項
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <p>
                  助成金名は公募マスタ由来の名称で、原則変更しません。
                </p>

                <p>
                  案件名は団体内部で管理するプロジェクト名としてPG-A10で編集できます。
                </p>

                <p>
                  次アクションと期限は一覧では表示のみです。
                </p>
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

      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-white">
        {value}
      </p>
    </div>
  );
};

type FilterButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

const FilterButton = ({ active, label, onClick }: FilterButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
          : "rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
      }
    >
      {label}
    </button>
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

type StageGuideProps = {
  title: string;
  description: string;
};

const StageGuide = ({ title, description }: StageGuideProps) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm font-semibold text-white">
        {title}
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
};