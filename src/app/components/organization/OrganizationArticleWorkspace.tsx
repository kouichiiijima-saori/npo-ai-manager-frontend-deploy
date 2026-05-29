import { useState } from "react";

type Article = {
    id: number;
    articleNo: string;
    title: string;
    content: string;
};

export function OrganizationArticleWorkspace() {
    const [articles, setArticles] = useState<Article[]>([
        {
            id: 1,
            articleNo: "第3条",
            title: "目的",
            content:
                "この法人は、地域社会における福祉、教育、まちづくりに関する活動を行い、公益の増進に寄与することを目的とする。",
        },
        {
            id: 2,
            articleNo: "第4条",
            title: "事業",
            content:
                "この法人は、前条の目的を達成するため、子ども支援、地域交流、福祉活動に関する事業を行う。",
        },
    ]);

    const [articleNo, setArticleNo] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    function handleAddArticle() {
        if (!articleNo || !title || !content) {
            alert("条文番号、条文名、条文内容を入力してください。");
            return;
        }

        const newArticle: Article = {
            id: articles.length + 1,
            articleNo,
            title,
            content,
        };

        setArticles([...articles, newArticle]);
        setArticleNo("");
        setTitle("");
        setContent("");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-100">
                    定款条文管理
                </h1>
                <p className="mt-1 text-sm text-neutral-400">
                    AI判定で根拠として参照する定款条文を登録・管理します。
                </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                <h2 className="mb-4 text-lg font-semibold text-neutral-100">
                    条文登録
                </h2>

                <div className="grid gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-300">
                            条文番号
                        </label>
                        <input
                            value={articleNo}
                            onChange={(e) => setArticleNo(e.target.value)}
                            placeholder="例：第3条"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-300">
                            条文名
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="例：目的、事業、会員"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-300">
                            条文内容
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            placeholder="定款の条文内容を入力してください。"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
                        />
                    </div>

                    <button
                        onClick={handleAddArticle}
                        className="w-fit rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        条文を追加
                    </button>
                </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                <h2 className="mb-4 text-lg font-semibold text-neutral-100">
                    登録済み条文
                </h2>

                <div className="space-y-3">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <span className="rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                                    {article.articleNo}
                                </span>
                                <h3 className="font-semibold text-neutral-100">
                                    {article.title}
                                </h3>
                            </div>

                            <p className="text-sm leading-6 text-neutral-300">
                                {article.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}