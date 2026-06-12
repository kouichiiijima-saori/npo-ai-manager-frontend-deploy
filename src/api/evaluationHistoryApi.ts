import { api } from "./axios";

export const getEvaluationHistories = async () => {
    const { data } = await api.get(
        "/evaluation-histories"
    );

    return data;
};

export const getEvaluationHistory = async (
    id: number
) => {
    const { data } = await api.get(
        `/evaluation-histories/${id}`
    );

    return data;
};

export const updateEvaluationHistoryReviewStatus = async (
    id: number,
    reviewStatus: string,
    reviewMemo?: string
) => {
    const { data } = await api.put(
        `/evaluation-histories/${id}/review-status`,
        {
            reviewStatus,
            reviewMemo,
        }
    );

    return data;
};