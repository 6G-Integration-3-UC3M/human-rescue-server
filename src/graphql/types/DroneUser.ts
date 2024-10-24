import { builder } from "../builder";

builder.prismaObject("DroneUser", {
        fields: (t) => ({
                droneId: t.exposeInt("droneId"),
                userId: t.exposeInt("userId"),
                role: t.exposeString("role"),
                createdAt: t.field({ type: "Date" }),
                drone: t.relation("drone"),
                user: t.relation("user"),
        }),
});
