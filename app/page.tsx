'use client';
import {useState, FormEvent} from 'react';
import {useFormState} from 'react-dom';

import {transcribeAudio} from '@/app/actions';
import {Button} from '@/components/ui/button';
import FileUploader from './_components/FileUploader';
import AudioRecorder from './_components/AudioRecorder';
import ResultDisplay from './_components/ResultDisplay';

export default function Home() {
    const initialState = {result: 'Upload an audio file or record audio.'};
    const [state, formAction] = useFormState(transcribeAudio, initialState);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!audioBlob) return;

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        formAction(formData);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold pb-24">Speech to Text</h1>
            <form onSubmit={handleSubmit}>
                <FileUploader setAudioBlob={setAudioBlob}/>
                <div className="flex space-x-4">
                    <AudioRecorder setAudioBlob={setAudioBlob}/>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
            <ResultDisplay result={state?.result}/>
        </main>
    );
}
