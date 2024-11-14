"use client"
import React from 'react';
import MobileNav from "@/components/nav/mobile-nav";
import SideBar from "@/components/nav/side-bar";
import PitchesList from "@/components/pitches/pitches-list";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/nav/app-sidebar"

const Dashboard = ({children}: { children: React.ReactNode }) => {
    const pitches = useQuery(api.pitches.getPitches) ?? [];
    return (
        <SidebarProvider>
            <AppSidebar/>
            <main>
                <SidebarTrigger/>
                {children}
            </main>
        </SidebarProvider>
    );
};

export default Dashboard;
