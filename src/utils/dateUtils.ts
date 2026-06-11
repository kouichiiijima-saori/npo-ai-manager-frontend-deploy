export const formatDate = (
    value: string | null | undefined
): string => {
    if (!value) {
        return "未設定";
    }

    return value.slice(0, 10);
};

export const formatDateTime = (
    value: string | null | undefined
): string => {
    if (!value) {
        return "未設定";
    }

    return value.replace("T", " ").slice(0, 16);
};

export const getFiscalYearLabel = (
    value: string | null | undefined
): string => {
    if (!value) {
        return "年度不明";
    }

    return `${value.slice(0, 4)}年度`;
};