'use client'

import {formatDate} from "@/lib/utils";

export default function ListAlerts({ alerts }) {
    return (
        <div className="space-y-3 items-center">
            <h1 className="text-2xl font-bold">Alerts</h1>
            <div className="grid grid-cols-1 gap-4">
                {alerts && alerts.map((alert) => (
                    <div key={alert.id} className="bg-white shadow-md rounded-md p-4">
                        <h2 className="text-xl font-bold">{alert.message}</h2>
                        <p>{alert.type}</p>
                        <p className="text-sm text-gray-500">Created at: {formatDate(alert.createdAt)}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
