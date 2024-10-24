import { builder } from "../builder";

builder.prismaObject("Rule", {
        fields: (t) => ({
                id: t.exposeID("id"),
                missionId: t.exposeInt("missionId"),
                condition: t.exposeString("condition"),
                action: t.exposeString("action"),
                priority: t.exposeInt("priority"),
                isActive: t.exposeInt("isActive"),
                createdAt: t.field({ type: "Date" }),
                mission: t.relation("mission"),
                alerts: t.relation("alerts", {
                        type: "Alert",
                        list: true,
                }),
        }),
});
