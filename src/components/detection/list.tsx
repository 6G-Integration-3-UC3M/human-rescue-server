'use client';

import { useState } from 'react';
import { formatDate } from "@/lib/utils";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function List({ detections }) {
    const [selectedDetection, setSelectedDetection] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = (detection) => {
        setSelectedDetection(detection);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setSelectedDetection({});
    };

    return (
        <div className="space-y-3 items-center">
            <h1 className="text-2xl font-bold">Detections</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detections && detections.map((detection) => (
                    <div
                        key={detection.id}
                        className="bg-white shadow-md rounded-md p-4 flex items-start overflow-hidden h-32 cursor-pointer" // Added cursor pointer
                        onClick={
                        () => openDialog(detection)}
                    >
                        <div className="flex-grow">
                            <h2 className="text-xl font-bold">{detection.detectedObject}</h2>
                            <p>Confidence: {detection.confidence.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{detection.description}</p>
                            <p className="text-sm text-gray-500">Created at: {formatDate(detection.timestamp)}</p>
                        </div>
                        {/* Image display */}
                        {detection.imageUrl && (
                            <img
                                src={`/api/image/get?id=${detection.id}`}
                                alt={detection.detectedObject}
                                className="ml-4 h-full object-cover rounded-md"
                                style={{ maxHeight: '100%' }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Dialog for displaying the image */}
            <Dialog open={isOpen} onOpenChange={closeDialog}>
                <DialogTrigger asChild>
                    <div />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>{selectedDetection.detectedObject}</DialogTitle>
                        <DialogDescription>
                            <p className="text-sm text-gray-500">{selectedDetection.description}</p>
                        </DialogDescription>
                    </DialogHeader>
                    <img
                        src={`/api/image/get?id=${selectedDetection.id}`}
                        alt="Detection"
                        className="w-full h-full object-cover rounded-md"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
