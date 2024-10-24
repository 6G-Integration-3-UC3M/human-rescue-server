'use client'

import { useRouter } from 'next/navigation';

export default function List({ drones }) {
    const router = useRouter();

    const handleDroneClick = (id) => {
        router.push(`/drones?id=${id}`);
    };

    return (
        <div className="space-y-3 items-center">
            <h1 className="text-2xl font-bold">Drones</h1>
            <div className="grid grid-cols-1 gap-4">
                {drones && drones.map((drone) => (
                    <div key={drone.id} className="bg-white shadow-md rounded-md p-4"
                        onClick={() => handleDroneClick(drone.id)} >
                        <h2 className="text-xl font-bold">{drone.name}</h2>
                        <p>{drone.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
