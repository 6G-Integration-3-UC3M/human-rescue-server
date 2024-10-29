'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';

const ruleRequestSchema = z.object({
    ip: z.string().min(1),
    secret: z.string().min(1),
    missionName: z.string().min(1),
});

export async function GET(req) {
    try {
        // Parse query parameters
        const url = new URL(req.url);
        const droneIp = url.searchParams.get('ip');
        const secret = url.searchParams.get('secret');
        const missionName = url.searchParams.get('missionName');

        // Validate input
        const validationResult = ruleRequestSchema.safeParse({
            ip: droneIp,
            secret,
            missionName,
        });

        if (!validationResult.success) {
            return new Response(
                JSON.stringify({ message: 'Validation error', errors: validationResult.error.errors }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Fetch the drone and verify the secret
        const drone = await prisma.drone.findUnique({
            where: { ip: droneIp },
            select: {
                id: true,
                secret: true,
            },
        });

        if (!drone || drone.secret !== secret) {
            return new Response(
                JSON.stringify({ message: 'Invalid drone IP or secret' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Fetch the mission rules directly via Mission model
        const mission = await prisma.mission.findFirst({
            where: {
                name: missionName,
                drones: {
                    some: { droneId: drone.id },  // Check if the drone is part of this mission
                },
            },
            select: {
                rules: true,
            },
        });

        // Check if the mission was found and retrieve rules
        if (!mission) {
            return new Response(
                JSON.stringify({ message: 'Mission not found or drone not assigned to the mission' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Return the rules for the mission
        return new Response(JSON.stringify(mission.rules), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching rules:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
``
