"use client"
import React from 'react';

import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Pages} from "@/components/nav/pages";
import SearchForm from "@/components/nav/search-form";
import PitchCard from "@/components/pitches/pitch-card";

const Dashboard = () => {
    const pitches = useQuery(api.pitches.getPitches) ?? [];

    return (
        <div>
            <Pages>
                <div className="p-4 lg:px-8">
                    <SearchForm/>
                </div>
                <PitchCard data={pitches}/>
            </Pages>
        </div>

    );
};


export default Dashboard;
