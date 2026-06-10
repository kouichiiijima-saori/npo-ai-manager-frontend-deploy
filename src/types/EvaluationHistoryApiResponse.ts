import type {
    AiSuitability,
} from "./AiSuitability";

import type {
    AiRecommendationLevel,
} from "./AiRecommendationLevel";

import type {
    ReviewStatus,
} from "./ReviewStatus";

export type EvaluationHistoryApiResponse = {
    id: number;
    grantCaseId: number;
    aiSuitability: AiSuitability;
    aiRecommendationLevel: AiRecommendationLevel;
    aiReason: string;
    aiEvidence: string;
    additionalChecks: string | null;
    organizationSnapshot: string | null;
    charterSnapshot: string | null;
    activitySnapshot: string | null;
    grantSnapshot: string | null;
    aiRawResponse: string | null;
    evaluatedAt: string | null;
    reviewStatus: ReviewStatus;
    reviewMemo: string | null;
    reviewedAt: string | null;
};