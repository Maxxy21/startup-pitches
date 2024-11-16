"use client"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function TrendingPitches() {
    const trending = useQuery(api.pitches.getTrendingPitches, { limit: 5 });
    const router = useRouter();

    if (!trending) return null;

    return (
        <Card className="p-4">
            <h3 className="font-semibold mb-4">Trending Pitches</h3>
            <div className="space-y-4">
                {trending.map((pitch) => (
                    <div
                        key={pitch._id}
                        className="flex items-center gap-4 p-2 hover:bg-muted rounded-lg cursor-pointer"
                        onClick={() => router.push(`/dashboard/pitch/${pitch._id}`)}
                    >
                        <div className="flex-1">
                            <p className="font-medium">{pitch.name}</p>
                            <p className="text-sm text-muted-foreground">
                                Score: {pitch.evaluation.overallScore.toFixed(1)}
                            </p>
                        </div>
                        <div className="text-2xl">
                            {pitch.evaluation.overallScore >= 8 ? "🌟" :
                                pitch.evaluation.overallScore >= 6 ? "⭐" : "✨"}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}