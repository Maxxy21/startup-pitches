import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Loader2, Mic, Square } from "lucide-react";

interface QuestionsInterfaceProps {
    pitchId: string;
    questions: string[];
    onComplete: (responses: Array<{ question: string; response: string }>) => void;
}

export const QuestionsInterface = ({ pitchId, questions, onComplete }: QuestionsInterfaceProps) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [responses, setResponses] = useState<Array<{ question: string; response: string }>>([]);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const { toast } = useToast();

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                await handleAudioUpload(audioBlob);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to start recording. Please check your microphone permissions.",
                variant: "destructive",
            });
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleAudioUpload = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Transcription failed');

            const { text } = await response.json();

            const newResponses = [
                ...responses,
                { question: questions[currentQuestion], response: text }
            ];

            setResponses(newResponses);

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            } else {
                onComplete(newResponses);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to process your response. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                    Question {currentQuestion + 1} of {questions.length}
                </h3>
                <p className="text-lg mb-6">{questions[currentQuestion]}</p>

                <div className="flex justify-center gap-4">
                    {!isRecording ? (
                        <Button
                            onClick={startRecording}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            <Mic className="w-4 h-4 mr-2" />
                            Start Recording
                        </Button>
                    ) : (
                        <Button
                            onClick={stopRecording}
                            variant="destructive"
                        >
                            <Square className="w-4 h-4 mr-2" />
                            Stop Recording
                        </Button>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};