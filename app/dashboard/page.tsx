"use client"
import React from 'react';
import MobileNav from "@/components/nav/mobile-nav";
import SideBar from "@/components/nav/side-bar";
import PitchesList from "@/components/pitches/pitches-list";

const Dashboard = () => {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <SideBar/>
            <div className="flex flex-col">
                <MobileNav/>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
                    <PitchesList/>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
