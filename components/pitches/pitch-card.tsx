"use client"
import {Skeleton} from "@/components/ui/skeleton"
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

const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-175px)]">
            <div className="bg-muted p-8 rounded-lg text-center max-w-md">
                <h3 className="text-lg font-medium mb-2">No pitches found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Get started by creating your first pitch
                </p>
                <motion.div
                    animate={{y: [0, -5, 0]}}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="text-3xl mb-2">↑</div>
                </motion.div>
                <p className="text-sm text-muted-foreground">
                    Click the Add Pitch button above
                </p>
            </div>
        </div>
    );
};

const PitchesGrid = ({data}: { data: Array<Doc<"pitches">> }) => {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Pitches</h1>
                <div className="flex-shrink-0">
                    <FileUpload/>
                </div>
            </div>

            {!data ? (
                <ScrollArea className="flex-1 w-full h-[calc(100vh-175px)]">
                    <PitchCardSkeleton/>
                </ScrollArea>
            ) : data.length === 0 ? (
                <EmptyState/>
            ) : (
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
            )}
        </div>
    );
};

const PitchCardSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {[1, 2, 3, 4, 5, 6].map((index) => (
                <Card key={index}
                      className="mb-4 hover:shadow-lg transition-shadow duration-200 dark:bg-neutral-800/50">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-7 w-1/2"/> {/* Title */}
                            <Skeleton className="h-8 w-8 rounded-full"/> {/* Delete button */}
                        </div>
                        <Skeleton className="h-4 w-1/3 mt-2"/> {/* Date */}
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full"/> {/* Text line 1 */}
                            <Skeleton className="h-4 w-full"/> {/* Text line 2 */}
                            <Skeleton className="h-4 w-2/3"/> {/* Text line 3 */}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-start">
                        <Skeleton className="h-9 w-24 rounded-full"/> {/* View button */}
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default PitchesGrid;