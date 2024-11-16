
import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

// Types
const evaluationObject = v.object({
    criteria: v.string(),
    comment: v.string(),
    score: v.number(),
    strengths: v.array(v.string()),
    improvements: v.array(v.string()),
    aspects: v.array(v.string()),
});

const evaluationArgs = v.object({
    evaluations: v.array(evaluationObject),
    overallScore: v.number(),
    overallFeedback: v.string(),
});


// Helper function for auth check
const validateUser = async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthorized: Please log in to continue");
    }
    return identity;
};

// Queries
export const getPitches = query({
    args: {
        status: v.optional(v.string()),
        sortBy: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        let queryBuilder = ctx.db
            .query("pitches")
            .filter((q) => q.eq(q.field("userId"), identity.subject));

        if (args.status) {
            queryBuilder = queryBuilder.filter((q) =>
                q.eq(q.field("status"), args.status)
            );
        }

        if (args.sortBy === "recent") {
            queryBuilder = queryBuilder.order("desc");
        }

        if (args.limit) {
            queryBuilder = queryBuilder.take(args.limit);
        }

        return await queryBuilder.collect();
    },
});

export const searchPitches = query({
    args: { searchTerm: v.string() },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);
        const searchTerm = args.searchTerm.toLowerCase();
        console.log("Searching for:", searchTerm);

        const allPitches = await ctx.db
            .query("pitches")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .collect();

        console.log("All pitches:", allPitches);

        const filteredPitches = allPitches.filter(pitch =>
            pitch.name.toLowerCase().includes(searchTerm) ||
            pitch.text.toLowerCase().includes(searchTerm) ||
            pitch.evaluation.overallFeedback.toLowerCase().includes(searchTerm) ||
            pitch.evaluation.evaluations.some(evali =>
                evali.comment.toLowerCase().includes(searchTerm)
            )
        );

        console.log("Filtered pitches:", filteredPitches);
        return filteredPitches;
    },
});
export const getPitch = query({
    args: {
        id: v.id("pitches"),
    },
    handler: async (ctx, {id}) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(id);
        if (!pitch) {
            throw new Error("Pitch not found");
        }

        if (pitch.userId !== identity.subject) {
            throw new Error("Unauthorized: You don't have access to this pitch");
        }

        return pitch;
    },
});

// Mutations
export const createPitch = mutation({
    args: {
        name: v.string(),
        text: v.string(),
        type: v.string(),
        status: v.string(),
        evaluation: evaluationArgs,
        createdAt: v.number(),
        updatedAt: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        // Simplified to just create the pitch without user stats
        return await ctx.db.insert("pitches", {
            ...args,
            userId: identity.subject,
        });
    },
});

export const updatePitch = mutation({
    args: {
        id: v.id("pitches"),
        name: v.optional(v.string()),
        text: v.optional(v.string()),
        status: v.optional(v.string()),
        evaluation: v.optional(evaluationArgs),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.id);
        if (!pitch) {
            throw new Error("Pitch not found");
        }

        if (pitch.userId !== identity.subject) {
            throw new Error("Unauthorized: You don't have permission to update this pitch");
        }

        const updates = {
            ...args,
            updatedAt: Date.now(),
        };
        delete updates.id;

        return await ctx.db.patch(args.id, updates);
    },
});

export const removePitch = mutation({
    args: {
        pitchId: v.id("pitches"),
    },
    handler: async (ctx, {pitchId}) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(pitchId);
        if (!pitch) {
            throw new Error("Pitch not found");
        }

        if (pitch.userId !== identity.subject) {
            throw new Error("Unauthorized: You don't have permission to delete this pitch");
        }

        await ctx.db.delete(pitchId);
    },
});