import React from "react";
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
  reviewResult: "進める" | "保留する" | "見送る";
  evaluatedAt: string;
};

type UpcomingTask = {
  id: number;
  title: string;
  dueDate: string;
  stage: string;
};

const summaryItems: SummaryItem[] = [
  {
    label: "助成金公募",
    value: "3件",
    description: "AI判定前の公募情報",
    icon: <ClipboardList size={20} />,
    cardClassName: "border-cyan-500/30 bg-cyan-500/10",
    iconClassName: "bg-cyan-500/20 text-cyan-200",
  },
  {
    label: "AI判定履歴",
    value: "5件",
    description: "過去の判定・検討ログ",
    icon: <History size={20} />,
    cardClassName: "border-violet-500/30 bg-violet-500/10",
    iconClassName: "bg-violet-500/20 text-violet-200",
  },
  {
    label: "助成金案件",
    value: "4件",
    description: "進行中の案件管理",
    icon: <FolderKanban size={20} />,
    cardClassName: "border-emerald-500/30 bg-emerald-500/10",
    iconClassName: "bg-emerald-500/20 text-emerald-200",
  },
  {
    label: "締切注意",
    value: "2件",
    description: "7日以内に確認が必要",
    icon: <CalendarClock size={20} />,
    cardClassName: "border-amber-500/30 bg-amber-500/10",
    iconClassName: "bg-amber-500/20 text-amber-200",
  },
];

const recentEvaluations: RecentEvaluation[] = [
  {
    id: 1,
    grantName: "地域子ども支援活動助成",
    aiResult: "適合",
    reviewResult: "進める",
    evaluatedAt: "2026-06-04",
  },
  {
    id: 2,
    grantName: "文化芸術体験活動助成",
    aiResult: "要確認",
    reviewResult: "保留する",
    evaluatedAt: "2026-06-03",
  },
  {
    id: 3,
    grantName: "地域コミュニティ再生助成",
    aiResult: "適合",
    reviewResult: "見送る",
    evaluatedAt: "2026-06-02",
  },
];

const upcomingTasks: UpcomingTask[] = [
  {
    id: 1,
    title: "前年度決算書と事業収支計画を確認する",
    dueDate: "2026-06-18",
    stage: "申請準備中",
  },
  {
    id: 2,
    title: "交付決定通知の条件を確認する",
    dueDate: "2026-06-12",
    stage: "採択",
  },
];

const aiResultStyle: Record<RecentEvaluation["aiResult"], string> = {
  適合: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  要確認: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  不適合: "border-slate-500/40 bg-slate-500/20 text-slate-300",
};

const reviewResultStyle: Record<RecentEvaluation["reviewResult"], string> = {
  進める: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
  保留する: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  見送る: "border-slate-500/40 bg-slate-500/20 text-slate-300",
};

export function PGA02DashboardPage() {
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

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {summaryItems.map((item) => (
                <SummaryCard key={item.label} item={item} />
              ))}
            </div>
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
                {recentEvaluations.map((history) => (
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
                          判定日：{history.evaluatedAt}
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
              title="近日対応が必要な作業"
            >
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <Badge className="border-amber-400/40 bg-amber-400/10 text-amber-200">
                      {task.stage}
                    </Badge>

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