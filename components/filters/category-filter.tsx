"use client";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
    selected: string[];
    onChange: (categories: string[]) => void;
}

export const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => {
    const categories = useQuery(api.pitches.getCategories);

    if (!categories?.length) return null;

    const toggleCategory = (category: string) => {
        if (selected.includes(category)) {
            onChange(selected.filter(c => c !== category));
        } else {
            onChange([...selected, category]);
        }
    };

    return (
        <ScrollArea className="w-full">
            <div className="flex flex-wrap gap-2 p-1">
                {categories.map((category) => (
                    <Badge
                        key={category._id}
                        variant={selected.includes(category.name) ? "default" : "outline"}
                        className={cn(
                            "cursor-pointer hover:opacity-75 transition",
                            category.color && `bg-${category.color}-500`
                        )}
                        onClick={() => toggleCategory(category.name)}
                    >
                        {category.name}
                    </Badge>
                ))}
            </div>
        </ScrollArea>
    );
};