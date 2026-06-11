import { useEffect, useState } from "react";

import {
    getOrganizationProfile,
    updateOrganizationProfile,
} from "../api/organizationApi";

import type {
    OrganizationProfile,
} from "../types/OrganizationProfile";

export const useOrganizationProfile = () => {
    const [profile, setProfile] = useState<OrganizationProfile | null>(null);
    const [draft, setDraft] = useState<OrganizationProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchOrganizationProfile = async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const data = await getOrganizationProfile();

            setProfile(data);
            setDraft(data);
        } catch {
            setErrorMessage(
                "団体基本情報の取得に失敗しました。Spring Bootが起動しているか確認してください。"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const saveOrganizationProfile = async (
        nextProfile: OrganizationProfile
    ) => {
        try {
            setIsSaving(true);
            setErrorMessage(null);

            await updateOrganizationProfile(nextProfile);

            setProfile(nextProfile);
            setDraft(nextProfile);

            return true;
        } catch {
            setErrorMessage(
                "団体基本情報の保存に失敗しました。Spring Bootが起動しているか確認してください。"
            );

            return false;
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchOrganizationProfile();
    }, []);

    return {
        profile,
        draft,
        setDraft,
        isLoading,
        isSaving,
        errorMessage,
        setErrorMessage,
        fetchOrganizationProfile,
        saveOrganizationProfile,
    };
};