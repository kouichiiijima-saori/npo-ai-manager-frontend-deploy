import { api } from "./axios";

export const getGrantMasters = async () => {
    const { data } = await api.get(
        "/api/grant-masters"
    );

    return data;
};

export const getGrantMaster = async (
    id: number
) => {
    const { data } = await api.get(
        `/api/grant-masters/${id}`
    );

    return data;
};

export const createGrantMaster = async (
    requestBody: any
) => {
    const { data } = await api.post(
        "/api/grant-masters",
        requestBody
    );

    return data;
};

export const updateGrantMaster = async (
    id: number,
    requestBody: any
) => {
    const { data } = await api.put(
        `/api/grant-masters/${id}`,
        requestBody
    );

    return data;
};