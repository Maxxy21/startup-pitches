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

const PitchDetails = () => {
    const {id} = useParams<{ id: string }>();

    const data = useQuery(api.pitches.getPitch, {
        id: id as Id<"pitches">,
    });

    if (!data) return <Loading/>

    return (
        <div>
            <Pages>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8 rounded-tl-2xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 w-full">
                    <h1 className="text-2xl">{data.name} Evaluation</h1>
                    {/*<h3>Transcript</h3>*/}
                    {/*<p>{data.text}</p>*/}
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
                                    <p>{comment}</p>
                                    <h4 className="font-bold">Score: {score}</h4>
                                </div>
                            </TabsContent>
                        ))}

                    </Tabs>
                </main>
            </Pages>
        </div>
    );
}
export default PitchDetails
