"use client"

import Link from 'next/link'
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatDistanceToNow } from 'date-fns'
import { Button } from "@/components/ui/button"

export function PendingEvaluations() {
    const pendingEvaluations = useQuery(api.evaluations.getPendingEvaluations)

    if (!pendingEvaluations || pendingEvaluations.length === 0) {
        return <div>No pending evaluations.</div>
    }

    return (
        <ul className="space-y-4">
            {pendingEvaluations.map((evaluation) => (
                <li key={evaluation._id} className="flex items-center justify-between">
                    <div>
                        <Link href={`/pitch/${evaluation.pitchId}`} className="font-medium hover:underline">
                            {evaluation.pitchTitle}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Assigned {formatDistanceToNow(new Date(evaluation._creationTime), { addSuffix: true })}
                        </p>
                    </div>
                    <Button asChild size="sm">
                        <Link href={`/evaluate/${evaluation._id}`}>
                            Evaluate
                        </Link>
                    </Button>
                </li>
            ))}
        </ul>
    )
}

