'use client';
import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { useFormState } from 'react-dom';
import { transcribeAudio } from '@/app/actions';
import { Button } from '@/components/ui/button';

export default function Home() {
    const initialState = { result: 'Upload an audio file or record audio.' };
    const [state, formAction] = useFormState(transcribeAudio, initialState);

    const [recording, setRecording] = useState<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            setAudioBlob(blob);
            audioChunksRef.current = [];
        };

        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setAudioBlob(file ? new Blob([file], { type: file.type }) : null);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!audioBlob) return;

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        formAction(formData);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold pb-24">Start-up Pitches</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="audio" className="block">
                    Audio file:
                </label>
                <input type="file" name="audio" onChange={handleFileChange} className="w-96 p-4" />
                <div className="flex space-x-4">
                    <Button type="button" onClick={recording ? stopRecording : startRecording}>
                        {recording ? 'Stop Recording' : 'Start Recording'}
                    </Button>
                    <Button type="submit">Submit</Button>
                </div>

            </form>
            <p>{state?.result}</p>
        </main>
    );
}
