import { api } from "./axios";

export const runAiEvaluation = async (
    requestBody: any
) => {

    const { data } = await api.post(
        "/api/ai-evaluations",
        requestBody
    );

    return data;
};
