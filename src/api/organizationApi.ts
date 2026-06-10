import { api } from "./axios";
import type { OrganizationProfile } from "../types/OrganizationProfile";

export const getOrganizationProfile = async () => {
    const { data } = await api.get<OrganizationProfile>(
        "/organization-profile"
    );

    return data;
};

export const updateOrganizationProfile = async (
    requestBody: OrganizationProfile
) => {
    await api.put(
        "/organization-profile",
        requestBody
    );
};
