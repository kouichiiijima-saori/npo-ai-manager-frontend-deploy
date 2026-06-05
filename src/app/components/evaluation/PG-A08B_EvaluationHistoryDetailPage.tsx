import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    BadgeCheck,
    CalendarClock,
    FileText,
    Lightbulb,
    SearchCheck,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

type AiEvaluationResult = "MATCH" | "CHECK_REQUIRED" | "NOT_MATCH";
type ReviewResult =
    | "APPLY_PREPARATION"
    | "PENDING"
    | "DECLINED"
    | "REJECTED";

type EvaluationHistoryDetail = {
    id: number;
    historyCode: string;
    grantName: string;
    provider: string;
    evaluatedAt: string;
    fiscalYear: string;
    evaluatorName: string;
    aiResult: AiEvaluationResult;
    reviewResult: ReviewResult;
    reason: string;
    evidence: string[];
    missingInfo: string[];
    additionalChecks: string[];
    reviewMemo: string;
};

const evaluationHistoryDetails: EvaluationHistoryDetail[] = [
    {
        id: 1,
        historyCode: "EH-2026-001",
        grantName: "地域子ども支援活動助成",
        provider: "公益財団法人 未来地域財団",
        evaluatedAt: "2026-06-04",
        fiscalYear: "2026年度",
        evaluatorName: "事務局担当者",
        aiResult: "MATCH",
        reviewResult: "APPLY_PREPARATION",
        reason:
            "団体の活動目的、子ども支援の実績、地域での居場所づくりの方向性が、公募の対象事業と高く一致しています。",
        evidence: [
            "活動実績に子ども食堂・学習支援が登録されている",
            "定款上の目的に地域福祉・子ども支援と整合する記載がある",
            "所在地が助成対象地域内である",
        ],
        missingInfo: [
            "前年度決算書の添付状況",
            "事業収支計画の具体性",
        ],
        additionalChecks: [
            "対象経費に食材費・人件費が含まれるか確認する",
            "申請時に必要な添付資料一覧を確認する",
        ],
        reviewMemo:
            "対象経費に食材費・人件費が含まれるか確認する。決算書の準備が必要。",
    },
    {
        id: 2,
        historyCode: "EH-2026-002",
        grantName: "文化芸術体験活動助成",
        provider: "文化活動支援センター",
        evaluatedAt: "2026-06-03",
        fiscalYear: "2026年度",
        evaluatorName: "事務局担当者",
        aiResult: "CHECK_REQUIRED",
        reviewResult: "PENDING",
        reason:
            "文化芸術活動との関連はあるものの、農業体験や居場所づくりが助成対象に含まれるか追加確認が必要です。",
        evidence: [
            "活動実績に体験活動が登録されている",
            "地域活動としての継続性が確認できる",
        ],
        missingInfo: [
            "農業体験が助成対象活動に含まれるか",
            "対象経費に会場費・材料費が含まれるか",
        ],
        additionalChecks: [
            "募集要項の対象活動欄を再確認する",
            "財団へ対象活動の範囲を問い合わせる",
        ],
        reviewMemo:
            "対象活動に農業体験が含まれるか確認してから再検討する。",
    },
    {
        id: 3,
        historyCode: "EH-2026-003",
        grantName: "地域コミュニティ再生助成",
        provider: "一般社団法人 まちづくり基金",
        evaluatedAt: "2026-06-02",
        fiscalYear: "2026年度",
        evaluatorName: "事務局担当者",
        aiResult: "MATCH",
        reviewResult: "DECLINED",
        reason:
            "事業内容との相性は高いものの、同時期に複数の申請準備が重なっており、実務体制に懸念があります。",
        evidence: [
            "地域拠点づくりの活動実績がある",
            "多世代交流に関する事業内容と整合する",
        ],
        missingInfo: [
            "申請書作成に必要な担当者の確保",
            "提出期限までの作業時間",
        ],
        additionalChecks: [
            "次年度以降の再挑戦候補として残す",
            "類似助成金との重複応募可否を確認する",
        ],
        reviewMemo:
            "今年度は人的リソースが不足しており、申請書作成まで対応できないため見送る。",
    },
    {
        id: 4,
        historyCode: "EH-2025-018",
        grantName: "子ども体験活動支援助成",
        provider: "こども未来支援財団",
        evaluatedAt: "2025-12-20",
        fiscalYear: "2025年度",
        evaluatorName: "事務局担当者",
        aiResult: "MATCH",
        reviewResult: "REJECTED",
        reason:
            "活動内容は助成趣旨に合致していましたが、審査結果として不採択となりました。",
        evidence: [
            "子ども向け体験活動の実績がある",
            "地域連携の活動記録が登録されている",
        ],
        missingInfo: [
            "成果指標の具体性",
            "収支計画の妥当性",
        ],
        additionalChecks: [
            "次年度は成果指標を数値で整理する",
            "収支計画と対象経費の説明を補強する",
        ],
        reviewMemo:
            "審査結果は不採択。次年度は事業成果指標と収支計画をより具体化する。",
    },
];

const aiResultLabel: Record<AiEvaluationResult, string> = {
    MATCH: "適合",
    CHECK_REQUIRED: "要確認",
    NOT_MATCH: "不適合",
};

const aiResultStyle: Record<AiEvaluationResult, string> = {
    MATCH: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    CHECK_REQUIRED: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    NOT_MATCH: "border-slate-500/40 bg-slate-500/20 text-slate-300",
};

const reviewResultLabel: Record<ReviewResult, string> = {
    APPLY_PREPARATION: "進める",
    PENDING: "保留する",
    DECLINED: "見送る",
    REJECTED: "不採択",
};

const reviewResultStyle: Record<ReviewResult, string> = {
    APPLY_PREPARATION: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
    PENDING: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    DECLINED: "border-slate-500/40 bg-slate-500/20 text-slate-300",
    REJECTED: "border-rose-400/40 bg-rose-400/10 text-rose-200",
};

const fallbackHistory = evaluationHistoryDetails[0];

export function PGA08BEvaluationHistoryDetailPage() {
    const navigate = useNavigate();
    const { historyId } = useParams();

    const history = useMemo(() => {
        return (
            evaluationHistoryDetails.find(
                (item) => item.id === Number(historyId)
            ) ?? fallbackHistory
        );
    }, [historyId]);

    const handleBackToList = () => {
        navigate("/admin/evaluations/histories");
    };

    const specialMemoLabel =
        history.reviewResult === "DECLINED"
            ? "辞退理由"
            : history.reviewResult === "REJECTED"
                ? "不採択理由"
                : "検討メモ";

    const specialMemoDescription =
        history.reviewResult === "DECLINED"
            ? "この公募を見送った理由です。"
            : history.reviewResult === "REJECTED"
                ? "案件終了時に記録された不採択理由です。"
                : "AI判定時に保存された検討メモです。";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-[-10%] top-[10%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="absolute bottom-[-15%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>

            <main className="relative mx-auto max-w-7xl px-6 py-8">
                <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-slate-950/60 backdrop-blur">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                                <Sparkles size={16} />
                                PG-A08B AI判定履歴詳細
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-white">
                                AI判定履歴詳細
                            </h1>

                            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
                                <span>履歴番号：{history.historyCode}</span>
                                <span>判定日：{history.evaluatedAt}</span>
                                <span>年度：{history.fiscalYear}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleBackToList}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <ArrowLeft size={18} />
                            一覧へ戻る
                        </button>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <DetailCard
                            icon={<FileText size={20} />}
                            title="基本情報"
                        >
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                                <h2 className="text-2xl font-bold text-white">
                                    {history.grantName}
                                </h2>

                                <div className="mt-3 space-y-1 text-sm text-slate-400">
                                    <p>提供元：{history.provider}</p>
                                    <p>判定者：{history.evaluatorName}</p>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <Badge className={aiResultStyle[history.aiResult]}>
                                        AI判定：{aiResultLabel[history.aiResult]}
                                    </Badge>

                                    <Badge className={reviewResultStyle[history.reviewResult]}>
                                        検討結果：{reviewResultLabel[history.reviewResult]}
                                    </Badge>
                                </div>
                            </div>
                        </DetailCard>

                        <DetailCard
                            icon={<BadgeCheck size={20} />}
                            title="AI判定結果"
                        >
                            <InfoBlock title="結果">
                                <Badge className={aiResultStyle[history.aiResult]}>
                                    {aiResultLabel[history.aiResult]}
                                </Badge>
                            </InfoBlock>

                            <div className="mt-4">
                                <InfoBlock title="判定理由">
                                    <p className="text-sm leading-7 text-slate-300">
                                        {history.reason}
                                    </p>
                                </InfoBlock>
                            </div>
                        </DetailCard>

                        <DetailCard
                            icon={<SearchCheck size={20} />}
                            title="根拠"
                        >
                            <ResultList
                                items={history.evidence}
                                markerClassName="bg-emerald-300"
                            />
                        </DetailCard>

                        <DetailCard
                            icon={<Lightbulb size={20} />}
                            title="不足情報・追加確認事項"
                        >
                            <InfoBlock title="不足情報">
                                <ResultList
                                    items={history.missingInfo}
                                    markerClassName="bg-amber-300"
                                />
                            </InfoBlock>

                            <div className="mt-4">
                                <InfoBlock title="追加確認事項">
                                    <ResultList
                                        items={history.additionalChecks}
                                        markerClassName="bg-cyan-300"
                                    />
                                </InfoBlock>
                            </div>
                        </DetailCard>

                        <DetailCard
                            icon={<FileText size={20} />}
                            title={specialMemoLabel}
                        >
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                                <p className="text-sm leading-7 text-slate-300">
                                    {history.reviewMemo}
                                </p>

                                <p className="mt-4 text-xs text-slate-500">
                                    {specialMemoDescription}
                                </p>
                            </div>
                        </DetailCard>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                画面ガイド
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="1件のAI判定履歴を詳細確認します。" />
                                <GuideLine text="判定理由、根拠、不足情報、追加確認事項を確認できます。" />
                                <GuideLine text="この画面から編集や再判定はできません。" />
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
                            <h2 className="text-lg font-semibold text-white">
                                履歴の扱い
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="履歴は作成後に変更しません。" />
                                <GuideLine text="見送る・不採択は履歴として保存されます。" />
                                <GuideLine text="進めるを選択した履歴は案件管理へ接続されます。" />
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                禁止操作
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="編集不可" />
                                <GuideLine text="削除不可" />
                                <GuideLine text="再判定不可" />
                                <GuideLine text="履歴からの案件化不可" />
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6">
                            <h2 className="text-lg font-semibold text-white">
                                データ流転
                            </h2>

                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                <GuideLine text="PG-A07で作成された判定履歴を参照します。" />
                                <GuideLine text="見送り・不採択となった案件も履歴として保存されます。" />
                                <GuideLine text="PG-A08は監査証跡として固定します。" />
                            </div>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    );
}

type DetailCardProps = {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
};

const DetailCard = ({ icon, title, children }: DetailCardProps) => {
    return (
        <section className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
            <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-2 text-cyan-200">
                    {icon}
                </div>

                <h2 className="text-lg font-semibold text-white">
                    {title}
                </h2>
            </div>

            {children}
        </section>
    );
};

type BadgeProps = {
    children: React.ReactNode;
    className: string;
};

const Badge = ({ children, className }: BadgeProps) => {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${className}`}
        >
            {children}
        </span>
    );
};

type InfoBlockProps = {
    title: string;
    children: React.ReactNode;
};

const InfoBlock = ({ title, children }: InfoBlockProps) => {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="mb-3 text-sm font-semibold text-white">
                {title}
            </p>

            {children}
        </div>
    );
};

type ResultListProps = {
    items: string[];
    markerClassName: string;
};

const ResultList = ({ items, markerClassName }: ResultListProps) => {
    return (
        <ul className="space-y-2">
            {items.map((item) => (
                <li
                    key={item}
                    className="flex gap-2 text-sm leading-6 text-slate-300"
                >
                    <span
                        className={`mt-2 h-2 w-2 shrink-0 rounded-full ${markerClassName}`}
                    />
                    {item}
                </li>
            ))}
        </ul>
    );
};

type GuideLineProps = {
    text: string;
};

const GuideLine = ({ text }: GuideLineProps) => {
    return (
        <div className="flex gap-2">
            <ShieldCheck size={16} className="mt-1 shrink-0 text-cyan-200" />
            <p>{text}</p>
        </div>
    );
};