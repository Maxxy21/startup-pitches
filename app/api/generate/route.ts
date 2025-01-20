import { NextResponse } from 'next/server';
import { getOpenAI } from "@/utils";

export async function POST(req: Request) {
    try {
        const { pitchText, evaluation } = await req.json();
        const openai = getOpenAI();

        const prompt = `
        Based on this startup pitch and its evaluation:
        
        Pitch: "${pitchText}"
        
        Evaluation Summary: "${evaluation.overallFeedback}"
        
        Generate 3 critical follow-up questions that a venture capitalist would ask. 
        Focus on areas that need clarification or deeper explanation.
        Format as a JSON array of questions.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an experienced venture capitalist." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const questions = JSON.parse(completion.choices[0].message.content || "{}");
        return NextResponse.json(questions);
    } catch (error) {
        console.error('Question generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate questions' },
            { status: 500 }
        );
    }
}