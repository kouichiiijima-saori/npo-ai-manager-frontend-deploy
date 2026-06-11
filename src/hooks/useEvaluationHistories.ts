import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type {
    EvaluationHistoryApiResponse,
} from "../types/EvaluationHistoryApiResponse";
import type {
    GrantCaseApiResponse,
} from "../types/GrantCaseApiResponse";
import type {
    EvaluationHistoryView,
} from "../types/EvaluationHistoryView";
import {
    formatDate,
    getFiscalYearLabel,
} from "../utils/dateUtils";
import {
    normalizeAiResult,
} from "../utils/aiResultUtils";

const convertEvaluationHistoryToView = (
    history: EvaluationHistoryApiResponse,
    grantCaseMap: Map<number, GrantCaseApiResponse>
): EvaluationHistoryView => {
    const grantCase = grantCaseMap.get(history.grantCaseId);

    return {
        id: history.id,
        historyCode: `EH-${String(history.id).padStart(4, "0")}`,
        grantCaseId: history.grantCaseId,
        grantName: grantCase?.caseName ?? `関連案件ID: ${history.grantCaseId}`,
        provider: "関連案件詳細で確認",
        evaluatedAt: formatDate(history.evaluatedAt),
        fiscalYear: getFiscalYearLabel(history.evaluatedAt),
        evaluatorName: "AI判定",
        aiResult: normalizeAiResult(history.aiSuitability),
        recommendationLevel: history.aiRecommendationLevel,
        aiReason: history.aiReason,
        aiEvidence: history.aiEvidence,
        reviewStatus: history.reviewStatus,
        reviewMemo: history.reviewMemo ?? "",
        reviewedAt: formatDate(history.reviewedAt),
    };
};

export const useEvaluationHistories = () => {
    const [evaluationHistories, setEvaluationHistories] =
        useState<EvaluationHistoryView[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchEvaluationHistories = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const { data: histories } =
                await api.get<EvaluationHistoryApiResponse[]>(
                    "/api/evaluation-histories"
                );

            const latestDisplayHistoryMap =
                new Map<number, EvaluationHistoryApiResponse>();

            const historiesByGrantCase =
                new Map<number, EvaluationHistoryApiResponse[]>();

            histories.forEach((history) => {
                const list =
                    historiesByGrantCase.get(history.grantCaseId) ?? [];

                list.push(history);
                historiesByGrantCase.set(history.grantCaseId, list);
            });

            historiesByGrantCase.forEach((caseHistories, grantCaseId) => {
                const sortedHistories = [...caseHistories].sort(
                    (a, b) => b.id - a.id
                );

                const latestHistory = sortedHistories[0];

                if (latestHistory.reviewStatus === "PROCEEDED") {
                    return;
                }

                if (
                    latestHistory.reviewStatus === "SAVED" ||
                    latestHistory.reviewStatus === "DECLINED"
                ) {
                    latestDisplayHistoryMap.set(grantCaseId, latestHistory);
                    return;
                }

                const latestReviewedHistory = sortedHistories.find(
                    (history) =>
                        history.reviewStatus === "SAVED" ||
                        history.reviewStatus === "DECLINED"
                );

                if (latestReviewedHistory) {
                    latestDisplayHistoryMap.set(
                        grantCaseId,
                        latestReviewedHistory
                    );
                }
            });

            const visibleHistories =
                Array.from(latestDisplayHistoryMap.values());

            const uniqueGrantCaseIds = Array.from(
                new Set(
                    visibleHistories.map(
                        (history) => history.grantCaseId
                    )
                )
            );

            const grantCases = await Promise.all(
                uniqueGrantCaseIds.map(async (grantCaseId) => {
                    try {
                        const { data: grantCase } =
                            await api.get<GrantCaseApiResponse>(
                                `/api/grant-cases/${grantCaseId}`
                            );

                        return grantCase;
                    } catch {
                        return null;
                    }
                })
            );

            const grantCaseMap = new Map<number, GrantCaseApiResponse>();

            grantCases.forEach((grantCase) => {
                if (grantCase) {
                    grantCaseMap.set(grantCase.id, grantCase);
                }
            });

            setEvaluationHistories(
                visibleHistories.map((history) =>
                    convertEvaluationHistoryToView(history, grantCaseMap)
                )
            );
        } catch (error) {
            console.error(error);
            setErrorMessage("AI判定履歴一覧の取得に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvaluationHistories();
    }, []);

    return {
        evaluationHistories,
        isLoading,
        errorMessage,
        fetchEvaluationHistories,
    };
};