import React from 'react';
import {useRouter} from "next/navigation";
import {Doc} from "@/convex/_generated/dataModel";
import {ScrollArea} from "@/components/ui/scroll-area";
import {FileUpload} from "@/components/add-pitches/file-upload";
import {AnimatePresence} from "framer-motion";
import {PitchCard} from "./pitch-card";
import {PitchCardSkeleton} from "./pitch-card-skeleton";
import {EmptyState} from "./empty-state";

interface PitchesGridProps {
    data: Array<Doc<"pitches">>;
}

export const PitchesGrid = ({data}: PitchesGridProps) => {
    const router = useRouter();

    if (!data) {
        return (
            <ScrollArea className="flex-1 w-full h-[calc(100vh-175px)]">
                <PitchCardSkeleton/>
            </ScrollArea>
        );
    }

    if (data.length === 0) {
        return (
            <ScrollArea className="flex-1">
                <EmptyState/>
            </ScrollArea>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Pitches</h1>
                <div className="flex-shrink-0">
                    <FileUpload/>
                </div>
            </div>

            <ScrollArea className="flex-1 w-full h-[calc(100vh-175px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    <AnimatePresence mode="popLayout">
                        {data.map((pitch) => (
                            <PitchCard
                                key={pitch._id}
                                pitch={pitch}
                                router={router}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </div>
    );
};