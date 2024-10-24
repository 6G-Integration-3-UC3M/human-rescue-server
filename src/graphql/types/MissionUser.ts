import { builder } from "../builder";

builder.prismaObject("MissionUser", {
        fields: (t) => ({
                missionId: t.exposeInt("missionId"),
                userId: t.exposeInt("userId"),
                role: t.exposeString("role"),
                createdAt: t.field({ type: "Date" }),
                mission: t.relation("mission"),
                user: t.relation("user"),
        }),
});
