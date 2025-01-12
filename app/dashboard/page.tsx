"use client"

import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowRight } from 'lucide-react'
import { RecentPitches } from "@/components/recents"
import { PendingEvaluations } from "@/components/pending-evaluations"
import { EvaluationStats } from "@/components/evaluation-stats"

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Pitch Evaluation Dashboard</h1>
                <Button asChild>
                    <Link href="/pitch/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Pitch
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<Card className="h-24 animate-pulse" />}>
                    {/*<EvaluationStats />*/}
                </Suspense>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Pitches</CardTitle>
                        <CardDescription>Latest pitches submitted for evaluation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<div>Loading recent pitches...</div>}>
                            {/*<RecentPitches />*/}
                        </Suspense>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending Evaluations</CardTitle>
                        <CardDescription>Pitches awaiting your evaluation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<div>Loading pending evaluations...</div>}>
                            {/*<PendingEvaluations />*/}
                        </Suspense>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Button asChild variant="outline" className="w-full justify-between">
                        <Link href="/pitches">
                            View All Pitches
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-between">
                        <Link href="/evaluations">
                            My Evaluations
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-between">
                        <Link href="/analytics">
                            Analytics
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-between">
                        <Link href="/settings">
                            Settings
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

