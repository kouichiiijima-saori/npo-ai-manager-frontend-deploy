import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileText,
  Clock,
  User,
  Building,
  Save,
} from "lucide-react";

const getResultStatusBadge = (status: string) => {
  switch (status) {
    case "検討中":
      return <Badge variant="secondary">{status}</Badge>;
    case "応募済":
      return <Badge variant="outline">{status}</Badge>;
    case "結果待ち":
      return <Badge variant="warning">{status}</Badge>;
    case "採択":
      return <Badge variant="success">{status}</Badge>;
    case "不採択":
      return <Badge variant="danger">{status}</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

const grantDetail = {
  id: "GR-2026-001",
  name: "令和8年度 環境保全活動支援助成金",
  status: "結果待ち",
  applicationDate: "2026-05-15",
  resultDate: "2026-07-20 (予定)",
  aiResult: {
    matchRate: 85,
    missingConditions: [
      "最新の財務諸表（要押印）",
      "環境活動の第三者評価レポート",
    ],
    comment:
      "本助成金の趣旨「地域密着型の環境保全」に対し、当法人の過去3年間の河川清掃活動実績が強く適合しています。一方で、財務要件に関する一部書類が不足状態と判定されました。",
    risks: [
      "事業完了報告書の提出期限が短く、体制構築が必要です。",
    ],
    recommendedAction:
      "不足書類を準備の上、申請手続きを進めることを推奨します。",
  },
  evidence: [
    {
      type: "適合条文",
      title: "募集要項 第3条 (対象事業)",
      content: "地域住民と協働で行う継続的な自然環境保全活動",
      reason:
        "定款第4条および過去実績レポートとの関連性が極めて高いと判定。",
    },
    {
      type: "活動実績",
      title: "2024-2025年度 A川水質改善プロジェクト",
      content:
        "地域ボランティア50名を動員した月例の清掃および水質調査。",
      reason:
        "参加人数および活動頻度が要件（月1回以上、延べ100名/年）を充足。",
    },
  ],
  decision: {
    status: "応募する",
    reason:
      "AIの判定通り、当法人のコア事業と親和性が高いため応募を決定。不足書類については経理担当と調整済み。",
    recordedBy: "山田 太郎（代表理事）",
    recordedAt: "2026-05-10 14:30",
  },
  timeline: [
    {
      date: "2026-05-01 10:00",
      event: "AI適合性判定を実行 (スコア: 85%)",
      actor: "SYSTEM",
    },
    {
      date: "2026-05-05 11:30",
      event: "詳細条件の確認を完了",
      actor: "佐藤 花子",
    },
    {
      date: "2026-05-10 14:30",
      event: "応募意思決定: 応募する",
      actor: "山田 太郎",
    },
    {
      date: "2026-05-15 09:00",
      event: "申請書類提出完了",
      actor: "佐藤 花子",
    },
  ],
};

export function DecisionDetailWorkspace() {
  return (
    <div className="flex-1 overflow-y-auto bg-neutral-900 p-8">
      <div className="mx-auto max-w-5xl space-y-10 pb-12">
        {/* Header */}
        <header className="space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 text-neutral-400 hover:text-neutral-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧へ戻る
          </Button>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono text-sm font-medium text-neutral-500">
                  {grantDetail.id}
                </span>
                {getResultStatusBadge(grantDetail.status)}
              </div>
              <h1 className="text-2xl font-semibold leading-tight text-neutral-100 md:text-3xl">
                {grantDetail.name}
              </h1>
            </div>
            <div className="flex flex-col gap-2 text-sm text-neutral-400 md:items-end">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  応募日: {grantDetail.applicationDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  結果通知日: {grantDetail.resultDate}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Section 1: AI判定結果 */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <Scale className="h-4 w-4" /> AI Analysis Result
          </h2>
          <Card className="border-neutral-800 bg-neutral-900/60 shadow-none">
            <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-3 md:gap-12">
              <div className="space-y-6 md:col-span-1">
                <div>
                  <div className="mb-2 text-sm text-neutral-400">
                    要件適合率
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-light tracking-tight text-emerald-400">
                      {grantDetail.aiResult.matchRate}
                    </span>
                    <span className="text-lg text-emerald-500/50">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm text-neutral-400">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>不足条件</span>
                  </div>
                  <ul className="space-y-2 text-sm text-neutral-300">
                    {grantDetail.aiResult.missingConditions.map(
                      (c, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2"
                        >
                          <span className="mt-1 text-neutral-600">
                            -
                          </span>
                          <span className="leading-snug">
                            {c}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              <div className="space-y-6 md:col-span-2">
                <div className="rounded-xl border border-neutral-800/60 bg-neutral-950/40 p-5">
                  <h4 className="mb-3 text-xs font-medium text-neutral-500">
                    AIコメント
                  </h4>
                  <p className="text-sm leading-relaxed text-neutral-200">
                    {grantDetail.aiResult.comment}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-red-500/10 bg-red-950/10 p-5">
                    <h4 className="mb-3 text-xs font-medium text-red-400/80">
                      重要リスク
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {grantDetail.aiResult.risks.map(
                        (r, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-red-200/80"
                          >
                            <span className="mt-1 text-red-500/50">
                              -
                            </span>
                            <span className="leading-snug">
                              {r}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-emerald-500/10 bg-emerald-950/10 p-5">
                    <h4 className="mb-3 text-xs font-medium text-emerald-400/80">
                      推奨アクション
                    </h4>
                    <p className="text-sm leading-relaxed text-emerald-200/80">
                      {grantDetail.aiResult.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 2: 根拠表示 */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <FileText className="h-4 w-4" /> Evidence & Grounds
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {grantDetail.evidence.map((item, idx) => (
              <Card
                key={idx}
                className="border-neutral-800 bg-neutral-900/40 shadow-none"
              >
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-neutral-800/80"
                    >
                      {item.type}
                    </Badge>
                    <span className="text-sm font-medium text-neutral-200">
                      {item.title}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-neutral-800/60 bg-neutral-950/50 p-4">
                      <div className="mb-2 text-xs text-neutral-500">
                        参照テキスト
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-300">
                        "{item.content}"
                      </p>
                    </div>
                    <div className="px-1">
                      <div className="mb-1 text-xs text-neutral-500">
                        AIの参照理由
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-400">
                        {item.reason}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 3: 応募意思決定 */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <User className="h-4 w-4" /> Human Decision
          </h2>
          <Card className="border-emerald-500/20 bg-emerald-950/5 shadow-none">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-8 md:flex-row">
                <div className="md:w-1/4">
                  <div className="mb-3 text-sm text-neutral-500">
                    最終判断
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium tracking-wide">
                      {grantDetail.decision.status}
                    </span>
                  </div>
                </div>
                <div className="md:w-2/4">
                  <div className="mb-3 text-sm text-neutral-500">
                    意思決定理由
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-200">
                    {grantDetail.decision.reason}
                  </p>
                </div>
                <div className="space-y-4 border-t border-neutral-800 pt-6 md:w-1/4 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                  <div>
                    <div className="mb-1 text-xs text-neutral-500">
                      記録者
                    </div>
                    <div className="text-sm text-neutral-300">
                      {grantDetail.decision.recordedBy}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-neutral-500">
                      記録日時
                    </div>
                    <div className="text-sm font-mono text-neutral-400">
                      {grantDetail.decision.recordedAt}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: 外部審査結果 */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <Building className="h-4 w-4" /> External Result
          </h2>
          <Card className="border-neutral-800 bg-neutral-900/40 shadow-none">
            <CardContent className="p-6 md:p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-2.5">
                    <label className="text-sm font-medium text-neutral-300">
                      ステータス更新
                    </label>
                    <select className="w-full appearance-none rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 transition-colors focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500">
                      <option value="PENDING_RESULT">
                        結果待ち
                      </option>
                      <option value="ADOPTED">採択</option>
                      <option value="REJECTED">不採択</option>
                    </select>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-sm font-medium text-neutral-300">
                      結果通知日
                    </label>
                    <input
                      type="date"
                      defaultValue="2026-07-20"
                      className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 transition-colors focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-neutral-300">
                    結果メモ・財団からのフィードバック
                  </label>
                  <textarea
                    rows={4}
                    placeholder="審査員からのコメントや次回への改善点などを記録します..."
                    className="w-full resize-none rounded-md border border-neutral-800 bg-neutral-950 px-3 py-3 text-sm text-neutral-100 transition-colors placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    結果を保存する
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Section 5: 履歴タイムライン */}
        <section className="space-y-6 pt-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
            <Clock className="h-4 w-4" /> Timeline
          </h2>
          <div className="ml-3 space-y-8 border-l border-neutral-800 pl-8 pb-4">
            {grantDetail.timeline.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[37px] mt-1.5 h-2.5 w-2.5 rounded-full border border-neutral-900 bg-neutral-600 ring-4 ring-neutral-900" />
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-xs text-neutral-500">
                    {item.date}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-neutral-200">
                      {item.event}
                    </span>
                    <Badge
                      variant="outline"
                      className="h-5 px-1.5 text-[10px] text-neutral-400"
                    >
                      {item.actor}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}