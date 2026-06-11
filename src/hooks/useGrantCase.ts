import { useEffect, useState } from "react";

import {
    getGrantCase,
    updateGrantCase,
    archiveGrantCaseWithReason,
    completeAndArchiveGrantCase,
    getGrantRequirementChecks,
    updateGrantRequirementCheck,
} from "../api/grantCaseApi";

import { getGrantMaster } from "../api/grantMasterApi";

import type {
    CaseStage,
} from "../types/CaseStage";

import type {
    GrantCaseApiResponse,
} from "../types/GrantCaseApiResponse";

import type {
    GrantMasterApiResponse,
} from "../types/GrantMasterApiResponse";

import type {
    GrantRequirementCheckApiResponse,
} from "../types/GrantRequirementCheckApiResponse";

export const useGrantCase = (caseId: string | undefined) => {
    const [grantCase, setGrantCase] = useState<GrantCaseApiResponse | null>(null);
    const [grantMaster, setGrantMaster] = useState<GrantMasterApiResponse | null>(null);
    const [requirementChecks, setRequirementChecks] = useState<
        GrantRequirementCheckApiResponse[]
    >([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [isLoadingRequirementChecks, setIsLoadingRequirementChecks] =
        useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [archiveErrorMessage, setArchiveErrorMessage] = useState("");
    const [requirementCheckErrorMessage, setRequirementCheckErrorMessage] =
        useState("");

    const fetchGrantCaseDetail = async () => {
        if (!caseId) {
            setErrorMessage("案件IDが指定されていません。");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage("");

            const caseData =
                await getGrantCase(Number(caseId)) as GrantCaseApiResponse;

            const grantData =
                await getGrantMaster(
                    caseData.grantMasterId
                ) as GrantMasterApiResponse;

            setGrantCase(caseData);
            setGrantMaster(grantData);
        } catch (error) {
            console.error(error);
            setErrorMessage("助成金案件詳細の取得に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRequirementChecks = async () => {
        if (!caseId) {
            return;
        }

        try {
            setIsLoadingRequirementChecks(true);
            setRequirementCheckErrorMessage("");

            const data =
                await getGrantRequirementChecks(
                    Number(caseId)
                ) as GrantRequirementCheckApiResponse[];

            setRequirementChecks(data);
        } catch (error) {
            console.error(error);
            setRequirementCheckErrorMessage("応募要件確認の取得に失敗しました。");
        } finally {
            setIsLoadingRequirementChecks(false);
        }
    };

    const saveGrantCase = async (
        nextGrantCase: GrantCaseApiResponse,
        nextStage: CaseStage,
        nextRequirementChecks: GrantRequirementCheckApiResponse[]
    ) => {
        try {
            setIsSaving(true);
            setErrorMessage("");

            const updatedCase =
                await updateGrantCase(
                    nextGrantCase.id,
                    {
                        ...nextGrantCase,
                        caseStage: nextStage,
                    }
                ) as GrantCaseApiResponse;

            const updatedRequirementChecks: GrantRequirementCheckApiResponse[] =
                await Promise.all(
                    nextRequirementChecks.map(async (check) => {
                        return await updateGrantRequirementCheck(
                            check.id,
                            check
                        ) as GrantRequirementCheckApiResponse;
                    })
                );

            setGrantCase(updatedCase);
            setRequirementChecks(updatedRequirementChecks);

            return updatedCase;
        } catch (error) {
            console.error(error);
            setErrorMessage("案件情報の保存に失敗しました。");
            return null;
        } finally {
            setIsSaving(false);
        }
    };

    const archiveGrantCase = async (
        grantCaseId: number,
        archiveReason: string
    ) => {
        try {
            setIsArchiving(true);
            setArchiveErrorMessage("");

            const updatedGrantCase =
                await archiveGrantCaseWithReason(
                    grantCaseId,
                    { archiveReason }
                ) as GrantCaseApiResponse;

            setGrantCase(updatedGrantCase);

            return updatedGrantCase;
        } catch (error) {
            console.error(error);
            setArchiveErrorMessage("案件のアーカイブに失敗しました。");
            return null;
        } finally {
            setIsArchiving(false);
        }
    };

    const completeAndArchiveGrant = async (grantCaseId: number) => {
        try {
            setIsArchiving(true);
            setArchiveErrorMessage("");

            await completeAndArchiveGrantCase(
                grantCaseId,
                {
                    archiveReason: "完了として案件を終了",
                }
            );

            return true;
        } catch (error) {
            console.error(error);
            setArchiveErrorMessage("案件の完了処理に失敗しました。");
            return false;
        } finally {
            setIsArchiving(false);
        }
    };

    useEffect(() => {
        fetchGrantCaseDetail();
        fetchRequirementChecks();
    }, [caseId]);

    return {
        grantCase,
        setGrantCase,
        grantMaster,
        requirementChecks,
        setRequirementChecks,
        isLoading,
        isSaving,
        isArchiving,
        isLoadingRequirementChecks,
        errorMessage,
        setErrorMessage,
        archiveErrorMessage,
        setArchiveErrorMessage,
        requirementCheckErrorMessage,
        fetchGrantCaseDetail,
        fetchRequirementChecks,
        saveGrantCase,
        archiveGrantCase,
        completeAndArchiveGrant,
    };
};