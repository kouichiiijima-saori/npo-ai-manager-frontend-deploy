import { api } from "./axios";

export const getEvaluationHistories = async () => {
    const { data } = await api.get(
        "/api/evaluation-histories"
    );

    return data;
};

export const getEvaluationHistory = async (
    id: number
) => {
    const { data } = await api.get(
        `/api/evaluation-histories/${id}`
    );

    return data;
};

export const saveEvaluationHistory = async (
    id: number
) => {
    await api.put(
        `/api/evaluation-histories/${id}/save`
    );
};

export const declineEvaluationHistory = async (
    id: number
) => {
    await api.put(
        `/api/evaluation-histories/${id}/decline`
    );
};

export const proceedEvaluationHistory = async (
    id: number
) => {
    await api.post(
        `/api/evaluation-histories/${id}/proceed`
    );
};