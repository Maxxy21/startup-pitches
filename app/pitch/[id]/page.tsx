"use client"
import React from 'react';
import {useParams} from "next/navigation";
import {useQuery} from "convex/react";
import {Id} from "@/convex/_generated/dataModel";
import {api} from "@/convex/_generated/api";
import {Loading} from "@/components/auth/loading";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ScrollArea} from "@/components/ui/scroll-area";
import {EvaluationContent} from "@/app/pitch/_components/evaluation-content";


const PitchDetails = () => {
    const {id} = useParams<{ id: string }>();
    const data = useQuery(api.pitches.getPitch, {
        id: id as Id<"pitches">,
    });

    if (!data) return <Loading/>

    const mobileView = (
        <Tabs defaultValue="transcript" className="w-full h-screen flex flex-col">
            <TabsList className="w-full">
                <TabsTrigger value="transcript" className="flex-1">Transcript</TabsTrigger>
                <TabsTrigger value="evaluation" className="flex-1">Evaluation</TabsTrigger>
            </TabsList>

            <TabsContent value="transcript" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-4">
                    <p className="whitespace-pre-wrap">{data.text}</p>
                </ScrollArea>
            </TabsContent>

            <TabsContent value="evaluation" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <EvaluationContent data={data} />
                </ScrollArea>
            </TabsContent>
        </Tabs>
    );

    const desktopView = (

        <div className="flex-1 flex h-screen overflow-hidden">
            <div className="w-1/2 p-4 border-r dark:border-neutral-800">
                <h2 className="font-semibold mb-2">Transcript</h2>
                <ScrollArea className="h-[calc(100vh-100px)]">
                    <p className="whitespace-pre-wrap">{data.text}</p>
                </ScrollArea>
            </div>

            <div className="w-1/2 p-4">
                <ScrollArea className="h-[calc(100vh-100px)]">
                    <EvaluationContent data={data} />
                </ScrollArea>
            </div>
        </div>
    );

    return (
        <>
            <h1 className="">
                {data.name} Evaluation
            </h1>
            <div className="flex h-screen">
                <div className="md:hidden w-full">{mobileView}</div>
                <div className="hidden md:flex w-full">{desktopView}</div>
            </div>
        </>
    );
};

export default PitchDetails;