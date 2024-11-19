"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DeletePitch from "@/components/pitches/delete-pitch";
import { formatDate } from "@/utils";
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";

interface PitchCardProps {
    pitch: Doc<"pitches">;
    onClick: () => void;
}

export const PitchCard = ({ pitch, onClick }: PitchCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
        >
            <Card className="mb-4 hover:shadow-lg transition-shadow duration-200 dark:bg-neutral-800/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">{pitch.name}</CardTitle>
                        <DeletePitch pitchId={pitch._id} />
                    </div>
                    <CardDescription>
                        Created {formatDate(pitch._creationTime)}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {pitch.text}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-start">
                    <Button
                        variant="outline"
                        onClick={onClick}
                        size="sm"
                        className="px-4 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
                    >
                        View
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};