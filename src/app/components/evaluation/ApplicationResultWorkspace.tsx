import { Link } from "react-router-dom";

export function ApplicationResultWorkspace() {
  const applicationResults = [
    {
      grantName: "環境保全プロジェクト 2026",
      organization: "NPO法人サンプル",
      appliedAt: "2026/05/10",
      status: "結果待ち",
      amount: "500,000円",
      nextAction: "追加資料の提出確認",
    },
    {
      grantName: "地域コミュニティ活性化基金 2026",
      organization: "NPO法人サンプル",
      appliedAt: "2026/04/22",
      status: "採択済み",
      amount: "300,000円",
      nextAction: "交付申請書の作成",
    },
    {
      grantName: "NPOデジタル化推進助成プログラム",
      organization: "NPO法人サンプル",
      appliedAt: "2026/03/18",
      status: "不採択",
      amount: "0円",
      nextAction: "不採択理由の記録",
    },
  ];

  return (
    <div className="p-8 text-white">
      <p className="text-sm text-zinc-500 tracking-[0.2em] uppercase">
        Application Results
      </p>

      <h1 className="mt-3 text-3xl font-bold">
        応募結果管理
      </h1>

      <p className="mt-3 text-zinc-400">
        応募した助成金の採択・不採択・結果待ちを管理します。
      </p>

      {/* 一覧 */}
      <div className="mt-8 space-y-4">
        {applicationResults.map((result, index) => (
          <div
            key={index}
            className="
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-900/50
              p-6
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {result.grantName}
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  {result.organization}
                </p>
              </div>

              <div className="text-sm text-zinc-400">
                {result.status}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-zinc-500">応募日</p>
                <p>{result.appliedAt}</p>
              </div>

              <div>
                <p className="text-zinc-500">助成金額</p>
                <p>{result.amount}</p>
              </div>

              <div>
                <p className="text-zinc-500">次の対応</p>
                <p>{result.nextAction}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Link
                to={`/admin/evaluations/results/${index + 1}`}
                className="
      rounded-lg
      border
      border-zinc-700
      px-3
      py-2
      text-sm
      hover:bg-zinc-800
    "
              >
                詳細
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}