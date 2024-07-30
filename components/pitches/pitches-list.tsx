"use client"

import React from 'react'
import {FaCircle} from "react-icons/fa";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import Pitches from "@/components/pitches/pitches";
import AddPitchButton, {AddPitchWrapper} from "@/components/add-pitches/add-pitch-button";

const PitchesList = () => {
    const pitches = useQuery(api.pitches.get) ?? [];

    if (
        pitches === undefined
    ) {
        <p>Loading...</p>;
    }
    return (
        <div className="xl:px-40">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Pitches</h1>
            </div>
            <div className="flex flex-col gap-1 py-4">
                {pitches.map((pitch) => (
                    <Pitches key={pitch._id} data={pitch}/>
                ))}
            </div>
            <AddPitchWrapper/>
        </div>
    );
}

export default PitchesList

