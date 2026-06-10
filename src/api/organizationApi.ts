import { api } from "./axios";

export const getOrganizationProfile = async () => {
    const { data } = await api.get(
        "/api/organization-profile"
    );

    return data;
};

export const updateOrganizationProfile = async (
    requestBody: any
) => {
    await api.put(
        "/api/organization-profile",
        requestBody
    );
};