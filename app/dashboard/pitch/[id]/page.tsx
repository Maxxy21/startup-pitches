"use client"

import React from 'react'
import {useParams} from "next/navigation";
import {useQuery} from "convex/react";
import {Id} from "@/convex/_generated/dataModel";
import {api} from "@/convex/_generated/api";
import {getShortCriteriaName} from "@/utils";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Pages} from "@/components/nav/pages";
import {Loading} from "@/components/auth/loading";
import {ScrollArea} from "@/components/ui/scroll-area";

const PitchDetails = () => {
    const {id} = useParams<{ id: string }>();

    const data = useQuery(api.pitches.getPitch, {
        id: id as Id<"pitches">,
    });

    if (!data) return <Loading/>

    return (
        <div>
            <Pages>
                <h1 className="text-2xl">{data.name} Evaluation</h1>
                {/*<h3>Transcript</h3>*/}
                {/*<p>{data.text}</p>*/}
                <Tabs defaultValue="Transcript">
                    <TabsList>
                        <TabsTrigger value="Transcript">
                            Transcript
                        </TabsTrigger>
                        <TabsTrigger value="Evaluation">
                            Evaluation
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="Transcript">
                        <div className="p-4">
                            <ScrollArea className=" h-[calc(100vh-175px)]">
                                <p>{data.text}</p>
                            </ScrollArea>
                        </div>
                    </TabsContent>
                    <TabsContent value="Evaluation">
                        <div className="p-4">
                            <Tabs
                                defaultValue={data.evaluation.length > 0 ? getShortCriteriaName(data.evaluation[0].criteria) : ''}
                                className="w-full">
                                <TabsList>
                                    {data.evaluation.map(({criteria}, index) => (
                                        <TabsTrigger key={index} value={getShortCriteriaName(criteria)}>
                                            {getShortCriteriaName(criteria)}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {data.evaluation.map(({criteria, comment, score}, index) => (
                                    <TabsContent key={index} value={getShortCriteriaName(criteria)}>
                                        <div className="p-4">
                                            <h4 className="font-bold">Comment:</h4>
                                            <h4 className="font-bold">Score: {score}</h4>
                                            <ScrollArea className=" h-[calc(100vh-175px)]">
                                                <p>{comment}</p>
                                            </ScrollArea>
                                        </div>
                                    </TabsContent>
                                ))}

                            </Tabs>
                        </div>
                    </TabsContent>
                </Tabs>

            </Pages>
        </div>
    );
}
export default PitchDetails
