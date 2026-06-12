import { api } from "./axios";

export const getActivityRecords = async () => {
    const { data } = await api.get(
        "/activity-records"
    );

    return data;
};

export const createActivityRecord = async (
    requestBody: any
) => {
    const { data } = await api.post(
        "/activity-records",
        requestBody
    );

    return data;
};

export const updateActivityRecord = async (
    id: number,
    requestBody: any
) => {
    const { data } = await api.put(
        `/activity-records/${id}`,
        requestBody
    );

    return data;
};

export const deleteActivityRecord = async (
    id: number
) => {
    await api.delete(
        `/activity-records/${id}`
    );
};