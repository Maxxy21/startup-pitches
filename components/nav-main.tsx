"use client"

import { LucideIcon } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavMainProps {
    items: {
        title: string
        icon: LucideIcon
        value: string
    }[]
}

export function NavMain({ items }: NavMainProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view");

    const handleNavigation = (value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (value === "home") {
            current.delete("view");
        } else {
            current.set("view", value);
        }


        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.replace(`/dashboard${query}`);
    };

    return (
        <SidebarMenu>
            {items.map((item) => {
                const isActive =
                    (item.value === "home" && !currentView) ||
                    currentView === item.value;

                return (
                    <SidebarMenuItem key={item.title} className="mx-2">
                        <SidebarMenuButton
                            isActive={isActive}
                            onClick={() => handleNavigation(item.value)}
                        >
                            <item.icon className="h-4 w-4 mr-2" />
                            <span>{item.title}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}
