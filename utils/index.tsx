import {Calendar, CalendarDays, Grid2X2, Inbox} from "lucide-react";
import {IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt} from "@tabler/icons-react";
import React from "react";
import Profile from "@/components/nav/profile";
import Logout from "@/components/nav/logout";
import Link from "next/link";
import {z} from "zod";

import OpenAI from "openai";

let openai: OpenAI | null = null;

export function getOpenAI() {
    if (openai === null) {
        openai = new OpenAI();
    }
    return openai;
}


const DotIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/>
        </svg>
    )
}

export const FormSchema = z.object({
    pitchName: z.string().min(2, {
        message: "Pitch name must be at least 2 characters.",
    }),
    contentType: z.enum(['audio', 'textFile', 'text']),
    content: z.string().optional(),
    file: z.any().optional(),
});

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
            <Profile/>

        ),
    },
    {
        label: "Logout",
        href: "#",
        icon: (
            <Logout/>
        ),
    },
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


export async function fileToText(file: File): Promise<string> {
    if (!file) {
        throw new Error('No file provided');
    }

    if (!file.type.includes('text/plain')) {
        throw new Error('Invalid file type. Please upload a text file (.txt)');
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                // Validate content isn't empty
                if (!reader.result.trim()) {
                    reject(new Error('File is empty'));
                    return;
                }
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read file as text'));
            }
        };

        reader.onerror = () => {
            reject(new Error(`File reading error: ${reader.error?.message || 'Unknown error'}`));
        };

        try {
            reader.readAsText(file);
        } catch (error: any) {
            reject(new Error(`Failed to start reading file: ${error.message}`));
        }
    });
}

export const getShortCriteriaName = (criteria: string) => {
    switch (criteria) {
        case "Problem-Solution Fit":
            return "Soundness";
        case "Business Potential":
            return "Potential";
        case "Presentation Quality":
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

export const mockEvaluation = {
    evaluations: [
        {
            criteria: "Problem-Solution Fit",
            comment: "The pitch demonstrates a clear understanding of the problem and presents a viable solution.",
            score: 8,
            strengths: ["Clear problem identification", "Innovative solution", "Market understanding"],
            improvements: ["Add more market validation", "Expand on competitive analysis"],
            aspects: ["Problem clarity", "Solution viability", "Market fit", "Innovation"]
        },
        {
            criteria: "Business Potential",
            comment: "Strong business model with good growth potential.",
            score: 7,
            strengths: ["Scalable model", "Clear revenue streams", "Large market opportunity"],
            improvements: ["More financial projections", "Detailed go-to-market strategy"],
            aspects: ["Market size", "Revenue model", "Scalability", "Growth strategy"]
        },
        {
            criteria: "Presentation Quality",
            comment: "Well-structured presentation with clear communication.",
            score: 8,
            strengths: ["Clear structure", "Engaging delivery", "Professional presentation"],
            improvements: ["Add more visual aids", "Include more data points"],
            aspects: ["Clarity", "Structure", "Engagement", "Professionalism"]
        }
    ],
    overallScore: 7.7,
    overallFeedback: "This is a strong pitch with clear potential. The problem-solution fit is well-defined, and the business model shows promise. Some improvements in market validation and financial projections would strengthen the pitch further."
};