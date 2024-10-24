"use server";

import prisma from "@/lib/prisma";

export const findAlertsForMission = async (missionId) => {
    if (!missionId || isNaN(parseInt(missionId))) {
        throw new Error("Invalid mission ID");
    }

    return await prisma.alert.findMany({
        where: {
            missionId: parseInt(missionId),
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
