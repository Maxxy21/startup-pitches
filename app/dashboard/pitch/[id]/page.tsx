"use client"
import React from 'react';
import {useParams} from "next/navigation";
import {useQuery} from "convex/react";
import {Id} from "@/convex/_generated/dataModel";
import {api} from "@/convex/_generated/api";
import {getShortCriteriaName} from "@/utils";
import {Loading} from "@/components/auth/loading";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Types for props
interface EvaluationData {
    evaluations: {
        criteria: string;
        comment: string;
        score: number;
        strengths: string[];
        improvements: string[];
        aspects: string[];
    }[];
    overallScore: number;
    overallFeedback: string;
}

const ScoreCard = ({ score }: { score: number }) => (
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

const CriteriaProgress = ({ evaluations }: { evaluations: EvaluationData['evaluations'] }) => (
    <div className="space-y-4">
        {evaluations.map(({ criteria, score }, index) => (
            <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span>{getShortCriteriaName(criteria)}</span>
                    <span className="text-muted-foreground">{score}/10</span>
                </div>
                <Progress value={score * 10} />
            </div>
        ))}
    </div>
);

const EvaluationContent = ({ data }) => (
    <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-8">
            {/* Score Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <ScoreCard score={data.evaluation.overallScore} />
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Evaluation Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CriteriaProgress evaluations={data.evaluation.evaluations} />
                    </CardContent>
                </Card>
            </div>

            {/* Overall Feedback */}
            <Card>
                <CardHeader>
                    <CardTitle>Overall Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{data.evaluation.overallFeedback}</p>
                </CardContent>
            </Card>

            {/* Feedback Categories */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Detailed Feedback</h3>
                    <Tabs className="w-full" defaultValue={getShortCriteriaName(data.evaluation.evaluations[0].criteria)}>
                        <TabsList className="w-full">
                            {data.evaluation.evaluations.map(({criteria}, index) => (
                                <TabsTrigger
                                    className="flex-1"
                                    key={index}
                                    value={getShortCriteriaName(criteria)}
                                >
                                    {getShortCriteriaName(criteria)}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {data.evaluation.evaluations.map(({criteria, comment, score, strengths, improvements, aspects}, index) => (
                            <TabsContent key={index} value={getShortCriteriaName(criteria)}>
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>{getShortCriteriaName(criteria)}</CardTitle>
                                            <span className="text-2xl font-bold">{score}/10</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold mb-2">Analysis</h4>
                                            <p className="text-sm text-muted-foreground leading-7">{comment}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2">Strengths</h4>
                                            <ul className="list-disc pl-4 space-y-1">
                                                {strengths.map((strength, i) => (
                                                    <li key={i} className="text-sm text-muted-foreground">{strength}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2">Areas for Improvement</h4>
                                            <ul className="list-disc pl-4 space-y-1">
                                                {improvements.map((improvement, i) => (
                                                    <li key={i} className="text-sm text-muted-foreground">{improvement}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2">Aspects Considered</h4>
                                            <ul className="list-disc pl-4 space-y-1">
                                                {aspects.map((aspect, i) => (
                                                    <li key={i} className="text-sm text-muted-foreground">{aspect}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>
        </div>
    </ScrollArea>
);


const PitchDetails = () => {
    const {id} = useParams<{ id: string }>();
    const data = useQuery(api.pitches.getPitch, {
        id: id as Id<"pitches">,
    });

    if (!data) return <Loading/>

    // Mobile view with tabs
    const mobileView = (
        <Tabs defaultValue="transcript" className="w-full">
            <TabsList className="w-full">
                <TabsTrigger value="transcript" className="flex-1">Transcript</TabsTrigger>
                <TabsTrigger value="evaluation" className="flex-1">Evaluation</TabsTrigger>
            </TabsList>

            <TabsContent value="transcript">
                <ScrollArea className="h-[calc(100vh-120px)] overflow-y-auto">
                    <p className="whitespace-pre-wrap">{data.text}</p>
                </ScrollArea>
            </TabsContent>

            <TabsContent value="evaluation">
                <EvaluationContent data={data} />
            </TabsContent>
        </Tabs>
    );

    // Desktop view with split panels
    const desktopView = (
        <div className="flex-1 flex">
            <div className="w-1/2 p-6 border-r dark:border-neutral-800">
                <h2 className="font-semibold items-center">Transcript</h2>
                <ScrollArea className="h-[calc(100vh-120px)] overflow-y-auto">
                    <p className="whitespace-pre-wrap">{data.text}</p>
                </ScrollArea>
            </div>

            <div className="w-1/2 p-6">
                <EvaluationContent data={data} />
            </div>
        </div>
    );

    return (
        <div className="flex h-screen">
            <div className="md:hidden w-full">{mobileView}</div>
            <div className="hidden md:flex w-full">{desktopView}</div>
        </div>
    );
}

export default PitchDetails;