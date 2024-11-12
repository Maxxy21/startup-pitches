import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const UserProfile = () => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <div >
            <SignedIn>
                <UserButton  appearance={{ baseTheme: isDark ? dark : undefined }}/>
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal"/>
            </SignedOut>
        </div>

    )
}

export default UserProfile;