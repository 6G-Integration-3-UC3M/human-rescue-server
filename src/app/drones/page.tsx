'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

import MainLayout from "@/components/layouts/mainLayout";

import ListMissions from "@/components/mission/list";
import ListDetections from "@/components/detection/list";
import Stream from "@/components/video/stream";

import { findMissionsForDrone } from "@/actions/mission";
import { findDetectionsForDrone } from "@/actions/detection";


export default function Mission() {
    const { data: session, status } = useSession()
    const searchParams = useSearchParams();
    const [missions, setMissions] = useState([]);
    const [detections, setDetections] = useState([]);

    useEffect(() => {
        if (status === 'authenticated') {
            const id = searchParams.get('id');

            if (!id || isNaN(parseInt(id))) {
                return;
            }

            findMissionsForDrone(id) .then((res) => {
                setMissions(res);
            });

            findDetectionsForDrone(id) .then((res) => {
                setDetections(res);
            });

        }
    }, [status]);

    return (
        <MainLayout>
        <div className="flex flex-col">
            <div className="mb-4">
                <ListMissions missions={missions}/>
                <ListDetections detections={detections}/>
            </div>
            <div className="mb-4">
                <Stream />
            </div>
        </div>
        </MainLayout>
    );
}
