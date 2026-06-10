import React, { useEffect, useState } from "react";
import {
    getCharterArticles,
    createCharterArticle,
    updateCharterArticle,
    deleteCharterArticle,
} from "../../../api/charterArticleApi";
import {
    AlertTriangle,
    BadgeCheck,
    CheckCircle2,
    Edit3,
    FileText,
    Hash,
    ListChecks,
    Loader2,
    Plus,
    Save,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";



type CharterArticle = {
    id: number;
    organizationId: number;
    articleNumber: number;
    title: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
};

const emptyArticle: CharterArticle = {
    id: 0,
    organizationId: 1,
    articleNumber: 1,
    title: "",
    content: "",
};

const formatArticleNumber = (articleNumber: number) => {
    return `第${articleNumber}条`;
};

const formatDateTime = (value?: string) => {
    if (!value) {
        return "未取得";
    }

    return value.replace("T", " ").slice(0, 16);
};

const getLatestUpdatedAt = (articles: CharterArticle[]) => {
    if (articles.length === 0) {
        return undefined;
    }

    return articles
        .map((article) => article.updatedAt)
        .filter((value): value is string => Boolean(value))
        .sort()
        .at(-1);
};

const buildAiUsageText = (article: CharterArticle) => {
    if (article.title.includes("目的")) {
        return "助成金の対象団体要件、事業目的、公益性との整合確認に利用します。";
    }

    if (article.title.includes("事業")) {
        return "助成金の対象事業、対象活動、対象経費との関連確認に利用します。";
    }

    if (article.title.includes("名称")) {
        return "団体名や法人格の確認に利用します。";
    }

    return "AI判定時に、団体の根拠情報として参照します。";
};

export function PGA04ArticlePage() {
    const [articles, setArticles] = useState<CharterArticle[]>([]);
    const [selectedArticleId, setSelectedArticleId] = useState<number | null>(
        null
    );
    const [draft, setDraft] = useState<CharterArticle>(emptyArticle);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const selectedArticle =
        articles.find((article) => article.id === selectedArticleId) ??
        articles[0] ??
        emptyArticle;

    const displayArticle = isEditing ? draft : selectedArticle;

    const fetchArticles = async () => {

        try {
            setIsLoading(true);
            setErrorMessage(null);

            const data = await getCharterArticles() as CharterArticle[];

            setArticles(data);

            if (data.length > 0) {

                const currentSelected = data.find(
                    (article) => article.id === selectedArticleId
                );

                const nextSelected = currentSelected ?? data[0];

                setSelectedArticleId(nextSelected.id);
                setDraft(nextSelected);

            } else {

                setSelectedArticleId(null);
                setDraft(emptyArticle);

            }

        } catch {

            setErrorMessage(
                "定款条文の取得に失敗しました。Spring Bootが起動しているか確認してください。"
            );

        } finally {

            setIsLoading(false);

        }
    };

    useEffect(() => {
        fetchArticles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        setIsCreating(false);
        setErrorMessage(null);
    };

    const handleStartEdit = () => {
        setDraft(selectedArticle);
        setIsEditing(true);
        setIsCreating(false);
        setErrorMessage(null);
    };

    const handleStartCreate = () => {
        const nextArticleNumber =
            articles.length === 0
                ? 1
                : Math.max(...articles.map((article) => article.articleNumber)) +
                1;

        const newArticle: CharterArticle = {
            ...emptyArticle,
            articleNumber: nextArticleNumber,
        };

        setSelectedArticleId(null);
        setDraft(newArticle);
        setIsEditing(true);
        setIsCreating(true);
        setErrorMessage(null);
    };

    const handleCancel = () => {
        setDraft(selectedArticle);
        setIsEditing(false);
        setIsCreating(false);
        setErrorMessage(null);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setErrorMessage(null);

            if (isCreating) {
                const createdArticle =
                    await createCharterArticle(
                        draft
                    ) as CharterArticle;

                setArticles((currentArticles) =>
                    [...currentArticles, createdArticle].sort(
                        (a, b) => a.articleNumber - b.articleNumber
                    )
                );

                setSelectedArticleId(createdArticle.id);
                setDraft(createdArticle);
                setIsCreating(false);
                setIsEditing(false);
                return;
            }

            const updatedArticle =
                await updateCharterArticle(
                    draft.id,
                    draft
                ) as CharterArticle;

            setArticles((currentArticles) =>
                currentArticles
                    .map((article) =>
                        article.id === updatedArticle.id
                            ? updatedArticle
                            : article
                    )
                    .sort((a, b) => a.articleNumber - b.articleNumber)
            );

            setSelectedArticleId(updatedArticle.id);
            setDraft(updatedArticle);
            setIsEditing(false);
        } catch {
            setErrorMessage(
                "定款条文の保存に失敗しました。条番号の重複やAPI接続を確認してください。"
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedArticle || selectedArticle.id === 0) {
            return;
        }

        const confirmed = window.confirm(
            `${formatArticleNumber(
                selectedArticle.articleNumber
            )} ${selectedArticle.title} を削除しますか？\n\nこの操作は取り消せません。`
        );

        if (!confirmed) {
            return;
        }

        try {
            setIsSaving(true);
            setErrorMessage(null);

            await deleteCharterArticle(
                selectedArticle.id
            );

            const nextArticles = articles.filter(
                (article) => article.id !== selectedArticle.id
            );

            setArticles(nextArticles);

            if (nextArticles.length > 0) {
                setSelectedArticleId(nextArticles[0].id);
                setDraft(nextArticles[0]);
            } else {
                setSelectedArticleId(null);
                setDraft(emptyArticle);
            }

            setIsEditing(false);
            setIsCreating(false);
        } catch {
            setErrorMessage(
                "定款条文の削除に失敗しました。API接続を確認してください。"
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (
        field: keyof CharterArticle,
        value: string
    ) => {
        setDraft((current) => ({
            ...current,
            [field]:
                field === "articleNumber"
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
                                    icon={
                                        isLoading ? (
                                            <Loader2
                                                size={20}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Hash size={20} />
                                        )
                                    }
                                    label="条文数"
                                    value={
                                        isLoading
                                            ? "取得中"
                                            : `${articles.length}条`
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
                                        getLatestUpdatedAt(articles)
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
                                        disabled={isLoading || articles.length === 0}
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
                                            articles.length === 0 ||
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
                        <ArticleCard
                            icon={<ListChecks size={20} />}
                            title="条文一覧"
                        >
                            {isLoading ? (
                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300">
                                    定款条文を取得中です。
                                </div>
                            ) : articles.length === 0 ? (
                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300">
                                    登録されている定款条文はありません。
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {articles.map((article) => {
                                        const isSelected =
                                            article.id === selectedArticleId;

                                        return (
                                            <button
                                                key={article.id}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectArticle(article)
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
                                                            {formatArticleNumber(
                                                                article.articleNumber
                                                            )}{" "}
                                                            {article.title}
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
                            )}
                        </ArticleCard>

                        <ArticleCard
                            icon={<FileText size={20} />}
                            title="選択中の条文"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <FieldBlock
                                    label="条番号"
                                    value={String(displayArticle.articleNumber)}
                                    inputType="number"
                                    isEditing={isEditing}
                                    onChange={(value) =>
                                        handleChange("articleNumber", value)
                                    }
                                />

                                <FieldBlock
                                    label="条文タイトル"
                                    value={displayArticle.title}
                                    isEditing={isEditing}
                                    onChange={(value) =>
                                        handleChange("title", value)
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <FieldBlock
                                    label="条文内容"
                                    value={displayArticle.content}
                                    isEditing={isEditing}
                                    multiline
                                    onChange={(value) =>
                                        handleChange("content", value)
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <FieldBlock
                                    label="AI判定での利用"
                                    value={buildAiUsageText(displayArticle)}
                                    isEditing={false}
                                    multiline
                                    onChange={() => undefined}
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