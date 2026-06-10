import React, { useEffect, useState } from "react";
import {
    AlertTriangle,
    BadgeCheck,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    Edit3,
    FileText,
    ListChecks,
    Loader2,
    Plus,
    Save,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";

import { api } from "../../../api/axios";

type ActivityRecord = {
    id: number;
    organizationId: number;
    fiscalYear: number;
    projectName: string;
    content: string;
    result: string;
    reportFileName: string | null;
    createdAt?: string;
    updatedAt?: string;
};

const emptyActivityRecord: ActivityRecord = {
    id: 0,
    organizationId: 1,
    fiscalYear: 2025,
    projectName: "",
    content: "",
    result: "",
    reportFileName: "",
};

const formatDateTime = (value?: string) => {
    if (!value) {
        return "未取得";
    }

    return value.replace("T", " ").slice(0, 16);
};

const getLatestUpdatedAt = (records: ActivityRecord[]) => {
    if (records.length === 0) {
        return undefined;
    }

    return records
        .map((record) => record.updatedAt)
        .filter((value): value is string => Boolean(value))
        .sort()
        .at(-1);
};

const buildAiUsageText = (record: ActivityRecord) => {
    return `${record.projectName}の活動内容・成果は、助成金の対象事業や実績要件との整合確認に利用します。`;
};

export function PGA05ProjectPage() {
    const [records, setRecords] = useState<ActivityRecord[]>([]);
    const [selectedRecordId, setSelectedRecordId] = useState<number | null>(
        null
    );
    const [draft, setDraft] = useState<ActivityRecord>(emptyActivityRecord);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const selectedRecord =
        records.find((record) => record.id === selectedRecordId) ??
        records[0] ??
        emptyActivityRecord;

    const displayRecord = isEditing ? draft : selectedRecord;

    const fetchActivityRecords = async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const { data } = await api.get<ActivityRecord[]>(
                "/activity-records"
            );

            setRecords(data);

            if (data.length > 0) {
                const currentSelected = data.find(
                    (record) => record.id === selectedRecordId
                );

                const nextSelected = currentSelected ?? data[0];

                setSelectedRecordId(nextSelected.id);
                setDraft(nextSelected);
            } else {
                setSelectedRecordId(null);
                setDraft(emptyActivityRecord);
            }
        } catch {
            setErrorMessage(
                "活動実績の取得に失敗しました。Spring Bootが起動しているか確認してください。"
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActivityRecords();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleSelectRecord = (record: ActivityRecord) => {
        if (isEditing) {
            const confirmed = window.confirm(
                "編集中の内容を破棄して、別の活動実績を表示しますか？\n\nこの操作は取り消せません。"
            );

            if (!confirmed) {
                return;
            }
        }

        setSelectedRecordId(record.id);
        setDraft(record);
        setIsEditing(false);
        setIsCreating(false);
        setErrorMessage(null);
    };

    const handleStartCreate = () => {
        setSelectedRecordId(null);
        setDraft(emptyActivityRecord);
        setIsEditing(true);
        setIsCreating(true);
        setErrorMessage(null);
    };

    const handleStartEdit = () => {
        setDraft(selectedRecord);
        setIsEditing(true);
        setIsCreating(false);
        setErrorMessage(null);
    };

    const handleCancel = () => {
        setDraft(selectedRecord);
        setIsEditing(false);
        setIsCreating(false);
        setErrorMessage(null);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setErrorMessage(null);

            if (isCreating) {
                const response = await api.post<ActivityRecord>(
                    "/activity-records",
                    draft
                );

                const createdRecord = response.data;

                setRecords((currentRecords) =>
                    [...currentRecords, createdRecord].sort(
                        (a, b) =>
                            b.fiscalYear - a.fiscalYear ||
                            a.projectName.localeCompare(b.projectName)
                    )
                );

                setSelectedRecordId(createdRecord.id);
                setDraft(createdRecord);
                setIsCreating(false);
                setIsEditing(false);
                return;
            }

            const response = await api.put<ActivityRecord>(
                `/activity-records/${draft.id}`,
                draft
            );

            const updatedRecord = response.data;

            setRecords((currentRecords) =>
                currentRecords
                    .map((record) =>
                        record.id === updatedRecord.id
                            ? updatedRecord
                            : record
                    )
                    .sort(
                        (a, b) =>
                            b.fiscalYear - a.fiscalYear ||
                            a.projectName.localeCompare(b.projectName)
                    )
            );

            setSelectedRecordId(updatedRecord.id);
            setDraft(updatedRecord);
            setIsEditing(false);
        } catch {
            setErrorMessage(
                "活動実績の保存に失敗しました。年度と事業名の重複、またはAPI接続を確認してください。"
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedRecord || selectedRecord.id === 0) {
            return;
        }

        const confirmed = window.confirm(
            `${selectedRecord.fiscalYear}年度 ${selectedRecord.projectName} を削除しますか？\n\nこの操作は取り消せません。`
        );

        if (!confirmed) {
            return;
        }

        try {
            setIsSaving(true);
            setErrorMessage(null);

            await api.delete(`/activity-records/${selectedRecord.id}`);

            const nextRecords = records.filter(
                (record) => record.id !== selectedRecord.id
            );

            setRecords(nextRecords);

            if (nextRecords.length > 0) {
                setSelectedRecordId(nextRecords[0].id);
                setDraft(nextRecords[0]);
            } else {
                setSelectedRecordId(null);
                setDraft(emptyActivityRecord);
            }

            setIsEditing(false);
            setIsCreating(false);
        } catch {
            setErrorMessage(
                "活動実績の削除に失敗しました。API接続を確認してください。"
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (
        field: keyof ActivityRecord,
        value: string
    ) => {
        setDraft((current) => ({
            ...current,
            [field]:
                field === "fiscalYear"
                    ? Number(value)
                    : value,
        }));
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
                                PG-A05 活動実績管理
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-white">
                                活動実績管理
                            </h1>

                            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                                助成金判定の根拠として利用する活動実績を確認・編集します。
                                活動内容、成果、報告書ファイル名はAI判定時の根拠情報として参照されます。
                            </p>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                <SummaryCard
                                    icon={
                                        isLoading ? (
                                            <Loader2
                                                size={20}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <BarChart3 size={20} />
                                        )
                                    }
                                    label="活動実績数"
                                    value={
                                        isLoading
                                            ? "取得中"
                                            : `${records.length}件`
                                    }
                                    cardClassName="border-violet-500/30 bg-violet-500/10"
                                    iconClassName="bg-violet-500/20 text-violet-200"
                                />

                                <SummaryCard
                                    icon={<BadgeCheck size={20} />}
                                    label="AI判定利用"
                                    value="利用可能"
                                    cardClassName="border-cyan-500/30 bg-cyan-500/10"
                                    iconClassName="bg-cyan-500/20 text-cyan-200"
                                />

                                <SummaryCard
                                    icon={<FileText size={20} />}
                                    label="最終更新"
                                    value={formatDateTime(
                                        getLatestUpdatedAt(records)
                                    )}
                                    cardClassName="border-emerald-500/30 bg-emerald-500/10"
                                    iconClassName="bg-emerald-500/20 text-emerald-200"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <X size={18} />
                                        キャンセル
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        保存
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleStartCreate}
                                        disabled={isLoading}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Plus size={18} />
                                        新規追加
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleStartEdit}
                                        disabled={isLoading || records.length === 0}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Edit3 size={18} />
                                        編集
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={
                                            isLoading ||
                                            records.length === 0 ||
                                            isSaving
                                        }
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-300/30 bg-rose-300/10 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Trash2 size={18} />
                                        削除
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {errorMessage && (
                    <section className="mb-6 rounded-[1.5rem] border border-rose-300/20 bg-rose-300/10 p-5 text-sm leading-6 text-rose-100">
                        <div className="flex gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-200" />
                            <p>{errorMessage}</p>
                        </div>
                    </section>
                )}

                {isEditing && (
                    <section className="mb-6 rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100">
                        <div className="flex gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />

                            <div>
                                <p className="font-semibold text-white">
                                    {isCreating ? "新規作成中です" : "編集中です"}
                                </p>
                                <p className="mt-1 text-amber-100/90">
                                    キャンセルを押すと、編集中の内容は破棄され、参照モードへ戻ります。
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <ProjectCard
                            icon={<ListChecks size={20} />}
                            title="活動実績一覧"
                        >
                            {isLoading ? (
                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300">
                                    活動実績を取得中です。
                                </div>
                            ) : records.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300">
                                    登録されている活動実績はありません。
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {records.map((record) => {
                                        const isSelected =
                                            record.id === selectedRecordId;

                                        return (
                                            <button
                                                key={record.id}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectRecord(record)
                                                }
                                                className={
                                                    isSelected
                                                        ? "rounded-2xl border border-cyan-300/40 bg-cyan-300/10 p-4 text-left"
                                                        : "rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/10"
                                                }
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-sm font-semibold text-white">
                                                            {record.fiscalYear}
                                                            年度{" "}
                                                            {record.projectName}
                                                        </p>

                                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                                                            {record.content}
                                                        </p>

                                                        <p className="mt-2 text-xs text-slate-500">
                                                            成果：{record.result}
                                                        </p>
                                                    </div>

                                                    {isSelected && (
                                                        <span className="shrink-0 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                                                            選択中
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </ProjectCard>

                        <ProjectCard
                            icon={<FileText size={20} />}
                            title="選択中の活動実績"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <FieldBlock
                                    label="年度"
                                    value={String(displayRecord.fiscalYear)}
                                    inputType="number"
                                    isEditing={isEditing}
                                    onChange={(value) =>
                                        handleChange("fiscalYear", value)
                                    }
                                />

                                <FieldBlock
                                    label="事業名"
                                    value={displayRecord.projectName}
                                    isEditing={isEditing}
                                    onChange={(value) =>
                                        handleChange("projectName", value)
                                    }
                                />
                            </div>

                            <div className="mt-4 space-y-4">
                                <FieldBlock
                                    label="活動内容"
                                    value={displayRecord.content}
                                    isEditing={isEditing}
                                    multiline
                                    onChange={(value) =>
                                        handleChange("content", value)
                                    }
                                />

                                <FieldBlock
                                    label="成果"
                                    value={displayRecord.result}
                                    isEditing={isEditing}
                                    multiline
                                    onChange={(value) =>
                                        handleChange("result", value)
                                    }
                                />

                                <FieldBlock
                                    label="報告書ファイル名"
                                    value={displayRecord.reportFileName ?? ""}
                                    isEditing={isEditing}
                                    onChange={(value) =>
                                        handleChange("reportFileName", value)
                                    }
                                />

                                <FieldBlock
                                    label="AI判定での利用"
                                    value={buildAiUsageText(displayRecord)}
                                    isEditing={false}
                                    multiline
                                    onChange={() => undefined}
                                />
                            </div>
                        </ProjectCard>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                画面ガイド
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="活動実績を確認・編集します。" />
                                <GuideLine text="活動内容と成果はAI判定の根拠として利用します。" />
                                <GuideLine text="助成金申請前に最新の活動実績へ更新してください。" />
                            </div>
                        </div>

                        <ProjectCard
                            icon={<BadgeCheck size={20} />}
                            title="業務説明"
                        >
                            <div className="space-y-3">
                                <InfoItem
                                    title="活動内容"
                                    description="助成金の対象事業と団体活動の一致度を確認します。"
                                />

                                <InfoItem
                                    title="成果"
                                    description="活動規模、参加者数、地域への効果などを確認します。"
                                />

                                <InfoItem
                                    title="報告書ファイル"
                                    description="将来の資料管理・RAG検索で参照する想定です。"
                                />

                                <InfoItem
                                    title="AI判定"
                                    description="活動実績は、申請理由や適合性判定の根拠になります。"
                                />
                            </div>
                        </ProjectCard>

                        <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                注意事項
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="同一年度・同一事業名の重複登録はできません。" />
                                <GuideLine text="成果は可能な範囲で定量的に記録してください。" />
                                <GuideLine text="削除は入力ミスや重複整理のために利用します。" />
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
    cardClassName: string;
    iconClassName: string;
};

const SummaryCard = ({
    icon,
    label,
    value,
    cardClassName,
    iconClassName,
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

type ProjectCardProps = {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
};

const ProjectCard = ({ icon, title, children }: ProjectCardProps) => {
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

type FieldBlockProps = {
    label: string;
    value: string;
    inputType?: "text" | "number";
    isEditing: boolean;
    multiline?: boolean;
    onChange: (value: string) => void;
};

const FieldBlock = ({
    label,
    value,
    inputType = "text",
    isEditing,
    multiline = false,
    onChange,
}: FieldBlockProps) => {
    if (isEditing) {
        return (
            <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-200">
                    {label}
                </span>

                {multiline ? (
                    <textarea
                        value={value}
                        rows={5}
                        onChange={(event) => onChange(event.target.value)}
                        className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                    />
                ) : (
                    <input
                        type={inputType}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                    />
                )}
            </label>
        );
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm text-slate-400">
                {label}
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-white">
                {value}
            </p>
        </div>
    );
};

type GuideLineProps = {
    text: string;
};

const GuideLine = ({ text }: GuideLineProps) => {
    return (
        <div className="flex gap-2">
            <CheckCircle2 size={16} className="mt-1 shrink-0 text-cyan-200" />
            <p>{text}</p>
        </div>
    );
};

type InfoItemProps = {
    title: string;
    description: string;
};

const InfoItem = ({ title, description }: InfoItemProps) => {
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