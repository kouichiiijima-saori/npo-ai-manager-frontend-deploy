import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    CalendarClock,
    Edit3,
    Eye,
    FilePlus2,
    FileSearch,
    Filter,
    Landmark,
    Layers3,
    Search,
    Sparkles,
    Trash2,
} from "lucide-react";

type DeadlineStatus = "OPEN" | "NEAR_DEADLINE" | "EXPIRED";
type CaseStatus = "NOT_STARTED" | "CASE_CREATED" | "DECLINED";

type GrantProgram = {
    id: number;
    name: string;
    provider: string;
    amount: string;
    deadline: string;
    deadlineStatus: DeadlineStatus;
    summary: string;
    target: string;
    url?: string;
    memo?: string;
    tags: string[];
    isArchived: boolean; // 論理アーカイブ
    caseStatus: CaseStatus; // 案件化状況
};

const grants: GrantProgram[] = [
    {
        id: 1,
        name: "地域子ども支援活動助成",
        provider: "公益財団法人 未来地域財団",
        amount: "上限 100万円",
        deadline: "2026-06-28",
        deadlineStatus: "NEAR_DEADLINE",
        summary: "子どもの居場所づくり、学習支援、食支援を行う団体を対象とした助成。",
        target: "子ども支援、地域福祉、居場所づくりに取り組む非営利団体",
        url: "https://example.com/grants/children-support",
        memo: "子ども食堂・学習支援との相性が高そう。募集要項の対象経費を要確認。",
        tags: ["子ども支援", "居場所", "食支援"],
        isArchived: false,
        caseStatus: "NOT_STARTED",
    },
    {
        id: 2,
        name: "農福連携スタートアップ支援金",
        provider: "埼玉県 地域共生推進課",
        amount: "上限 80万円",
        deadline: "2026-07-15",
        deadlineStatus: "OPEN",
        summary: "農業と福祉の連携による地域参加、就労体験、交流活動を支援。",
        target: "農福連携、就労体験、地域共生に取り組む団体",
        url: "https://example.com/grants/agri-welfare",
        memo: "案件化済みのためPG-A06には表示しない想定。",
        tags: ["農福連携", "就労体験", "地域共生"],
        isArchived: false,
        caseStatus: "CASE_CREATED",
    },
    {
        id: 3,
        name: "地域コミュニティ再生助成",
        provider: "一般社団法人 まちづくり基金",
        amount: "上限 50万円",
        deadline: "2026-08-05",
        deadlineStatus: "OPEN",
        summary: "多世代交流、地域拠点づくり、住民参加型活動を対象とした助成。",
        target: "地域活動、交流拠点、多世代参加の活動を行う団体",
        url: "https://example.com/grants/community",
        memo: "農業体験や地域の居場所づくりとの接続を確認したい。",
        tags: ["多世代交流", "地域拠点", "住民参加"],
        isArchived: false,
        caseStatus: "NOT_STARTED",
    },
    {
        id: 4,
        name: "文化芸術体験活動助成",
        provider: "文化活動支援センター",
        amount: "上限 30万円",
        deadline: "2026-06-01",
        deadlineStatus: "EXPIRED",
        summary: "地域における文化芸術体験の機会創出を支援。",
        target: "文化芸術活動、体験活動を実施する団体",
        url: "https://example.com/grants/culture",
        memo: "期限切れ。将来的には一定期間後に自動アーカイブ対象。",
        tags: ["文化", "体験活動"],
        isArchived: false,
        caseStatus: "NOT_STARTED",
    },
    {
        id: 5,
        name: "登録ミス確認用データ",
        provider: "テスト団体",
        amount: "上限 10万円",
        deadline: "2026-07-01",
        deadlineStatus: "OPEN",
        summary: "論理アーカイブ確認用のサンプル。",
        target: "テスト",
        tags: ["テスト"],
        isArchived: true,
        caseStatus: "NOT_STARTED",
    },
];

const deadlineStatusLabel: Record<DeadlineStatus, string> = {
    OPEN: "募集中",
    NEAR_DEADLINE: "締切間近",
    EXPIRED: "期限終了",
};

const deadlineStatusStyle: Record<DeadlineStatus, string> = {
    OPEN: "border-sky-400/40 bg-sky-400/10 text-sky-200",
    NEAR_DEADLINE: "border-amber-400/50 bg-amber-400/15 text-amber-200",
    EXPIRED: "border-slate-500/40 bg-slate-500/20 text-slate-300",
};

export function PGA06GrantListPage() {
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState("");
    const [selectedDeadlineStatus, setSelectedDeadlineStatus] =
        useState<DeadlineStatus | "ALL">("ALL");
    const [showArchived, setShowArchived] = useState(false);

    const summaryBaseGrants = useMemo(() => {
        return grants.filter((grant) => {
            if (grant.caseStatus === "CASE_CREATED") {
                return false;
            }

            if (!showArchived && grant.isArchived) {
                return false;
            }

            return true;
        });
    }, [showArchived]);

    const openCount = summaryBaseGrants.filter(
        (grant) => grant.deadlineStatus === "OPEN"
    ).length;

    const nearDeadlineCount = summaryBaseGrants.filter(
        (grant) => grant.deadlineStatus === "NEAR_DEADLINE"
    ).length;

    const expiredCount = summaryBaseGrants.filter(
        (grant) => grant.deadlineStatus === "EXPIRED"
    ).length;

    const filteredGrants = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return grants.filter((grant) => {
            if (grant.caseStatus === "CASE_CREATED") {
                return false;
            }

            if (!showArchived && grant.isArchived) {
                return false;
            }

            if (
                selectedDeadlineStatus !== "ALL" &&
                grant.deadlineStatus !== selectedDeadlineStatus
            ) {
                return false;
            }

            const searchableText = [
                grant.name,
                grant.provider,
                grant.amount,
                grant.summary,
                grant.target,
                grant.memo ?? "",
                ...grant.tags,
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
    }, [keyword, selectedDeadlineStatus, showArchived]);

    const handleCreateGrant = () => {
        navigate("/admin/grants/new");
    };

    const handleViewGrant = (grantId: number) => {
        navigate(`/admin/grants/${grantId}?mode=view`);
    };

    const handleEditGrant = (grantId: number) => {
        navigate(`/admin/grants/${grantId}?mode=edit`);
    };

    const handleArchiveGrant = (grantId: number) => {
        const confirmed = window.confirm(
            "この公募情報を非表示（アーカイブ）にしますか？"
        );

        if (!confirmed) {
            return;
        }

        alert(`論理アーカイブ予定です。grantId: ${grantId}`);
    };

    const handleStartEvaluation = (grantId: number) => {
        navigate(`/admin/evaluations/workspace?grantId=${grantId}`);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-[-10%] top-[10%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="absolute bottom-[-15%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>

            <main className="relative mx-auto max-w-7xl px-6 py-8">
                <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-slate-950/60 backdrop-blur">
                    <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                                <Sparkles size={16} />
                                PG-A06 助成金公募管理
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-white">
                                助成金公募管理
                            </h1>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                <SummaryCard
                                    icon={<FileSearch size={20} />}
                                    label="募集中"
                                    value={`${openCount}件`}
                                    cardClassName="border-sky-500/30 bg-sky-500/10"
                                    iconClassName="bg-sky-500/20 text-sky-200"
                                />

                                <SummaryCard
                                    icon={<CalendarClock size={20} />}
                                    label="締切間近"
                                    value={`${nearDeadlineCount}件`}
                                    cardClassName="border-amber-500/30 bg-amber-500/10"
                                    iconClassName="bg-amber-500/20 text-amber-200"
                                />

                                <SummaryCard
                                    icon={<Layers3 size={20} />}
                                    label="期限終了"
                                    value={`${expiredCount}件`}
                                    cardClassName="border-slate-500/30 bg-slate-500/10"
                                    iconClassName="bg-slate-500/20 text-slate-300"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleCreateGrant}
                            className="mb-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95"
                        >
                            <FilePlus2 size={18} />
                            新規公募登録
                        </button>
                    </div>
                </section>

                <section className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full lg:max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                value={keyword}
                                onChange={(event) => setKeyword(event.target.value)}
                                placeholder="公募名・提供元・キーワードで検索"
                                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Filter size={18} className="text-slate-400" />

                            <FilterButton
                                active={selectedDeadlineStatus === "ALL"}
                                label="すべて"
                                onClick={() => setSelectedDeadlineStatus("ALL")}
                            />

                            <FilterButton
                                active={selectedDeadlineStatus === "OPEN"}
                                label="募集中"
                                onClick={() => setSelectedDeadlineStatus("OPEN")}
                            />

                            <FilterButton
                                active={selectedDeadlineStatus === "NEAR_DEADLINE"}
                                label="締切間近"
                                onClick={() => setSelectedDeadlineStatus("NEAR_DEADLINE")}
                            />

                            <FilterButton
                                active={selectedDeadlineStatus === "EXPIRED"}
                                label="期限終了"
                                onClick={() => setSelectedDeadlineStatus("EXPIRED")}
                            />

                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 hover:bg-white/10">
                                <input
                                    type="checkbox"
                                    checked={showArchived}
                                    onChange={(event) => setShowArchived(event.target.checked)}
                                    className="h-4 w-4 accent-cyan-400"
                                />
                                アーカイブ済みを表示
                            </label>
                        </div>
                    </div>
                </section>

                <section className="grid gap-5">
                    {filteredGrants.map((grant) => (
                        <article
                            key={grant.id}
                            className={`overflow-hidden rounded-[1.75rem] border shadow-xl shadow-slate-950/40 transition ${grant.isArchived || grant.deadlineStatus === "EXPIRED"
                                ? "border-slate-700/50 bg-slate-900/45 hover:border-slate-600/60"
                                : "border-white/10 bg-slate-900/80 hover:border-cyan-300/30 hover:bg-slate-900"
                                }`}
                        >
                            <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
                                <div className="p-6">
                                    <div className="mb-4 flex flex-wrap items-center gap-2">
                                        <Badge className={deadlineStatusStyle[grant.deadlineStatus]}>
                                            <CalendarClock size={14} />
                                            {deadlineStatusLabel[grant.deadlineStatus]}
                                        </Badge>

                                        {grant.isArchived && (
                                            <Badge className="border-slate-500/40 bg-slate-500/20 text-slate-300">
                                                アーカイブ済み
                                            </Badge>
                                        )}
                                    </div>

                                    <h2 className="text-2xl font-bold text-white">
                                        {grant.name}
                                    </h2>

                                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                        <span className="inline-flex items-center gap-2">
                                            <Landmark size={16} />
                                            {grant.provider}
                                        </span>

                                        <span className="inline-flex items-center gap-2">
                                            <CalendarClock size={16} />
                                            締切：{grant.deadline}
                                        </span>

                                        <span className="inline-flex items-center gap-2">
                                            <Layers3 size={16} />
                                            {grant.amount}
                                        </span>
                                    </div>

                                    <p className="mt-4 text-sm leading-7 text-slate-300">
                                        {grant.summary}
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {grant.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex border-t border-white/10 bg-slate-950/50 p-6 lg:border-l lg:border-t-0">
                                    <div className="flex w-full flex-col justify-between gap-5">
                                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                            <p className="text-sm font-semibold text-white">
                                                対象条件
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                                {grant.target}
                                            </p>
                                        </div>

                                        <div className="grid gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleStartEvaluation(grant.id)}
                                                disabled={
                                                    grant.deadlineStatus === "EXPIRED" ||
                                                    grant.isArchived
                                                }
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-300 disabled:shadow-none"
                                            >
                                                AI判定へ進む
                                                <ArrowRight size={18} />
                                            </button>

                                            <div className="grid grid-cols-3 gap-2">
                                                <SmallActionButton
                                                    icon={<Eye size={15} />}
                                                    label="詳細"
                                                    onClick={() => handleViewGrant(grant.id)}
                                                />

                                                <SmallActionButton
                                                    icon={<Edit3 size={15} />}
                                                    label="編集"
                                                    onClick={() => handleEditGrant(grant.id)}
                                                />

                                                {grant.isArchived ? (
                                                    <div className="inline-flex items-center justify-center rounded-xl border border-slate-600/40 bg-slate-700/20 px-3 py-2 text-xs font-semibold text-slate-400">
                                                        アーカイブ済み
                                                    </div>
                                                ) : (
                                                    <SmallActionButton
                                                        icon={<Trash2 size={15} />}
                                                        label="非表示"
                                                        onClick={() => handleArchiveGrant(grant.id)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
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
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${className}`}>
            {children}
        </span>
    );
};

type SmallActionButtonProps = {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
};

const SmallActionButton = ({ icon, label, onClick }: SmallActionButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
            {icon}
            {label}
        </button>
    );
};