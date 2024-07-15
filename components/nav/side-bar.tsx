"use client";
import Link from "next/link";

import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {primaryNavItems} from "@/utils";

import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import {api} from "@/convex/_generated/api";
import {useQuery} from "convex/react";
import {useEffect, useState} from "react";
import {Hash, PlusIcon} from "lucide-react";
import {Doc} from "@/convex/_generated/dataModel";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import UserProfile from "@/components/nav/user-profile";


interface MyListTitleType {
    [key: string]: string;
}

export default function SideBar() {
    const pathname = usePathname();


    const LIST_OF_TITLE_IDS: MyListTitleType = {
        primary: "",
        projects: "My Projects",
    };

    const [navItems, setNavItems] = useState([...primaryNavItems]);


    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex justify-between h-14 items-center border-b p-1 lg:h-[60px] lg:px-2">
                    <UserProfile/>
                </div>
                <nav className="grid items-start px-1 text-sm font-medium lg:px-4">
                    {navItems.map(({name, icon, link, id}, idx) => (
                        <div key={idx}>
                            {id && (
                                <div
                                    className={cn(
                                        "flex items-center mt-6 mb-2",
                                        id === "filters" && "my-0"
                                    )}
                                >
                                    <p className="flex flex-1 text-base">
                                        {LIST_OF_TITLE_IDS[id]}
                                    </p>

                                </div>
                            )}
                            <div className={cn("flex items-center lg:w-full")}>
                                <div
                                    className={cn(
                                        "flex items-center text-left lg:gap-3 rounded-lg py-2 transition-all hover:text-primary justify-between w-full",
                                        pathname === link
                                            ? "active rounded-lg bg-primary/10 text-primary transition-all hover:text-primary"
                                            : "text-foreground "
                                    )}
                                >
                                    <Link
                                        key={idx}
                                        href={link}
                                        className={cn(
                                            "flex items-center text-left gap-3 rounded-lg transition-all hover:text-primary w-full"
                                        )}
                                    >
                                        <div className="flex gap-4 items-center w-full">
                                            <div className="flex gap-2 items-center">
                                                <p className="flex text-base text-left">
                                                    {icon || <Hash/>}
                                                </p>
                                                <p>{name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                    {id === "filters" && (
                                        <Dialog>
                                            <DialogTrigger id="closeDialog">
                                                <PlusIcon
                                                    className="h-5 w-5"
                                                    aria-label="Add a Label"
                                                />
                                            </DialogTrigger>
                                        </Dialog>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}

