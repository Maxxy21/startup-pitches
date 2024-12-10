"use client";
import React from 'react';
import {DashboardStats} from "./_components/stats";

import {PitchList} from "./_components/pitch-list";
import {SidebarInset, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import ModeToggle from "@/components/mode-toggle";
import DashboardHeader from "@/app/dashboard/_components/dashboard-header";

interface DashboardProps {
    searchParams: {
        search?: string;
        favorites?: string;
    };
}


const Dashboard = ({searchParams}: DashboardProps) => {
    return (
        <SidebarInset>
            <DashboardHeader/>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <DashboardStats/>
                <PitchList query={searchParams}/>
            </div>

        </SidebarInset>

    );
};

export default Dashboard;