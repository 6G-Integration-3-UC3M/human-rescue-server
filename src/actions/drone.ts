"use server";

import prisma from "@/lib/prisma";

export const findDronesForUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      drones: {
        include: {
          drone: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Extract the drones from the `DroneUser` relation
  const drones = user.drones.map((droneUser) => droneUser.drone);

  return drones;
};

export const findDronesForMission = async (missionId) => {
    if (!missionId || isNaN(parseInt(missionId))) {
        throw new Error("Invalid mission ID");
    }

    const missions = await prisma.missionDrone.findMany({
        where: {
            missionId: parseInt(missionId), // Ensure missionId is an integer
        },
        include: {
            drone: true, // Include related drone data
        },
    });

    return missions.map((missionDrone) => missionDrone.drone);

}
