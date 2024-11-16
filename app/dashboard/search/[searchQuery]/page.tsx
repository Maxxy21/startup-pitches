"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { Pages } from "@/components/nav/pages";
import SearchForm from "@/components/nav/search-form";
import PitchCard from "@/components/pitches/pitch-card";
import { Loading } from "@/components/auth/loading";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Search() {
    const { searchQuery } = useParams<{ searchQuery: string }>();

    // Use useQuery instead of useAction for basic text search
    const searchResults = useQuery(api.pitches.searchPitches, {
        searchTerm: decodeURI(searchQuery)
    });

    if (!searchResults) return <Loading />;

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-4">
                    <SearchForm />
                </div>

                <div className="flex items-center justify-between pb-4">
                    <h1 className="text-lg font-semibold md:text-2xl">
                        Search Results for{" "}
                        <span className="text-primary">
                             {`"`}
                            {decodeURI(searchQuery)}
                            {`"`}
                        </span>
                    </h1>
                    <span className="text-sm text-muted-foreground">
                        {searchResults.length} results found
                    </span>
                </div>

                {searchResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-lg text-muted-foreground">
                            No pitches found for{`"`}
                            {decodeURI(searchQuery)}
                            {`"`}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Try searching with different keywords
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-[calc(100vh-200px)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchResults.map((pitch) => (
                                <PitchCard key={pitch._id} data={pitch} />
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}