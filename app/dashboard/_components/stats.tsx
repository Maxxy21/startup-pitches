// components/dashboard/stats.tsx
"use client"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function DashboardStats() {
    const stats = useQuery(api.pitches.getPitchStats);

    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard
                title="Total Pitches"
                value={stats.totalPitches}
                icon="📊"
            />
            <StatCard
                title="Average Score"
                value={stats.averageScore.toFixed(1)}
                icon="⭐"
                progress={stats.averageScore * 10}
            />
            <StatCard
                title="Best Pitch"
                value={stats.bestPitch?.name || "None"}
                subValue={stats.bestPitch?.evaluation.overallScore.toFixed(1)}
                icon="🏆"
            />
            <StatCard
                title="Recent Pitches"
                value={stats.recentPitches.length}
                subValue="Last 7 days"
                icon="📈"
            />
        </div>
    );
}

function StatCard({ title, value, subValue, icon, progress }: {
    title: string;
    value: string | number;
    subValue?: string | number;
    icon?: string;
    progress?: number;
}) {
    return (
        <Card className="p-4">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                {icon && <span className="text-2xl">{icon}</span>}
            </div>
            <div className="mt-2">
                <h3 className="text-2xl font-bold">{value}</h3>
                {subValue && (
                    <p className="text-xs text-muted-foreground">{subValue}</p>
                )}
                {progress && (
                    <Progress value={progress} className="mt-2 h-1" />
                )}
            </div>
        </Card>
    );
}