'use server';

import prisma from '@/lib/prisma';
import { checkRulesForMission } from '@/actions/rule';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const detectionSchema = z.object({
    droneIp: z.string().min(1),
    secret: z.string().min(1),
    missionName: z.string().min(1),
    detectedObject: z.string().min(1),
    confidence: z.number().min(0).max(1),
    timestamp: z.string().optional(), // Adjust if you have a specific format
    description: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        // Parse form data
        const formData = await req.formData();

        // Get fields from form data
        const droneIp = formData.get('droneIp');
        const secret = formData.get('secret');
        const missionName = formData.get('missionName');
        const detectedObject = formData.get('detectedObject');
        const confidence = parseFloat(formData.get('confidence'));
        const imageFile = formData.get('image');
        const description = formData.get('description');

        // Validate input
        const validationResult = detectionSchema.safeParse({
            droneIp,
            secret,
            missionName,
            detectedObject,
            confidence,
            description,
            timestamp: new Date().toISOString(), // Add current timestamp
        });

        if (!validationResult.success) {
            return new Response(
                JSON.stringify({ message: 'Validation error', errors: validationResult.error.errors }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Check if the drone exists by IP and retrieve its ID and secret
        const drone = await prisma.drone.findUnique({
            where: {
                ip: droneIp,
            },
            select: {
                id: true,
                secret: true,
            },
        });

        if (!drone) {
            return new Response(JSON.stringify({ message: 'Drone not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Validate the drone secret
        if (drone.secret !== secret) {
            return new Response(JSON.stringify({ message: 'Invalid drone secret' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Check if the mission exists and retrieve its ID
        const mission = await prisma.mission.findUnique({
            where: {
                name: missionName,
                drones: {
                    some: { droneId: drone.id },
                },
            },
            select: {
                id: true,
                name: true,
            },
        });

        if (!mission) {
            return new Response(JSON.stringify({ message: 'Mission not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Save the image locally
        const uploadsDir = path.join(process.cwd(), 'prisma', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }

        const imageName = `${Date.now()}_${imageFile.name}`;
        const imagePath = path.join(uploadsDir, imageName);

        // Read the file and save it to the local filesystem
        const buffer = await imageFile.arrayBuffer();
        fs.writeFileSync(imagePath, Buffer.from(buffer));

        // Construct the image URL
        const imageUrl = `http://localhost:3000/uploads/${imageName}`;

        // Create detection record in the database
        const detection = await prisma.detection.create({
            data: {
                droneId: drone.id,
                missionId: mission.id,
                detectedObject: detectedObject,
                confidence: confidence,
                imageUrl: imageUrl,
                description: description,
                timestamp: new Date().toISOString(), // Add current timestamp if required
            },
        });

        // Check detections to create a new alert
        checkRulesForMission(mission.id, detection);

        return new Response(JSON.stringify(detection), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error adding detection:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
