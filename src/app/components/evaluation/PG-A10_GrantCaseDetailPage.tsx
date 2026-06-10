import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/axios";
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

type GrantMasterApiResponse = {
    id: number;
    fiscalYear: number;
    title: string;
    provider: string;
    applicationStartDate: string | null;
    applicationDeadline: string | null;
    maxGrantAmount: number | null;
    summary: string;
    targetTheme: string | null;
    targetProject: string | null;
    targetOrganization: string | null;
    targetArea: string | null;
    requiredDocuments: string | null;
    officialUrl: string | null;
    officialPdfName: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};

type GrantRequirementCheckApiResponse = {
    id: number;
    grantCaseId: number;
    requirementName: string;
    targetFileName: string | null;
    checkStatus: string;
    checkMemo: string | null;
    archived: boolean;
    archivedAt: string | null;
    archiveReason: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};

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

const checkStatusLabel: Record<string, string> = {
    UNCHECKED: "未確認",
    CHECKING: "確認中",
    COMPLETED: "確認済み",
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

export function PGA10GrantCaseDetailPage() {
    const navigate = useNavigate();
    const { caseId } = useParams<{ caseId: string }>();

    const [grantCase, setGrantCase] = useState<GrantCaseApiResponse | null>(null);
    const [grantMaster, setGrantMaster] = useState<GrantMasterApiResponse | null>(null);

    const [caseName, setCaseName] = useState("");
    const [stage, setStage] = useState<CaseStage>("APPLY_PREPARATION");
    const [nextAction, setNextAction] = useState("");
    const [nextActionDueDate, setNextActionDueDate] = useState("");
    const [examinationMemo, setExaminationMemo] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const [archiveReason, setArchiveReason] = useState("");
    const [isArchiving, setIsArchiving] = useState(false);
    const [archiveErrorMessage, setArchiveErrorMessage] = useState("");

    const [requirementChecks, setRequirementChecks] = useState<
        GrantRequirementCheckApiResponse[]
    >([]);
    const [isLoadingRequirementChecks, setIsLoadingRequirementChecks] =
        useState(false);
    const [requirementCheckErrorMessage, setRequirementCheckErrorMessage] =
        useState("");

    const dueSoon = nextActionDueDate ? isDueSoon(nextActionDueDate) : false;

    useEffect(() => {
        const fetchGrantCaseDetail = async () => {
            if (!caseId) {
                setErrorMessage("案件IDが指定されていません。");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage("");

                const { data: caseData } = await api.get<GrantCaseApiResponse>(
                    `/api/grant-cases/${caseId}`
                );

                setGrantCase(caseData);
                setCaseName(caseData.caseName);
                setStage(caseData.caseStage);
                setNextAction(caseData.nextAction ?? "");
                setNextActionDueDate(caseData.nextActionDueDate ?? "");
                setExaminationMemo(caseData.examinationMemo ?? "");

                const { data: grantData } = await api.get<GrantMasterApiResponse>(
                    `/api/grant-masters/${caseData.grantMasterId}`
                );

                setGrantMaster(grantData);
            } catch (error) {
                console.error(error);
                setErrorMessage("助成金案件詳細の取得に失敗しました。");
            } finally {
                setIsLoading(false);
            }
        };

        fetchGrantCaseDetail();
    }, [caseId]);

    useEffect(() => {
        const fetchRequirementChecks = async () => {
            if (!caseId) {
                return;
            }

            try {
                setIsLoadingRequirementChecks(true);
                setRequirementCheckErrorMessage("");

                const { data } = await api.get<GrantRequirementCheckApiResponse[]>(
                    `/api/grant-cases/${caseId}/requirement-checks`
                );

                setRequirementChecks(data);
            } catch (error) {
                console.error(error);
                setRequirementCheckErrorMessage("応募要件確認の取得に失敗しました。");
            } finally {
                setIsLoadingRequirementChecks(false);
            }
        };

        fetchRequirementChecks();
    }, [caseId]);

    const handleBackToList = () => {
        navigate("/admin/grant-cases");
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (!grantCase) {
            return;
        }

        setCaseName(grantCase.caseName);
        setStage(grantCase.caseStage);
        setNextAction(grantCase.nextAction ?? "");
        setNextActionDueDate(grantCase.nextActionDueDate ?? "");
        setExaminationMemo(grantCase.examinationMemo ?? "");
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!grantCase) {
            return;
        }

        try {
            setIsSaving(true);
            setErrorMessage("");

            const { data: updatedCase } = await api.put<GrantCaseApiResponse>(
                `/api/grant-cases/${grantCase.id}`,
                {
                    ...grantCase,
                    caseName,
                    caseStage: stage,
                    examinationMemo,
                    nextAction,
                    nextActionDueDate: nextActionDueDate || null,
                }
            );

            const updatedRequirementChecks: GrantRequirementCheckApiResponse[] =
                await Promise.all(
                    requirementChecks.map(async (check) => {
                        const { data: requirementData } = await api.put<GrantRequirementCheckApiResponse>(
                            `/api/grant-requirement-checks/${check.id}`,
                            check
                        );
                        return requirementData;
                    })
                );

            setGrantCase(updatedCase);
            setCaseName(updatedCase.caseName);
            setStage(updatedCase.caseStage);
            setNextAction(updatedCase.nextAction ?? "");
            setNextActionDueDate(updatedCase.nextActionDueDate ?? "");
            setExaminationMemo(updatedCase.examinationMemo ?? "");
            setRequirementChecks(updatedRequirementChecks);

            setIsEditing(false);

            alert("案件情報と応募要件確認を保存しました。");
        } catch (error) {
            console.error(error);
            setErrorMessage("案件情報の保存に失敗しました。");
        } finally {
            setIsSaving(false);
        }
    };

    const handleArchive = async () => {
        if (!grantCase) {
            return;
        }

        if (archiveReason.trim() === "") {
            setArchiveErrorMessage("アーカイブ理由を入力してください。");
            return;
        }

        try {
            setIsArchiving(true);
            setArchiveErrorMessage("");

            const { data: updatedGrantCase } = await api.patch<GrantCaseApiResponse>(
                `/api/grant-cases/${grantCase.id}/archive`,
                { archiveReason }
            );

            setGrantCase(updatedGrantCase);
            setArchiveReason("");
            setArchiveErrorMessage("");

            navigate("/admin/grant-cases");
        } catch (error) {
            console.error(error);
            setArchiveErrorMessage("案件のアーカイブに失敗しました。");
        } finally {
            setIsArchiving(false);
        }
    };

    const handleArchiveWithReason = async (reason: string) => {
        if (!grantCase) {
            return;
        }

        try {
            setIsArchiving(true);
            setArchiveErrorMessage("");

            await api.patch(
                `/api/grant-cases/${grantCase.id}/archive`,
                { archiveReason: reason }
            );

            alert("案件をアーカイブしました。");
            navigate("/admin/grant-cases");
        } catch (error) {
            console.error(error);
            setArchiveErrorMessage("案件のアーカイブに失敗しました。");
        } finally {
            setIsArchiving(false);
        }
    };

    const handleRequirementCheckStatusChange = (
        id: number,
        nextStatus: string
    ) => {
        setRequirementChecks((currentChecks) =>
            currentChecks.map((check) =>
                check.id === id
                    ? {
                        ...check,
                        checkStatus: nextStatus,
                    }
                    : check
            )
        );
    };

    const handleCompleteArchive = async () => {
        if (!grantCase) {
            return;
        }

        try {
            setIsArchiving(true);
            setArchiveErrorMessage("");

            await api.patch(
                `/api/grant-cases/${grantCase.id}/complete`,
                { archiveReason: "完了として案件を終了" }
            );

            alert("案件を完了としてアーカイブしました。");

            navigate("/grant-cases");
        } catch (error) {
            console.error(error);
            setArchiveErrorMessage("案件の完了処理に失敗しました。");
        } finally {
            setIsArchiving(false);
        }
    };

    const handleRequirementCheckMemoChange = (
        id: number,
        nextMemo: string
    ) => {
        setRequirementChecks((currentChecks) =>
            currentChecks.map((check) =>
                check.id === id
                    ? {
                        ...check,
                        checkMemo: nextMemo,
                    }
                    : check
            )
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-[-10%] top-[10%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="absolute bottom-[-15%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>

            <main className="relative mx-auto max-w-7xl px-6 py-8">
                {isLoading && (
                    <section className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300 backdrop-blur">
                        助成金案件詳細を読み込み中です。
                    </section>
                )}

                {errorMessage && (
                    <section className="mb-6 flex items-start gap-3 rounded-[1.5rem] border border-rose-400/30 bg-rose-500/10 p-5 text-sm text-rose-200 backdrop-blur">
                        <AlertTriangle className="mt-0.5 shrink-0" size={18} />
                        <p>{errorMessage}</p>
                    </section>
                )}

                {!isLoading && grantCase && grantMaster && (
                    <>
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

                                        {isEditing ? (
                                            <input
                                                value={caseName}
                                                onChange={(event) => setCaseName(event.target.value)}
                                                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-3xl font-bold tracking-tight text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-white">
                                                {caseName || "未設定"}
                                            </p>
                                        )}
                                    </label>

                                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                                        <span>助成金名：{grantMaster?.title ?? "未設定"}</span>
                                        <span>提供元：{grantMaster?.provider ?? "未設定"}</span>
                                        <span>公募締切：{grantMaster?.applicationDeadline ?? "未設定"}</span>
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

                                            {isEditing ? (
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
                                            ) : (
                                                <p className="text-sm font-semibold text-white">
                                                    {stageLabel[stage] ?? stage}
                                                </p>
                                            )}
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

                                        {isEditing ? (
                                            <textarea
                                                value={nextAction}
                                                onChange={(event) => setNextAction(event.target.value)}
                                                rows={5}
                                                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                                            />
                                        ) : (
                                            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                                                {nextAction || "未設定"}
                                            </p>
                                        )}
                                    </label>

                                    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-semibold text-slate-200">
                                                次アクション期限
                                            </span>

                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    value={nextActionDueDate}
                                                    onChange={(event) => setNextActionDueDate(event.target.value)}
                                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
                                                />
                                            ) : (
                                                <p className="text-sm font-semibold text-white">
                                                    {nextActionDueDate || "未設定"}
                                                </p>
                                            )}
                                        </label>

                                        {dueSoon && (
                                            <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-xs text-rose-200">
                                                <AlertTriangle size={14} />
                                                締切注意
                                            </span>
                                        )}
                                    </div>
                                </DetailCard>

                                <DetailCard icon={<FileText size={20} />} title="応募要件確認">
                                    {isLoadingRequirementChecks ? (
                                        <p className="text-sm text-slate-300">
                                            応募要件確認を読み込み中です。
                                        </p>
                                    ) : requirementCheckErrorMessage ? (
                                        <p className="text-sm text-rose-300">
                                            {requirementCheckErrorMessage}
                                        </p>
                                    ) : (() => {
                                        const visibleRequirementChecks = (() => {
                                            const latestCheckMap = new Map<string, GrantRequirementCheckApiResponse>();

                                            requirementChecks.forEach((check) => {
                                                const current = latestCheckMap.get(check.requirementName);

                                                if (!current || check.id > current.id) {
                                                    latestCheckMap.set(check.requirementName, check);
                                                }
                                            });

                                            return Array.from(latestCheckMap.values());
                                        })();

                                        if (visibleRequirementChecks.length === 0) {
                                            return (
                                                <p className="text-sm text-slate-300">
                                                    応募要件確認はまだ登録されていません。
                                                </p>
                                            );
                                        }

                                        return (
                                            <div className="space-y-4">
                                                {visibleRequirementChecks.map((check) => (
                                                    <div
                                                        key={check.id}
                                                        className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4"
                                                    >
                                                        <div className="space-y-3 text-sm text-slate-300">
                                                            <div>
                                                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                                                    要件名
                                                                </p>
                                                                <p className="mt-1 text-sm text-white">
                                                                    {check.requirementName}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                                                    確認状況
                                                                </p>
                                                                <select
                                                                    aria-label={`${check.requirementName}の確認状況`}
                                                                    value={check.checkStatus}
                                                                    onChange={(event) =>
                                                                        handleRequirementCheckStatusChange(
                                                                            check.id,
                                                                            event.target.value
                                                                        )
                                                                    }
                                                                    disabled={!isEditing}
                                                                    className="mt-2 w-full max-w-xs rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-300/50"
                                                                >
                                                                    <option value="UNCHECKED">未確認</option>
                                                                    <option value="CHECKING">確認中</option>
                                                                    <option value="COMPLETED">確認済み</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                                                    対象資料
                                                                </p>
                                                                <p className="mt-1 text-sm text-white">
                                                                    {check.targetFileName || "未設定"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                                                    確認メモ
                                                                </p>

                                                                {isEditing ? (
                                                                    <textarea
                                                                        aria-label={`${check.requirementName}の確認メモ`}
                                                                        value={check.checkMemo ?? ""}
                                                                        onChange={(event) =>
                                                                            handleRequirementCheckMemoChange(
                                                                                check.id,
                                                                                event.target.value
                                                                            )
                                                                        }
                                                                        className="..."
                                                                        rows={3}
                                                                    />
                                                                ) : (
                                                                    <p className="mt-1 text-sm text-slate-300">
                                                                        {check.checkMemo || "未入力"}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    })()}
                                </DetailCard>

                                <DetailCard icon={<FileText size={20} />} title="検討メモ">
                                    {isEditing ? (
                                        <textarea
                                            value={examinationMemo}
                                            onChange={(event) => setExaminationMemo(event.target.value)}
                                            rows={6}
                                            placeholder="検討メモ、確認事項、見送り理由などを入力してください。"
                                            className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                                        />
                                    ) : (
                                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                                            {examinationMemo || "未入力"}
                                        </p>
                                    )}
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
                                        {!isEditing ? (
                                            <button
                                                type="button"
                                                onClick={handleEdit}
                                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95"
                                            >
                                                編集
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={handleSave}
                                                    disabled={isSaving}
                                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-300 disabled:shadow-none"
                                                >
                                                    <Save size={18} />
                                                    {isSaving ? "保存中..." : "保存"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={handleCancel}
                                                    disabled={isSaving}
                                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    キャンセル
                                                </button>
                                            </>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => handleArchiveWithReason("不採択として案件を終了")}
                                            disabled={isArchiving}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-400/5 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Trash2 size={18} />
                                            不採択として案件を終了
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleArchiveWithReason("完了として案件を終了")}
                                            disabled={
                                                isArchiving ||
                                                grantCase?.caseStage !== "COMPLETED"
                                            }
                                            title={
                                                grantCase?.caseStage !== "COMPLETED"
                                                    ? "案件ステージを完了に変更してから実行してください"
                                                    : undefined
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-5 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <CheckCircle2 size={18} />
                                            完了として案件を終了
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-[1.5rem] border border-rose-400/20 bg-rose-400/5 p-6 shadow-xl shadow-slate-950/40">
                                    <h2 className="text-lg font-semibold text-rose-200">アーカイブ</h2>

                                    <div className="mt-5 grid gap-3">
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-semibold text-rose-200/80">
                                                アーカイブ理由
                                            </span>
                                            <textarea
                                                value={archiveReason}
                                                onChange={(event) => setArchiveReason(event.target.value)}
                                                rows={3}
                                                placeholder="例：誤って作成したため、別案件と重複しているため"
                                                className="w-full resize-none rounded-2xl border border-rose-400/20 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-rose-400/50"
                                            />
                                        </label>

                                        {archiveErrorMessage && (
                                            <p className="text-sm font-medium text-rose-400">
                                                {archiveErrorMessage}
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleArchive}
                                            disabled={isArchiving}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950/40 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Trash2 size={18} />
                                            {isArchiving ? "アーカイブ中..." : "案件をアーカイブ"}
                                        </button>
                                    </div>
                                </div>
                            </aside>
                        </section>
                    </>
                )}
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