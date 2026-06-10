import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getEvaluationHistory,
    updateEvaluationHistoryReviewStatus,
} from "../../../api/evaluationHistoryApi";

import { getGrantCase } from "../../../api/grantCaseApi";

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
    additionalChecks: string | null;
    organizationSnapshot: string | null;
    charterSnapshot: string | null;
    activitySnapshot: string | null;
    grantSnapshot: string | null;
    aiRawResponse: string | null;
    evaluatedAt: string | null;
    reviewStatus: string;
    reviewMemo: string | null;
    reviewedAt: string | null;
};

type GrantCaseApiResponse = {
    id: number;
    caseName: string;
    grantMasterId: number;
};

type EvaluationHistoryDetailView = {
    id: number;
    historyCode: string;
    grantCaseId: number;
    grantMasterId: number | null;
    grantName: string;
    caseName: string;
    provider: string;
    evaluatedAt: string;
    fiscalYear: string;
    evaluatorName: string;
    aiResult: AiEvaluationResult;
    recommendationLevel: string;
    reason: string;
    evidence: string[];
    additionalChecks: string[];
    organizationSnapshot: string;
    charterSnapshot: string;
    activitySnapshot: string;
    grantSnapshot: string;
    aiRawResponse: string;
    reviewStatus: string;
    reviewMemo: string;
    reviewedAt: string | null;
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

const normalizeAiResult = (value: string): AiEvaluationResult => {
    if (value === "SUITABLE" || value === "MATCH") {
        return "MATCH";
    }

    if (value === "UNSUITABLE" || value === "NOT_MATCH") {
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

const splitTextToOptionalList = (value: string | null | undefined): string[] => {
    if (!value || value.trim() === "") {
        return [];
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

const getGrantMasterIdFromSnapshot = (
    grantSnapshot: string | null
): number | null => {
    if (!grantSnapshot) {
        return null;
    }

    try {
        const parsed = JSON.parse(grantSnapshot);
        const grantMasterId = Number(parsed.grantMasterId);

        if (Number.isNaN(grantMasterId)) {
            return null;
        }

        return grantMasterId;
    } catch {
        return null;
    }
};

const getReviewStatusLabel = (
    reviewStatus: string
): string => {
    switch (reviewStatus) {
        case "SAVED":
            return "検討中";

        case "DECLINED":
            return "見送り";

        case "PROCEEDED":
            return "申請準備へ移行済み";

        case "UNREVIEWED":
        default:
            return "未判断";
    }
};

const getReviewStatusStyle = (
    reviewStatus: string
): string => {
    switch (reviewStatus) {
        case "SAVED":
            return "border-blue-400/40 bg-blue-400/10 text-blue-200";
        case "DECLINED":
            return "border-rose-400/40 bg-rose-400/10 text-rose-200";
        case "PROCEEDED":
            return "border-emerald-400/40 bg-emerald-400/10 text-emerald-200";
        case "UNREVIEWED":
        default:
            return "border-slate-400/40 bg-slate-400/10 text-slate-200";
    }
};

const convertEvaluationHistoryToView = (
    history: EvaluationHistoryApiResponse,
    grantCase: GrantCaseApiResponse | null
): EvaluationHistoryDetailView => {
    return {
        id: history.id,
        historyCode: `EH-${String(history.id).padStart(4, "0")}`,
        grantCaseId: history.grantCaseId,
        grantMasterId: getGrantMasterIdFromSnapshot(history.grantSnapshot),
        grantName: grantCase?.caseName ?? `案件ID: ${history.grantCaseId}`,
        caseName: grantCase?.caseName ?? "",
        provider: "関連案件詳細で確認",
        evaluatedAt: formatDate(history.evaluatedAt),
        fiscalYear: getFiscalYearLabel(history.evaluatedAt),
        evaluatorName: "AI判定",
        aiResult: normalizeAiResult(history.aiSuitability),
        recommendationLevel: history.aiRecommendationLevel,
        reason: history.aiReason,
        evidence: splitTextToList(history.aiEvidence),
        additionalChecks: splitTextToOptionalList(history.additionalChecks),
        organizationSnapshot: normalizeSnapshot(history.organizationSnapshot),
        charterSnapshot: normalizeSnapshot(history.charterSnapshot),
        activitySnapshot: normalizeSnapshot(history.activitySnapshot),
        grantSnapshot: normalizeSnapshot(history.grantSnapshot),
        aiRawResponse: normalizeSnapshot(history.aiRawResponse),
        reviewStatus: history.reviewStatus,
        reviewMemo: history.reviewMemo ?? "",
        reviewedAt: history.reviewedAt,
    };
};

export function PGA08BEvaluationHistoryDetailPage() {
    const navigate = useNavigate();
    const { historyId } = useParams<{ historyId: string }>();

    const [history, setHistory] =
        useState<EvaluationHistoryDetailView | null>(null);
    const [grantCase, setGrantCase] = useState<GrantCaseApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [reviewMemo, setReviewMemo] = useState("");
    const [isUpdatingReviewStatus, setIsUpdatingReviewStatus] = useState(false);
    const [reviewStatusErrorMessage, setReviewStatusErrorMessage] = useState("");
    const [reviewStatusSuccessMessage, setReviewStatusSuccessMessage] = useState("");
    const [retryCooldown, setRetryCooldown] = useState(0);

    useEffect(() => {
        if (retryCooldown > 0) {
            const timerId = setTimeout(() => {
                setRetryCooldown((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        }
    }, [retryCooldown]);

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

                const data =
                    await getEvaluationHistory(
                        Number(historyId)
                    ) as EvaluationHistoryApiResponse;
                let grantCaseData: GrantCaseApiResponse | null = null;
                try {
                    const caseData =
                        await getGrantCase(
                            data.grantCaseId
                        ) as GrantCaseApiResponse;
                    grantCaseData = caseData;
                    setGrantCase(grantCaseData);
                } catch (err) {
                    console.error("案件取得に失敗しました", err);
                }

                setHistory(convertEvaluationHistoryToView(data, grantCaseData));
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
            setReviewStatusSuccessMessage("");

            let updatedHistory: EvaluationHistoryApiResponse;

            if (nextReviewStatus === "SAVED") {
                updatedHistory =
                    await updateEvaluationHistoryReviewStatus(
                        history.id,
                        "SAVED",
                        reviewMemo
                    ) as EvaluationHistoryApiResponse;
            } else if (nextReviewStatus === "DECLINED") {
                updatedHistory =
                    await updateEvaluationHistoryReviewStatus(
                        history.id,
                        "DECLINED",
                        reviewMemo
                    ) as EvaluationHistoryApiResponse;
            } else if (nextReviewStatus === "PROCEEDED") {
                updatedHistory =
                    await updateEvaluationHistoryReviewStatus(
                        history.id,
                        "PROCEEDED",
                        reviewMemo
                    ) as EvaluationHistoryApiResponse;
            } else {
                throw new Error("Invalid review status");
            }

            setHistory(convertEvaluationHistoryToView(updatedHistory, grantCase));
            setReviewMemo(updatedHistory.reviewMemo ?? "");
            setReviewStatusSuccessMessage("判断内容を保存しました。");
        } catch (error) {
            console.error(error);
            setReviewStatusErrorMessage("判断内容の保存に失敗しました。");
            setReviewStatusSuccessMessage("");
        } finally {
            setIsUpdatingReviewStatus(false);
        }
    };

    const handleReEvaluate = () => {
        if (!history || !history.grantMasterId) {
            return;
        }

        setRetryCooldown(60);

        navigate(
            `/ai-workspace/${history.grantMasterId}?grantCaseId=${history.grantCaseId}`
        );
    };

    const handleProceedToApplication = async () => {
        if (!history) {
            return;
        }

        await updateReviewStatus("PROCEEDED");

        navigate(`/grant-cases/${history.grantCaseId}`);
    };

    const isUnreviewed = history?.reviewStatus === "UNREVIEWED";
    const isSaved = history?.reviewStatus === "SAVED";
    const isDeclined = history?.reviewStatus === "DECLINED";
    const isProceeded = history?.reviewStatus === "PROCEEDED";

    const reviewStatusMessage = (() => {
        if (!history) {
            return "";
        }

        switch (history.reviewStatus) {
            case "SAVED":
                return "この判定は検討中として保存されています。判断を変更する場合は再判定してください。";

            case "DECLINED":
                return "この判定は見送りとして保存されています。判断を変更する場合は再判定してください。";

            case "PROCEEDED":
                return "この判定は申請準備へ移行済みです。以降は案件詳細で管理します。";

            case "UNREVIEWED":
            default:
                return "AI判定結果を確認し、次の対応を選択してください。";
        }
    })();

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
                                            <p>関連案件ID：{history.grantCaseId}</p>
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
                                    icon={<SearchCheck size={20} />}
                                    title="追加確認事項"
                                >
                                    {history.additionalChecks.length > 0 ? (
                                        <ResultList
                                            items={history.additionalChecks}
                                            markerClassName="bg-amber-300"
                                        />
                                    ) : (
                                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                                            <p className="text-sm leading-7 text-slate-300">
                                                追加確認事項はありません。
                                            </p>
                                        </div>
                                    )}
                                </DetailCard>

                                <DetailCard
                                    icon={<FileText size={20} />}
                                    title="AI判定ログ"
                                >
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                                        <p className="text-sm leading-7 text-slate-300">
                                            AI判定時の内部ログを保存しています。<br />
                                            必要に応じて監査証跡として参照できます。
                                        </p>
                                    </div>
                                </DetailCard>

                                <DetailCard
                                    icon={<FileText size={20} />}
                                    title="判定時の団体情報"
                                >
                                    <InfoBlock title="">
                                        <p className="text-sm leading-7 text-slate-300">
                                            判定時点の団体情報を保存しています。<br />
                                            後日の判定検証に利用できます。
                                        </p>
                                    </InfoBlock>
                                </DetailCard>

                                <DetailCard
                                    icon={<FileText size={20} />}
                                    title="判定時の定款情報"
                                >
                                    <InfoBlock title="">
                                        <p className="text-sm leading-7 text-slate-300">
                                            判定時点の定款情報を保存しています。<br />
                                            後日の判定検証に利用できます。
                                        </p>
                                    </InfoBlock>
                                </DetailCard>

                                <DetailCard
                                    icon={<FileText size={20} />}
                                    title="判定時の活動実績"
                                >
                                    <InfoBlock title="">
                                        <p className="text-sm leading-7 text-slate-300">
                                            判定時点の活動実績を保存しています。<br />
                                            後日の判定検証に利用できます。
                                        </p>
                                    </InfoBlock>
                                </DetailCard>

                                <DetailCard
                                    icon={<FileText size={20} />}
                                    title="判定時の助成金情報"
                                >
                                    <InfoBlock title="">
                                        <p className="text-sm leading-7 text-slate-300">
                                            判定時点の助成金情報を保存しています。<br />
                                            後日の判定検証に利用できます。
                                        </p>
                                    </InfoBlock>
                                </DetailCard>

                                <DetailCard
                                    icon={<Lightbulb size={20} />}
                                    title="次の判断"
                                >
                                    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-950/30 p-6">
                                        <p className="mb-6 text-sm leading-6 text-slate-300">
                                            {reviewStatusMessage}<br />
                                            追加確認事項を確認したうえで、申請に進むか判断してください。<br />
                                            AI判定は最終判断ではありません。
                                        </p>

                                        <div className="mb-6 space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    現在の判断状態
                                                </p>

                                                <p className="font-medium text-white">
                                                    {getReviewStatusLabel(history.reviewStatus)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    最終更新日時
                                                </p>

                                                <p className="text-white">
                                                    {history.reviewedAt
                                                        ? formatDate(history.reviewedAt)
                                                        : "未更新"}
                                                </p>
                                            </div>
                                        </div>

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
                                                placeholder={`例：\n理事会で確認予定\n追加資料確認後に再検討\n今回は対象外のため見送り`}
                                            />
                                        </div>

                                        {retryCooldown > 0 && (
                                            <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200">
                                                短時間に再判定を繰り返すとAI APIの利用制限に達する可能性があります。少し時間を空けてから再判定してください。
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-4">
                                            {isProceeded ? (
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/grant-cases/${history.grantCaseId}`)}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                                                >
                                                    案件詳細へ移動
                                                </button>
                                            ) : (
                                                <>
                                                    {isUnreviewed && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={handleReEvaluate}
                                                                disabled={retryCooldown > 0}
                                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                                                            >
                                                                {retryCooldown > 0 ? `再判定まで ${retryCooldown}秒` : "再判定する"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => updateReviewStatus("SAVED")}
                                                                disabled={isUpdatingReviewStatus}
                                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                                                            >
                                                                {isUpdatingReviewStatus ? "保存中..." : "保存する"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => updateReviewStatus("DECLINED")}
                                                                disabled={isUpdatingReviewStatus}
                                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200 disabled:opacity-50"
                                                            >
                                                                {isUpdatingReviewStatus ? "更新中..." : "見送る"}
                                                            </button>
                                                        </>
                                                    )}

                                                    {isSaved && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={handleReEvaluate}
                                                                disabled={retryCooldown > 0}
                                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                                                            >
                                                                {retryCooldown > 0 ? `再判定まで ${retryCooldown}秒` : "再判定する"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => updateReviewStatus("DECLINED")}
                                                                disabled={isUpdatingReviewStatus}
                                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200 disabled:opacity-50"
                                                            >
                                                                {isUpdatingReviewStatus ? "更新中..." : "見送りに変更"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={handleProceedToApplication}
                                                                disabled={isUpdatingReviewStatus}
                                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:opacity-50"
                                                            >
                                                                {isUpdatingReviewStatus ? "処理中..." : "申請に進む"}
                                                            </button>
                                                        </>
                                                    )}

                                                    {isDeclined && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={handleReEvaluate}
                                                                disabled={retryCooldown > 0}
                                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                                                            >
                                                                {retryCooldown > 0 ? `再判定まで ${retryCooldown}秒` : "再判定する"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => updateReviewStatus("SAVED")}
                                                                disabled={isUpdatingReviewStatus}
                                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20 hover:text-blue-200 disabled:opacity-50"
                                                            >
                                                                {isUpdatingReviewStatus ? "更新中..." : "検討中に戻す"}
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {reviewStatusErrorMessage && (
                                            <p className="mt-4 text-sm text-red-400">
                                                {reviewStatusErrorMessage}
                                            </p>
                                        )}

                                        {reviewStatusSuccessMessage && (
                                            <p className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                                                {reviewStatusSuccessMessage}
                                            </p>
                                        )}
                                    </div>
                                </DetailCard>
                            </div>

                            <aside className="space-y-6">
                                <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                                    <h2 className="text-lg font-semibold text-white">
                                        画面ガイド
                                    </h2>

                                    <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                        <GuideLine text="PG-A06: 助成金一覧・未確定判定の入口" />
                                        <GuideLine text="PG-A07: AI判定実行" />
                                        <GuideLine text="PG-A08: 保存・見送り済みの履歴一覧" />
                                        <GuideLine text="PG-A08B: 検討・申請判断 (現在の画面)" />
                                        <GuideLine text="PG-A09: 申請に進んだ案件一覧" />
                                        <GuideLine text="PG-A10: 案件化後の進捗管理" />
                                    </div>
                                </div>

                                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
                                    <h2 className="text-lg font-semibold text-white">
                                        履歴の扱い
                                    </h2>

                                    <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                        <GuideLine text="AI判定履歴そのものは変更しません" />
                                        <GuideLine text="判断状態と判断メモを保存します" />
                                        <GuideLine text="申請に進んだものは案件管理へ移動します" />
                                    </div>
                                </div>

                                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6">
                                    <h2 className="text-lg font-semibold text-white">
                                        データ流転
                                    </h2>

                                    <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                                        <GuideLine text="PG-A06から判定へ" />
                                        <div className="pl-6 text-slate-500">↓</div>
                                        <GuideLine text="PG-A07でAI判定" />
                                        <div className="pl-6 text-slate-500">↓</div>
                                        <GuideLine text="PG-A08Bで検討・申請判断" />
                                        <div className="pl-6 text-slate-500">↓</div>
                                        <GuideLine text="申請に進むとPG-A09の案件管理へ移動" />
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
