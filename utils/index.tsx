import {Calendar, CalendarDays, Grid2X2, Inbox} from "lucide-react";





interface Evaluation {
    criteria: string;
    comment: string;
    score: number;
}

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