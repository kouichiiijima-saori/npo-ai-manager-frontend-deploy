import { Link } from "react-router-dom";

type Grant = {
    id: number;
    name: string;
    provider: string;
    category: string;
    deadline: string;
    amount: string;
    status: string;
};

export function GrantListWorkspace() {
    const grants: Grant[] = [
        {
            id: 1,
            name: "地域コミュニティ活性化基金 2026",
            provider: "サンプル財団",
            category: "地域づくり",
            deadline: "2026/06/15",
            amount: "上限300,000円",
            status: "募集中",
        },
        {
            id: 2,
            name: "子どもの居場所づくり助成",
            provider: "こども支援財団",
            category: "子ども・教育",
            deadline: "2026/07/31",
            amount: "上限500,000円",
            status: "募集中",
        },
        {
            id: 3,
            name: "地域福祉活動支援助成",
            provider: "福祉まちづくり基金",
            category: "福祉",
            deadline: "2026/08/20",
            amount: "上限1,000,000円",
            status: "確認中",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-100">
                    助成金一覧
                </h1>
                <p className="mt-1 text-sm text-neutral-400">
                    登録済みの助成金情報を確認し、詳細画面またはAI判定へ進みます。
                </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                <h2 className="mb-4 text-lg font-semibold text-neutral-100">
                    登録済み助成金
                </h2>

                <div className="space-y-3">
                    {grants.map((grant) => (
                        <div
                            key={grant.id}
                            className="rounded-md border border-neutral-800 bg-neutral-950 p-4"
                        >
                            <div className="mb-2 flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-neutral-100">
                                        {grant.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-neutral-400">
                                        実施団体：{grant.provider}
                                    </p>
                                </div>

                                <span className="rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                                    {grant.status}
                                </span>
                            </div>

                            <div className="mt-3 grid gap-2 text-sm text-neutral-300 md:grid-cols-3">
                                <p>分野：{grant.category}</p>
                                <p>締切：{grant.deadline}</p>
                                <p>助成額：{grant.amount}</p>
                            </div>

                            <div className="mt-4">
                                <Link
                                    to={`/admin/grants/${grant.id}`}
                                    className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    詳細を見る
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}