import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";

export function ApplicationResultWorkspace() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "結果待ち":
        return <Badge variant="warning">{status}</Badge>;

      case "採択済み":
        return <Badge variant="success">{status}</Badge>;

      case "不採択":
        return <Badge variant="danger">{status}</Badge>;

      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
    <div className="flex-1 overflow-y-auto bg-neutral-900 p-8 text-neutral-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            Application Results
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-neutral-100">
            応募結果管理
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            応募した助成金の採択・不採択・結果待ちを管理します。
          </p>
        </header>

        <div className="space-y-4">
          {applicationResults.map((result, index) => (
            <div
              key={index}
              className="
                rounded-xl
                border
                border-neutral-800
                bg-neutral-900/40
                p-5
                transition-colors
                hover:bg-neutral-800/30
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-medium text-neutral-200">
                    {result.grantName}
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    {result.organization}
                  </p>
                </div>

                <div className="whitespace-nowrap">
                  {getStatusBadge(result.status)}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-neutral-500">応募日</p>
                  <p className="mt-1 text-neutral-300">{result.appliedAt}</p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">助成金額</p>
                  <p className="mt-1 text-neutral-300">{result.amount}</p>
                </div>

                <div>
                  <p className="text-xs text-neutral-500">次の対応</p>
                  <p className="mt-1 text-neutral-300">{result.nextAction}</p>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <Link
                  to={`/admin/evaluations/results/${index + 1}`}
                  className="
                    rounded-md
                    border
                    border-neutral-700
                    px-3
                    py-2
                    text-sm
                    text-neutral-300
                    transition-colors
                    hover:bg-neutral-800
                    hover:text-neutral-100
                  "
                >
                  詳細
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}