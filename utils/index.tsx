import {Calendar, CalendarDays, Grid2X2, Inbox} from "lucide-react";
import {IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt} from "@tabler/icons-react";
import React from "react";
import {SignOutButton} from "@clerk/clerk-react";
import UserProfile from "@/components/nav/user-profile";
import {UserButton} from "@clerk/nextjs";
import MenuButton from "@/components/ui/menu-button";

const DotIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
        </svg>
    )
}

interface Evaluation {
    criteria: string;
    comment: string;
    score: number;
}

export const links = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
            <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
        ),
    },
    {
        label: "Profile",
        href: "#",
        icon: (
            // <UserButton>
            //     <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
            // </UserButton>
            <MenuButton/>

        ),
    },
    // {
    //     label: "Settings",
    //     href: "/settings",
    //     icon: (
    //         <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
    //     ),
    // },
    // {
    //     label: "Logout",
    //     href: "/",
    //     icon: (
    //         <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
    //     ),
    // },
];

export const primaryNavItems = [
    {
        id: "primary",
        name: "Pitches",
        link: "/dashboard",
        icon: <Inbox className="w-4 h-4"/>,
    },
    // {
    //     id: "filters",
    //     name: "Filters & Labels",
    //     link: "/loggedin/filter-labels",
    //     icon: <Grid2X2 className="w-4 h-4" />,
    // },
];


export function fileToText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject('Failed to read file as text.');
            }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

export const getShortCriteriaName = (criteria: string) => {
    switch (criteria) {
        case "Soundness of the project in terms of problem-solution-customer fit":
            return "Soundness";
        case "Potential of the project as a startup business":
            return "Potential";
        case "Quality of the presentation":
            return "Presentation Quality";
        default:
            return criteria;
    }
}

export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'});
}

export const calculateAverageScore = (evaluations: Evaluation[]): string => {
    const totalScore = evaluations.reduce((sum, item) => sum + item.score, 0);
    const averageScore = evaluations.length > 0 ? totalScore / evaluations.length : 0;
    return averageScore.toFixed(1); // Keeping one decimal for the average score display
}