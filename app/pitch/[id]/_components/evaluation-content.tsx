import React from "react";

import {ScrollArea} from "@/components/ui/scroll-area";
import {ScoreCard} from "@/app/pitch/[id]/_components/score-card";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {getShortCriteriaName} from "@/utils";
import {EvaluationContentProps} from "@/app/pitch/[id]/_components/types";
import {CriteriaProgress} from "@/app/pitch/[id]/_components/criteria-progress";


export const EvaluationContent = ({data}: EvaluationContentProps) => (
    <div className="space-y-4 p-2"> {/* Reduced spacing and added padding */}
        {/* Score Section - Make it more compact */}
        <div className="grid gap-2 md:grid-cols-2"> {/* Reduced gap */}
            <ScoreCard score={data.evaluation.overallScore}/>
            <Card>
                <CardHeader className="pb-1"> {/* Reduced padding */}
                    <CardTitle className="text-sm text-muted-foreground">Evaluation Progress</CardTitle>
                </CardHeader>
                <CardContent className="pt-2"> {/* Adjusted padding */}
                    <CriteriaProgress evaluations={data.evaluation.evaluations}/>
                </CardContent>
            </Card>
        </div>

        {/* Overall Feedback - More compact */}
        <Card>
            <CardHeader className="pb-2"> {/* Reduced padding */}
                <CardTitle className="text-base">Overall Feedback</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{data.evaluation.overallFeedback}</p>
            </CardContent>
        </Card>

        {/* Feedback Categories */}
        <div className="space-y-2"> {/* Reduced spacing */}
            <h3 className="text-base font-semibold mb-2">Detailed Feedback</h3>
            <Tabs defaultValue={getShortCriteriaName(data.evaluation.evaluations[0].criteria)}>
                <TabsList className="w-full">
                    {data.evaluation.evaluations.map(({criteria}, index) => (
                        <TabsTrigger
                            className="flex-1 text-xs py-1" /* Smaller text and padding */
                            key={index}
                            value={getShortCriteriaName(criteria)}
                        >
                            {getShortCriteriaName(criteria)}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {data.evaluation.evaluations.map(({
                                                      criteria,
                                                      comment,
                                                      score,
                                                      strengths,
                                                      improvements,
                                                      aspects
                                                  }, index) => (
                    <TabsContent key={index} value={getShortCriteriaName(criteria)}>
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-base">{getShortCriteriaName(criteria)}</CardTitle>
                                    <span className="text-xl font-bold">{score}/10</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ScrollArea className=""> {/* Scrollable content area */}
                                    <div>
                                        <h4 className="font-semibold text-sm mb-1">Analysis</h4>
                                        <p className="text-sm text-muted-foreground">{comment}</p>
                                    </div>

                                    <div className="mt-3">
                                        <h4 className="font-semibold text-sm mb-1">Strengths</h4>
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            {strengths.map((strength, i) => (
                                                <li key={i} className="text-sm text-muted-foreground">{strength}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-3">
                                        <h4 className="font-semibold text-sm mb-1">Areas for Improvement</h4>
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            {improvements.map((improvement, i) => (
                                                <li key={i} className="text-sm text-muted-foreground">{improvement}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-3">
                                        <h4 className="font-semibold text-sm mb-1">Aspects Considered</h4>
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            {aspects.map((aspect, i) => (
                                                <li key={i} className="text-sm text-muted-foreground">{aspect}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    </div>
);