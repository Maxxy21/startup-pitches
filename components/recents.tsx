"use client"

import Link from 'next/link'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatDistanceToNow } from 'date-fns'
import { Badge } from "@/components/ui/badge"

export function RecentPitches() {
    const recentPitches = useQuery(api.pitches.getRecentPitches)

    if (!recentPitches || recentPitches.length === 0) {
        return <div>No recent pitches found.</div>
    }

    return (
        <ul className="space-y-4">
            {recentPitches.map((pitch) => (
                <li key={pitch._id} className="flex items-center justify-between">
                    <div>
                        <Link href={`/pitch/${pitch._id}`} className="font-medium hover:underline">
                            {pitch.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(pitch._creationTime), { addSuffix: true })}
                        </p>
                    </div>
                    <Badge variant={pitch.status === 'Evaluated' ? 'default' : 'secondary'}>
                        {pitch.status}
                    </Badge>
                </li>
            ))}
        </ul>
    )
}

