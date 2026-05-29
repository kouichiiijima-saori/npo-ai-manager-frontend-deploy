import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    ArrowLeft,
    Calendar,
    ClipboardCheck,
    FileText,
    CheckCircle2,
    Clock,
    Save,
} from "lucide-react";

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
        <div className="flex-1 overflow-y-auto bg-neutral-900 p-8">
            <div className="mx-auto max-w-5xl space-y-10 pb-12">
                <header className="space-y-6">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="-ml-3 text-neutral-400 hover:text-neutral-100"
                    >
                        <Link to="/admin/evaluations/results">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            応募結果管理へ戻る
                        </Link>
                    </Button>

                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-3">
                                <span className="font-mono text-sm font-medium text-neutral-500">
                                    RESULT-{id}
                                </span>
                                {getStatusBadge(result.status)}
                            </div>

                            <h1 className="text-2xl font-semibold leading-tight text-neutral-100 md:text-3xl">
                                {result.grantName}
                            </h1>

                            <p className="mt-2 text-sm text-neutral-400">
                                {result.organization}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 text-sm text-neutral-400 md:items-end">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>応募日: {result.appliedAt}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>提出期限: {result.deadline}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="space-y-4">
                    <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                        <ClipboardCheck className="h-4 w-4" />
                        Application Summary
                    </h2>

                    <Card className="border-neutral-800 bg-neutral-900/60 shadow-none">
                        <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
                            <SummaryItem label="採択金額" value={result.amount} />
                            <SummaryItem label="次の対応" value={result.nextAction} />
                            <SummaryItem label="応募日" value={result.appliedAt} />
                            <SummaryItem label="提出期限" value={result.deadline} />
                        </CardContent>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                        <FileText className="h-4 w-4" />
                        Result Notes
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <NoteCard title="採択後メモ" text={result.memo} />
                        <NoteCard title="評価された可能性" text={result.reason} />
                        <NoteCard title="次回改善点" text={result.improvement} />
                        <NoteCard
                            title="管理メモ"
                            text="今後、提出書類・報告書・入金確認などをこの画面で管理できるようにする。"
                        />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                        <CheckCircle2 className="h-4 w-4" />
                        Next Action
                    </h2>

                    <Card className="border-emerald-500/20 bg-emerald-950/5 shadow-none">
                        <CardContent className="p-6 md:p-8">
                            <div className="flex flex-col gap-8 md:flex-row">
                                <div className="md:w-1/4">
                                    <div className="mb-3 text-sm text-neutral-500">
                                        現在の対応
                                    </div>

                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-emerald-400">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span className="font-medium tracking-wide">
                                            {result.nextAction}
                                        </span>
                                    </div>
                                </div>

                                <div className="md:w-2/4">
                                    <div className="mb-3 text-sm text-neutral-500">
                                        対応内容
                                    </div>

                                    <p className="text-sm leading-relaxed text-neutral-200">
                                        {result.memo}
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-neutral-800 pt-6 md:w-1/4 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                                    <div>
                                        <div className="mb-1 text-xs text-neutral-500">
                                            期限
                                        </div>
                                        <div className="text-sm font-mono text-neutral-400">
                                            {result.deadline}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-1 text-xs text-neutral-500">
                                            ステータス
                                        </div>
                                        {getStatusBadge(result.status)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                        <Clock className="h-4 w-4" />
                        Result Update
                    </h2>

                    <Card className="border-neutral-800 bg-neutral-900/40 shadow-none">
                        <CardContent className="p-6 md:p-8">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2.5">
                                        <label htmlFor="status-update" className="text-sm font-medium text-neutral-300">
                                            ステータス更新
                                        </label>

                                        <select
                                            id="status-update"
                                            title="ステータスを更新"
                                            className="w-full appearance-none rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100"
                                        >
                                            <option>結果待ち</option>
                                            <option>採択済み</option>
                                            <option>不採択</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label htmlFor="deadline-date" className="text-sm font-medium text-neutral-300">
                                            提出期限
                                        </label>

                                        <input
                                            id="deadline-date"
                                            type="date"
                                            defaultValue="2026-06-15"
                                            title="提出期限を選択"
                                            placeholder="2026-06-15"
                                            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-sm font-medium text-neutral-300">
                                        結果メモ・次回への改善点
                                    </label>

                                    <textarea
                                        rows={4}
                                        placeholder="採択後の対応、不採択理由、次回改善点などを記録します..."
                                        className="w-full resize-none rounded-md border border-neutral-800 bg-neutral-950 px-3 py-3 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                                    />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="button" variant="secondary" className="gap-2">
                                        <Save className="h-4 w-4" />
                                        結果を保存する
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-xs text-neutral-500">{label}</div>
            <div className="mt-2 text-sm font-medium text-neutral-200">{value}</div>
        </div>
    );
}

function NoteCard({ title, text }: { title: string; text: string }) {
    return (
        <Card className="border-neutral-800 bg-neutral-900/40 shadow-none">
            <CardContent className="p-5">
                <h3 className="text-sm font-medium text-neutral-200">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                    {text}
                </p>
            </CardContent>
        </Card>
    );
}