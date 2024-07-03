"use client"

import React from 'react';
import {usePitch} from '@/contexts/PitchContext';

const PitchDetailPage: React.FC = () => {
    const {pitchData} = usePitch();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold">Pitch Details</h1>
            <h2 className="text-2xl font-semibold mt-6">Transcription:</h2>
            <p className="mt-2">{pitchData.transcription}</p>
            <h2 className="text-2xl font-semibold mt-6">Evaluations:</h2>
            <ul className="list-disc mt-2">
                {pitchData.evaluations.map((evali, index) => (
                    <li key={index}>
                        <strong>{evali.criteria}:</strong> {evali.evaluation}
                    </li>
                ))}
            </ul>
        </main>
    );
};

export default PitchDetailPage;