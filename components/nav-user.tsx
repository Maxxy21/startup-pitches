"use client"

import {
    BadgeCheck,
    ChevronsUpDown,
    LogOut,
} from "lucide-react"
import {useClerk, useUser} from "@clerk/nextjs";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {dark} from "@clerk/themes";
import {useTheme} from "next-themes";


interface NavUserProps {
    isDark?: boolean;
}

export function NavUser({isDark}: NavUserProps) {
    const {isMobile} = useSidebar()
    const {user} = useUser();
    const {signOut} = useClerk();
    const {openUserProfile} = useClerk();

    if (!user) return null;

    const handleSignOut = () => {
        signOut();
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.imageUrl} alt={user.fullName || ''}/>
                                <AvatarFallback className="rounded-lg">
                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user.fullName}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.imageUrl} alt={user.fullName || ''}/>
                                    <AvatarFallback className="rounded-lg">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user.fullName}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.primaryEmailAddress?.emailAddress}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => openUserProfile({appearance: {baseTheme: isDark ? dark : undefined}})}>
                                <BadgeCheck className="mr-2"/>
                                Account
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleSignOut}>
                            <LogOut className="mr-2"/>
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}