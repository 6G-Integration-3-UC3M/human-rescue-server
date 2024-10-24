import { builder } from "../builder";

builder.prismaObject("Drone", {
        fields: (t) => ({
                id: t.exposeID("id"),
                ip: t.exposeString("ip"),
                secret: t.exposeString("secret"),
                name: t.exposeString("name"),
                status: t.exposeString("status"),
                location: t.exposeString("location"),
                batteryLevel: t.exposeInt("batteryLevel"),
                createdAt: t.field({ type: "Date" }),
                lastSeenAt: t.field({ type: "Date" }),
                users: t.relation("users", {
                        type: "DroneUser", // Adjust based on your actual type
                        list: true, // Assuming it's a list of relations
                }),
                missions: t.relation("missions", {
                        type: "MissionDrone", // Adjust based on your actual type
                        list: true,
                }),
                alerts: t.relation("alerts", {
                        type: "Alert", // Adjust based on your actual type
                        list: true,
                }),
                detections: t.relation("detections", {
                        type: "Detection", // Adjust based on your actual type
                        list: true,
                }),
        }),
});

builder.queryField("drone", (t) =>
        t.prismaField({
                type: "Drone",
                nullable: true,
                args: {
                        id: t.arg.id({ required: true }),
                },
                resolve: (query, _parent, args, _info) =>
                        prisma.drone.findUnique({
                                ...query,
                                where: {
                                        id: Number(args.id),
                                },
                        }),
        }),
);
