"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { SearchInput } from "@/app/dashboard/_components/search-input";

export const DashboardHeader = () => {
    return (
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-x-4">
            <div className="flex items-center justify-between lg:flex-1">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <div className="lg:hidden">
                    <ModeToggle />
                </div>
            </div>

            <div className="w-full lg:w-[600px]">
                <SearchInput />
            </div>

            <div className="hidden lg:block">
                <ModeToggle />
            </div>
        </header>
    );
};