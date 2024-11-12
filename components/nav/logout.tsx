import {SignOutButton, SignedIn, useClerk} from "@clerk/nextjs";
import {IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt} from "@tabler/icons-react";

const Logout = () => {
    const {session, signOut} = useClerk();
    return (
        <SignedIn>
            <SignOutButton signOutOptions={{sessionId: session?.id}}>
                <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
            </SignOutButton>
        </SignedIn>
    )
}

export default Logout;