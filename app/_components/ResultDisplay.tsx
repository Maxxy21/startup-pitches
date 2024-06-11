import React from 'react';

interface ResultDisplayProps {
    result: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
    return <p className="mt-4">{result}</p>;
};

export default ResultDisplay;
