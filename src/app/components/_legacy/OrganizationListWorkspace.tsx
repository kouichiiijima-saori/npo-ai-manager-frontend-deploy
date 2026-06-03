import { Link } from "react-router-dom";

export function OrganizationListWorkspace() {
    const organizations = [
        {
            id: 1,
            name: "NPO法人サンプル",
            type: "NPO法人",
            city: "埼玉県鳩山町",
            status: "活動中",
        },
        {
            id: 2,
            name: "地域福祉協議会",
            type: "任意団体",
            city: "埼玉県東松山市",
            status: "活動中",
        },
        {
            id: 3,
            name: "こども未来ネット",
            type: "一般社団法人",
            city: "埼玉県坂戸市",
            status: "準備中",
        },
    ];

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">NPO法人一覧</h1>

            {organizations.map((organization) => (
                <div
                    key={organization.id}
                    className="rounded-lg border p-4 shadow-sm"
                >
                    <h2 className="text-lg font-semibold">
                        {organization.name}
                    </h2>

                    <p>法人種別: {organization.type}</p>
                    <p>所在地: {organization.city}</p>
                    <p>ステータス: {organization.status}</p>

                    <Link
                        to={`/admin/organizations/${organization.id}`}
                        className="mt-2 inline-block text-blue-600"
                    >
                        詳細を見る
                    </Link>
                </div>
            ))}
        </div>
    );
}