import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CalendarClock,
  ClipboardList,
  FileText,
  FolderKanban,
  History,
  Sparkles,
} from "lucide-react";
import { getGrantMasters } from "../../../../api/grantMasterApi";
import { getGrantCases } from "../../../../api/grantCaseApi";
import { getEvaluationHistories } from "../../../../api/evaluationHistoryApi";
import type { GrantMasterApiResponse } from "../../../../types/GrantMasterApiResponse";
import type { GrantCaseApiResponse } from "../../../../types/GrantCaseApiResponse";
import type { EvaluationHistoryApiResponse } from "../../../../types/EvaluationHistoryApiResponse";
import type { CaseStage } from "../../../../types/CaseStage";
import { normalizeCaseStage } from "../../../../types/CaseStage";
import { getGrantMasterIdFromSnapshot } from "../../../../utils/snapshotUtils";
import {
  getTaskDeadlineStatus,
  type TaskDeadlineStatus,
} from "../../../../utils/taskDeadlineUtils";

type SummaryItem = {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  cardClassName: string;
  iconClassName: string;
};

type RecentEvaluation = {
  id: number;
  grantName: string;
  aiResult: "適合" | "要確認" | "不適合";
  reviewResult: "未確認" | "進める" | "保留する" | "見送る";
  evaluatedAt: string;
};

type UpcomingTask = {
  id: number;
  title: string;
  dueDate: string;
  stage: string;
  deadlineStatus: Exclude<TaskDeadlineStatus, "NORMAL">;
};

const caseStageLabel: Record<CaseStage, string> = {
  APPLY_PREPARATION: "申請準備中",
  APPLIED: "申請済み",
  UNDER_REVIEW: "審査中",
  APPLICATION_REVIEW: "申請・審査中",
  ADOPTED: "採択",
  IN_PROGRESS: "実施中",
  INTERIM_REPORT: "中間報告",
  FINAL_REPORT: "実績報告",
  SETTLEMENT: "精算",
  COMPLETED: "完了",
};

const aiResultStyle: Record<RecentEvaluation["aiResult"], string> = {
  適合: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  要確認: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  不適合: "border-slate-500/40 bg-slate-500/20 text-slate-300",
};

const reviewResultStyle: Record<RecentEvaluation["reviewResult"], string> = {
  未確認: "border-violet-400/40 bg-violet-400/10 text-violet-200",
  進める: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
  保留する: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  見送る: "border-slate-500/40 bg-slate-500/20 text-slate-300",
};

const aiSuitabilityLabel: Record<
  EvaluationHistoryApiResponse["aiSuitability"],
  RecentEvaluation["aiResult"]
> = {
  SUITABLE: "適合",
  NEEDS_CONFIRMATION: "要確認",
  NOT_SUITABLE: "不適合",
};

const reviewStatusLabel: Record<
  EvaluationHistoryApiResponse["reviewStatus"],
  RecentEvaluation["reviewResult"]
> = {
  UNREVIEWED: "未確認",
  SAVED: "保留する",
  DECLINED: "見送る",
  PROCEEDED: "進める",
};

export function PGA02DashboardPage() {
  const [grantMasters, setGrantMasters] = useState<GrantMasterApiResponse[]>([]);
  const [grantCases, setGrantCases] = useState<GrantCaseApiResponse[]>([]);
  const [evaluationHistories, setEvaluationHistories] =
    useState<EvaluationHistoryApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [grantMasterData, grantCaseData, historyData] =
          await Promise.all([
            getGrantMasters(),
            getGrantCases(),
            getEvaluationHistories(),
          ]);

        setGrantMasters(grantMasterData as GrantMasterApiResponse[]);
        setGrantCases(grantCaseData as GrantCaseApiResponse[]);
        setEvaluationHistories(historyData as EvaluationHistoryApiResponse[]);
      } catch (error) {
        console.error(error);
        setErrorMessage("ダッシュボード情報の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardSummary = useMemo(() => {
    const completedEvaluationGrantIds = new Set<number>();
    const proceededGrantCaseIds = new Set<number>();

    evaluationHistories.forEach((history) => {
      if (
        history.reviewStatus === "SAVED"
        || history.reviewStatus === "DECLINED"
        || history.reviewStatus === "PROCEEDED"
      ) {
        const grantMasterId = getGrantMasterIdFromSnapshot(
          history.grantSnapshot
        );

        if (grantMasterId !== null) {
          completedEvaluationGrantIds.add(grantMasterId);
        }
      }

      if (history.reviewStatus === "PROCEEDED") {
        proceededGrantCaseIds.add(history.grantCaseId);
      }
    });

    const visibleGrantMasterCount = grantMasters.filter(
      (grantMaster) => !completedEvaluationGrantIds.has(grantMaster.id)
    ).length;

    const latestGrantCaseMap = new Map<number, GrantCaseApiResponse>();

    grantCases.forEach((grantCase) => {
      if (!proceededGrantCaseIds.has(grantCase.id)) {
        return;
      }

      const current = latestGrantCaseMap.get(grantCase.grantMasterId);

      if (!current || grantCase.id > current.id) {
        latestGrantCaseMap.set(grantCase.grantMasterId, grantCase);
      }
    });

    const activeGrantCases = Array.from(latestGrantCaseMap.values()).filter(
      (grantCase) => !grantCase.archived
    );
    const deadlineStatusByCaseId = new Map(
      activeGrantCases.map((grantCase) => [
        grantCase.id,
        getTaskDeadlineStatus(grantCase.nextActionDueDate ?? ""),
      ])
    );
    const dueSoonCount = activeGrantCases.filter(
      (grantCase) => deadlineStatusByCaseId.get(grantCase.id) === "DUE_SOON"
    ).length;
    const overdueCount = activeGrantCases.filter(
      (grantCase) => deadlineStatusByCaseId.get(grantCase.id) === "OVERDUE"
    ).length;
    const value = (count: number) => isLoading || errorMessage ? "—" : `${count}件`;

    const summaryItems: SummaryItem[] = [
      {
        label: "公募一覧の表示対象",
        value: value(visibleGrantMasterCount),
        description: "検討結果が確定していない公募",
        icon: <ClipboardList size={20} />,
        cardClassName: "border-cyan-500/30 bg-cyan-500/10",
        iconClassName: "bg-cyan-500/20 text-cyan-200",
      },
      {
        label: "未確認のAI判定履歴",
        value: value(
          evaluationHistories.filter(
            (history) => history.reviewStatus === "UNREVIEWED"
          ).length
        ),
        description: "検討結果が未入力の判定履歴",
        icon: <History size={20} />,
        cardClassName: "border-violet-500/30 bg-violet-500/10",
        iconClassName: "bg-violet-500/20 text-violet-200",
      },
      {
        label: "進行中の助成金案件",
        value: value(activeGrantCases.length),
        description: "進めると判断した未アーカイブ案件",
        icon: <FolderKanban size={20} />,
        cardClassName: "border-emerald-500/30 bg-emerald-500/10",
        iconClassName: "bg-emerald-500/20 text-emerald-200",
      },
      {
        label: "7日以内の次アクション",
        value: value(dueSoonCount),
        description: "今日から7日以内が期限",
        icon: <CalendarClock size={20} />,
        cardClassName: "border-amber-500/30 bg-amber-500/10",
        iconClassName: "bg-amber-500/20 text-amber-200",
      },
      {
        label: "期限超過の次アクション",
        value: value(overdueCount),
        description: "期限を過ぎた未アーカイブ案件",
        icon: <CalendarClock size={20} />,
        cardClassName: "border-red-500/30 bg-red-500/10",
        iconClassName: "bg-red-500/20 text-red-200",
      },
    ];

    const upcomingTasks: UpcomingTask[] = activeGrantCases
      .map((grantCase) => ({
        id: grantCase.id,
        title: grantCase.nextAction ?? "次アクション未設定",
        dueDate: grantCase.nextActionDueDate ?? "",
        stage: caseStageLabel[normalizeCaseStage(grantCase.caseStage)],
        deadlineStatus: deadlineStatusByCaseId.get(grantCase.id) ?? "NORMAL",
      }))
      .filter(
        (task): task is UpcomingTask =>
          task.dueDate !== "" && task.deadlineStatus !== "NORMAL"
      )
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    const grantCaseNameById = new Map(
      grantCases.map((grantCase) => [grantCase.id, grantCase.caseName])
    );
    const recentEvaluations: RecentEvaluation[] = [...evaluationHistories]
      .sort((a, b) => {
        const evaluatedAtDiff =
          (Date.parse(b.evaluatedAt ?? "") || 0)
          - (Date.parse(a.evaluatedAt ?? "") || 0);

        return evaluatedAtDiff !== 0 ? evaluatedAtDiff : b.id - a.id;
      })
      .slice(0, 3)
      .map((history) => ({
        id: history.id,
        grantName:
          grantCaseNameById.get(history.grantCaseId)
          ?? `関連案件ID: ${history.grantCaseId}`,
        aiResult: aiSuitabilityLabel[history.aiSuitability],
        reviewResult: reviewStatusLabel[history.reviewStatus],
        evaluatedAt: history.evaluatedAt
          ? history.evaluatedAt.replace("T", " ").slice(0, 16)
          : "日時未設定",
      }));

    return { summaryItems, upcomingTasks, recentEvaluations };
  }, [errorMessage, evaluationHistories, grantCases, grantMasters, isLoading]);

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
              PG-A02 ダッシュボード
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white">
              ダッシュボード
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              団体情報、助成金公募、AI判定履歴、助成金案件の状況を確認します。
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {dashboardSummary.summaryItems.map((item) => (
                <SummaryCard key={item.label} item={item} />
              ))}
            </div>

            {errorMessage && (
              <p className="mt-4 text-sm text-rose-200">{errorMessage}</p>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <DashboardCard
              icon={<ClipboardList size={20} />}
              title="主要メニュー"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <MenuCard
                  title="助成金管理"
                  description="公募情報の登録・確認・編集を行います。AI判定は公募詳細から開始します。"
                  icon={<ClipboardList size={22} />}
                  to="/admin/grants"
                />

                <MenuCard
                  title="AI判定履歴"
                  description="過去のAI判定と検討結果を監査証跡として確認します。"
                  icon={<History size={22} />}
                  to="/admin/evaluations/histories"
                />

                <MenuCard
                  title="助成金案件一覧"
                  description="申請準備中から報告・精算までの助成金案件を管理します。"
                  icon={<FolderKanban size={22} />}
                  to="/admin/grant-cases"
                />

                <MenuCard
                  title="団体基本情報"
                  description="AI判定の根拠となる団体情報を確認・管理します。"
                  icon={<Building2 size={22} />}
                  to="/admin/organization/profile"
                />
              </div>
            </DashboardCard>

            <DashboardCard
              icon={<History size={20} />}
              title="最近のAI判定履歴"
            >
              <div className="space-y-3">
                {isLoading && (
                  <p className="text-sm text-slate-400">
                    AI判定履歴を読み込み中です。
                  </p>
                )}

                {!isLoading && errorMessage && (
                  <p className="text-sm text-rose-200">
                    AI判定履歴を取得できませんでした。
                  </p>
                )}

                {!isLoading
                  && !errorMessage
                  && dashboardSummary.recentEvaluations.length === 0 && (
                    <p className="text-sm text-slate-400">
                      AI判定履歴はまだありません。
                    </p>
                  )}

                {!isLoading && !errorMessage && dashboardSummary.recentEvaluations.map((history) => (
                  <div
                    key={history.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {history.grantName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          判定日時：{history.evaluatedAt}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={aiResultStyle[history.aiResult]}>
                          AI判定：{history.aiResult}
                        </Badge>

                        <Badge className={reviewResultStyle[history.reviewResult]}>
                          検討結果：{history.reviewResult}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
              <h2 className="text-lg font-semibold text-white">
                画面ガイド
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <GuideLine text="助成金公募、AI判定履歴、助成金案件の状況を確認します。" />
                <GuideLine text="AI判定は助成金管理から対象公募を選んで実行します。" />
                <GuideLine text="進行中の助成金案件はPG-A09で管理します。" />
              </div>
            </div>

            <DashboardCard
              icon={<CalendarClock size={20} />}
              title="期限が近い・超過した次アクション"
            >
              <div className="space-y-3">
                {!isLoading && !errorMessage && dashboardSummary.upcomingTasks.length === 0 && (
                  <p className="text-sm text-slate-400">
                    期限超過または7日以内の次アクションはありません。
                  </p>
                )}

                {dashboardSummary.upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      <Badge className="border-slate-400/40 bg-slate-400/10 text-slate-200">
                        {task.stage}
                      </Badge>
                      <Badge
                        className={
                          task.deadlineStatus === "OVERDUE"
                            ? "border-red-400/40 bg-red-400/10 text-red-200"
                            : "border-amber-400/40 bg-amber-400/10 text-amber-200"
                        }
                      >
                        {task.deadlineStatus === "OVERDUE" ? "期限超過" : "7日以内"}
                      </Badge>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {task.title}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      期限：{task.dueDate}
                    </p>
                  </div>
                ))}
              </div>
            </DashboardCard>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
              <h2 className="text-lg font-semibold text-white">
                画面ポリシー
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <GuideLine text="助成金公募はPG-A06で管理します。" />
                <GuideLine text="AI判定結果はPG-A08に履歴として保存します。" />
                <GuideLine text="案件化後はPG-A09・PG-A10で進捗を管理します。" />
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

type SummaryCardProps = {
  item: SummaryItem;
};

const SummaryCard = ({ item }: SummaryCardProps) => {
  return (
    <div className={`rounded-2xl border p-4 ${item.cardClassName}`}>
      <div className={`mb-3 inline-flex rounded-xl p-2 ${item.iconClassName}`}>
        {item.icon}
      </div>

      <p className="text-sm text-slate-400">{item.label}</p>
      <p className="mt-1 text-xl font-bold text-white">{item.value}</p>
      <p className="mt-1 text-xs text-slate-500">{item.description}</p>
    </div>
  );
};

type DashboardCardProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

const DashboardCard = ({ icon, title, children }: DashboardCardProps) => {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-white/10 p-2 text-cyan-200">
          {icon}
        </div>

        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
};

type MenuCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
};

const MenuCard = ({ title, description, icon, to }: MenuCardProps) => {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-300/30 hover:bg-white/10"
    >
      <div className="mb-4 inline-flex rounded-2xl bg-cyan-300/10 p-3 text-cyan-200">
        {icon}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>

        <ArrowRight
          size={18}
          className="mt-1 shrink-0 text-slate-500 transition group-hover:text-cyan-200"
        />
      </div>
    </Link>
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

type GuideLineProps = {
  text: string;
};

const GuideLine = ({ text }: GuideLineProps) => {
  return (
    <div className="flex gap-2">
      <BadgeCheck size={16} className="mt-1 shrink-0 text-cyan-200" />
      <p>{text}</p>
    </div>
  );
};
