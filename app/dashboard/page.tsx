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
        <div className="flex flex-col h-full">
            <div className="flex-none p-4 space-y-6">
                <DashboardHeader />
                <DashboardStats />
            </div>
            <div className="flex-1">
                <PitchList query={searchParams} />
            </div>
        </div>
    );
};

export default DashboardPage;