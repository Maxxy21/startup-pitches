"use client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PitchCardSkeleton = () => {
    return (
        <div className="p-4">
            <Skeleton className="h-10 w-[200px] mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <Card key={index} className="mb-4 hover:shadow-lg transition-shadow duration-200 dark:bg-neutral-800/50">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-7 w-1/2" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-1/3 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-start">
                            <Skeleton className="h-9 w-24 rounded-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};