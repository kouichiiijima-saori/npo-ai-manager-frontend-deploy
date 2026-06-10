import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    getGrantMaster,
    createGrantMaster,
    updateGrantMaster,
} from "../../../api/grantMasterApi";
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

type GrantMasterApiResponse = {
    id: number;
    fiscalYear: number;
    title: string;
    provider: string | null;
    applicationStartDate: string | null;
    applicationDeadline: string | null;
    maxGrantAmount: number | null;
    summary: string | null;
    targetTheme: string | null;
    targetProject: string | null;
    targetOrganization: string | null;
    targetArea: string | null;
    requiredDocuments: string | null;
    officialUrl: string | null;
    officialPdfName: string | null;
    archived?: boolean;
    archivedAt?: string | null;
    archiveReason?: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};

type GrantMasterForm = {
    fiscalYear: string;
    title: string;
    provider: string;
    applicationStartDate: string;
    applicationDeadline: string;
    maxGrantAmount: string;
    summary: string;
    targetTheme: string;
    targetProject: string;
    targetOrganization: string;
    targetArea: string;
    requiredDocuments: string;
    officialUrl: string;
    officialPdfName: string;
};

const API_BASE_URL = "http://localhost:8080";

const emptyGrantMasterForm: GrantMasterForm = {
    fiscalYear: String(new Date().getFullYear()),
    title: "",
    provider: "",
    applicationStartDate: "",
    applicationDeadline: "",
    maxGrantAmount: "",
    summary: "",
    targetTheme: "",
    targetProject: "",
    targetOrganization: "",
    targetArea: "",
    requiredDocuments: "",
    officialUrl: "",
    officialPdfName: "",
};

const convertGrantMasterToForm = (
    grantMaster: GrantMasterApiResponse
): GrantMasterForm => {
    return {
        fiscalYear: String(grantMaster.fiscalYear ?? ""),
        title: grantMaster.title ?? "",
        provider: grantMaster.provider ?? "",
        applicationStartDate: grantMaster.applicationStartDate ?? "",
        applicationDeadline: grantMaster.applicationDeadline ?? "",
        maxGrantAmount:
            grantMaster.maxGrantAmount !== null &&
                grantMaster.maxGrantAmount !== undefined
                ? String(grantMaster.maxGrantAmount)
                : "",
        summary: grantMaster.summary ?? "",
        targetTheme: grantMaster.targetTheme ?? "",
        targetProject: grantMaster.targetProject ?? "",
        targetOrganization: grantMaster.targetOrganization ?? "",
        targetArea: grantMaster.targetArea ?? "",
        requiredDocuments: grantMaster.requiredDocuments ?? "",
        officialUrl: grantMaster.officialUrl ?? "",
        officialPdfName: grantMaster.officialPdfName ?? "",
    };
};

const convertFormToRequestBody = (form: GrantMasterForm) => {
    return {
        fiscalYear: Number(form.fiscalYear),
        title: form.title,
        provider: form.provider || null,
        applicationStartDate: form.applicationStartDate || null,
        applicationDeadline: form.applicationDeadline || null,
        maxGrantAmount:
            form.maxGrantAmount.trim() === ""
                ? null
                : Number(form.maxGrantAmount),
        summary: form.summary || null,
        targetTheme: form.targetTheme || null,
        targetProject: form.targetProject || null,
        targetOrganization: form.targetOrganization || null,
        targetArea: form.targetArea || null,
        requiredDocuments: form.requiredDocuments || null,
        officialUrl: form.officialUrl || null,
        officialPdfName: form.officialPdfName || null,
    };
};

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
    const [form, setForm] = useState<GrantMasterForm>(emptyGrantMasterForm);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchGrantMaster = async () => {
        if (!grantId) return;
        try {
            setIsLoading(true);
            setErrorMessage("");

            const grantMaster =
                await getGrantMaster(
                    Number(grantId)
                ) as GrantMasterApiResponse;

            setForm(
                convertGrantMasterToForm(
                    grantMaster
                )
            );
        } catch (error) {
            console.error(error);
            setErrorMessage("助成金情報の取得に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGrantMaster();
    }, [grantId]);

    const deadlineStatus = getDeadlineStatus(form.applicationDeadline);
    const isNewMode = mode === "new";
    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isCaseCreated = initialGrant.caseStatus === "CASE_CREATED";
    const canStartEvaluation = initialGrant.caseStatus === "NOT_STARTED";
    const isReadOnly = isViewMode || isCaseCreated;

    const handleChange = (field: keyof GrantMasterForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setErrorMessage("");

            const requestBody = convertFormToRequestBody(form);

            if (grantId) {
                await updateGrantMaster(
                    Number(grantId),
                    requestBody
                );
            } else {
                await createGrantMaster(
                    requestBody
                );
            }

            navigate("/admin/grants");
        } catch (error) {
            console.error(error);
            alert("保存に失敗しました。");
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        if (mode === "edit") {
            setMode("view");
            fetchGrantMaster();
        } else {
            navigate("/admin/grants");
        }
    };

    const handleEdit = () => {
        setMode("edit");
    };

    const handleStartEvaluation = () => {
        if (!grantId) return;
        navigate(`/admin/grants/${grantId}/ai-evaluation`);
    };

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-[-10%] top-[10%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="absolute bottom-[-15%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>

            <main className="relative mx-auto max-w-4xl px-6 py-8">
                {errorMessage && (
                    <div className="mb-4 text-rose-400">{errorMessage}</div>
                )}
                <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-slate-950/60 backdrop-blur">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="w-full">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                                <Sparkles size={16} />
                                PG-A06B 助成金公募{isNewMode ? "登録" : "詳細"}
                            </div>

                            {isNewMode ? (
                                <h1 className="text-4xl font-bold tracking-tight text-white">
                                    新規助成金の登録
                                </h1>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${deadlineStatusStyle[deadlineStatus]}`}
                                        >
                                            {deadlineStatus === "OPEN" && (
                                                <CalendarClock size={14} />
                                            )}
                                            {deadlineStatusLabel[deadlineStatus]}
                                        </span>

                                        {isCaseCreated && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                                                案件化済み
                                            </span>
                                        )}
                                    </div>

                                    {!isEditMode ? (
                                        <h1 className="text-3xl font-bold tracking-tight text-white">
                                            {form.title}
                                        </h1>
                                    ) : (
                                        <label className="block w-full">
                                            <span className="mb-2 block text-sm font-semibold text-slate-300">
                                                助成金名
                                            </span>
                                            <input
                                                type="text"
                                                value={form.title}
                                                onChange={(e) => handleChange("title", e.target.value)}
                                                placeholder="助成金の名称を入力"
                                                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-lg font-bold text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                                            />
                                        </label>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex shrink-0 gap-3">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                            >
                                {isEditMode ? (
                                    <>
                                        <X size={18} />
                                        キャンセル
                                    </>
                                ) : (
                                    <>
                                        <ArrowLeft size={18} />
                                        一覧へ戻る
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-6">
                        <FormSection title="基本情報" icon={<FileText size={20} />}>
                            <div className="grid gap-5">
                                <FormField
                                    label="提供元（財団名・行政機関名など）"
                                    isReadOnly={isReadOnly}
                                    value={form.provider}
                                    placeholder="例：公益財団法人 未来地域財団"
                                    onChange={(val) => handleChange("provider", val)}
                                />

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <FormField
                                        label="助成金額"
                                        isReadOnly={isReadOnly}
                                        value={form.maxGrantAmount}
                                        placeholder="例：上限 100万円"
                                        onChange={(val) => handleChange("maxGrantAmount", val)}
                                    />
                                    <FormField
                                        label="公募締切"
                                        type="date"
                                        isReadOnly={isReadOnly}
                                        value={form.applicationDeadline}
                                        onChange={(val) => handleChange("applicationDeadline", val)}
                                    />
                                </div>

                                <FormField
                                    label="公募URL"
                                    isReadOnly={isReadOnly}
                                    value={form.officialUrl}
                                    placeholder="https://..."
                                    onChange={(val) => handleChange("officialUrl", val)}
                                    rightElement={
                                        isReadOnly && form.officialUrl ? (
                                            <a href={form.officialUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute right-3 top-[38px] text-cyan-400 hover:text-cyan-300"
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                        ) : undefined
                                    }
                                />
                            </div>
                        </FormSection>

                        <FormSection title="概要・対象" icon={<Tag size={20} />}>
                            <div className="grid gap-5">
                                <FormField
                                    label="助成概要"
                                    isReadOnly={isReadOnly}
                                    isTextArea
                                    rows={3}
                                    value={form.summary}
                                    placeholder="どのような活動に対する助成か簡潔に記載してください"
                                    onChange={(val) => handleChange("summary", val)}
                                />

                                <FormField
                                    label="対象者・対象要件"
                                    isReadOnly={isReadOnly}
                                    isTextArea
                                    rows={3}
                                    value={form.targetOrganization}
                                    placeholder="例：法人格を持つ非営利団体、活動実績3年以上"
                                    onChange={(val) => handleChange("targetOrganization", val)}
                                />
                            </div>
                        </FormSection>
                    </div>

                    <div className="space-y-6">
                        <aside className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
                            <h2 className="mb-5 text-lg font-semibold text-white">
                                アクション
                            </h2>

                            <div className="grid gap-3">
                                {isViewMode && (
                                    <>
                                        {!isCaseCreated && (
                                            <button
                                                type="button"
                                                onClick={handleEdit}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                                            >
                                                <Edit3 size={18} />
                                                編集する
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleStartEvaluation}
                                            disabled={!canStartEvaluation}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-300 disabled:shadow-none"
                                        >
                                            <Sparkles size={18} />
                                            {isCaseCreated ? "案件化済み" : "AIで適合度を判定"}
                                        </button>
                                    </>
                                )}

                                {(isNewMode || isEditMode) && (
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {isSaving ? "保存中..." : "保存する"}
                                    </button>
                                )}
                            </div>
                        </aside>

                        <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                            <h3 className="mb-2 font-semibold text-cyan-100">
                                公募情報の登録について
                            </h3>
                            <p className="text-sm leading-6 text-slate-300">
                                助成金の公募要項に基づき、正確な情報を入力してください。
                                ここで登録した情報は、後続のAI適合度判定や案件管理の基礎データとなります。
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// ---------------------------------------------
// サブコンポーネント
// ---------------------------------------------

type FormSectionProps = {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
};

const FormSection = ({ title, icon, children }: FormSectionProps) => {
    return (
        <section className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
            <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-2 text-cyan-200">{icon}</div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
            {children}
        </section>
    );
};

type FormFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    isReadOnly?: boolean;
    isTextArea?: boolean;
    placeholder?: string;
    type?: "text" | "date";
    rows?: number;
    rightElement?: React.ReactNode;
};

const FormField = ({
    label,
    value,
    onChange,
    isReadOnly,
    isTextArea,
    placeholder,
    type = "text",
    rows = 3,
    rightElement,
}: FormFieldProps) => {
    return (
        <label className="relative block w-full">
            <span className="mb-2 block text-sm font-semibold text-slate-300">
                {label}
            </span>

            {isReadOnly ? (
                <div className="min-h-[52px] w-full rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm leading-6 text-slate-300">
                    {value ? (
                        isTextArea ? (
                            <span className="whitespace-pre-wrap">{value}</span>
                        ) : (
                            value
                        )
                    ) : (
                        <span className="text-slate-500">未設定</span>
                    )}
                </div>
            ) : isTextArea ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                />
            )}

            {rightElement}
        </label>
    );
};