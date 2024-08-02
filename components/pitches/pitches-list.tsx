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
import EvaluationDetail from "@/components/pitches/evaluation-detail";
import {formatDate} from "@/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {Doc} from "@/convex/_generated/dataModel";
import {useRouter} from "next/navigation";

interface Evaluation {
    criteria: string;
    comment: string;
    score: number;
}

const PitchesList = ({data}: { data: Array<Doc<"pitches">> }) => {
    const router = useRouter();
    // router.push(`/dashboard/search/${searchText}`);

    if (
        data === undefined
    ) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Pitches</h1>
            </div>
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="h-4 w-4"/>
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <AddPitchWrapper/>
        </div>

    );
}

export default PitchesList

