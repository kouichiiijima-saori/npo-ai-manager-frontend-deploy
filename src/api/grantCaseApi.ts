import { api } from "./axios";

export const getGrantCases = async () => {
    const { data } = await api.get(
        "/api/grant-cases"
    );

    return data;
};

export const getGrantCase = async (
    id: number
) => {
    const { data } = await api.get(
        `/api/grant-cases/${id}`
    );

    return data;
};

export const updateGrantCase = async (
    id: number,
    requestBody: any
) => {
    const { data } = await api.put(
        `/api/grant-cases/${id}`,
        requestBody
    );

    return data;
};

export const archiveGrantCase = async (
    id: number
) => {
    const { data } = await api.patch(
        `/api/grant-cases/${id}/archive`
    );

    return data;
};

export const archiveGrantCaseWithReason = async (
    id: number,
    requestBody: any
) => {
    const { data } = await api.patch(
        `/api/grant-cases/${id}/archive`,
        requestBody
    );

    return data;
};

export const completeAndArchiveGrantCase = async (
    id: number,
    requestBody: any
) => {
    const { data } = await api.patch(
        `/api/grant-cases/${id}/complete`,
        requestBody
    );

    return data;
};

export const getGrantRequirementChecks = async (
    grantCaseId: number
) => {
    const { data } = await api.get(
        `/api/grant-cases/${grantCaseId}/requirement-checks`
    );

    return data;
};

export const updateGrantRequirementCheck = async (
    id: number,
    requestBody: any
) => {
    const { data } = await api.put(
        `/api/grant-requirement-checks/${id}`,
        requestBody
    );

    return data;
};