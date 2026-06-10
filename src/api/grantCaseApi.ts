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
    await api.put(
        `/api/grant-cases/${id}`,
        requestBody
    );
};

export const archiveGrantCase = async (
    id: number
) => {
    await api.patch(
        `/api/grant-cases/${id}/archive`
    );
};

export const archiveGrantCaseWithReason = async (
    id: number,
    requestBody: any
) => {
    await api.patch(
        `/api/grant-cases/${id}/archive`,
        requestBody
    );
};

export const completeAndArchiveGrantCase = async (
    id: number
) => {
    await api.patch(
        `/api/grant-cases/${id}/complete-and-archive`
    );
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
    await api.put(
        `/api/grant-requirement-checks/${id}`,
        requestBody
    );
};