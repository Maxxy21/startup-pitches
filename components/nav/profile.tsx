import {useTheme} from "next-themes";
import {SignOutButton, SignedIn, useClerk} from "@clerk/nextjs";
import {IconUserBolt} from "@tabler/icons-react";
import React from "react";
import {dark} from "@clerk/themes";

const Profile = () => {
    const {openUserProfile} = useClerk();
    const {resolvedTheme} = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <SignedIn>
            <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
                          onClick={() => openUserProfile({appearance: {baseTheme: isDark ? dark : undefined}})}/>
        </SignedIn>
    )
}

export default Profile;