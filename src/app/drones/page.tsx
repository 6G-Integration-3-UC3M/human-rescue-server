'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation';

import MainLayout from "@/components/layouts/mainLayout";

import ListMissions from "@/components/mission/list";
import ListDetections from "@/components/detection/list";
import Stream from "@/components/video/stream";

import { findMissionsForDrone } from "@/actions/mission";
import { findDetectionsForDrone } from "@/actions/detection";

export default function Drone() { // Changed component name for clarity
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const [missions, setMissions] = useState([]);
    const [detections, setDetections] = useState([]);

    useEffect(() => {
        if (status === 'authenticated') {
            const id = searchParams.get('id');

            if (!id || isNaN(parseInt(id))) {
                return;
            }

            const fetchData = async () => {
                const missionsRes = await findMissionsForDrone(id);
                setMissions(missionsRes);

                const detectionsRes = await findDetectionsForDrone(id);
                setDetections(detectionsRes);
            };

            fetchData();

            // Optional: Set up an interval to refresh detections
            const interval = setInterval(() => {
                findDetectionsForDrone(id).then((res) => {
                    setDetections(res);
                });
            }, 5000);

            // Cleanup interval on component unmount
            return () => clearInterval(interval);
        }
    }, [status]);

    // Function to refresh detections manually
    const refreshDetections = () => {
        const id = searchParams.get('id');
        if (id && !isNaN(parseInt(id))) {
            findDetectionsForDrone(id).then((res) => {
                setDetections(res);
            });
        }
    };

    return (
        <MainLayout>
            <div className="flex flex-col">
                <div className="mb-4">
                    <ListMissions missions={missions} />
                    <div className="my-4"></div>
                    <div className="relative">
                        <ListDetections detections={detections} />
                        <button
                            onClick={refreshDetections}
                            className="absolute top-2 right-2 p-2 text-5xl rounded transition duration-300 hover:bg-blue-600"
                        >
                            ⟳
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <Stream />
                </div>
            </div>
        </MainLayout>
    );
}
