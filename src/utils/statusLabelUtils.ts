export const getExaminationStatusLabel = (
    status: string
): string => {
    switch (status) {
        case "UNCONFIRMED":
            return "未確認";

        case "UNDER_REVIEW":
            return "確認中";

        case "SKIPPED":
            return "見送り";

        default:
            return status;
    }
};

export const getExternalAuditStatusLabel = (
    status: string
): string => {
    switch (status) {
        case "NO_RESPONSE":
            return "未回答";

        case "UNDER_AUDIT":
            return "審査中";

        case "ADOPTED":
            return "採択";

        case "REJECTED":
            return "不採択";

        default:
            return status;
    }
};

export const getCheckStatusLabel = (
    status: string
): string => {
    switch (status) {
        case "UNCHECKED":
            return "未確認";

        case "CHECKING":
            return "確認中";

        case "COMPLETED":
            return "確認済";

        default:
            return status;
    }
};