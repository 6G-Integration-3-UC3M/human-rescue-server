import { builder } from "../builder";

builder.prismaObject("Mission", {
        fields: (t) => ({
                id: t.exposeID("id"),
                name: t.exposeString("name"),
                description: t.exposeString("description", { nullable: true }),
                startTime: t.field({ type: "DateTime" }),
                endTime: t.field({ type: "DateTime", nullable: true }),
                status: t.exposeString("status"),
                createdAt: t.field({ type: "Date" }),
                drones: t.relation("drones", {
                        type: "MissionDrone",
                        list: true,
                }),
                users: t.relation("users", {
                        type: "MissionUser",
                        list: true,
                }),
                alerts: t.relation("alerts", {
                        type: "Alert",
                        list: true,
                }),
                rules: t.relation("rules", {
                        type: "Rule",
                        list: true,
                }),
                detections: t.relation("detections", {
                        type: "Detection",
                        list: true,
                }),
        }),
});
