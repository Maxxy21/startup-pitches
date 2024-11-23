"use client";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import { CategoryFilter } from "./category-filter";
import React from "react";

interface FilterState {
    categories: string[];
    scoreRange: {
        min: number;
        max: number;
    };
    sortBy: "date" | "score";
}

interface FilterPanelProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
}

export const FilterPanel = React.memo(({ filters, onChange }: FilterPanelProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleScoreRangeChange = (value: number[]) => {
        onChange({
            ...filters,
            scoreRange: {
                min: value[0],
                max: value[1]
            }
        });
    };

    const handleSortChange = (sortBy: "date" | "score") => {
        onChange({
            ...filters,
            sortBy
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filter Pitches</SheetTitle>
                </SheetHeader>
                <SheetDescription>
                    Filter pitches by category, score range, and sort order.
                </SheetDescription>
                <div className="space-y-6 mt-4" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Score Range</h3>
                        <Slider
                            min={0}
                            max={10}
                            step={0.1}
                            value={[filters.scoreRange.min, filters.scoreRange.max]}
                            onValueChange={handleScoreRangeChange}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{filters.scoreRange.min.toFixed(1)}</span>
                            <span>{filters.scoreRange.max.toFixed(1)}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium mb-2">Sort By</h3>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant={filters.sortBy === "date" ? "default" : "outline"}
                                onClick={() => handleSortChange("date")}
                            >
                                Date
                            </Button>
                            <Button
                                size="sm"
                                variant={filters.sortBy === "score" ? "default" : "outline"}
                                onClick={() => handleSortChange("score")}
                            >
                                Score
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
});

FilterPanel.displayName = "FilterPanel";