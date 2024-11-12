"use client"

import React from 'react'
import {AddPitchWrapper} from "@/components/add-pitches/add-pitch-button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {formatDate} from "@/utils";
import {Doc} from "@/convex/_generated/dataModel";
import {useRouter} from "next/navigation";
import DeletePitch from "@/components/pitches/delete-pitch";
import {Loading} from "@/components/auth/loading";
import {ScrollArea} from "@/components/ui/scroll-area";
import {FileUpload} from "@/components/add-pitches/file-upload";


const PitchesList = ({data}: { data: Array<Doc<"pitches">> }) => {
    const router = useRouter();

    if (!data) return <Loading/>

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Pitches</h1>
            </div>
            <div>
                <ScrollArea className="flex-1 w-full h-[calc(100vh-300px)] ">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Evaluation</TableHead>
                                {/*<TableHead>Avg. Score</TableHead>*/}
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((pitch: Doc<"pitches">) => (
                                <TableRow key={pitch._id}>
                                    <TableCell className="font-medium">{pitch.name}</TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => router.push(`/dashboard/pitch/${pitch._id}`)}>
                                            See more
                                        </button>
                                    </TableCell>
                                    <TableCell>{formatDate(pitch._creationTime)}</TableCell>
                                    <TableCell>
                                        <DeletePitch pitchId={pitch._id}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
                <FileUpload/>
            </div>
        </div>

    );
}

export default PitchesList

