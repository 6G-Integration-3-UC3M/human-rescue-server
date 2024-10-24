'use server';

import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id'); // Get the detection ID from the query params

        // TODO need to check auth

        // Fetch the detection details from the database
        const detection = await prisma.detection.findUnique({
            where: {
                id: parseInt(id), // Assuming id is an integer
            },
            select: {
                imageUrl: true,
            },
        });

        // TODO Check if the detection exists and belongs to the authenticated user

        // Serve the image file
        const imagePath = path.join(process.cwd(), 'prisma', 'uploads', detection.imageUrl.split('/').pop());
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            return new Response(imageBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'image/jpeg', // Adjust based on your image format
                    'Content-Length': imageBuffer.length,
                },
            });
        } else {
            return new Response(JSON.stringify({ message: 'Image not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error('Error loading image:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
