"use client"
import React from 'react';
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import SearchForm from "@/components/nav/search-form";
import {ModeToggle} from "@/components/ui/mode-toggle";
import {PitchesGrid} from "@/components/pitches/pitch-card/pitches-grid";


const Dashboard = () => {
    const pitches = useQuery(api.pitches.getPitches, {}) ?? [];

    return (
        <div>
            <div className="p-4 lg:px-8">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <SearchForm/>
                    <ModeToggle/>
                </div>
            </div>
            <PitchesGrid data={pitches}/> {/* Use PitchesGrid instead of PitchCard */}
        </div>
    );
};

export default Dashboard;