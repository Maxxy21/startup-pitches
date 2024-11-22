"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NewPitchButton } from "./new-pitch-button";
import { EmptySearch } from "./empty-search";
import { EmptyFavorites } from "./empty-favorites";
import { EmptyPitches } from "./empty-pitches";
import { PitchCardSkeleton } from "./pitch-card/pitch-card-skeleton";
import { PitchCard } from "./pitch-card/pitch-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface PitchListProps {
    query: {
        search?: string;
        favorites?: string;
    }
}

export const PitchList = ({ query }: PitchListProps) => {
    const router = useRouter();
    const data = useQuery(api.pitches.get, {
        ...query,
    });

    if (data === undefined) {
        return (
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-semibold">
                        {query.favorites ? "Favorite Pitches" : "Pitches"}
                    </h2>
                    <NewPitchButton disabled />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                    {[...Array(4)].map((_, index) => (
                        <PitchCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (!data?.length && query.search) {
        return <EmptySearch />;
    }

    if (!data?.length && query.favorites) {
        return <EmptyFavorites />;
    }

    if (!data?.length) {
        return <EmptyPitches />;
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">
                    {query.favorites ? "Favorite Pitches" : "Pitches"}
                </h2>
                <NewPitchButton />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
                <AnimatePresence mode="popLayout">
                    {data.map((pitch) => (
                        <PitchCard
                            key={pitch._id}
                            pitch={pitch}
                            onClick={() => router.push(`/pitch/${pitch._id}`)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};