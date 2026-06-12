import { useEffect, useState } from "react";

import {
    getGrantMasters,
} from "../api/grantMasterApi";

import {
    getEvaluationHistories,
} from "../api/evaluationHistoryApi";

import type {
    GrantMasterApiResponse,
} from "../types/GrantMasterApiResponse";

import type {
    EvaluationHistoryApiResponse,
} from "../types/EvaluationHistoryApiResponse";

import type {
    GrantProgram,
} from "../types/GrantProgram";
import {
    getGrantMasterIdFromSnapshot,
} from "../utils/snapshotUtils";

export const useGrantMasters = (
    convertGrantMasterToGrantProgram: (
        grantMaster: GrantMasterApiResponse
    ) => GrantProgram
) => {
    const [grants, setGrants] = useState<GrantProgram[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchGrantMasters = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const [grantMastersResult, evaluationHistoriesResult] =
                await Promise.all([
                    getGrantMasters(),
                    getEvaluationHistories(),
                ]);

            const grantMasters =
                Array.isArray(grantMastersResult)
                    ? grantMastersResult
                    : Array.isArray(
                        (grantMastersResult as { data?: unknown }).data
                    )
                        ? (grantMastersResult as { data: GrantMasterApiResponse[] }).data
                        : [];

            const evaluationHistories =
                Array.isArray(evaluationHistoriesResult)
                    ? evaluationHistoriesResult
                    : Array.isArray(
                        (evaluationHistoriesResult as { data?: unknown }).data
                    )
                        ? (evaluationHistoriesResult as { data: EvaluationHistoryApiResponse[] }).data
                        : [];

            const evaluatedGrantMasterIds = new Set<number>();
            const unreviewedHistoryMap = new Map<number, number>();

            evaluationHistories.forEach((history) => {
                const grantMasterId =
                    getGrantMasterIdFromSnapshot(
                        history.grantSnapshot
                    );

                const shouldHideFromGrantList =
                    history.reviewStatus === "SAVED"
                    || history.reviewStatus === "DECLINED"
                    || history.reviewStatus === "PROCEEDED";

                if (grantMasterId !== null) {

                    if (shouldHideFromGrantList) {
                        evaluatedGrantMasterIds.add(
                            grantMasterId
                        );
                    } else if (
                        history.reviewStatus === "UNREVIEWED"
                    ) {
                        const current =
                            unreviewedHistoryMap.get(
                                grantMasterId
                            );

                        if (
                            !current ||
                            history.id > current
                        ) {
                            unreviewedHistoryMap.set(
                                grantMasterId,
                                history.id
                            );
                        }
                    }
                }
            });

            const visibleGrantMasters =
                grantMasters.filter(
                    (grantMaster) =>
                        !evaluatedGrantMasterIds.has(
                            grantMaster.id
                        )
                );

            setGrants(
                visibleGrantMasters.map((gm) => {
                    const program =
                        convertGrantMasterToGrantProgram(
                            gm
                        );

                    program.unreviewedHistoryId =
                        unreviewedHistoryMap.get(gm.id);

                    return program;
                })
            );
        } catch (error) {
            console.error(error);

            setErrorMessage(
                "助成金公募一覧の取得に失敗しました。"
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGrantMasters();
    }, []);

    return {
        grants,
        isLoading,
        errorMessage,
        fetchGrantMasters,
    };
};