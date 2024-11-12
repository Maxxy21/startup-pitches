"use client"
import React from 'react';

import PitchesList from "@/components/pitches/pitches-list";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Pages} from "@/components/nav/pages";
import SearchForm from "@/components/nav/search-form";

const Dashboard = () => {
    const pitches = useQuery(api.pitches.getPitches) ?? [];

    return (
        <div>
            <Pages>
                <div className="p-4 lg:px-8">
                    <SearchForm/>
                </div>
                <PitchesList data={pitches}/>
            </Pages>
        </div>

    );
};


export default Dashboard;
