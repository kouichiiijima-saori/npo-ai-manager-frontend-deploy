import type {
    AiEvaluationResult,
} from "./AiEvaluationResult";

export type EvaluationHistoryDetailView = {
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