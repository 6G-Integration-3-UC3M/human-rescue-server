'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { logout } from "@/actions/auth";
import Link from "next/link";

import MainLayout from "@/components/layouts/mainLayout";

import { findDronesForUser } from "@/actions/drone";
import { findMissionsForUser } from "@/actions/mission";

import ListDrones from "@/components/drone/list";
import ListMissions from "@/components/mission/list";

export default function Dashboard() {
    const { data: session, status } = useSession()
    const [drones, setDrones] = useState([]);
    const [missions, setMissions] = useState([]);

    useEffect(() => {
        if (status === 'authenticated') {
            const email = session?.user?.email;
            findDronesForUser(email).then((res) => {
                setDrones(res);
            });

            findMissionsForUser(email).then((res) => {
                setMissions(res);
            });
        }
    }, [status]);

    return (
        <MainLayout>
            <div className="mb-4">
                <ListDrones drones={drones}/>
                <div className="my-4"></div>
                <ListMissions missions={missions}/>
            </div>
        </MainLayout>
    );
}
