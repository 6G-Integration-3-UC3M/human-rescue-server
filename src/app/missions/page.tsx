'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

import MainLayout from "@/components/layouts/mainLayout";

import ListDrones from "@/components/drone/list";
import ListAlerts from "@/components/alert/list";
import ListRules from "@/components/rule/list";

import { findDronesForMission } from "@/actions/drone";
import { findAlertsForMission } from "@/actions/alert";
import { findRulesForMission } from "@/actions/rule";

export default function Mission() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const [drones, setDrones] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [rules, setRules] = useState([]);

    useEffect(() => {
        if (status === 'authenticated') {
            const id = searchParams.get('id');

            if (!id || isNaN(parseInt(id))) {
                return;
            }

            const fetchData = async () => {
                const dronesRes = await findDronesForMission(id);
                setDrones(dronesRes);

                const alertsRes = await findAlertsForMission(id);
                setAlerts(alertsRes);

                const rulesRes = await findRulesForMission(id);
                setRules(rulesRes);
            };

            fetchData();

            // Set up an interval to refresh alerts every 5 seconds
            const interval = setInterval(() => {
                findAlertsForMission(id).then((res) => {
                    setAlerts(res);
                });
            }, 5000);

            // Cleanup interval on component unmount
            return () => clearInterval(interval);
        }
    }, [status]);

    // Function to refresh alerts manually
    const refreshAlerts = () => {
        const id = searchParams.get('id');
        if (id && !isNaN(parseInt(id))) {
            findAlertsForMission(id).then((res) => {
                setAlerts(res);
            });
        }
    };

    return (
        <MainLayout>
            <div className="flex flex-col">
                <div className="mb-4">
                    <ListDrones drones={drones} />
                    <div className="relative">
                        <ListAlerts alerts={alerts} />
                        <button
                            onClick={refreshAlerts}
                            className="absolute top-2 right-2 p-2 text-5xl rounded transition duration-300 hover:bg-blue-600"
                        >
                            ⟳
                        </button>
                    </div>
                    <div className="my-4"></div>
                    <ListRules rules={rules} />
                </div>
            </div>
        </MainLayout>
    );
}
