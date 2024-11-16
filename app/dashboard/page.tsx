"use client"
import React from 'react';
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import SearchForm from "@/components/nav/search-form";
import PitchCard from "@/components/pitches/pitch-card";

const Dashboard = () => {
    // Add empty object as argument
    const pitches = useQuery(api.pitches.getPitches, {}) ?? [];

    return (
        <div>
            <div className="p-4 lg:px-8">
                <SearchForm/>
            </div>
            <PitchCard data={pitches}/>
        </div>
    );
};

export default Dashboard;