import { NextResponse } from 'next/server';
import { evaluatePitch } from "@/evaluations";

export const runtime = 'edge';
export const maxDuration = 300;

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        //Timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Evaluation timed out')), 240000); // 4 minutes
        });

        // Race between evaluation and timeout
        const evaluationResults = await Promise.race([
            evaluatePitch(text),
            timeoutPromise
        ]);

        return NextResponse.json(evaluationResults);
    } catch (error: any) {
        console.error('Evaluation error:', error);
        return NextResponse.json(
            { error: 'Evaluation failed' },
            { status: 500 }
        );
    }
}
