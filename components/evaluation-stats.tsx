"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function EvaluationStats() {
    const stats = useQuery(api.dashboard.getEvaluationStats)

    if (!stats) {
        return null
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pitches</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPitches}</div>
                    <p className="text-xs text-muted-foreground">
                        +{stats.newPitchesThisWeek} this week
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Evaluated Pitches</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.evaluatedPitches}</div>
                    <p className="text-xs text-muted-foreground">
                        {((stats.evaluatedPitches / stats.totalPitches) * 100).toFixed(1)}% of total
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">
                        Out of 10
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Evaluations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingEvaluations}</div>
                    <p className="text-xs text-muted-foreground">
                        Awaiting review
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

