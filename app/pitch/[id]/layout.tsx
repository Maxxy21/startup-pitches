import {SidebarProvider} from "@/components/nav/SidebarProvider";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            {children}
        </SidebarProvider>
    )
}