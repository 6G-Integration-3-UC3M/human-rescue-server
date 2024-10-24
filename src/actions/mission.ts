"use server";

import prisma from "@/lib/prisma";

export const findMissionsForUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      missions: {
        include: {
          mission: true, // Include the actual mission data through MissionUser relation
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Extract the missions from the `MissionUser` relation
  const missions = user.missions.map((missionUser) => missionUser.mission);

  return missions;
};

export const findMissionsForDrone = async (droneId) => {
    if (!droneId || isNaN(parseInt(droneId))) {
        throw new Error("Invalid drone ID");
    }

    const drones = await prisma.missionDrone.findMany({
        where: {
            droneId: parseInt(droneId), // Ensure missionId is an integer
        },
        include: {
            mission: true, // Include related drone data
        },
    });

    return drones.map((missionDrone) => missionDrone.mission);
}

export const findMissionById = async (id: string) => {
    const mission = await prisma.mission.findUnique({
        where: {
            id: Number(id),
        },
    });

    // TODO check the user is the owner

    if (!mission) {
        throw new Error("Mission not found");
    }

    return mission;
};
