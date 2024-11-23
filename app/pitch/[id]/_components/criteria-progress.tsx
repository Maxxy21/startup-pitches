import React from "react";
import {getShortCriteriaName} from "@/utils";
import {Progress} from "@/components/ui/progress";
import {CriteriaProgressProps} from "@/app/pitch/[id]/_components/types";

export const CriteriaProgress = ({evaluations}: CriteriaProgressProps) => (
    <div className="space-y-4">
        {evaluations.map(({criteria, score}, index) => (
            <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span>{getShortCriteriaName(criteria)}</span>
                    <span className="text-muted-foreground">{score}/10</span>
                </div>
                <Progress value={score * 10}/>
            </div>
        ))}
    </div>
);
