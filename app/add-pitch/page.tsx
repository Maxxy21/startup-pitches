"use client"

import React, {useState, FormEvent} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import FileUploader from '@/components/file-uploader';
import {transcribeAudio, evaluatePitch} from '@/actions/openai';
import {usePitch} from '@/contexts/PitchContext';

const AddPitchPage = () => {
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const {updatePitchData} = usePitch();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!audioBlob) return;

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        const transcriptionText = await transcribeAudio(formData);
        const evaluationResults = await evaluatePitch(transcriptionText);

        updatePitchData({transcription: transcriptionText, evaluations: evaluationResults});

        router.push(`/pitch-detail/${new Date().getTime()}`);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold pb-24">Add Pitch</h1>
            <form onSubmit={handleSubmit}>
                <FileUploader setAudioBlob={setAudioBlob}/>
                <Button type="submit">Submit</Button>
            </form>
        </main>
    );
};

export default AddPitchPage;