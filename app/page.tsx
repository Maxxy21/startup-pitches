'use client';

import {SignInButton} from "@clerk/nextjs";

export default function Home() {

    return (
        <main className="flex flex-col items-center justify-between p-24">
            <SignInButton/>
        </main>

    );
}


