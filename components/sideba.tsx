"use client";
import React, {useState} from "react";
import {Sidebar, SidebarBody, SidebarLink} from "@/components/ui/sidebar";

import {links} from "@/utils";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import PitchesList from "@/components/pitches/pitches-list";

import Link from "next/link";
import {motion} from "framer-motion";
import Image from "next/image";
import {cn} from "@/lib/utils";
import UserProfile from "@/components/nav/user-profile";

export function SidebarDemo() {

    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn(
                "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "h-screen"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo/> : <LogoIcon/>}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link}/>
                            ))}
                        </div>
                    </div>
                    <div>
                        {/*<SidebarLink*/}
                        {/*    link={{*/}
                        {/*        label: ,*/}
                        {/*        href: "#",*/}
                        {/*        icon: (*/}
                        {/*            <Image*/}
                        {/*                src="https://assets.aceternity.com/manu.png"*/}
                        {/*                className="h-7 w-7 flex-shrink-0 rounded-full"*/}
                        {/*                width={50}*/}
                        {/*                height={50}*/}
                        {/*                alt="Avatar"*/}
                        {/*            />*/}
                        {/*        ),*/}
                        {/*    }}*/}
                        {/*/>*/}
                        <UserProfile/>
                    </div>
                </SidebarBody>
            </Sidebar>
            <Dashboard/>
        </div>
    );
}

export const Logo = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div
                className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"/>
            <motion.span
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                Pitch Perfect
            </motion.span>
        </Link>
    );
};
export const LogoIcon = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div
                className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"/>
        </Link>
    );
};

// Dummy dashboard component with content
const Dashboard = () => {
    const pitches = useQuery(api.pitches.getPitches) ?? [];
    return (
        <div className="flex flex-1">
            {/*<div*/}
            {/*    className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">*/}
            {/*    <div className="flex gap-2">*/}
            {/*        {[...new Array(4)].map((i) => (*/}
            {/*            <div*/}
            {/*                key={"first-array" + i}*/}
            {/*                className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"*/}
            {/*            ></div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*    <div className="flex gap-2 flex-1">*/}
            {/*        {[...new Array(2)].map((i) => (*/}
            {/*            <div*/}
            {/*                key={"second-array" + i}*/}
            {/*                className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"*/}
            {/*            ></div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}
                <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900  w-full h-full">
                    <PitchesList data={pitches}/>
                </main>
        </div>
    );
};
