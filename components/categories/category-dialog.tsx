"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export const CategoryDialog = () => {
    const [name, setName] = useState("");
    const { mutate, pending } = useApiMutation(api.pitches.addCategory);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await mutate({ name });
            toast.success("Category added");
            setName("");
        } catch (error) {
            toast.error("Failed to add category");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Add Category</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Input
                        placeholder="Category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button
                        type="submit"
                        disabled={pending || !name.trim()}
                        className="w-full"
                    >
                        Add Category
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};