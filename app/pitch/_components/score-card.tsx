import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";


interface ScoreCardProps {
    score: number;
}


export const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => (
    <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-none">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Overall Score</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-baseline space-x-2">
                <h1 className="text-4xl font-bold">{score}</h1>
                <span className="text-muted-foreground">/ 10</span>
            </div>
            <Progress value={score * 10} className="mt-2" />
        </CardContent>
    </Card>
);