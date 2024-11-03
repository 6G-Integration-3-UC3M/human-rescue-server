'use client';

import { formatDate } from "@/lib/utils";

export default function ListAlerts({ alerts }) {
    return (
        <div className="space-y-3 items-center my-4">
            <h1 className="text-2xl font-bold">Alerts</h1>
            <div className="grid grid-cols-1 gap-4">
                {alerts && alerts.map((alert) => {
                    let detectedObject = 'Unknown';
                    let confidenceValue = 'N/A';
                    let confidenceOperator = '';

                    // Extract the JSON part from the alert message
                    const regex = /Rule triggered: (.*)/; // Regular expression to match the JSON part
                    const match = alert.message.match(regex);

                    if (match && match[1]) {
                        try {
                            const details = JSON.parse(match[1]);

                            // Extract detectedObject and confidence
                            detectedObject = details.detectedObject || 'Unknown';
                            confidenceValue = details.confidence?.value || 'N/A';
                            confidenceOperator = details.confidence?.operator || '';
                        } catch (error) {
                            console.error("Error parsing alert details:", error);
                        }
                    }

                    return (
                        <div key={alert.id} className="bg-white shadow-md rounded-md p-4">
                            <h2 className="text-xl font-bold">{alert.type}</h2>
                            <p>Detected Object: {detectedObject}</p>
                            <p>Confidence: {confidenceValue} {confidenceOperator}</p>
                            <p className="text-sm text-gray-500">{formatDate(alert.createdAt)}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
