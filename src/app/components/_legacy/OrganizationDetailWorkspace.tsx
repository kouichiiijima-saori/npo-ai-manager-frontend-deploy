import { Link, useParams } from "react-router-dom";

export function OrganizationDetailWorkspace() {
    const { id } = useParams();

    return (
        <div className="space-y-4">
            <Link
                to="/admin/organizations"
                className="text-blue-600"
            >
                ← 一覧へ戻る
            </Link>

            <h1 className="text-2xl font-bold">
                NPO法人詳細
            </h1>

            <div className="rounded-lg border p-4">
                <p>ID: {id}</p>

                <p>法人名: NPO法人サンプル</p>

                <p>法人種別: NPO法人</p>

                <p>所在地: 埼玉県鳩山町</p>

                <p>ステータス: 活動中</p>
            </div>

            <Link
                to={`/admin/organizations/${id}/edit`}
                className="inline-block rounded bg-blue-600 px-4 py-2 text-white"
            >
                編集
            </Link>
        </div>
    );
}