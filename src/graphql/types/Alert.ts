import { builder } from "../builder";

builder.prismaObject("Alert", {
        fields: (t) => ({
                id: t.exposeID("id"),
                droneId: t.exposeInt("droneId", { nullable: true }),
                missionId: t.exposeInt("missionId", { nullable: true }),
                detectionId: t.exposeInt("detectionId", { nullable: true }),
                ruleId: t.exposeInt("ruleId", { nullable: true }),
                type: t.exposeString("type"),
                message: t.exposeString("message"),
                extra: t.exposeString("extra", { nullable: true }),
                severity: t.exposeString("severity"),
                isAcknowledged: t.exposeInt("isAcknowledged"),
                createdAt: t.field({ type: "Date" }),
                drone: t.relation("drone", { nullable: true }),
                mission: t.relation("mission", { nullable: true }),
                detection: t.relation("detection", { nullable: true }),
                rule: t.relation("rule", { nullable: true }),
        }),
});
