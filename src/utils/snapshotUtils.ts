export const getGrantMasterIdFromSnapshot = (
    grantSnapshot: string | null | undefined
): number | null => {
    if (!grantSnapshot) {
        return null;
    }

    try {
        const parsed = JSON.parse(grantSnapshot);
        const grantMasterId = Number(parsed.grantMasterId);

        return Number.isNaN(grantMasterId)
            ? null
            : grantMasterId;
    } catch {
        return null;
    }
};