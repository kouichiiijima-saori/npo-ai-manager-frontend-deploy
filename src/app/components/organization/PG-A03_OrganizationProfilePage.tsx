import React, { useState } from "react";
import {
    AlertTriangle,
    BadgeCheck,
    Building2,
    CheckCircle2,
    Edit3,
    FileText,
    MapPin,
    Save,
    Sparkles,
    UserRound,
    X,
} from "lucide-react";

type OrganizationProfile = {
    organizationName: string;
    representativeName: string;
    location: string;
    establishedDate: string;
    activityArea: string;
    mission: string;
    targetPeople: string;
    mainActivities: string;
};

const initialProfile: OrganizationProfile = {
    organizationName: "特定非営利活動法人 サンプルNPO",
    representativeName: "代表者名",
    location: "埼玉県比企郡鳩山町",
    establishedDate: "2026-04-01",
    activityArea: "地域福祉、農福連携、子どもの居場所づくり",
    mission:
        "農・食・多様性を軸に、地域で支え合いながら暮らせる場をつくる。",
    targetPeople:
        "子ども、障害のある人、社会との接点が少なくなった人、地域住民",
    mainActivities:
        "農業体験、地域交流、子どもの居場所づくり、障害福祉との連携、助成金を活用した地域活動",
};

const fieldLabels: Record<keyof OrganizationProfile, string> = {
    organizationName: "団体名",
    representativeName: "代表者名",
    location: "所在地",
    establishedDate: "設立日",
    activityArea: "活動分野",
    mission: "団体の目的・ミッション",
    targetPeople: "主な対象者",
    mainActivities: "主な活動内容",
};

export function PGA03OrganizationProfilePage() {
    const [profile, setProfile] = useState<OrganizationProfile>(initialProfile);
    const [draft, setDraft] = useState<OrganizationProfile>(initialProfile);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (field: keyof OrganizationProfile, value: string) => {
        setDraft((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleStartEdit = () => {
        setDraft(profile);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDraft(profile);
        setIsEditing(false);
    };

    const handleSave = () => {
        setProfile(draft);
        setIsEditing(false);
    };

    const displayProfile = isEditing ? draft : profile;

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
                                PG-A03 団体基本情報
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-white">
                                団体基本情報
                            </h1>

                            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                                AI判定の根拠として利用する団体の基本情報を確認・編集します。
                                団体目的、活動分野、対象者、主な活動内容は助成金との適合判定に利用されます。
                            </p>

                            <div className="grid gap-6 md:grid-cols-3">
                                <SummaryCard
                                    icon={<CheckCircle2 size={20} />}
                                    label="必須項目"
                                    value="8 / 8"
                                    cardClassName="border-emerald-500/30 bg-emerald-500/10"
                                    iconClassName="bg-emerald-500/20 text-emerald-200"
                                />

                                <SummaryCard
                                    icon={<BadgeCheck size={20} />}
                                    label="AI判定利用"
                                    value="利用可能"
                                    cardClassName="border-cyan-500/30 bg-cyan-500/10"
                                    iconClassName="bg-cyan-500/20 text-cyan-200"
                                />

                                {/** TODO:
                                API接続後に organization.updatedAt を表示 **/}
                                <SummaryCard
                                    icon={<FileText size={20} />}
                                    label="最終更新"
                                    value="2026-06-05"
                                    cardClassName="border-violet-500/30 bg-violet-500/10"
                                    iconClassName="bg-violet-500/20 text-violet-200"
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
                        <ProfileCard
                            icon={<Building2 size={20} />}
                            title="基本情報"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <FieldBlock
                                    label={fieldLabels.organizationName}
                                    value={displayProfile.organizationName}
                                    isEditing={isEditing}
                                    onChange={(value) => handleChange("organizationName", value)}
                                />

                                <FieldBlock
                                    label={fieldLabels.representativeName}
                                    value={displayProfile.representativeName}
                                    isEditing={isEditing}
                                    onChange={(value) => handleChange("representativeName", value)}
                                />

                                <FieldBlock
                                    label={fieldLabels.location}
                                    value={displayProfile.location}
                                    isEditing={isEditing}
                                    onChange={(value) => handleChange("location", value)}
                                />

                                <FieldBlock
                                    label={fieldLabels.establishedDate}
                                    value={displayProfile.establishedDate}
                                    type="date"
                                    isEditing={isEditing}
                                    onChange={(value) => handleChange("establishedDate", value)}
                                />
                            </div>

                            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                                <div className="flex gap-2">
                                    <MapPin size={16} className="mt-1 shrink-0 text-amber-200" />
                                    <p>
                                        所在地は公開して差し支えない範囲で登録します。
                                        個人宅住所などの個人情報は登録しないでください。
                                    </p>
                                </div>
                            </div>
                        </ProfileCard>

                        <ProfileCard
                            icon={<FileText size={20} />}
                            title="活動・目的"
                        >
                            <div className="space-y-4">
                                <FieldBlock
                                    label={fieldLabels.activityArea}
                                    value={displayProfile.activityArea}
                                    isEditing={isEditing}
                                    onChange={(value) => handleChange("activityArea", value)}
                                />

                                <FieldBlock
                                    label={fieldLabels.mission}
                                    value={displayProfile.mission}
                                    isEditing={isEditing}
                                    multiline
                                    onChange={(value) => handleChange("mission", value)}
                                />

                                <FieldBlock
                                    label={fieldLabels.targetPeople}
                                    value={displayProfile.targetPeople}
                                    isEditing={isEditing}
                                    multiline
                                    onChange={(value) => handleChange("targetPeople", value)}
                                />

                                <FieldBlock
                                    label={fieldLabels.mainActivities}
                                    value={displayProfile.mainActivities}
                                    isEditing={isEditing}
                                    multiline
                                    onChange={(value) => handleChange("mainActivities", value)}
                                />
                            </div>
                        </ProfileCard>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                画面ガイド
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="団体の基本情報を確認・編集します。" />
                                <GuideLine text="活動分野や対象者はAI判定の根拠として利用します。" />
                                <GuideLine text="情報が古い場合は、助成金との適合判定が弱くなります。" />
                            </div>
                        </div>

                        <ProfileCard
                            icon={<BadgeCheck size={20} />}
                            title="業務説明"
                        >
                            <div className="space-y-3">
                                <InfoItem title="活動分野" description="助成金の対象分野と照合します。" />
                                <InfoItem title="団体目的" description="定款・公募趣旨との整合確認に利用します。" />
                                <InfoItem title="対象者" description="助成対象者との一致度を確認します。" />
                                <InfoItem title="主な活動内容" description="活動実績とのつながりを確認します。" />
                            </div>
                        </ProfileCard>

                        <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                注意事項
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="AI判定前に、活動分野と主な活動内容を確認してください。" />
                                <GuideLine text="所在地には個人情報を含めないでください。" />
                                <GuideLine text="保存後は参照モードへ戻ります。" />
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

type ProfileCardProps = {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
};

const ProfileCard = ({ icon, title, children }: ProfileCardProps) => {
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
    type?: "text" | "date";
    isEditing: boolean;
    multiline?: boolean;
    onChange: (value: string) => void;
};

const FieldBlock = ({
    label,
    value,
    type = "text",
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
                        rows={4}
                        onChange={(event) => onChange(event.target.value)}
                        className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                    />
                ) : (
                    <input
                        type={type}
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

type StatusRowProps = {
    label: string;
    value: string;
};

const StatusRow = ({ label, value }: StatusRowProps) => {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm font-semibold text-white">
                {label}
            </p>

            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                {value}
            </span>
        </div>
    );
};