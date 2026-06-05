import React, { useState } from "react";
import {
    AlertTriangle,
    BadgeCheck,
    CheckCircle2,
    Edit3,
    FileText,
    Hash,
    ListChecks,
    Save,
    Sparkles,
    X,
} from "lucide-react";

type CharterArticle = {
    id: number;
    articleNumber: string;
    title: string;
    content: string;
    aiUsage: string;
};

const initialArticles: CharterArticle[] = [
    {
        id: 1,
        articleNumber: "第1条",
        title: "目的",
        content:
            "この法人は、地域に暮らす子ども、障害のある人、社会との接点が少なくなった人々に対して、農・食・多様性を軸とした支援活動を行い、誰もが安心して暮らせる地域社会の形成に寄与することを目的とする。",
        aiUsage:
            "助成金の対象団体要件、事業目的、公益性との整合確認に利用します。",
    },
    {
        id: 2,
        articleNumber: "第2条",
        title: "事業",
        content:
            "この法人は、目的を達成するため、農業体験、子どもの居場所づくり、地域交流、福祉との連携、学習支援、食支援に関する事業を行う。",
        aiUsage:
            "助成金の対象事業、対象活動、対象経費との関連確認に利用します。",
    },
    {
        id: 3,
        articleNumber: "第3条",
        title: "活動区域",
        content:
            "この法人は、主として地域社会において活動し、必要に応じて関係機関、地域団体、行政機関等と連携して事業を実施する。",
        aiUsage:
            "助成金の対象地域、地域連携要件、協働性の確認に利用します。",
    },
];

export function PGA04ArticlePage() {
    const [articles, setArticles] = useState<CharterArticle[]>(initialArticles);
    const [selectedArticleId, setSelectedArticleId] = useState<number>(
        initialArticles[0].id
    );
    const [isEditing, setIsEditing] = useState(false);

    const selectedArticle =
        articles.find((article) => article.id === selectedArticleId) ??
        articles[0];

    const [draft, setDraft] = useState<CharterArticle>(selectedArticle);

    const handleSelectArticle = (article: CharterArticle) => {
        if (isEditing) {
            const confirmed = window.confirm(
                "編集中の内容を破棄して、別の条文を表示しますか？\n\nこの操作は取り消せません。"
            );
            if (!confirmed) {
                return;
            }
        }

        setSelectedArticleId(article.id);
        setDraft(article);
        setIsEditing(false);
    };

    const handleStartEdit = () => {
        setDraft(selectedArticle);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDraft(selectedArticle);
        setIsEditing(false);
    };

    const handleSave = () => {
        setArticles((currentArticles) =>
            currentArticles.map((article) =>
                article.id === draft.id ? draft : article
            )
        );

        setIsEditing(false);
    };

    const handleChange = (
        field: keyof CharterArticle,
        value: string
    ) => {
        setDraft((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const displayArticle = isEditing ? draft : selectedArticle;

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
                                PG-A04 定款条文管理
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-white">
                                定款条文管理
                            </h1>

                            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                                AI判定の根拠として利用する定款条文を確認・編集します。
                                団体目的、事業内容、活動区域は助成金との適合判定に利用されます。
                            </p>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                <SummaryCard
                                    icon={<Hash size={20} />}
                                    label="条文数"
                                    value={`${articles.length}条`}
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
                        <ArticleCard
                            icon={<ListChecks size={20} />}
                            title="条文一覧"
                        >
                            <div className="grid gap-3">
                                {articles.map((article) => {
                                    const isSelected = article.id === selectedArticleId;

                                    return (
                                        <button
                                            key={article.id}
                                            type="button"
                                            onClick={() => handleSelectArticle(article)}
                                            className={
                                                isSelected
                                                    ? "rounded-2xl border border-cyan-300/40 bg-cyan-300/10 p-4 text-left"
                                                    : "rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/10"
                                            }
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-white">
                                                        {article.articleNumber} {article.title}
                                                    </p>

                                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                                                        {article.content}
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
                        </ArticleCard>

                        <ArticleCard
                            icon={<FileText size={20} />}
                            title="選択中の条文"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <FieldBlock
                                    label="条番号"
                                    value={displayArticle.articleNumber}
                                    isEditing={isEditing}
                                    onChange={(value) => handleChange("articleNumber", value)}
                                />

                                <FieldBlock
                                    label="条文タイトル"
                                    value={displayArticle.title}
                                    isEditing={isEditing}
                                    onChange={(value) => handleChange("title", value)}
                                />
                            </div>

                            <div className="mt-4">
                                <FieldBlock
                                    label="条文内容"
                                    value={displayArticle.content}
                                    isEditing={isEditing}
                                    multiline
                                    onChange={(value) => handleChange("content", value)}
                                />
                            </div>

                            <div className="mt-4">
                                <FieldBlock
                                    label="AI判定での利用"
                                    value={displayArticle.aiUsage}
                                    isEditing={isEditing}
                                    multiline
                                    onChange={(value) => handleChange("aiUsage", value)}
                                />
                            </div>
                        </ArticleCard>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                画面ガイド
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="定款条文を確認・編集します。" />
                                <GuideLine text="団体目的や事業内容はAI判定の根拠として利用します。" />
                                <GuideLine text="定款変更後は最新内容へ更新してください。" />
                            </div>
                        </div>

                        <ArticleCard
                            icon={<BadgeCheck size={20} />}
                            title="業務説明"
                        >
                            <div className="space-y-3">
                                <InfoItem
                                    title="団体目的"
                                    description="助成金の対象団体要件や公益性との整合を確認します。"
                                />

                                <InfoItem
                                    title="対象事業"
                                    description="公募の対象事業と団体の事業内容が一致するか確認します。"
                                />

                                <InfoItem
                                    title="活動区域"
                                    description="助成金の対象地域や地域連携要件との関係を確認します。"
                                />

                                <InfoItem
                                    title="会員・運営体制"
                                    description="団体の運営基盤や継続性を確認する材料になります。"
                                />
                            </div>
                        </ArticleCard>

                        <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                注意事項
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="条番号の重複登録はできません。" />
                                <GuideLine text="定款変更後は最新の内容に更新してください。" />
                                <GuideLine text="目的条文と活動実績の整合を確認してください。" />
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

type ArticleCardProps = {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
};

const ArticleCard = ({ icon, title, children }: ArticleCardProps) => {
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