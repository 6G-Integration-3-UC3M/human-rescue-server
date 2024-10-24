'use client'

import { useRouter } from 'next/navigation';

export default function List({ missions }) {
    const router = useRouter();

    const handleMissionClick = (id) => {
        router.push(`/missions?id=${id}`);
    };

    return (
        <div className="space-y-3 items-center">
            <h1 className="text-2xl font-bold">Missions</h1>
            <div className="grid grid-cols-1 gap-4">
                {missions && missions.map((mission) => (
                    <div key={mission.id} className="bg-white shadow-md rounded-md p-4"
                        onClick={() => handleMissionClick(mission.id)} >
                        <h2 className="text-xl font-bold">{mission.name}</h2>
                        <p>{mission.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
