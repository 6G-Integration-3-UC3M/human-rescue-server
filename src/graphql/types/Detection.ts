import { builder } from "../builder";

builder.prismaObject("Detection", {
        fields: (t) => ({
                id: t.exposeID("id"),
                droneId: t.exposeInt("droneId"),
                missionId: t.exposeInt("missionId"),
                detectedObject: t.exposeString("detectedObject"),
                confidence: t.exposeFloat("confidence"),
                imageUrl: t.exposeString("imageUrl", { nullable: true }),
                timestamp: t.field({ type: "DateTime" }),
                drone: t.relation("drone"),
                mission: t.relation("mission"),
                alerts: t.relation("alerts", {
                        type: "Alert",
                        list: true,
                }),
        }),
});
