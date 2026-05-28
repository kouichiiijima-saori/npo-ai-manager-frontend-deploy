import { Link, useParams } from "react-router-dom";

export function ApplicationResultDetailWorkspace() {
    const { id } = useParams();

    const result = {
        id,
        grantName: "地域コミュニティ活性化基金 2026",
        organization: "NPO法人サンプル",
        appliedAt: "2026/04/22",
        status: "採択済み",
        amount: "300,000円",
        nextAction: "交付申請書の作成",
        deadline: "2026/06/15",
        memo: "採択後、交付申請書と事業計画の詳細提出が必要。",
        reason: "地域住民との協働性が高く評価された可能性がある。",
        improvement: "次回は実施体制と成果指標をより具体化する。",
    };

    return (
        <div className="p-8 text-white">
            <Link
                to="/admin/evaluations/results"
                className="text-sm text-zinc-400 hover:text-white"
            >
                ← 応募結果管理へ戻る
            </Link>

            <p className="mt-8 text-sm text-zinc-500 tracking-[0.2em] uppercase">
                Application Result Detail
            </p>

            <div className="mt-3 flex items-start justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold">{result.grantName}</h1>
                    <p className="mt-2 text-zinc-400">{result.organization}</p>
                </div>

                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300 whitespace-nowrap">
                    {result.status}
                </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                <InfoCard label="応募日" value={result.appliedAt} />
                <InfoCard label="採択金額" value={result.amount} />
                <InfoCard label="提出期限" value={result.deadline} />
                <InfoCard label="次の対応" value={result.nextAction} />
            </div>


            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Section title="採択後メモ" text={result.memo} />
                <Section title="評価された可能性" text={result.reason} />
                <Section title="次回改善点" text={result.improvement} />
                <Section
                    title="管理メモ"
                    text="今後、提出書類・報告書・入金確認などをこの画面で管理できるようにする。"
                />
            </div>
        </div>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-sm text-zinc-500">{label}</p>
            <p className="mt-2 font-semibold">{value}</p>
        </div>
    );
}

function Section({ title, text }: { title: string; text: string }) {
    return (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-3 leading-7 text-zinc-400">{text}</p>
        </section>
    );
}