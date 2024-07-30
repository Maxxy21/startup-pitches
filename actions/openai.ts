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

export async function transcribeAudio(formData: FormData) {
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
    return transcription.text
}

// export async function evaluatePitch(transcription: string): Promise<any> {
//     const openai = getOpenAI();
//     const prompts = [
//         "Soundness of the project in terms of problem-solution-customer fit",
//         "Potential of the project as a startup business",
//         "Quality of the presentation"
//     ];
//
//     return await Promise.all(prompts.map(async (prompt) => {
//         const completion = await openai.chat.completions.create({
//             messages: [
//                 {
//                     role: "system",
//                     content: "You are an assistant that evaluates startup pitches.ts based on specific criteria."
//                 },
//                 {
//                     role: "user",
//                     content: `Evaluate this pitch based on the following criteria: ${prompt}\n\n"${transcription}"`
//                 }
//             ],
//             model: "gpt-3.5-turbo",
//         });
//
//         return {
//             criteria: prompt,
//             evaluation: completion.choices[0].message.content
//         };
//     }));
// }


// export async function evaluatePitch(transcription: string): Promise<any> {
//     const openai = getOpenAI();
//     const prompts = [
//         "Soundness of the project in terms of problem-solution-customer fit",
//         "Potential of the project as a startup business",
//         "Quality of the presentation"
//     ];
//
//     return await Promise.all(prompts.map(async (prompt) => {
//         const completion = await openai.chat.completions.create({
//             messages: [
//                 {
//                     role: "system",
//                     content: "You are an assistant that evaluates startup pitches based on specific criteria."
//                 },
//                 {
//                     role: "user",
//                     content: `Evaluate this pitch based on the following criteria: ${prompt}\n\n"${transcription}"`
//                 }
//             ],
//             model: "gpt-3.5-turbo",
//         });
//
//         return {
//             criteria: prompt,
//             comment: completion.choices[0].message.content,
//             score: Math.floor(Math.random() * 10) + 1  // Generating random scores for illustration
//         };
//     }));
// }


export async function evaluatePitch(transcription: string): Promise<{ criteria: string; comment: string; score: number; }[]> {
    const openai = getOpenAI();
    const prompts = [
        "Soundness of the project in terms of problem-solution-customer fit",
        "Potential of the project as a startup business",
        "Quality of the presentation"
    ];

    const evaluations = await Promise.all(prompts.map(async (prompt) => {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an assistant that evaluates startup pitches based on specific criteria."
                },
                {
                    role: "user",
                    content: `Evaluate this pitch based on the following criteria: ${prompt}\n\n"${transcription}"`
                }
            ],
            model: "gpt-3.5-turbo",
        });

        // Ensure comment is never null, provide a default empty string or a meaningful default message
        const comment = completion.choices[0].message.content || "No comment provided";

        return {
            criteria: prompt,
            comment: comment,
            score: Math.floor(Math.random() * 10) + 1  // Generating random scores for illustration
        };
    }));

    return evaluations;
}


