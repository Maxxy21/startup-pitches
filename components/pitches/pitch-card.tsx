"use client"
import React from 'react'
import {formatDate} from "@/utils";
import {Doc} from "@/convex/_generated/dataModel";
import {useRouter} from "next/navigation";
import DeletePitch from "@/components/pitches/delete-pitch";
import {Loading} from "@/components/auth/loading";
import {ScrollArea} from "@/components/ui/scroll-area";
import {FileUpload} from "@/components/add-pitches/file-upload";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Button} from "@/components/ui/button";
import {motion, AnimatePresence} from "framer-motion";

const PitchCard = ({pitch, router}: { pitch: Doc<"pitches">, router: any }) => {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            layout
        >
            <Card className="mb-4 hover:shadow-lg transition-shadow duration-200 dark:bg-neutral-800/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">{pitch.name}</CardTitle>
                        <DeletePitch pitchId={pitch._id}/>
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
                        onClick={() => router.push(`/dashboard/pitch/${pitch._id}`)}
                        size={"sm"}
                    >
                        See Evaluation
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

const PitchesGrid = ({data}: { data: Array<Doc<"pitches">> }) => {
    const router = useRouter();

    if (!data) return <Loading/>

    return (
        <div className="space-y-6">
            {/* Header with Title and Add Pitch Button */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Pitches</h1>
                <div className="flex-shrink-0">
                    <FileUpload />
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 w-full h-[calc(100vh-175px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    <AnimatePresence mode="popLayout">
                        {data.map((pitch: Doc<"pitches">) => (
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
}

export default PitchesGrid;