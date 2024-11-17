import {DatabaseReader, DatabaseWriter, mutation, MutationCtx, query, QueryCtx} from "./_generated/server";
import {ConvexError, v} from "convex/values";
import {Doc} from "@/convex/_generated/dataModel";

// Types
export const evaluationObject = v.object({
    criteria: v.string(),
    comment: v.string(),
    score: v.number(),
    strengths: v.array(v.string()),
    improvements: v.array(v.string()),
    aspects: v.array(v.string()),
});

export const evaluationArgs = v.object({
    evaluations: v.array(evaluationObject),
    overallScore: v.number(),
    overallFeedback: v.string(),
});

type Pitch = Doc<"pitches">;


// Helper function for auth check
const validateUser = async (ctx: { auth: any, db: DatabaseReader | DatabaseWriter }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new ConvexError("Unauthorized: Please log in to continue");
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
    handler: async (ctx: QueryCtx, args) => {
        const identity = await validateUser(ctx);

        // Let TypeScript infer the type
        const queryBuilder = ctx.db
            .query("pitches")
            .filter((q) => q.eq(q.field("userId"), identity.subject));

        if (args.status) {
            queryBuilder.filter((q) =>
                q.eq(q.field("status"), args.status)
            );
        }

        // Chain the queries directly
        const finalQuery = args.sortBy === "recent"
            ? queryBuilder.order("desc")
            : queryBuilder.order("asc");

        const result = args.limit
            ? await finalQuery.take(args.limit)
            : await finalQuery.collect();

        return result;
    },
});

export const searchPitches = query({
    args: {
        searchTerm: v.string(),
        sortBy: v.optional(v.string())
    },
    handler: async (ctx: QueryCtx, args) => {
        const identity = await validateUser(ctx);
        const searchTerm = args.searchTerm.toLowerCase();

        let queryBuilder = ctx.db
            .query("pitches")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .order("desc"); // Get newest first

        const allPitches = await queryBuilder.collect();

        // Filter for search
        const filteredPitches = allPitches.filter(pitch =>
            pitch.name.toLowerCase().includes(searchTerm) ||
            pitch.text.toLowerCase().includes(searchTerm) ||
            pitch.evaluation.overallFeedback.toLowerCase().includes(searchTerm) ||
            pitch.evaluation.evaluations.some(evali =>
                evali.comment.toLowerCase().includes(searchTerm)
            )
        );

        if (args.sortBy === "score") {
            return filteredPitches.sort((a, b) =>
                b.evaluation.overallScore - a.evaluation.overallScore
            );
        }

        return filteredPitches;
    },
});

export const getPitch = query({
    args: {
        id: v.id("pitches"),
    },
    handler: async (ctx: QueryCtx, {id}) => {
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
    handler: async (ctx: MutationCtx, args) => {
        const identity = await validateUser(ctx);

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
    handler: async (ctx: MutationCtx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.id);
        if (!pitch) {
            throw new Error("Pitch not found");
        }

        if (pitch.userId !== identity.subject) {
            throw new Error("Unauthorized: You don't have permission to update this pitch");
        }

        const updates = {
            ...(args.name && {name: args.name}),
            ...(args.text && {text: args.text}),
            ...(args.status && {status: args.status}),
            ...(args.evaluation && {evaluation: args.evaluation}),
            updatedAt: Date.now(),
        };

        return await ctx.db.patch(args.id, updates);
    },
});

export const removePitch = mutation({
    args: {
        pitchId: v.id("pitches"),
    },
    handler: async (ctx: MutationCtx, {pitchId}) => {
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


interface PitchStats {
    totalPitches: number;
    averageScore: number;
    bestPitch: Doc<"pitches"> | undefined;
    recentPitches: Doc<"pitches">[];
    scoreDistribution: Record<number, number>;
}

export const getPitchStats = query({
    args: {},
    handler: async (ctx: QueryCtx): Promise<PitchStats> => {
        const identity = await validateUser(ctx);

        const pitches = await ctx.db
            .query("pitches")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .collect();

        // Handle empty pitches case
        if (pitches.length === 0) {
            return {
                totalPitches: 0,
                averageScore: 0,
                bestPitch: undefined,
                recentPitches: [],
                scoreDistribution: {},
            };
        }
        // Calculate stats for non-empty pitches
        const totalScores = pitches.reduce((acc, pitch) => acc + pitch.evaluation.overallScore, 0);

        const bestPitch = pitches.reduce((best, current) => {
            if (!best) return current;
            return current.evaluation.overallScore > best.evaluation.overallScore ? current : best;
        }, pitches[0]);

        return {
            totalPitches: pitches.length,
            averageScore: totalScores / pitches.length,
            bestPitch,
            recentPitches: pitches.slice(-5),
            scoreDistribution: pitches.reduce((acc, pitch) => {
                const score = Math.floor(pitch.evaluation.overallScore);
                acc[score] = (acc[score] || 0) + 1;
                return acc;
            }, {} as Record<number, number>),
        };
    },
});


// Add categories/tags to pitches
export const updatePitchCategories = mutation({
    args: {
        id: v.id("pitches"),
        categories: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.id);
        if (!pitch) throw new Error("Pitch not found");
        if (pitch.userId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        return await ctx.db.patch(args.id, {
            categories: args.categories,
            updatedAt: Date.now(),
        });
    },
});

// Add ability to favorite/bookmark pitches
export const togglePitchFavorite = mutation({
    args: {
        pitchId: v.id("pitches"),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.pitchId);
        if (!pitch) throw new Error("Pitch not found");
        if (pitch.userId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        return await ctx.db.patch(args.pitchId, {
            isFavorite: !pitch.isFavorite,
            updatedAt: Date.now(),
        });
    },
});

// Add comments/notes to pitches
export const addPitchNote = mutation({
    args: {
        pitchId: v.id("pitches"),
        note: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.pitchId);
        if (!pitch) throw new Error("Pitch not found");
        if (pitch.userId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        const notes = pitch.notes || [];
        notes.push({
            content: args.note,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return await ctx.db.patch(args.pitchId, {
            notes,
            updatedAt: Date.now(),
        });
    },
});

// Get pitch history/versions
export const getPitchHistory = query({
    args: {
        pitchId: v.id("pitches"),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.pitchId);
        if (!pitch) throw new Error("Pitch not found");
        if (pitch.userId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        // Assuming you store versions in the pitch document
        return pitch.versions || [];
    },
});

// Compare two pitches
export const comparePitches = query({
    args: {
        pitchId1: v.id("pitches"),
        pitchId2: v.id("pitches"),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch1 = await ctx.db.get(args.pitchId1);
        const pitch2 = await ctx.db.get(args.pitchId2);

        if (!pitch1 || !pitch2) throw new Error("Pitch not found");
        if (pitch1.userId !== identity.subject || pitch2.userId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        return {
            pitch1,
            pitch2,
            comparison: {
                scoreDifference: pitch2.evaluation.overallScore - pitch1.evaluation.overallScore,
                improvements: pitch2.evaluation.evaluations.map((eval2, index) => ({
                    criteria: eval2.criteria,
                    scoreDifference: eval2.score - pitch1.evaluation.evaluations[index].score,
                })),
            },
        };
    },
});