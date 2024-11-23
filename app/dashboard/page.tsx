"use client";
import React from 'react';
import { DashboardStats } from "./_components/stats";
import { DashboardHeader } from "./_components/layout/dashboard-header";
import { PitchList } from "./_components/pitch-list";

interface DashboardPageProps {
    searchParams: {
        search?: string;
        favorites?: string;
    };
}

const DashboardPage = ({ searchParams }: DashboardPageProps) => {
    return (
        <div className="flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex-none p-4 space-y-6">
                <DashboardHeader />
                <DashboardStats />
            </div>
            <div className="flex-1 min-h-0"> {/* min-h-0 is important for nested flexbox scrolling */}
                <PitchList query={searchParams} />
            </div>
        </div>
    );
};

export default DashboardPage;