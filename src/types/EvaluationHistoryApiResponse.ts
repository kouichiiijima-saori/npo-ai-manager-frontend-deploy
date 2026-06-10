export type EvaluationHistoryApiResponse = {
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