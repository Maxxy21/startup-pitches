import Image from "next/image";
import {CreateOrganization} from "@clerk/nextjs";

import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import {dark} from "@clerk/themes";
import {useTheme} from "next-themes";
import * as React from "react";

export const EmptyOrg = () => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <div className="grid grid-cols-7 gap-4 mt-20">
            <div className="col-start-4 ">
                <div className="col-span-4">
                    <div className="flex flex-col items-center justify-center">
                        <Image
                            src="/elements.svg"
                            alt="Empty"
                            height={200}
                            width={200}
                        />
                        <h2 className="text-2xl font-semibold mt-6">
                            Welcome to Board
                        </h2>
                        <p className="text-muted-foreground text-sm mt-2">
                            Create an organization to get started
                        </p>
                        <div className="mt-6">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="lg">
                                        Create organization
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
                                    <CreateOrganization appearance={{baseTheme: isDark ? dark : undefined}}
                                                        routing={"hash"}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};
