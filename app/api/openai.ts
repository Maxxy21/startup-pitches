import OpenAI from "openai";

let openai: OpenAI | null = null;

export function getOpenAI() {
    if (openai === null) {
        openai = new OpenAI();
    }
    return openai;
}
