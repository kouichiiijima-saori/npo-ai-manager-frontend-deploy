import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    AlertTriangle,
    ArrowLeft,
    CalendarClock,
    CheckCircle2,
    FileText,
    Layers3,
    Save,
    Sparkles,
    Trash2,
} from "lucide-react";

type CaseStage =
    | "APPLY_PREPARATION"
    | "APPLICATION_REVIEW"
    | "ADOPTED"
    | "IN_PROGRESS"
    | "INTERIM_REPORT"
    | "FINAL_REPORT"
    | "SETTLEMENT"
    | "COMPLETED";

type GrantCase = {
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
};

const grantCases: GrantCase[] = [
    {
        id: 1,
        caseName: "2026年度 子ども食堂運営プロジェクト",
        grantName: "地域子ども支援活動助成",
        provider: "公益財団法人 未来地域財団",
        stage: "APPLY_PREPARATION",
        deadline: "2026-06-28",
        nextAction: "前年度決算書と事業収支計画を確認する",
        nextActionDueDate: "2026-06-18",
        reviewMemo:
            "対象経費に食材費・人件費が含まれるか確認する。決算書の準備が必要。",
        updatedAt: "2026-06-04",
    },
    {
        id: 2,
        caseName: "農福連携 体験受入モデル事業",
        grantName: "農福連携スタートアップ支援金",
        provider: "埼玉県 地域共生推進課",
        stage: "APPLICATION_REVIEW",
        deadline: "2026-07-15",
        nextAction: "受付完了メールと審査予定日を確認する",
        nextActionDueDate: "2026-06-20",
        reviewMemo: "申請済み。審査期間中に追加資料依頼が来る可能性あり。",
        updatedAt: "2026-06-03",
    },
];

const stageLabel: Record<CaseStage, string> = {
    APPLY_PREPARATION: "申請準備中",
    APPLICATION_REVIEW: "申請済・審査中",
    ADOPTED: "採択",
    IN_PROGRESS: "事業実施中",
    INTERIM_REPORT: "中間報告",
    FINAL_REPORT: "実績報告",
    SETTLEMENT: "精算中",
    COMPLETED: "完了",
};

const stageStyle: Record<CaseStage, string> = {
    APPLY_PREPARATION: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
    "APPLICATION_REVIEW": "border-sky-400/40 bg-sky-400/10 text-sky-200",
    ADOPTED: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    IN_PROGRESS: "border-teal-400/40 bg-teal-400/10 text-teal-200",
    INTERIM_REPORT: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    FINAL_REPORT: "border-orange-400/40 bg-orange-400/10 text-orange-200",
    SETTLEMENT: "border-rose-400/40 bg-rose-400/10 text-rose-200",
    COMPLETED: "border-slate-500/40 bg-slate-500/20 text-slate-300",
};

const caseStageOptions: CaseStage[] = [
    "APPLY_PREPARATION",
    "APPLICATION_REVIEW",
    "ADOPTED",
    "IN_PROGRESS",
    "INTERIM_REPORT",
    "FINAL_REPORT",
    "SETTLEMENT",
    "COMPLETED",
];

const isDueSoon = (date: string) => {
    const today = new Date();
    const dueDate = new Date(`${date}T00:00:00`);

    today.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 7;
};

const fallbackGrantCase: GrantCase = grantCases[0];

export function PGA10GrantCaseDetailPage() {
    const navigate = useNavigate();
    const { caseId } = useParams();

    const initialGrantCase = useMemo(() => {
        return (
            grantCases.find((grantCase) => grantCase.id === Number(caseId)) ??
            fallbackGrantCase
        );
    }, [caseId]);

    const [caseName, setCaseName] = useState(initialGrantCase.caseName);
    const [stage, setStage] = useState<CaseStage>(initialGrantCase.stage);
    const [nextAction, setNextAction] = useState(initialGrantCase.nextAction);
    const [nextActionDueDate, setNextActionDueDate] = useState(
        initialGrantCase.nextActionDueDate
    );

    const dueSoon = isDueSoon(nextActionDueDate);

    const handleBackToList = () => {
        navigate("/admin/grant-cases");
    };

    const handleSave = () => {
        alert("案件情報を保存しました。");
    };

    const handleRejectCase = () => {
        const confirmed = window.confirm(
            "この案件を不採択として終了しますか？案件一覧からは除外され、判定履歴へ保存されます。"
        );

        if (!confirmed) {
            return;
        }

        alert("不採択として案件を終了しました。データは判定履歴（PG-A08）に保管され、案件一覧へ戻ります。");
        navigate("/admin/grant-cases");
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
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="w-full max-w-4xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                                <Sparkles size={16} />
                                PG-A10 助成金案件詳細
                            </div>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-300">
                                    案件名
                                </span>

                                <input
                                    value={caseName}
                                    onChange={(event) => setCaseName(event.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-3xl font-bold tracking-tight text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                                />
                            </label>

                            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                                <span>助成金名：{initialGrantCase.grantName}</span>
                                <span>提供元：{initialGrantCase.provider}</span>
                                <span>公募締切：{initialGrantCase.deadline}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleBackToList}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <ArrowLeft size={18} />
                            案件一覧へ戻る
                        </button>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <DetailCard icon={<Layers3 size={20} />} title="案件ステージ">
                            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-slate-200">
                                        現在のステージ
                                    </span>

                                    <select
                                        value={stage}
                                        onChange={(event) => setStage(event.target.value as CaseStage)}
                                        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
                                    >
                                        {caseStageOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {stageLabel[option]}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <span
                                    className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs ${stageStyle[stage]}`}
                                >
                                    <CheckCircle2 size={14} />
                                    {stageLabel[stage]}
                                </span>
                            </div>
                        </DetailCard>

                        <DetailCard icon={<CalendarClock size={20} />} title="次アクション">
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-200">
                                    次に行うこと
                                </span>

                                <textarea
                                    value={nextAction}
                                    onChange={(event) => setNextAction(event.target.value)}
                                    rows={5}
                                    className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                                />
                            </label>

                            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-slate-200">
                                        次アクション期限
                                    </span>

                                    <input
                                        type="date"
                                        value={nextActionDueDate}
                                        onChange={(event) => setNextActionDueDate(event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
                                    />
                                </label>

                                {dueSoon && (
                                    <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-xs text-rose-200">
                                        <AlertTriangle size={14} />
                                        締切注意
                                    </span>
                                )}
                            </div>
                        </DetailCard>

                        <DetailCard icon={<FileText size={20} />} title="検討メモ">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                                <p className="text-sm leading-7 text-slate-300">
                                    {initialGrantCase.reviewMemo}
                                </p>
                            </div>
                        </DetailCard>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">画面ガイド</h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <p>
                                    案件名、案件ステージ、次アクションを管理します。
                                </p>

                                <p>
                                    助成金名と検討メモは、判定時点の情報として変更しません。
                                </p>

                                <p>
                                    採択後も、実施・報告・精算まで継続して管理します。
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
                            <h2 className="text-lg font-semibold text-white">
                                ライフサイクル
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <LifecycleItem label="申請準備中" />
                                <LifecycleItem label="申請済・審査中" />
                                <LifecycleItem label="採択" />
                                <LifecycleItem label="事業実施中" />
                                <LifecycleItem label="中間報告" />
                                <LifecycleItem label="実績報告" />
                                <LifecycleItem label="精算中" />
                                <LifecycleItem label="完了" />
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
                            <h2 className="text-lg font-semibold text-white">操作</h2>

                            <div className="mt-5 grid gap-3">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95"
                                >
                                    <Save size={18} />
                                    保存
                                </button>

                                <button
                                    type="button"
                                    onClick={handleRejectCase}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/40 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
                                >
                                    <Trash2 size={18} />
                                    不採択として案件を終了
                                </button>
                            </div>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    );
}

type DetailCardProps = {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
};

const DetailCard = ({ icon, title, children }: DetailCardProps) => {
    return (
        <section className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
            <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-2 text-cyan-200">{icon}</div>

                <h2 className="text-lg font-semibold text-white">{title}</h2>
            </div>

            {children}
        </section>
    );
};

type LifecycleItemProps = {
    label: string;
};

const LifecycleItem = ({ label }: LifecycleItemProps) => {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
            {label}
        </div>
    );
};