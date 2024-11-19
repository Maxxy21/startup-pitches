import { Pages } from "@/components/nav/pages";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <Pages>
            {children}
        </Pages>
    );
}