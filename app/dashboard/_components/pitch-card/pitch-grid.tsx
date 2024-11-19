"use client";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence } from "framer-motion";
import { PitchCard } from "./pitch-card";
import { Doc } from "@/convex/_generated/dataModel";
import { NewPitchButton } from "../new-pitch-button";
import { PitchCardSkeleton } from "./pitch-card-skeleton";

interface PitchGridProps {
    data: Doc<"pitches">[];
    loading?: boolean;
    showNewPitchButton?: boolean;
}

export const PitchGrid = ({ data, loading, showNewPitchButton = true }: PitchGridProps) => {
    const router = useRouter();

    if (loading) {
        return <PitchCardSkeleton />;
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl">
                    {/* Title can be passed as prop if needed */}
                    Pitches
                </h2>
            </div>
            <ScrollArea className="w-full h-[calc(100vh-220px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
                    {showNewPitchButton && <NewPitchButton disabled={loading} />}
                    <AnimatePresence mode="popLayout">
                        {data?.map((pitch) => (
                            <PitchCard
                                key={pitch._id}
                                pitch={pitch}
                                onClick={() => router.push(`/pitch/${pitch._id}`)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </div>
    );
};