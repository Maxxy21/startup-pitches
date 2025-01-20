import {useState} from "react";
import {toast} from "sonner";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "./ui/button";
import {QuestionsInterface} from "@/components/questions-interface";

interface FollowUpSectionProps {
    id: string;
    pitchText: string;
    evaluation: any;
}

const FollowUpSection = ({id, pitchText, evaluation}: FollowUpSectionProps) => {
    const [questions, setQuestions] = useState<string[]>([]);
    const [showQuestions, setShowQuestions] = useState(false);

    const handleStartFollowUp = async () => {
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    pitchText,
                    evaluation
                })
            });

            if (!response.ok) throw new Error('Failed to generate questions');
            const {questions} = await response.json();
            setQuestions(questions);
            setShowQuestions(true);
        } catch (error) {
            toast.error('Failed to generate follow-up questions');
        }
    };

    const handleResponsesComplete = async (responses: Array<{ question: string; response: string }>) => {
        // Here you can implement additional evaluation of the responses
        toast.success('Follow-up responses recorded successfully!');
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Follow-up Questions</CardTitle>
            </CardHeader>
            <CardContent>
                {!showQuestions ? (
                    <Button onClick={handleStartFollowUp}>
                        Start Follow-up Questions
                    </Button>
                ) : (
                    <QuestionsInterface
                        pitchId={id}
                        questions={questions}
                        onComplete={handleResponsesComplete}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default FollowUpSection;