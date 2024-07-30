'use client';

import SideBar from "@/components/nav/side-bar";
import Link from "next/link";
import MobileNav from "@/components/nav/mobile-nav";
import {Button} from "@/components/ui/button";
import {SignInButton} from "@clerk/nextjs";

export default function Home() {

    return (
        <main className="flex flex-col items-center justify-between p-24">
            <SignInButton/>

        </main>

    );
}


