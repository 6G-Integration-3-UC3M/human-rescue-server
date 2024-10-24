'use client'

export default function ListRules({ rules }) {
    return (
        <div className="space-y-3 items-center">
            <h1 className="text-2xl font-bold">Rules</h1>
            <div className="grid grid-cols-1 gap-4">
                {rules && rules.map((rule) => (
                    <div key={rule.id} className="bg-white shadow-md rounded-md p-4">
                        <h2 className="text-xl font-bold">{rule.condition}</h2>
                        <p>{rule.action}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
