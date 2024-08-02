import OpenAI from "openai";

let openai: OpenAI | null = null;


function getOpenAI() {
    if (openai === null) {
        openai = new OpenAI();
    }
    return openai;
}

export const getEmbeddingsWithAI = async (searchText: string) => {
    const embedding = await getOpenAI().embeddings.create({
        model: "text-embedding-ada-002",
        input: searchText,
        encoding_format: "float",
    });

    console.log(embedding);

    const vector = embedding.data[0].embedding;
    console.log(`Embedding of ${searchText}: , ${vector.length} dimensions`);

    return vector;
};