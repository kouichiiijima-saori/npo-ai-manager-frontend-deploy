import React, { useState } from "react";
import {
    AlertTriangle,
    BadgeCheck,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    Edit3,
    FileText,
    ListChecks,
    Save,
    Sparkles,
    Users,
    X,
} from "lucide-react";

type ActivityRecord = {
    id: number;
    fiscalYear: string;
    projectName: string;
    targetPeople: string;
    participants: string;
    activitySummary: string;
    resultSummary: string;
    aiUsage: string;
};

const initialActivityRecords: ActivityRecord[] = [
    {
        id: 1,
        fiscalYear: "2025年度",
        projectName: "子ども食堂事業",
        targetPeople: "地域の子ども、保護者、ひとり親家庭",
        participants: "延べ240名",
        activitySummary:
            "長期休暇期間を中心に、地域の子どもと保護者に食事提供と居場所づくりを行った。",
        resultSummary:
            "地域住民、農家、ボランティアが連携し、子どもが安心して過ごせる場を継続的に提供できた。",
        aiUsage:
            "子ども支援、食支援、地域福祉を対象とする助成金との適合判定に利用します。",
    },
    {
        id: 2,
        fiscalYear: "2025年度",
        projectName: "農業体験・地域交流事業",
        targetPeople: "子ども、障害のある人、地域住民",
        participants: "延べ180名",
        activitySummary:
            "畑での収穫体験、野菜の袋詰め、地域交流イベントを実施した。",
        resultSummary:
            "農作業を通じて多世代交流が生まれ、障害のある人の地域参加の機会にもつながった。",
        aiUsage:
            "農福連携、地域交流、多世代参加を対象とする助成金との整合確認に利用します。",
    },
    {
        id: 3,
        fiscalYear: "2024年度",
        projectName: "学習支援・居場所づくり事業",
        targetPeople: "小中学生、保護者",
        participants: "延べ120名",
        activitySummary:
            "放課後や長期休暇中に、学習支援と安心して過ごせる居場所を提供した。",
        resultSummary:
            "学習習慣の定着だけでなく、保護者同士の相談や地域とのつながりも生まれた。",
        aiUsage:
            "学習支援、子どもの居場所、地域福祉分野の助成金判定に利用します。",
    },
];

export function PGA05ProjectPage() {
    const [activityRecords, setActivityRecords] =
        useState<ActivityRecord[]>(initialActivityRecords);
    const [selectedRecordId, setSelectedRecordId] = useState<number>(
        initialActivityRecords[0].id
    );
    const [isEditing, setIsEditing] = useState(false);

    const selectedRecord =
        activityRecords.find((record) => record.id === selectedRecordId) ??
        activityRecords[0];

    const [draft, setDraft] = useState<ActivityRecord>(selectedRecord);

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
    };

    const handleStartEdit = () => {
        setDraft(selectedRecord);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDraft(selectedRecord);
        setIsEditing(false);
    };

    const handleSave = () => {
        setActivityRecords((currentRecords) =>
            currentRecords.map((record) =>
                record.id === draft.id ? draft : record
            )
        );

        setIsEditing(false);
    };

    const handleChange = (
        field: keyof ActivityRecord,
        value: string
    ) => {
        setDraft((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const displayRecord = isEditing ? draft : selectedRecord;

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
                                AI判定の根拠として利用する活動実績を確認・編集します。
                                実施年度、事業名、対象者、成果は助成金との適合判定に利用されます。
                            </p>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                <SummaryCard
                                    icon={<BarChart3 size={20} />}
                                    label="活動実績数"
                                    value={`${activityRecords.length}件`}
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
                                    value="2026-06-05"
                                    cardClassName="border-emerald-500/30 bg-emerald-500/10"
                                    iconClassName="bg-emerald-500/20 text-emerald-200"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                                    >
                                        <X size={18} />
                                        キャンセル
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95"
                                    >
                                        <Save size={18} />
                                        保存
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleStartEdit}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:opacity-95"
                                >
                                    <Edit3 size={18} />
                                    編集
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {isEditing && (
                    <section className="mb-6 rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100">
                        <div className="flex gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />

                            <div>
                                <p className="font-semibold text-white">編集中です</p>
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
                            <div className="grid gap-3">
                                {activityRecords.map((record) => {
                                    const isSelected = record.id === selectedRecordId;

                                    return (
                                        <button
                                            key={record.id}
                                            type="button"
                                            onClick={() => handleSelectRecord(record)}
                                            className={
                                                isSelected
                                                    ? "rounded-2xl border border-cyan-300/40 bg-cyan-300/10 p-4 text-left"
                                                    : "rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/10"
                                            }
                                        >
                                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full border border-violet-400/40 bg-violet-400/10 px-3 py-1 text-xs text-violet-200">
                                                            {record.fiscalYear}
                                                        </span>

                                                        <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                                                            AI判定利用可能
                                                        </span>
                                                    </div>

                                                    <p className="mt-3 text-sm font-semibold text-white">
                                                        {record.projectName}
                                                    </p>

                                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                                                        {record.activitySummary}
                                                    </p>
                                                </div>

                                                <div className="shrink-0 text-left md:text-right">
                                                    <p className="text-xs text-slate-500">参加者</p>
                                                    <p className="mt-1 text-sm font-semibold text-white">
                                                        {record.participants}
                                                    </p>

                                                    {isSelected && (
                                                        <p className="mt-3 inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                                                            選択中
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </ProjectCard>

                        <ProjectCard
                            icon={<FileText size={20} />}
                            title="選択中の活動実績"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <FieldBlock
                                    label="実施年度"
                                    value={displayRecord.fiscalYear}
                                    isEditing={isEditing}
                                    onChange={(value) => handleChange("fiscalYear", value)}
                                />

                                <FieldBlock
                                    label="事業名"
                                    value={displayRecord.projectName}
                                    isEditing={isEditing}
                                    onChange={(value) => handleChange("projectName", value)}
                                />

                                <FieldBlock
                                    label="対象者"
                                    value={displayRecord.targetPeople}
                                    isEditing={isEditing}
                                    onChange={(value) => handleChange("targetPeople", value)}
                                />

                                <FieldBlock
                                    label="参加者数"
                                    value={displayRecord.participants}
                                    isEditing={isEditing}
                                    onChange={(value) => handleChange("participants", value)}
                                />
                            </div>

                            <div className="mt-4">
                                <FieldBlock
                                    label="活動内容"
                                    value={displayRecord.activitySummary}
                                    isEditing={isEditing}
                                    multiline
                                    onChange={(value) => handleChange("activitySummary", value)}
                                />
                            </div>

                            <div className="mt-4">
                                <FieldBlock
                                    label="成果・実績"
                                    value={displayRecord.resultSummary}
                                    isEditing={isEditing}
                                    multiline
                                    onChange={(value) => handleChange("resultSummary", value)}
                                />
                            </div>

                            <div className="mt-4">
                                <FieldBlock
                                    label="AI判定での利用"
                                    value={displayRecord.aiUsage}
                                    isEditing={isEditing}
                                    multiline
                                    onChange={(value) => handleChange("aiUsage", value)}
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
                                <GuideLine text="実施年度、事業名、対象者、成果はAI判定の根拠として利用します。" />
                                <GuideLine text="活動内容は助成金との適合性を判断する重要情報です。" />
                            </div>
                        </div>

                        <ProjectCard
                            icon={<BadgeCheck size={20} />}
                            title="業務説明"
                        >
                            <div className="space-y-3">
                                <InfoItem
                                    title="活動内容"
                                    description="助成金の対象事業や対象活動との一致を確認します。"
                                />

                                <InfoItem
                                    title="実施年度"
                                    description="近年の活動実績として利用できるかを確認します。"
                                />

                                <InfoItem
                                    title="参加人数"
                                    description="活動規模や地域への波及効果を判断する材料になります。"
                                />

                                <InfoItem
                                    title="成果・実績"
                                    description="助成金申請時の説得力や継続性の確認に利用します。"
                                />
                            </div>
                        </ProjectCard>

                        <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                注意事項
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="年度×事業名は重複登録できません。" />
                                <GuideLine text="同一事業でも年度が異なれば登録できます。" />
                                <GuideLine text="活動内容と成果は具体的に記録してください。" />
                                <GuideLine text="AI判定では活動実績を重要な根拠として利用します。" />
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
    isEditing: boolean;
    multiline?: boolean;
    onChange: (value: string) => void;
};

const FieldBlock = ({
    label,
    value,
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