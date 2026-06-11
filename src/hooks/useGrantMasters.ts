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

const getGrantMasterIdFromSnapshot = (
    grantSnapshot: string | null
): number | null => {
    if (!grantSnapshot) {
        return null;
    }

    try {
        const parsed = JSON.parse(grantSnapshot);
        const grantMasterId = Number(parsed.grantMasterId);

        return Number.isNaN(grantMasterId)
            ? null
            : grantMasterId;
    } catch {
        return null;
    }
};

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

            const [grantMasters, evaluationHistories] =
                await Promise.all([
                    getGrantMasters() as Promise<GrantMasterApiResponse[]>,
                    getEvaluationHistories() as Promise<EvaluationHistoryApiResponse[]>,
                ]);

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