import { Link, useParams } from "react-router-dom";

type Grant = {
    id: number;
    name: string;
    provider: string;
    category: string;
    deadline: string;
    amount: string;
    target: string;
    requirements: string;
    summary: string;
};

export function GrantDetailWorkspace() {
    const { grantId } = useParams();

    const grants: Grant[] = [
        {
            id: 1,
            name: "地域コミュニティ活性化基金 2026",
            provider: "サンプル財団",
            category: "地域づくり",
            deadline: "2026/06/15",
            amount: "上限300,000円",
            target: "地域住民と協働して実施する継続的な地域活動",
            requirements:
                "非営利法人または地域団体であること。地域住民との協働性、継続性、公益性があること。",
            summary:
                "地域コミュニティの活性化を目的とした活動に対して助成を行う制度。",
        },
        {
            id: 2,
            name: "子どもの居場所づくり助成",
            provider: "こども支援財団",
            category: "子ども・教育",
            deadline: "2026/07/31",
            amount: "上限500,000円",
            target: "子どもや若者の居場所づくり、学習支援、食支援に関する活動",
            requirements:
                "子ども支援に関する活動実績があること。地域内で継続的に実施されていること。",
            summary:
                "子どもの孤立防止や学習機会の確保を目的とした民間団体向け助成制度。",
        },
        {
            id: 3,
            name: "地域福祉活動支援助成",
            provider: "福祉まちづくり基金",
            category: "福祉",
            deadline: "2026/08/20",
            amount: "上限1,000,000円",
            target: "高齢者、障害者、生活困窮者などを対象とした地域福祉活動",
            requirements:
                "福祉分野での活動実績があること。地域課題の解決に資する事業であること。",
            summary:
                "地域福祉の向上を目的とするNPO・地域団体向け助成制度。",
        },
    ];

    const grant = grants.find((item) => item.id === Number(grantId));

    if (!grant) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-neutral-100">
                    助成金詳細
                </h1>
                <p className="text-neutral-400">
                    指定された助成金が見つかりません。
                </p>
                <Link
                    to="/admin/grants"
                    className="inline-block text-blue-500 hover:text-blue-400"
                >
                    助成金一覧へ戻る
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <Link
                    to="/admin/grants"
                    className="text-sm text-blue-500 hover:text-blue-400"
                >
                    ← 助成金一覧へ戻る
                </Link>

                <h1 className="mt-3 text-2xl font-bold text-neutral-100">
                    {grant.name}
                </h1>

                <p className="mt-1 text-sm text-neutral-400">
                    {grant.provider}
                </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                <h2 className="mb-4 text-lg font-semibold text-neutral-100">
                    基本情報
                </h2>

                <div className="grid gap-3 text-sm text-neutral-300 md:grid-cols-2">
                    <p>分野：{grant.category}</p>
                    <p>締切：{grant.deadline}</p>
                    <p>助成額：{grant.amount}</p>
                    <p>対象：{grant.target}</p>
                </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                <h2 className="mb-4 text-lg font-semibold text-neutral-100">
                    募集概要
                </h2>
                <p className="text-sm leading-6 text-neutral-300">
                    {grant.summary}
                </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                <h2 className="mb-4 text-lg font-semibold text-neutral-100">
                    主な応募要件
                </h2>
                <p className="text-sm leading-6 text-neutral-300">
                    {grant.requirements}
                </p>
            </div>

            <div className="flex gap-3">
                <Link
                    to="/admin/evaluations/workspace"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    AI判定へ進む
                </Link>

                <Link
                    to="/admin/grants"
                    className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
                >
                    一覧へ戻る
                </Link>
            </div>
        </div>
    );
}