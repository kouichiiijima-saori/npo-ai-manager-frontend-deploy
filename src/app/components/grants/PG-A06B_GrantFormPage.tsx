import React, { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CalendarClock,
    Edit3,
    ExternalLink,
    FileText,
    Save,
    Sparkles,
    Tag,
    X,
} from "lucide-react";

type DeadlineStatus = "OPEN" | "NEAR_DEADLINE" | "EXPIRED";
type CaseStatus = "NOT_STARTED" | "CASE_CREATED" | "DECLINED";
type PageMode = "new" | "view" | "edit";

type GrantProgram = {
    id: number;
    name: string;
    provider: string;
    amount: string;
    deadline: string;
    summary: string;
    target: string;
    url: string;
    tagText: string;
    memo: string;
    isArchived: boolean;
    caseStatus: CaseStatus;
};

const grants: GrantProgram[] = [
    {
        id: 1,
        name: "地域子ども支援活動助成",
        provider: "公益財団法人 未来地域財団",
        amount: "上限 100万円",
        deadline: "2026-06-28",
        summary: "子どもの居場所づくり、学習支援、食支援を行う団体を対象とした助成。",
        target: "子ども支援、地域福祉、居場所づくりに取り組む非営利団体",
        url: "https://example.com/grants/children-support",
        tagText: "子ども支援 居場所 食支援",
        memo: "子ども食堂・学習支援との相性が高そう。募集要項の対象経費を要確認。",
        isArchived: false,
        caseStatus: "NOT_STARTED",
    },
    {
        id: 2,
        name: "農福連携スタートアップ支援金",
        provider: "埼玉県 地域共生推進課",
        amount: "上限 80万円",
        deadline: "2026-07-15",
        summary: "農業と福祉の連携による地域参加、就労体験、交流活動を支援。",
        target: "農福連携、就労体験、地域共生に取り組む団体",
        url: "https://example.com/grants/agri-welfare",
        tagText: "農福連携 就労体験 地域共生",
        memo: "案件化済みのため編集不可。",
        isArchived: false,
        caseStatus: "CASE_CREATED",
    },
];

const emptyGrant: GrantProgram = {
    id: 0,
    name: "",
    provider: "",
    amount: "",
    deadline: "",
    summary: "",
    target: "",
    url: "",
    tagText: "",
    memo: "",
    isArchived: false,
    caseStatus: "NOT_STARTED",
};

const getDeadlineStatus = (deadline: string): DeadlineStatus => {
    if (!deadline) {
        return "OPEN";
    }

    const today = new Date();
    const deadlineDate = new Date(`${deadline}T00:00:00`);

    today.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return "EXPIRED";
    }

    if (diffDays <= 14) {
        return "NEAR_DEADLINE";
    }

    return "OPEN";
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

export function PGA06BGrantFormPage() {
    const navigate = useNavigate();
    const { grantId } = useParams();
    const [searchParams] = useSearchParams();

    const initialMode: PageMode = grantId
        ? searchParams.get("mode") === "edit"
            ? "edit"
            : "view"
        : "new";

    const initialGrant = useMemo(() => {
        if (!grantId) {
            return emptyGrant;
        }

        return grants.find((grant) => grant.id === Number(grantId)) ?? emptyGrant;
    }, [grantId]);

    const [mode, setMode] = useState<PageMode>(initialMode);
    const [form, setForm] = useState<GrantProgram>(initialGrant);

    const deadlineStatus = getDeadlineStatus(form.deadline);
    const isNewMode = mode === "new";
    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isCaseCreated = form.caseStatus === "CASE_CREATED";
    const canStartEvaluation = form.caseStatus === "NOT_STARTED";
    const isReadOnly = isViewMode || isCaseCreated;

    const handleChange = (field: keyof GrantProgram, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleBackToList = () => {
        navigate("/admin/grants");
    };

    const handleEdit = () => {
        if (isCaseCreated || !grantId) {
            return;
        }

        setMode("edit");
        navigate(`/admin/grants/${grantId}?mode=edit`);
    };

    const handleCancel = () => {
        if (isNewMode) {
            navigate("/admin/grants");
            return;
        }

        setForm(initialGrant);
        setMode("view");
        navigate(`/admin/grants/${grantId}?mode=view`);
    };

    const handleSave = () => {
        if (isCaseCreated) {
            return;
        }

        alert("保存しました。");

        if (isNewMode) {
            navigate("/admin/grants");
            return;
        }

        setMode("view");
        navigate(`/admin/grants/${grantId}?mode=view`);
    };

    const handleStartEvaluation = () => {
        if (!grantId || !canStartEvaluation) {
            return;
        }

        navigate(`/admin/evaluations/workspace?grantId=${grantId}`);
    };

    const handleOpenUrl = () => {
        if (!form.url) {
            return;
        }

        window.open(form.url, "_blank", "noopener,noreferrer");
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
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                                <Sparkles size={16} />
                                PG-A06B 助成金公募登録・編集
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-white">
                                {isNewMode
                                    ? "助成金公募登録・編集"
                                    : isEditMode
                                        ? "助成金公募を編集"
                                        : "助成金公募の詳細"}
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={handleBackToList}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <ArrowLeft size={18} />
                            一覧へ戻る
                        </button>
                    </div>
                </section>

                {isCaseCreated && (
                    <section className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
                        この公募はすでに案件化済みです。AI判定時点の情報との整合性を守るため、編集できません。
                    </section>
                )}

                <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <FormCard
                            icon={<FileText size={20} />}
                            title="基本情報"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <TextField
                                    label="公募名"
                                    value={form.name}
                                    readOnly={isReadOnly}
                                    onChange={(value) => handleChange("name", value)}
                                />

                                <TextField
                                    label="提供元"
                                    value={form.provider}
                                    readOnly={isReadOnly}
                                    onChange={(value) => handleChange("provider", value)}
                                />

                                <TextField
                                    label="助成上限額"
                                    value={form.amount}
                                    readOnly={isReadOnly}
                                    placeholder="例：上限 100万円"
                                    onChange={(value) => handleChange("amount", value)}
                                />

                                <TextField
                                    label="締切日"
                                    type="date"
                                    value={form.deadline}
                                    readOnly={isReadOnly}
                                    onChange={(value) => handleChange("deadline", value)}
                                />
                            </div>

                            <div className="mt-4">
                                {form.deadline && (
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${deadlineStatusStyle[deadlineStatus]}`}
                                    >
                                        <CalendarClock size={14} />
                                        {deadlineStatusLabel[deadlineStatus]}
                                    </span>
                                )}
                            </div>
                        </FormCard>

                        <FormCard
                            icon={<FileText size={20} />}
                            title="募集内容"
                        >
                            <TextAreaField
                                label="募集概要"
                                value={form.summary}
                                readOnly={isReadOnly}
                                rows={4}
                                onChange={(value) => handleChange("summary", value)}
                            />

                            <div className="mt-4">
                                <TextAreaField
                                    label="対象条件"
                                    value={form.target}
                                    readOnly={isReadOnly}
                                    rows={4}
                                    onChange={(value) => handleChange("target", value)}
                                />
                            </div>

                            <div className="mt-4">
                                {isViewMode ? (
                                    <div>
                                        <p className="mb-2 text-sm font-semibold text-slate-200">
                                            募集要項URL
                                        </p>

                                        <button
                                            type="button"
                                            onClick={handleOpenUrl}
                                            disabled={!form.url}
                                            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-slate-500"
                                        >
                                            <ExternalLink size={16} />
                                            募集要項を見る
                                        </button>
                                    </div>
                                ) : (
                                    <TextField
                                        label="募集要項URL"
                                        value={form.url}
                                        readOnly={isReadOnly}
                                        placeholder="https://example.com"
                                        onChange={(value) => handleChange("url", value)}
                                    />
                                )}
                            </div>
                        </FormCard>
                    </div>

                    <div className="space-y-6">
                        <FormCard
                            icon={<Tag size={20} />}
                            title="補足情報"
                        >
                            <TextField
                                label="タグ"
                                value={form.tagText}
                                readOnly={isReadOnly}
                                placeholder="スペース区切りで入力（例：子ども支援 居場所 食支援）"
                                onChange={(value) => handleChange("tagText", value)}
                            />

                            <div className="mt-4">
                                <TextAreaField
                                    label="メモ"
                                    value={form.memo}
                                    readOnly={isReadOnly}
                                    rows={5}
                                    onChange={(value) => handleChange("memo", value)}
                                />
                            </div>
                        </FormCard>
                        <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                画面ガイド
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <p>
                                    この画面でできること
                                </p>

                                <p>
                                    ・助成金公募の登録<br />
                                    ・登録済み公募の確認<br />
                                    ・公募情報の編集<br />
                                    ・AI判定前の内容確認<br />
                                </p>

                                <p>
                                    注意事項
                                </p>

                                <p>
                                    ・募集状況は締切日から自動判定<br />
                                    ・案件化済みは編集不可<br />
                                </p>
                            </div>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                操作
                            </h2>

                            <div className="mt-5 grid gap-3">
                                {isViewMode && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleEdit}
                                            disabled={isCaseCreated}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                                        >
                                            <Edit3 size={18} />
                                            編集する
                                        </button>

                                        {canStartEvaluation && (
                                            <button
                                                type="button"
                                                onClick={handleStartEvaluation}
                                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95"
                                            >
                                                AI判定へ進む
                                                <ArrowRight size={18} />
                                            </button>
                                        )}
                                    </>
                                )}

                                {(isNewMode || isEditMode) && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={isCaseCreated}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-300 disabled:shadow-none"
                                        >
                                            <Save size={18} />
                                            保存
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                                        >
                                            <X size={18} />
                                            キャンセル
                                        </button>
                                    </>
                                )}
                            </div>

                            {isCaseCreated && (
                                <p className="mt-4 text-sm leading-6 text-amber-200">
                                    案件化済みのため編集できません。
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

type FormCardProps = {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
};

const FormCard = ({ icon, title, children }: FormCardProps) => {
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

type TextFieldProps = {
    label: string;
    value: string;
    readOnly: boolean;
    type?: string;
    placeholder?: string;
    onChange: (value: string) => void;
};

const TextField = ({
    label,
    value,
    readOnly,
    type = "text",
    placeholder,
    onChange,
}: TextFieldProps) => {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">
                {label}
            </span>

            <input
                type={type}
                value={value}
                readOnly={readOnly}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className={
                    readOnly
                        ? "w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-300 outline-none"
                        : "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                }
            />
        </label>
    );
};

type TextAreaFieldProps = {
    label: string;
    value: string;
    readOnly: boolean;
    rows: number;
    onChange: (value: string) => void;
};

const TextAreaField = ({
    label,
    value,
    readOnly,
    rows,
    onChange,
}: TextAreaFieldProps) => {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">
                {label}
            </span>

            <textarea
                value={value}
                readOnly={readOnly}
                rows={rows}
                onChange={(event) => onChange(event.target.value)}
                className={
                    readOnly
                        ? "w-full resize-none rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm leading-6 text-slate-300 outline-none"
                        : "w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                }
            />
        </label>
    );
};