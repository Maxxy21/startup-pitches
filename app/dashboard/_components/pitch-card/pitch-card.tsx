"use client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils";
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { Actions } from "@/components/actions";
import { MoreHorizontal, Star } from "lucide-react";
import React from "react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

interface PitchCardProps {
    pitch: Doc<"pitches">;
    onClick: () => void;
}

interface PitchCardProps {
    pitch: Doc<"pitches">;
    onClick: () => void;
}

export const PitchCard = ({ pitch, onClick }: PitchCardProps) => {
    const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(api.pitches.favorite);
    const { mutate: onUnfavorite, pending: pendingUnfavorite } = useApiMutation(api.pitches.unfavorite);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (pitch.isFavorite) {
            onUnfavorite({ id: pitch._id })
                .catch(() => toast.error("Failed to unfavorite"));
        } else {
            onFavorite({ id: pitch._id })
                .catch(() => toast.error("Failed to favorite"));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
            className="group h-[250px]" // Fixed height container
        >
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 dark:bg-neutral-800/50">
                <CardHeader className="flex-none"> {/* flex-none to prevent header from growing */}
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold truncate">
                            {pitch.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Actions
                                id={pitch._id}
                                title={pitch.title}
                                side="right"
                            >
                                <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                >
                                    <MoreHorizontal className="h-4 w-4"/>
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </Actions>
                        </div>
                    </div>
                    <CardDescription>
                        Created {formatDate(pitch._creationTime)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1"> {/* flex-1 to take remaining space */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 ">
                        {pitch.text}
                    </p>
                </CardContent>
                <CardFooter className="flex-none justify-between"> {/* flex-none to prevent footer from growing */}
                    <Button
                        variant="outline"
                        onClick={onClick}
                        size="sm"
                        className="px-4 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
                    >
                        View
                    </Button>
                    <button
                        onClick={toggleFavorite}
                        disabled={pendingFavorite || pendingUnfavorite}
                        className={cn(
                            "focus:outline-none",
                            (pendingFavorite || pendingUnfavorite) && "cursor-not-allowed opacity-75"
                        )}
                    >
                        <Star
                            className={cn(
                                "h-4 w-4 hover:text-blue-600 transition",
                                pitch.isFavorite && "fill-blue-600 text-blue-600"
                            )}
                        />
                    </button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};





