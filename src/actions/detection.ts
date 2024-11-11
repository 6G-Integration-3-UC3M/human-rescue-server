"use server";

import prisma from "@/lib/prisma";

export const findDetectionsForDrone = async (droneId) => {
    if (!droneId || isNaN(parseInt(droneId))) {
        throw new Error("Invalid detection ID");
    }

    return await prisma.detection.findMany({
        where: {
            droneId: parseInt(droneId),
        },
        orderBy: {
            timestamp: "desc", // Sorting by the most recent `createdAt` first
        },
    });
}
