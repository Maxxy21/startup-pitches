"use client";
import {useFormState} from "react-dom";

import {transcribeAudio} from "@/app/actions";
import { Button } from "@/components/ui/button"


export default function Home() {
    const initialState = {result: "Upload an audio file."};
    const [state, formAction] = useFormState(transcribeAudio, initialState);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold pb-24">Speech to Text</h1>
            <form action={formAction}>
                <label htmlFor="audio" className="block">
                    Audio file:
                </label>
                <input type="file" name="audio" className="w-96 p-4"/>
                <Button>Submit</Button>
            </form>
            <p>{state?.result}</p>
        </main>
    );
}
