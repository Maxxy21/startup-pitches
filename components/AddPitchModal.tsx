// components/AddPitchModal.tsx
import React, { useState, FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileUploader from '@/components/file-uploader';
import { transcribeAudio, evaluatePitch } from '@/actions/openai';
import { useMutation } from 'convex/react';
import {api} from "@/convex/_generated/api";

const AddPitchModal = () => {
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const createPitch = useMutation(api.pitches.create);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!audioBlob) return;

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        const transcriptionText = await transcribeAudio(formData);
        const evaluationResults = await evaluatePitch(transcriptionText);

        await createPitch({
            text: transcriptionText,
            evaluation: JSON.stringify(evaluationResults)
        });

        // Reset and close modal here if needed
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add New Pitch</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Pitch</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <FileUploader setAudioBlob={setAudioBlob}/>
                    <DialogFooter>
                        <Button type="submit">Submit</Button>
                        <DialogClose asChild>
                            <Button type="button">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddPitchModal;
