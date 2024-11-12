"use client";
import React, {useState} from "react";

import {useUser} from '@clerk/clerk-react'
import {Sidebar, SidebarBody, SidebarLink} from "@/components/ui/sidebar";

import {links} from "@/utils";

import UserProfile from "@/components/nav/user-profile";
import LogoIcon from "@/components/ui/logo-icon";
import Logo from "@/components/ui/logo";
import {cn} from "@/lib/utils";
import Image from "next/image";


interface PagesProps {
    children: React.ReactNode;
}


export function Pages({
                          children
                      }: PagesProps) {
    const {user} = useUser()
    const userName = user?.fullName
    const userImage = user?.imageUrl
    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "h-screen fixed inset-0"
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
                        <SidebarLink
                            link={{
                                label: userName,
                                href: "#",
                                icon: (userImage ? (
                                        <Image
                                            src={userImage}
                                            alt={"UserAvatar"}
                                            width={32} height={32}

                                            className="rounded-xl"
                                        />
                                    ) : (
                                        <UserProfile/>
                                    )
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <main
                className="flex flex-1 flex-col gap-4 p-4 lg:px-8 rounded-tl-2xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 w-full">
                {children}
            </main>
        </div>
    );
}




