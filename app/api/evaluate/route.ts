import { NextResponse } from 'next/server';
import {evaluatePitch} from "@/evaluations";


export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }
        const evaluationResults = await evaluatePitch(text);

        return NextResponse.json(evaluationResults);
    } catch (error) {
        console.error('Evaluation error:', error);
        return NextResponse.json(
            { error: 'Evaluation failed' },
            { status: 500 }
        );
    }
}