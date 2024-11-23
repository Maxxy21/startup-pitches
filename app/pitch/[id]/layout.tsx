import {Pages} from "@/components/nav/pages";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <Pages>
            {children}
        </Pages>
    )
}