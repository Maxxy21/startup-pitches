import { NextResponse } from 'next/server';
import {getOpenAI} from "@/utils";

export async function POST(req: Request) {
    try {
        const openai = getOpenAI();
        const formData = await req.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

        const transcription = await openai.audio.transcriptions.create({
            file: new File([audioBuffer], audioFile.name, { type: audioFile.type }),
            model: "whisper-1",
            language: "en",
            response_format: "text",
        });

        return NextResponse.json({ text: transcription });
    } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json(
            { error: 'Transcription failed' },
            { status: 500 }
        );
    }
}