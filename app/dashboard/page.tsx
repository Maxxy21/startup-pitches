"use client"
import React, {useState} from 'react';
import {useQuery} from 'convex/react';
import {Button} from '@/components/ui/button';
import MobileNav from "@/components/nav/mobile-nav";
import {api} from "@/convex/_generated/api";
import SideBar from "@/components/nav/side-bar";
import PitchesList from "@/components/pitches/pitches-list";

const Dashboard = () => {
    const pitches = useQuery(api.pitches.get);
    const [selectedPitch, setSelectedPitch] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePitchSelect = (pitch: any) => {
        setSelectedPitch(pitch);
        setIsModalOpen(true);
    };

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
