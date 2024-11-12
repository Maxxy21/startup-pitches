"use client";
import {api} from "@/convex/_generated/api";
import {useAction} from "convex/react";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import PitchesList from "@/components/pitches/pitches-list";
import {Pages} from "@/components/nav/pages";
import SearchForm from "@/components/nav/search-form";

export default function Search() {
    const {searchQuery} = useParams<{ searchQuery: string }>();

    const [searchResults, setSearchResults] = useState<any>([]);
    const [searchInProgress, setSearchInProgress] = useState(false);

    const vectorSearch = useAction(api.search.searchPitches);

    console.log({searchQuery});

    useEffect(() => {
        const handleSearch = async () => {
            setSearchResults([]);

            setSearchInProgress(true);
            try {
                const results = await vectorSearch({
                    query: searchQuery,
                });

                setSearchResults(results);
            } finally {
                setSearchInProgress(false);
            }
        };

        if (searchQuery) {
            handleSearch();
        }
    }, [searchQuery, vectorSearch]);

    return (
        <div>
            <Pages>
                <div className="xl:px-40">
                    <SearchForm/>
                    <div className="flex items-center justify-between pt-2">
                        <h1 className="text-lg font-semibold md:text-2xl">
                            Search Results for{" "}
                            <span>
                  {`"`}
                                {decodeURI(searchQuery)}
                                {`"`}
                </span>
                        </h1>
                    </div>

                    <div className="flex flex-col gap-1 py-4">
                        <PitchesList data={searchResults}/>
                    </div>
                </div>
            </Pages>
        </div>
    )
        ;
}