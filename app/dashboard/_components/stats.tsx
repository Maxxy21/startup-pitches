"use client"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {cn} from "@/lib/utils";

export function DashboardStats() {
    const stats = useQuery(api.pitches.getPitchStats);

    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Pitches"
                value={stats.totalPitches}
                icon="📊"
                className="bg-card dark:bg-neutral-800/50 border dark:border-neutral-700"
            />
            <StatCard
                title="Average Score"
                value={stats.averageScore?.toFixed(1) ?? "0.0"}
                subValue={`${stats.totalPitches} pitches`}
                icon="⭐"
                className="bg-card dark:bg-neutral-800/50 border dark:border-neutral-700"
            />
            <StatCard
                title="Best Pitch"
                value={stats.bestPitch?.title ?? "None"}
                subValue={stats.bestPitch?.evaluation.overallScore.toFixed(1) ?? "0.0"}
                icon="🏆"
                className="bg-card dark:bg-neutral-800/50 border dark:border-neutral-700"
            />
            <StatCard
                title="Recent Pitches"
                value={stats.recentPitches.length}
                subValue="Last 7 days"
                icon="📈"
                className="bg-card dark:bg-neutral-800/50 border dark:border-neutral-700"
            />
        </div>
    );
}

function StatCard({
                      title,
                      value,
                      subValue,
                      icon,
                      className
                  }: {
    title: string;
    value: string | number;
    subValue?: string;
    icon?: string;
    className?: string;
}) {
    return (
        <div className={cn(
            "rounded-lg p-4",
            className
        )}>
            <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                    <p className="text-sm font-medium text-muted-foreground">
                        {title}
                    </p>
                    <div className="flex items-baseline space-x-2">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {value}
                        </h2>
                        {subValue && (
                            <p className="text-sm text-muted-foreground">
                                {subValue}
                            </p>
                        )}
                    </div>
                </div>
                {icon && <span className="text-2xl">{icon}</span>}
            </div>
        </div>
    );
}