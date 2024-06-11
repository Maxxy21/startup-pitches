"use server";

import fs from "fs/promises";
import {createReadStream} from "fs";
import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAI() {
    if (openai === null) {
        openai = new OpenAI();
    }
    return openai;
}

export async function transcribeAudio(prevState: any, formData: FormData) {
    const audioFile = formData.get("audio") as File;

    const buffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(buffer);

    await fs.writeFile(audioFile.name, audioBuffer);

    const transcription = await getOpenAI().audio.transcriptions.create({
        file: createReadStream(audioFile.name),
        model: "whisper-1",
    });

    await fs.unlink(audioFile.name);

    console.log("result", transcription.text);
    return {result: transcription.text};
}