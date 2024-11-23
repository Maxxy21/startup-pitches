// types/evaluation.ts
import {Id} from "@/convex/_generated/dataModel";

export interface Evaluation {
    criteria: string;
    comment: string;
    score: number;
    strengths: string[];
    improvements: string[];
    aspects: string[];
}

export interface EvaluationData {
    evaluations: Evaluation[];
    overallScore: number;
    overallFeedback: string;
}


export interface PitchData {
    _id: Id<"pitches">;
    _creationTime: number;
    name: string;
    text: string;
    type: string;
    status: string;
    evaluation: EvaluationData;
    userId: string;
    categories?: string[];
    isFavorite?: boolean;
    notes?: {
        content: string;
        createdAt: number;
        updatedAt: number;
    }[];
    versions?: {
        text: string;
        evaluation: EvaluationData;
        createdAt: number;
    }[];
    createdAt: number;
    updatedAt: number;
}