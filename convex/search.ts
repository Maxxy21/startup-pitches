import { v } from "convex/values";
import { action, internalQuery } from "./_generated/server";
import { getEmbeddingsWithAI } from "./openAIEmbeddings";
import { internal } from "./_generated/api";

export const fetchSearchResults = internalQuery({
    args: {
        results: v.array(v.object({ _id: v.id("pitches"), _score: v.float64() })),
    },
    handler: async (ctx, args) => {
        const results = [];
        for (const result of args.results) {
            const doc = await ctx.db.get(result._id);
            if (doc === null) {
                continue;
            }
            results.push({ ...doc });
        }
        return results;
    },
});

export const searchPitches = action({
    args: {
        query: v.string(),
    },
    handler: async (ctx, { query }) => {
        try {
            const identity = await ctx.auth.getUserIdentity();
            if (identity) {
                // 1. Generate an embedding from you favorite third party API:
                const embedding = await getEmbeddingsWithAI(query);

                // 2. Then search for similar foods!
                const results = await ctx.vectorSearch("pitches", "by_embeddings", {
                    vector: embedding,
                    limit: 16,
                    filter: (q) => q.eq("userId", identity.subject),
                });
                const rows: any = await ctx.runQuery(
                    internal.search.fetchSearchResults,
                    {
                        results,
                    }
                );
                return rows;
            }
        } catch (err) {
            console.error("Error searching", err);
        }
    },
});