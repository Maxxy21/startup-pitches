import {Calendar, CalendarDays, Grid2X2, Inbox} from "lucide-react";

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