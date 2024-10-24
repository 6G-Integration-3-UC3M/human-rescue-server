import { builder } from "../builder";

builder.prismaObject("MissionDrone", {
        fields: (t) => ({
                missionId: t.exposeInt("missionId"),
                droneId: t.exposeInt("droneId"),
                createdAt: t.field({ type: "Date" }),
                mission: t.relation("mission"),
                drone: t.relation("drone"),
        }),
});
