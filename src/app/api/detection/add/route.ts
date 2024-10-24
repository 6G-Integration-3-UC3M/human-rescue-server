'use server';

import prisma from '@/lib/prisma';

import { checkRulesForMission } from '@/actions/rule';

import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const detectionSchema = z.object({
    droneId: z.number().int().positive(),
    secret: z.string().min(1),
    missionId: z.number().int().positive(),
    detectedObject: z.string().min(1),
    confidence: z.number().min(0).max(1),
});

export async function POST(req) {
    try {
        // Parse form data
        const formData = await req.formData();

        // Get fields from form data
        const droneId = parseInt(formData.get('droneId'));
        const secret = formData.get('secret');
        const missionId = parseInt(formData.get('missionId'));
        const detectedObject = formData.get('detectedObject');
        const confidence = parseFloat(formData.get('confidence'));
        const imageFile = formData.get('image');

        // Validate input
        const validationResult = detectionSchema.safeParse({
            droneId,
            secret,
            missionId,
            detectedObject,
            confidence,
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

        const droneSecret = await prisma.drone.findUnique({
            where: {
                id: parseInt(droneId),
            },
            select: {
                secret: true,
            },
        });

        if (!droneSecret || droneSecret.secret !== secret) {
            return new Response(JSON.stringify({ message: 'Invalid drone secret' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // TODO: Check if droneId and missionId exist and if user has persmission

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

        const detection = await prisma.detection.create({
            data: {
                droneId,
                missionId,
                detectedObject,
                confidence,
                imageUrl,
            },
        });

        // check detections to create a new alert
        checkRulesForMission(missionId, detection);

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
