import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    BadgeCheck,
    FileText,
    Lightbulb,
    SearchCheck,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

type AiEvaluationResult = "MATCH" | "CHECK_REQUIRED" | "NOT_MATCH";

type EvaluationHistoryApiResponse = {
    id: number;
    grantCaseId: number;
    aiSuitability: string;
    aiRecommendationLevel: string;
    aiReason: string;
    aiEvidence: string;
    organizationSnapshot: string | null;
    charterSnapshot: string | null;
    activitySnapshot: string | null;
    grantSnapshot: string | null;
    aiRawResponse: string | null;
    evaluatedAt: string | null;
    reviewMemo?: string | null;
};

type EvaluationHistoryDetailView = {
    id: number;
    historyCode: string;
    grantCaseId: number;
    grantName: string;
    provider: string;
    evaluatedAt: string;
    fiscalYear: string;
    evaluatorName: string;
    aiResult: AiEvaluationResult;
    recommendationLevel: string;
    reason: string;
    evidence: string[];
    organizationSnapshot: string;
    charterSnapshot: string;
    activitySnapshot: string;
    grantSnapshot: string;
    aiRawResponse: string;
    reviewMemo: string;
};

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

const API_BASE_URL = "http://localhost:8080";

const normalizeAiResult = (value: string): AiEvaluationResult => {
    if (value === "MATCH") {
        return "MATCH";
    }

    if (value === "NOT_MATCH") {
        return "NOT_MATCH";
    }

    return "CHECK_REQUIRED";
};

const splitTextToList = (value: string | null | undefined): string[] => {
    if (!value || value.trim() === "") {
        return ["記録なし"];
    }

    return value
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter((item) => item !== "");
};

const formatDate = (value: string | null): string => {
    if (!value) {
        return "未設定";
    }

    return value.slice(0, 10);
};

const getFiscalYearLabel = (value: string | null): string => {
    if (!value) {
        return "年度不明";
    }

    return `${value.slice(0, 4)}年度`;
};

const normalizeSnapshot = (value: string | null): string => {
    if (!value || value.trim() === "") {
        return "記録なし";
    }

    return value;
};

const convertEvaluationHistoryToView = (
    history: EvaluationHistoryApiResponse
): EvaluationHistoryDetailView => {
    return {
        id: history.id,
        historyCode: `EH-${String(history.id).padStart(4, "0")}`,
        grantCaseId: history.grantCaseId,
        grantName: `案件ID: ${history.grantCaseId}`,
        provider: "案件詳細で確認",
        evaluatedAt: formatDate(history.evaluatedAt),
        fiscalYear: getFiscalYearLabel(history.evaluatedAt),
        evaluatorName: "AI判定",
        aiResult: normalizeAiResult(history.aiSuitability),
        recommendationLevel: history.aiRecommendationLevel,
        reason: history.aiReason,
        evidence: splitTextToList(history.aiEvidence),
        organizationSnapshot: normalizeSnapshot(history.organizationSnapshot),
        charterSnapshot: normalizeSnapshot(history.charterSnapshot),
        activitySnapshot: normalizeSnapshot(history.activitySnapshot),
        grantSnapshot: normalizeSnapshot(history.grantSnapshot),
        aiRawResponse: normalizeSnapshot(history.aiRawResponse),
        reviewMemo: history.reviewMemo ?? "",
    };
};

export function PGA08BEvaluationHistoryDetailPage() {
    const navigate = useNavigate();
    const { historyId } = useParams<{ historyId: string }>();

    const [history, setHistory] =
        useState<EvaluationHistoryDetailView | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [reviewMemo, setReviewMemo] = useState("");
    const [isUpdatingReviewStatus, setIsUpdatingReviewStatus] = useState(false);
    const [reviewStatusErrorMessage, setReviewStatusErrorMessage] = useState("");

    useEffect(() => {
        const fetchEvaluationHistory = async () => {
            if (!historyId) {
                setErrorMessage("判定履歴IDが指定されていません。");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage("");

                const response = await fetch(
                    `${API_BASE_URL}/api/evaluation-histories/${historyId}`
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("AI判定履歴詳細APIエラー:", errorText);
                    throw new Error("AI判定履歴詳細の取得に失敗しました。");
                }

                const data: EvaluationHistoryApiResponse = await response.json();

                setHistory(convertEvaluationHistoryToView(data));
                setReviewMemo(data.reviewMemo ?? "");
            } catch (error) {
                console.error(error);
                setErrorMessage("AI判定履歴詳細の取得に失敗しました。");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvaluationHistory();
    }, [historyId]);

    const handleBackToList = () => {
        navigate("/admin/evaluations/histories");
    };

    const updateReviewStatus = async (nextReviewStatus: string) => {
        if (!history) {
            return;
        }

        try {
            setIsUpdatingReviewStatus(true);
            setReviewStatusErrorMessage("");

            const response = await fetch(
                `${API_BASE_URL}/api/evaluation-histories/${history.id}/review-status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reviewStatus: nextReviewStatus,
                        reviewMemo,
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("AI判定レビュー状態更新APIエラー:", errorText);
                throw new Error("AI判定レビュー状態の更新に失敗しました。");
            }

            const updatedHistory: EvaluationHistoryApiResponse =
                await response.json();

            setHistory(convertEvaluationHistoryToView(updatedHistory));
            setReviewMemo(updatedHistory.reviewMemo ?? "");

            alert("判断内容を保存しました。");
        } catch (error) {
            console.error(error);
            setReviewStatusErrorMessage("判断内容の保存に失敗しました。");
        } finally {
            setIsUpdatingReviewStatus(false);
        }
    };

    const handleReEvaluate = () => { };
    const handleProceedToApplication = () => { };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute right-[-10%] top-[10%] h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="absolute bottom-[-15%] left-[35%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>

            <main className="relative mx-auto max-w-7xl px-6 py-8">
                {isLoading && (
                    <section className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300 backdrop-blur">
                        AI判定履歴詳細を読み込み中です。
                    </section>
                )}

                {errorMessage && (
                    <section className="mb-6 rounded-[1.5rem] border border-rose-400/30 bg-rose-500/10 p-5 text-sm text-rose-200 backdrop-blur">
                        {errorMessage}
                    </section>
                )}

                {!isLoading && history && (
                    <>
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
                                            <p>関連案件：{history.provider}</p>
                                            <p>判定者：{history.evaluatorName}</p>
                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            <Badge className={aiResultStyle[history.aiResult]}>
                                                AI判定：{aiResultLabel[history.aiResult]}
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
                                    icon={<FileText size={20} />}
                                    title="AI判定ログ"
                                >
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                                            {history.aiRawResponse}
                                        </p>
                                    </div>
                                </DetailCard>

                                <DetailCard
                                    icon={<FileText size={20} />}
                                    title="判定時の団体情報"
                                >
                                    <InfoBlock title="">
                                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                                            {history.organizationSnapshot}
                                        </p>
                                    </InfoBlock>
                                </DetailCard>

                                <DetailCard
                                    icon={<FileText size={20} />}
                                    title="判定時の定款情報"
                                >
                                    <InfoBlock title="">
                                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                                            {history.charterSnapshot}
                                        </p>
                                    </InfoBlock>
                                </DetailCard>

                                <DetailCard
                                    icon={<FileText size={20} />}
                                    title="判定時の活動実績"
                                >
                                    <InfoBlock title="">
                                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                                            {history.activitySnapshot}
                                        </p>
                                    </InfoBlock>
                                </DetailCard>

                                <DetailCard
                                    icon={<FileText size={20} />}
                                    title="判定時の助成金情報"
                                >
                                    <InfoBlock title="">
                                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                                            {history.grantSnapshot}
                                        </p>
                                    </InfoBlock>
                                </DetailCard>

                                <DetailCard
                                    icon={<Lightbulb size={20} />}
                                    title="次の判断"
                                >
                                    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-950/30 p-6">
                                        <p className="mb-6 text-sm leading-6 text-slate-300">
                                            AI判定結果を確認し、次の対応を選択します。<br />
                                            AI判定は最終判断ではありません。
                                        </p>

                                        {reviewStatusErrorMessage && (
                                            <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                                                {reviewStatusErrorMessage}
                                            </div>
                                        )}

                                        <div className="mb-6">
                                            <label className="mb-2 block text-sm font-semibold text-slate-300">
                                                判断メモ
                                            </label>
                                            <textarea
                                                aria-label="判断メモ"
                                                value={reviewMemo}
                                                onChange={(event) => setReviewMemo(event.target.value)}
                                                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                                                rows={4}
                                                placeholder="判断に関するメモを入力してください..."
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                type="button"
                                                onClick={handleReEvaluate}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                                            >
                                                再判定する
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleProceedToApplication}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400"
                                            >
                                                申請に進む
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => updateReviewStatus("SAVED")}
                                                disabled={isUpdatingReviewStatus}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                                            >
                                                保存する
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => updateReviewStatus("DECLINED")}
                                                disabled={isUpdatingReviewStatus}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200 disabled:opacity-50"
                                            >
                                                見送る
                                            </button>
                                        </div>
                                    </div>
                                </DetailCard>
                            </div>

                            <aside className="space-y-6">
                                <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                                    <h2 className="text-lg font-semibold text-white">
                                        画面ガイド
                                    </h2>

                                    <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                        <GuideLine text="AI判定結果、判定理由、根拠を確認します。" />
                                        <GuideLine text="この画面で内容を確認し、再判定・申請準備・見送りなどの判断につなげます。" />
                                        <GuideLine text="AI判定は最終判断ではありません。担当者が内容を確認します。" />
                                    </div>
                                </div>

                                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
                                    <h2 className="text-lg font-semibold text-white">
                                        履歴の扱い
                                    </h2>

                                    <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                        <GuideLine text="AI判定履歴そのものは作成後に変更しません。" />
                                        <GuideLine text="再判定した場合は、新しいAI判定履歴として保存されます。" />
                                        <GuideLine text="通常表示では最新の判定結果を中心に確認します。" />
                                    </div>
                                </div>

                                <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-6">
                                    <h2 className="text-lg font-semibold text-white">
                                        禁止操作
                                    </h2>

                                    <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                        <GuideLine text="AI判定内容の編集不可" />
                                        <GuideLine text="AI判定履歴の物理削除不可" />
                                        <GuideLine text="判定結果の上書き不可" />
                                    </div>
                                </div>

                                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6">
                                    <h2 className="text-lg font-semibold text-white">
                                        データ流転
                                    </h2>

                                    <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                        <GuideLine text="PG-A07で作成されたAI判定履歴を参照します。" />
                                        <GuideLine text="この画面で判定結果を確認し、再判定・申請準備・見送りなどを判断します。" />
                                        <GuideLine text="申請に進む場合は、PG-A09 / PG-A10の案件管理へ接続します。" />
                                    </div>
                                </div>
                            </aside>
                        </section>
                    </>
                )}
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