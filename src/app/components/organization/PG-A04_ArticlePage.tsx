import React, { useState } from "react";
import {
    AlertTriangle,
    BookOpen,
    CheckCircle2,
    Edit3,
    FileText,
    Save,
    X,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type Article = {
    id: string;
    articleNumber: string;
    title: string;
    content: string;
    aiUse: string;
};

const initialArticles: Article[] = [
    {
        id: "article-3",
        articleNumber: "第3条",
        title: "目的",
        content:
            "この法人は、地域の自然環境保全および持続可能な地域社会の形成に関する活動を行い、子ども、障害のある人、地域住民が共に育ち合う場づくりに寄与することを目的とする。",
        aiUse:
            "助成金の対象分野、団体目的、活動目的との一致確認に利用する。",
    },
    {
        id: "article-4",
        articleNumber: "第4条",
        title: "事業",
        content:
            "この法人は、目的を達成するため、農福連携事業、子どもの居場所づくり事業、地域交流事業、環境保全活動、福祉と農業を結びつける活動を行う。",
        aiUse:
            "助成金の対象事業、実施可能事業、応募要件との一致確認に利用する。",
    },
    {
        id: "article-5",
        articleNumber: "第5条",
        title: "活動区域",
        content:
            "この法人の主たる活動区域は、埼玉県比企郡鳩山町およびその周辺地域とする。",
        aiUse:
            "助成金の対象地域、地域要件との一致確認に利用する。",
    },
];

export function PGA04ArticlePage() {
    const [articles, setArticles] = useState<Article[]>(initialArticles);
    const [selectedArticleId, setSelectedArticleId] =
        useState<string>("article-3");
    const [draftArticle, setDraftArticle] = useState<Article>(
        initialArticles[0],
    );
    const [isEditing, setIsEditing] = useState(false);

    const selectedArticle =
        articles.find((article) => article.id === selectedArticleId) ??
        articles[0];

    const handleSelectArticle = (article: Article) => {
        if (isEditing) {
            return;
        }

        setSelectedArticleId(article.id);
        setDraftArticle(article);
    };

    const handleStartEdit = () => {
        setDraftArticle(selectedArticle);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDraftArticle(selectedArticle);
        setIsEditing(false);
    };

    const handleSave = () => {
        setArticles((current) =>
            current.map((article) =>
                article.id === draftArticle.id ? draftArticle : article,
            ),
        );
        setSelectedArticleId(draftArticle.id);
        setIsEditing(false);
    };

    const handleChange = (field: keyof Article, value: string) => {
        setDraftArticle((current) => ({
            ...current,
            [field]: value,
        }));
    };

    return (
        <div className="min-h-full bg-neutral-950 px-8 py-8 text-neutral-100">
            <header className="mb-8">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <BookOpen className="h-4 w-4" />
                    PG-A04 定款条文管理
                </div>

                <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            定款条文管理
                        </h1>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
                            AI判定の根拠として利用する定款条文を確認・編集します。
                            団体目的、事業内容、活動区域に関する条文は、助成金との適合判定に利用されます。
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="border-neutral-700 bg-neutral-950 text-neutral-100 hover:bg-neutral-900"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    キャンセル
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    className="bg-emerald-600 text-white hover:bg-emerald-500"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    保存する
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleStartEdit}
                                className="bg-neutral-100 text-neutral-950 hover:bg-white"
                            >
                                <Edit3 className="mr-2 h-4 w-4" />
                                選択中の条文を編集
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="space-y-6">
                <section className="grid gap-4 xl:grid-cols-3">
                    <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="text-sm text-neutral-400">
                                登録状態
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                <span className="text-2xl font-bold">
                                    {articles.length}件
                                </span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-neutral-400">
                                AI判定に利用する定款条文が登録されています。
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="text-sm text-neutral-400">
                                AI判定での利用
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="secondary">根拠データ</Badge>
                            <p className="mt-3 text-sm leading-6 text-neutral-400">
                                助成金の対象目的、対象事業、地域要件との照合に利用されます。
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-900/60 bg-amber-950/30 text-neutral-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm text-amber-300">
                                <AlertTriangle className="h-4 w-4" />
                                確認事項
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-6 text-amber-100/90">
                                定款の目的・事業条文が未登録の場合、助成金との適合判定の根拠が不足します。
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {isEditing && (
                    <Alert className="border-amber-900/60 bg-amber-950/30 text-amber-100">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>編集中です</AlertTitle>
                        <AlertDescription>
                            条文選択は一時的にロックされます。キャンセルを押すと、編集中の内容は破棄され、参照モードへ戻ります。
                        </AlertDescription>
                    </Alert>
                )}

                <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
                    <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-neutral-400" />
                                <CardTitle>条文一覧</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {articles.map((article) => {
                                const isSelected = article.id === selectedArticleId;

                                return (
                                    <button
                                        key={article.id}
                                        type="button"
                                        disabled={isEditing}
                                        onClick={() => handleSelectArticle(article)}
                                        className={[
                                            "w-full rounded-xl border px-4 py-3 text-left transition",
                                            isSelected
                                                ? "border-neutral-500 bg-neutral-800 text-white"
                                                : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-600",
                                            isEditing ? "cursor-not-allowed opacity-60" : "",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <div className="text-sm font-semibold">
                                                    {article.articleNumber} {article.title}
                                                </div>
                                                <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500">
                                                    {article.content}
                                                </p>
                                            </div>

                                            {isSelected && (
                                                <Badge variant="secondary">選択中</Badge>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-800 bg-neutral-900/70 text-neutral-100">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-neutral-400" />
                                <CardTitle>選択中の条文</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {isEditing ? (
                                <div className="grid gap-5">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <label className="block">
                                            <span className="text-sm font-semibold text-neutral-300">
                                                条文番号
                                            </span>
                                            <Input
                                                value={draftArticle.articleNumber}
                                                onChange={(event) =>
                                                    handleChange(
                                                        "articleNumber",
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 border-neutral-700 bg-neutral-950 text-neutral-100"
                                            />
                                        </label>

                                        <label className="block">
                                            <span className="text-sm font-semibold text-neutral-300">
                                                条文名
                                            </span>
                                            <Input
                                                value={draftArticle.title}
                                                onChange={(event) =>
                                                    handleChange("title", event.target.value)
                                                }
                                                className="mt-2 border-neutral-700 bg-neutral-950 text-neutral-100"
                                            />
                                        </label>
                                    </div>

                                    <label className="block">
                                        <span className="text-sm font-semibold text-neutral-300">
                                            条文内容
                                        </span>
                                        <Textarea
                                            value={draftArticle.content}
                                            onChange={(event) =>
                                                handleChange("content", event.target.value)
                                            }
                                            className="mt-2 min-h-40 border-neutral-700 bg-neutral-950 text-neutral-100"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-semibold text-neutral-300">
                                            AI判定での利用目的
                                        </span>
                                        <Textarea
                                            value={draftArticle.aiUse}
                                            onChange={(event) =>
                                                handleChange("aiUse", event.target.value)
                                            }
                                            className="mt-2 min-h-24 border-neutral-700 bg-neutral-950 text-neutral-100"
                                        />
                                    </label>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-4">
                                        <div className="text-xs font-semibold text-neutral-500">
                                            条文
                                        </div>
                                        <div className="mt-2 text-lg font-bold">
                                            {selectedArticle.articleNumber} {selectedArticle.title}
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-4">
                                        <div className="text-xs font-semibold text-neutral-500">
                                            条文内容
                                        </div>
                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-neutral-100">
                                            {selectedArticle.content}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-4">
                                        <div className="text-xs font-semibold text-neutral-500">
                                            AI判定での利用目的
                                        </div>
                                        <p className="mt-2 text-sm leading-7 text-neutral-100">
                                            {selectedArticle.aiUse}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
}