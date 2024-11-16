"use client";
import {api} from "@/convex/_generated/api";
import {useQuery} from "convex/react";
import {useParams, useRouter} from "next/navigation";
import SearchForm from "@/components/nav/search-form";

import {Loading} from "@/components/auth/loading";
import {ScrollArea} from "@/components/ui/scroll-area";
import {AnimatePresence} from "framer-motion";
import {PitchCard} from "@/components/pitches/pitch-card/pitch-card";
import {PitchCardSkeleton} from "@/components/pitches/pitch-card/pitch-card-skeleton";


export default function Search() {
    const router = useRouter();
    const { searchQuery } = useParams<{ searchQuery: string }>();
    const decodedQuery = decodeURI(searchQuery);

    // Add loading state
    const searchResults = useQuery(api.pitches.searchPitches, {
        searchTerm: decodedQuery
    });

    // Show loading skeleton while data is being fetched
    if (!searchResults) {
        return (
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        <SearchForm />
                    </div>
                    <div className="pb-4">
                        <h1 className="text-lg font-semibold md:text-2xl">
                            Searching for  {`"`}{decodeURI(searchQuery)}{`"`}...
                        </h1>
                    </div>
                    <PitchCardSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-4">
                    <SearchForm />
                </div>

                <div className="flex items-center justify-between pb-4">
                    <h1 className="text-lg font-semibold md:text-2xl">
                        Search results for{" "}
                        <span className="text-primary">{`"`}{decodeURI(searchQuery)}{`"`}</span>
                    </h1>
                    <span className="text-sm text-muted-foreground">
                        {searchResults.length} results found
                    </span>
                </div>

                {searchResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-lg text-muted-foreground">
                            No pitches found for {`"`}{decodeURI(searchQuery)}{`"`}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Try searching with different keywords
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-[calc(100vh-200px)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence mode="popLayout">
                                {searchResults.map((pitch) => (
                                    <PitchCard
                                        key={pitch._id}
                                        pitch={pitch}
                                        router={router}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}