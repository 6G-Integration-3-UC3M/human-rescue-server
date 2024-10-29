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
        secret: "DONT_SHARE_THIS_SECRET",
        name: "Sky Watcher",
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
        name: "Sky Watcher 2",
        status: "ACTIVE",
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

const missionData: Prisma.MissionCreateInput[] =[
    {
        name: "Apollo Mission 1",
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
    }
];

const alertData: Prisma.AlertCreateInput[] = [
];

const ruleData: Prisma.RuleCreateInput[] = [
    {
        mission: { connect: { name: "Apollo Mission 1" } },
        condition: '{"detectedObject": "person", "confidence": { "operator": ">=", "value": 0.5 }}',
        action: "create alert",
        priority: 5,
    },
];

const detectionData: Prisma.DetectionCreateInput[] = [
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
