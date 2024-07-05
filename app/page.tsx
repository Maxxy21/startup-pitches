'use client';

import {SideBar} from "@/app/_components/nav/side-bar";
import Link from "next/link";
import MobileNav from "@/app/_components/nav/mobile-nav";

export default function Home() {

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <SideBar/>
            <div className="flex flex-col">
                <MobileNav/>
                {/*<main className=" flex flex-1 flex-col gap-4 p-4 lg:px-8">*/}
                {/*    <h1>Welcome to Speech to Text Evaluation</h1>*/}
                {/*    <Link href="/add-pitch">*/}
                {/*        Add Pitch*/}
                {/*    </Link>*/}
                {/*</main>*/}
            </div>
        </div>
    );
}


