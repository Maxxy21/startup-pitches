"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PitchData {
    transcription: string;
    evaluations: any[];
}

interface PitchContextType {
    pitchData: PitchData;
    updatePitchData: (data: PitchData) => void;
}

const PitchContext = createContext<PitchContextType | null>(null);

export const usePitch = () => {
    const context = useContext(PitchContext);
    if (!context) {
        throw new Error('usePitch must be used within a PitchProvider');
    }
    return context;
};

interface PitchProviderProps {
    children: ReactNode;
}

export const PitchProvider: React.FC<PitchProviderProps> = ({ children }) => {
    const [pitchData, setPitchData] = useState<PitchData>({ transcription: '', evaluations: [] });

    const updatePitchData = (data: PitchData) => {
        setPitchData(data);
    };

    return (
        <PitchContext.Provider value={{ pitchData, updatePitchData }}>
            {children}
        </PitchContext.Provider>
    );
};
