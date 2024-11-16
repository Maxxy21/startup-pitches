import {Doc} from "@/convex/_generated/dataModel";

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

export interface PitchData extends Doc<"pitches"> {
    evaluation: EvaluationData;
    text: string;
}

export interface EvaluationContentProps {
    data: PitchData;
}

export interface CriteriaProgressProps {
    evaluations: Evaluation[];
}