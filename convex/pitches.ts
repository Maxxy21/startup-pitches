import {action, mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {getEmbeddingsWithAI} from "./openAIEmbeddings";
import {api} from "@/convex/_generated/api";


export const getPitches = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity) {
            return await ctx.db
                .query("pitches")
                .filter((q) => q.eq(q.field("userId"), identity.subject))
                .collect();
        }
        return [];
    },
});

export const getPitch = query({
    args: {
        id: v.id("pitches"),
    },
    handler: async (ctx, {id}) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        return await ctx.db.get(id);
    },
});

export const removePitch = mutation({
    args: {
        pitchId: v.id("pitches"),
    },
    handler: async (ctx, {pitchId}) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }
        await ctx.db.delete(pitchId);
    },
});


export const createPitch = mutation({
    args: {
        evaluation: v.array(v.object({
            criteria: v.string(),
            comment: v.string(),
            score: v.number(),
        })),
        text: v.string(),
        name: v.string(),
        embedding: v.optional(v.array(v.float64()))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        return await ctx.db.insert("pitches", {
            name: args.name,
            text: args.text,
            evaluation: args.evaluation,
            userId: identity.subject,
            embedding: args.embedding,
        });
    },
});


export const createPitchEmbeddings = action({
    args: {
        evaluation: v.array(v.object({
            criteria: v.string(),
            comment: v.string(),
            score: v.number(),
        })),
        text: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const embedding = await getEmbeddingsWithAI(args.name);

        await ctx.runMutation(api.pitches.createPitch, {
            name: args.name,
            text: args.text,
            evaluation: args.evaluation,
            embedding,
        });

    },
});

// export const remove = mutation({
//     args
// }
