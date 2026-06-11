import { useEffect, useState } from "react";

import { getGrantMaster } from "../api/grantMasterApi";
import { runAiEvaluation } from "../api/aiEvaluationApi";

import type {
    EvaluationState,
} from "../types/EvaluationState";

import type {
    AiResult,
} from "../types/AiResult";

import type {
    GrantMasterApiResponse,
} from "../types/GrantMasterApiResponse";

import type {
    GrantView,
} from "../types/GrantView";

import type {
    AiEvaluationResponse,
} from "../types/AiEvaluationResponse";

import type {
    AiEvaluationView,
} from "../types/AiEvaluationView";

const ORGANIZATION_ID = 1;

const formatGrantAmount = (amount: number | null): string => {
    if (amount === null) {
        return "上限額未設定";
    }

    if (amount >= 10000 && amount % 10000 === 0) {
        return `上限 ${amount / 10000}万円`;
    }

    return `上限 ${amount.toLocaleString()}円`;
};

const convertGrantMasterToGrantView = (
    grantMaster: GrantMasterApiResponse
): GrantView => {
    return {
        id: grantMaster.id,
        name: grantMaster.title,
        provider: grantMaster.provider ?? "",
        amount: formatGrantAmount(grantMaster.maxGrantAmount),
        deadline: grantMaster.applicationDeadline ?? "締切未設定",
        summary: grantMaster.summary ?? "",
    };
};

const normalizeAiResult = (value: string): AiResult => {
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
        return ["根拠情報はまだ登録されていません。"];
    }

    return value
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter((item) => item !== "");
};

const getExaminationStatusLabel = (status: string): string => {
    switch (status) {
        case "UNCONFIRMED":
            return "未確認";

        case "UNDER_REVIEW":
            return "確認中";

        case "SKIPPED":
            return "見送り";

        default:
            return status;
    }
};

const getExternalAuditStatusLabel = (status: string): string => {
    switch (status) {
        case "NO_RESPONSE":
            return "未回答";

        case "UNDER_AUDIT":
            return "審査中";

        case "ADOPTED":
            return "採択";

        case "REJECTED":
            return "不採択";

        default:
            return status;
    }
};

const convertAiResponseToView = (
    response: AiEvaluationResponse
): AiEvaluationView => {
    return {
        grantCaseId: response.grantCaseId,
        evaluationHistoryId: response.evaluationHistoryId,
        result: normalizeAiResult(response.aiSuitability),
        recommendationLevel: response.aiRecommendationLevel,
        reason: response.aiReason,
        evidence: splitTextToList(response.aiEvidence),
        missingInfo: [
            `書類チェック状況：${getExaminationStatusLabel(response.examinationStatus)}`,
            `外部審査状況：${getExternalAuditStatusLabel(response.externalAuditStatus)}`,
        ],
        additionalChecks: [
            "募集要項の最新PDFを確認する",
            "申請に必要な添付書類を確認する",
            "対象経費と活動内容の整合性を確認する",
        ],
    };
};

export const useAiEvaluation = (
    grantMasterId: string | undefined
) => {
    const [grant, setGrant] = useState<GrantView | null>(null);
    const [isLoadingGrant, setIsLoadingGrant] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [evaluationState, setEvaluationState] =
        useState<EvaluationState>("NOT_STARTED");

    const [aiEvaluation, setAiEvaluation] =
        useState<AiEvaluationView | null>(null);

    const fetchGrantMaster = async () => {
        if (!grantMasterId) {
            setErrorMessage("助成金IDが指定されていません。");
            setIsLoadingGrant(false);
            return;
        }

        try {
            setIsLoadingGrant(true);
            setErrorMessage("");

            const data =
                await getGrantMaster(
                    Number(grantMasterId)
                ) as GrantMasterApiResponse;

            setGrant(convertGrantMasterToGrantView(data));
        } catch (error) {
            console.error(error);
            setErrorMessage("助成金公募詳細の取得に失敗しました。");
        } finally {
            setIsLoadingGrant(false);
        }
    };

    const evaluateGrant = async () => {
        if (!grant) {
            return null;
        }

        try {
            setEvaluationState("RUNNING");
            setErrorMessage("");

            const data =
                await runAiEvaluation({
                    organizationId: ORGANIZATION_ID,
                    grantMasterId: grant.id,
                }) as AiEvaluationResponse;

            const convertedEvaluation =
                convertAiResponseToView(data);

            setAiEvaluation(convertedEvaluation);
            setEvaluationState("COMPLETED");

            return data;
        } catch (error) {
            console.error(error);
            setEvaluationState("NOT_STARTED");
            setErrorMessage("AI判定の実行に失敗しました。");

            return null;
        }
    };

    useEffect(() => {
        fetchGrantMaster();
    }, [grantMasterId]);

    return {
        grant,
        isLoadingGrant,
        errorMessage,
        setErrorMessage,
        evaluationState,
        aiEvaluation,
        evaluateGrant,
    };
};