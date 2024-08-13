import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import React from "react";
import {Id} from "@/convex/_generated/dataModel";
import {useAction, useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useRouter} from "next/navigation";

const DeletePitch = ({pitchId}: {
    pitchId: Id<"pitches">
}) => {
    const form = useForm();
    const router = useRouter();

    const deletePitch = useMutation(api.pitches.removePitch)

    const onSubmit = async () => {
        const deleteTaskId = await deletePitch({pitchId});
        router.push("/dashboard")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-haspopup="true"
                    size="icon"
                    variant="ghost"
                >
                    <MoreHorizontal className="h-4 w-4"/>
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DropdownMenuItem>
                        Delete
                    </DropdownMenuItem>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DeletePitch