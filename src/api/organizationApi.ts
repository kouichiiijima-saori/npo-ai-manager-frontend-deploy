import { api } from "./axios";

export const getOrganizationProfile = async () => {
    const { data } = await api.get(
        "/organization-profile"
    );

    return data;
};

export const updateOrganizationProfile = async (
    requestBody: any
) => {
    await api.put(
        "/organization-profile",
        requestBody
    );
};
