"use client"

import React from 'react'
import SideBar from "@/components/nav/side-bar";
import MobileNav from "@/components/nav/mobile-nav";
import {useParams} from "next/navigation";
import {useQuery} from "convex/react";
import {Id} from "@/convex/_generated/dataModel";
import {api} from "@/convex/_generated/api";
import {getShortCriteriaName} from "@/utils";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

const PitchDetails = () => {
    const {id} = useParams<{ id: string }>();

    const data = useQuery(api.pitches.getPitch, {
        id: id as Id<"pitches">,
    });

    if (!data) return <p>Loading...</p>

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <SideBar/>
            <div className="flex flex-col">
                <MobileNav/>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
                    <h1 className="text-2xl">{data.name} Evaluation</h1>
                    {/*<h3>Transcript</h3>*/}
                    {/*<p>{data.text}</p>*/}
                    <Tabs defaultValue={data.evaluation.length > 0 ? getShortCriteriaName(data.evaluation[0].criteria) : ''}
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
                                        <p>{comment}</p>
                                    <h4 className="font-bold">Score: {score}</h4>
                                </div>
                            </TabsContent>
                        ))}

                    </Tabs>
                </main>
            </div>
        </div>
    )
}
export default PitchDetails
