"use client"

import React from 'react'
import {FaCircle} from "react-icons/fa";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Pitches from "@/components/pitches/pitches";
import AddPitchButton, {AddPitchWrapper} from "@/components/add-pitches/add-pitch-button";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]

const PitchesList = () => {
    const pitches = useQuery(api.pitches.get) ?? [];

    if (
        pitches === undefined
    ) {
        return <p>Loading...</p>;
    }
    return (
        // <div className="xl:px-40">
        //     <div className="flex items-center justify-between">
        //         <h1 className="text-lg font-semibold md:text-2xl">Pitches</h1>
        //     </div>
        //     <div className="flex flex-col gap-1 py-4">
        //         {pitches.map((pitch) => (
        //             <Pitches key={pitch._id} data={pitch}/>
        //         ))}
        //     </div>
        //     <AddPitchWrapper/>
        // </div>

        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Pitches</h1>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Avg. Score</TableHead>
                        <TableHead>Creation Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pitches.map((pitch) => (
                        <TableRow key={pitch._id}>
                            <TableCell className="font-medium">{pitch.name}</TableCell>
                            <TableCell>{"See more"}</TableCell>
                            <TableCell className="items-center">{5}</TableCell>
                            <TableCell>{"16/05/24"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
           <AddPitchWrapper/>
        </div>

    );
}

export default PitchesList

