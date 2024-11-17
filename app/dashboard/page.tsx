"use client"
import React from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import SearchForm from "@/components/nav/search-form";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { PitchesGrid } from "@/components/pitches/pitch-card/pitches-grid";
import { DashboardStats } from "./_components/stats";

const Dashboard = () => {
    const pitches = useQuery(api.pitches.getPitches, {}) ?? [];

    return (
        <div className="flex flex-col h-full">
            {/* Fixed Header Section */}
            <div className="p-4 space-y-6">
                {/* Header Bar */}
                <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-x-4">
                    {/* Title and Search */}
                    <div className="flex items-center justify-between lg:flex-1">
                        <h1 className="text-2xl font-semibold">Dashboard</h1>
                        <div className="lg:hidden">
                            <ModeToggle />
                        </div>
                    </div>

                    {/* Search Bar - Full width on mobile, auto width on desktop */}
                    <div className="w-full lg:w-[600px]">
                        <SearchForm />
                    </div>

                    {/* Mode Toggle - Desktop */}
                    <div className="hidden lg:block">
                        <ModeToggle />
                    </div>
                </header>

                {/* Stats Grid */}
                <DashboardStats />
            </div>
                    <PitchesGrid data={pitches} />

        </div>
    );
}

export default Dashboard;