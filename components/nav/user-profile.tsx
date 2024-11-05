import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";

const UserProfile = () => {
    return (
        <div >
            <SignedIn>
                <UserButton/>
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal"/>
            </SignedOut>
        </div>

    )
}

export default UserProfile;