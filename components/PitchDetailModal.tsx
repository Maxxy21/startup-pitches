// components/PitchDetailModal.tsx
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface PitchDetailModalProps {
    pitch: any; // Adjust this to match the pitch type from your backend
}

export const PitchDetailModal: React.FC<PitchDetailModalProps> = ({pitch}) => {
    if (!pitch) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">See Pitch</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Pitch Details</DialogTitle>
                    <DialogDescription>
                        Detailed view of the selected pitch.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="pitchText" className="text-right">
                            Pitch Text
                        </Label>
                        <Input id="pitchText" defaultValue={pitch.text} className="col-span-3" readOnly/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="evaluation" className="text-right">
                            Evaluation
                        </Label>
                        <Input id="evaluation" defaultValue={pitch.evaluation} className="col-span-3" readOnly/>
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
