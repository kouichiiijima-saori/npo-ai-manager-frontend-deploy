import React, { useMemo, useState } from "react";
import { useGrantMasters } from "../../../hooks/useGrantMasters";
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
import type {
    DeadlineStatus,
} from "../../../types/DeadlineStatus";
import type {
    CaseStatus,
} from "../../../types/CaseStatus";
import type {
    GrantMasterApiResponse,
} from "../../../types/GrantMasterApiResponse";
import type {
    EvaluationHistoryApiResponse,
} from "../../../types/EvaluationHistoryApiResponse";
import type {
    GrantProgram,
} from "../../../types/GrantProgram";

const getGrantMasterIdFromSnapshot = (
    grantSnapshot: string | null
): number | null => {
    if (!grantSnapshot) {
        return null;
    }

    try {
        const parsed = JSON.parse(grantSnapshot);
        const grantMasterId = Number(parsed.grantMasterId);

        if (Number.isNaN(grantMasterId)) {
            return null;
        }

        return grantMasterId;
    } catch {
        return null;
    }
};

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

const calculateDeadlineStatus = (deadline: string): DeadlineStatus => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return "EXPIRED";
    }

    if (diffDays <= 30) {
        return "NEAR_DEADLINE";
    }

    return "OPEN";
};

const formatGrantAmount = (amount: number | null): string => {
    if (amount === null) {
        return "上限額未設定";
    }

    return `上限 ${amount.toLocaleString()}円`;
};

const convertGrantMasterToGrantProgram = (
    grantMaster: GrantMasterApiResponse
): GrantProgram => {
    const deadline = grantMaster.applicationDeadline ?? "";

    return {
        id: grantMaster.id,
        name: grantMaster.title,
        provider: grantMaster.provider ?? "",
        amount: formatGrantAmount(grantMaster.maxGrantAmount),
        deadline: deadline || "締切未設定",
        deadlineStatus: deadline ? calculateDeadlineStatus(deadline) : "OPEN",
        summary: grantMaster.summary ?? "",
        target: [
            grantMaster.targetTheme,
            grantMaster.targetProject,
            grantMaster.targetOrganization,
            grantMaster.targetArea,
        ]
            .filter(Boolean)
            .join(" / ") || "対象条件未設定",
        url: grantMaster.officialUrl ?? undefined,
        memo: grantMaster.requiredDocuments ?? undefined,
        tags: [
            grantMaster.targetTheme,
            grantMaster.targetArea,
            grantMaster.fiscalYear ? `${grantMaster.fiscalYear}年度` : null,
        ].filter(Boolean) as string[],
        isArchived: false,
        caseStatus: "NOT_STARTED",
    };
};

export function PGA06GrantListPage() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [selectedDeadlineStatus, setSelectedDeadlineStatus] =
        useState<DeadlineStatus | "ALL">("ALL");
    const [showArchived, setShowArchived] = useState(false);

    const {
        grants,
        isLoading,
        errorMessage,
    } = useGrantMasters(
        convertGrantMasterToGrantProgram
    );

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
    }, [grants, showArchived]);

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
    }, [grants, keyword, selectedDeadlineStatus, showArchived]);

    const handleCreateGrant = () => {
        navigate("/admin/grants/new");
    };

    const handleViewGrant = (grantId: number) => {
        navigate(`/admin/grants/${grantId}?mode=view`);
    };

    const handleEditGrant = (grantId: number) => {
        navigate(`/admin/grants/${grantId}?mode=edit`);
    };

    const handleStartEvaluation = (grantId: number) => {
        navigate(`/ai-workspace/${grantId}`);
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

                {isLoading && (
                    <section className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300 backdrop-blur">
                        助成金公募一覧を読み込み中です。
                    </section>
                )}

                {errorMessage && (
                    <section className="mb-6 rounded-[1.5rem] border border-rose-400/30 bg-rose-500/10 p-5 text-sm text-rose-200 backdrop-blur">
                        {errorMessage}
                    </section>
                )}

                <section className="grid gap-5">
                    {!isLoading && !errorMessage && filteredGrants.length === 0 && (
                        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-slate-300">
                            条件に一致する助成金公募はありません。
                        </div>
                    )}
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

                                        {grant.unreviewedHistoryId && (
                                            <Badge className="border-cyan-500/40 bg-cyan-500/20 text-cyan-200">
                                                未保存の判定あり
                                            </Badge>
                                        )}

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
                                            {grant.unreviewedHistoryId ? (
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/evaluation-histories/${grant.unreviewedHistoryId}`)}
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/30"
                                                >
                                                    判定結果を確認
                                                    <ArrowRight size={18} />
                                                </button>
                                            ) : (
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
                                            )}

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

                                                <SmallActionButton
                                                    icon={<Trash2 size={15} />}
                                                    label={grant.isArchived ? "アーカイブ済み" : "非表示"}
                                                    onClick={undefined}
                                                    disabled
                                                />
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
    onClick?: () => void;
    disabled?: boolean;
};

const SmallActionButton = ({ icon, label, onClick, disabled }: SmallActionButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white ${disabled ? "cursor-not-allowed opacity-50" : ""
                }`}
        >
            {icon}
            {label}
        </button>
    );
};