import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
    {
        name: "Carlo Tablante",
        email: "carlotabianca266@gmail.com",
        emailVerifiedAt: new Date(1720950786715),
        password:
            "$2a$10$molnOKUwqzMC04bOwxrFOODUHFVOGYvffd9KH3Vu2i3ls4WVXAOiC",
    },
];

const droneData: Prisma.DroneCreateInput[] = [
    {
        ip: "12.12.12.13",
        secret: "LKDJFSLDF",
        name: "Comeback Kid",
        status: "ACTIVE",
        batteryLevel: 85,
        users: {
            create: [
                {
                    user: {
                        connect: {
                            email: "carlotabianca266@gmail.com",
                        },
                    },
                    role: "OWNER",
                },
            ],
        },
    },
    {
        ip: "12.12.12.14",
        secret: "MNBVCXZQWERTYUIOP",
        name: "Sky Watcher",
        status: "INACTIVE",
        batteryLevel: 50,
        users: {
            create: [
                {
                    user: {
                        connect: {
                            email: "carlotabianca266@gmail.com",
                        },
                    },
                    role: "OWNER",
                },
            ],
        },
    },
];

const missionData: Prisma.MissionCreateInput[] = [
    {
        name: "Recon Mission Alpha",
        description: "First reconnaissance mission",
        startTime: new Date(),
        status: "ONGOING",
        drones: {
            create: [{ drone: { connect: { ip: "12.12.12.13" } } }],
        },
        users: {
            create: [
                {
                    user: { connect: { email: "carlotabianca266@gmail.com" } },
                    role: "OWNER",
                },
            ],
        },
    },
    {
        name: "Surveillance Mission Beta",
        description: "Surveillance mission",
        startTime: new Date("2024-08-01T00:00:00.000Z"),
        status: "PLANNED",
        drones: {
            create: [{ drone: { connect: { ip: "12.12.12.14" } } }],
        },
        users: {
            create: [
                {
                    user: { connect: { email: "carlotabianca266@gmail.com" } },
                    role: "OBSERVER",
                },
            ],
        },
    },
];

const alertData: Prisma.AlertCreateInput[] = [
    {
        type: "Battery Low",
        message: "Drone battery is below 20%",
        severity: "high",
        drone: { connect: { ip: "12.12.12.13" } },
        mission: { connect: { name: "Recon Mission Alpha" } },
    },
    {
        type: "Human Detection",
        message: "Person detected with 95% confidence",
        severity: "medium",
        drone: { connect: { ip: "12.12.12.13" } },
        mission: { connect: { name: "Recon Mission Alpha" } },
    },
];

const ruleData: Prisma.RuleCreateInput[] = [
    {
        mission: { connect: { name: "Recon Mission Alpha" } },
        condition: '{"detectedObject": "person", "confidence": { "operator": ">=", "value": 0.8 }}',
        action: "create alert",
        priority: 5,
    },
    {
        mission: { connect: { name: "Surveillance Mission Beta" } },
        condition: '{"detectedObject": "person", "confidence": { "operator": ">=", "value": 0.8 }}',
        action: "send notification",
        priority: 8,
    },
];

const detectionData: Prisma.DetectionCreateInput[] = [
    {
        drone: { connect: { ip: "12.12.12.13" } },
        mission: { connect: { name: "Recon Mission Alpha" } },
        detectedObject: "Person",
        confidence: 0.95,
        imageUrl: "http://example.com/image1.jpg",
    },
    {
        drone: { connect: { ip: "12.12.12.14" } },
        mission: { connect: { name: "Recon Mission Alpha" } },
        detectedObject: "Car",
        confidence: 0.8,
        imageUrl: "http://example.com/image2.jpg",
    },
];

export async function main() {
    try {
        console.log(`Start seeding ...`);

        for (const u of userData) {
            const user = await prisma.user.create({
                data: u,
            });
            console.log(`Created user with id: ${user.id}`);
        }

        for (const d of droneData) {
            const drone = await prisma.drone.create({
                data: d,
            });
            console.log(`Created drone with id: ${drone.id}`);
        }
        for (const m of missionData) {
            const mission = await prisma.mission.create({
                data: m,
            });
            console.log(`Created mission with id: ${mission.id}`);
        }

        for (const a of alertData) {
            const alert = await prisma.alert.create({
                data: a,
            });
            console.log(`Created alert with id: ${alert.id}`);
        }

        for (const r of ruleData) {
            const rule = await prisma.rule.create({
                data: r,
            });
            console.log(`Created rule with id: ${rule.id}`);
        }

        for (const det of detectionData) {
            const detection = await prisma.detection.create({
                data: det,
            });
            console.log(`Created detection with id: ${detection.id}`);
        }

        console.log(`Seeding finished.`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
