import { useEffect, useState } from "react";

import {
    getGrantCases,
} from "../api/grantCaseApi";

import {
    getEvaluationHistories,
} from "../api/evaluationHistoryApi";

import {
    normalizeCaseStage,
} from "../types/CaseStage";

import type {
    EvaluationHistoryApiResponse,
} from "../types/EvaluationHistoryApiResponse";

import type {
    GrantCaseApiResponse,
} from "../types/GrantCaseApiResponse";

import type {
    GrantCaseView,
} from "../types/GrantCaseView";

const convertGrantCaseToView = (
    grantCase: GrantCaseApiResponse
): GrantCaseView => {
    return {
        id: grantCase.id,
        caseName: grantCase.caseName,
        grantName: `助成金ID: ${grantCase.grantMasterId}`,
        provider: "公募情報は詳細画面で確認",
        stage: normalizeCaseStage(grantCase.caseStage),
        deadline: "詳細画面で確認",
        nextAction: grantCase.nextAction ?? "次アクション未設定",
        nextActionDueDate: grantCase.nextActionDueDate ?? "",
        reviewMemo: grantCase.examinationMemo ?? "検討メモ未入力",
        updatedAt: grantCase.updatedAt ?? "",
        archived: grantCase.archived,
        archiveReason: grantCase.archiveReason,
    };
};

export const useGrantCases = () => {
    const [grantCases, setGrantCases] = useState<GrantCaseView[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchGrantCases = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const [grantCasesResult, historiesResult] =
                await Promise.all([
                    getGrantCases(),
                    getEvaluationHistories(),
                ]);

            const grantCasesData =
                Array.isArray(grantCasesResult)
                    ? grantCasesResult
                    : Array.isArray(
                        (grantCasesResult as { data?: unknown }).data
                    )
                        ? (grantCasesResult as { data: GrantCaseApiResponse[] }).data
                        : [];

            const historiesData =
                Array.isArray(historiesResult)
                    ? historiesResult
                    : Array.isArray(
                        (historiesResult as { data?: unknown }).data
                    )
                        ? (historiesResult as { data: EvaluationHistoryApiResponse[] }).data
                        : [];

            const proceededGrantCaseIds = new Set<number>();

            historiesData.forEach((history) => {
                if (history.reviewStatus === "PROCEEDED") {
                    proceededGrantCaseIds.add(history.grantCaseId);
                }
            });

            const latestGrantCaseMap = new Map<number, GrantCaseApiResponse>();

            grantCasesData.forEach((grantCase) => {
                if (!proceededGrantCaseIds.has(grantCase.id)) {
                    return;
                }

                const current =
                    latestGrantCaseMap.get(grantCase.grantMasterId);

                if (!current || grantCase.id > current.id) {
                    latestGrantCaseMap.set(
                        grantCase.grantMasterId,
                        grantCase
                    );
                }
            });

            const latestGrantCases =
                Array.from(latestGrantCaseMap.values());

            setGrantCases(
                latestGrantCases.map(convertGrantCaseToView)
            );
        } catch (error) {
            console.error(error);
            setErrorMessage("助成金案件一覧の取得に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGrantCases();
    }, []);

    return {
        grantCases,
        isLoading,
        errorMessage,
        fetchGrantCases,
    };
};