import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Doc } from "@/convex/_generated/dataModel";
import { getAllOrThrow } from "convex-helpers/server/relationships";
import { evaluationData, questionAnswer } from "./schema";

interface PitchStats {
    totalPitches: number;
    averageScore: number;
    bestPitch: Doc<"pitches"> | undefined;
    recentPitches: Doc<"pitches">[];
    scoreDistribution: Record<number, number>;
}

const RECENT_PITCH_COUNT = 5;
const PREFETCH_COUNT = 10;

const validateUser = async (ctx: { auth: any }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new ConvexError({
            message: "Not authenticated",
            code: "UNAUTHORIZED",
        });
    }
    return identity;
};

export const create = mutation({
    args: {
        orgId: v.string(),
        title: v.string(),
        text: v.string(),
        type: v.string(),
        status: v.string(),
        evaluation: evaluationData,
        questions: v.array(questionAnswer),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);
        return ctx.db.insert("pitches", {
            ...args,
            userId: identity.subject,
            authorName: identity.name!,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

// Get all pitches for an organization
export const get = query({
    args: {
        orgId: v.string(),
        search: v.optional(v.string()),
        favorites: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        // Handle favorites
        if (args.favorites) {
            const favoritedPitches = await ctx.db
                .query("userFavorites")
                .withIndex("by_user_org_pitch", (q) =>
                    q.eq("userId", identity.subject).eq("orgId", args.orgId)
                )
                .order("desc")
                .collect();

            const ids = favoritedPitches.map((f) => f.pitchId);
            const pitches = await getAllOrThrow(ctx.db, ids);

            return pitches.map((pitch) => ({
                ...pitch,
                isFavorite: true,
            }));
        }

        // Handle search
        let pitches: Doc<"pitches">[];
        const searchTerm = args.search?.trim();
        if (searchTerm) {
            pitches = await ctx.db
                .query("pitches")
                .withSearchIndex("search_title", (q) =>
                    q.search("title", searchTerm).eq("orgId", args.orgId)
                )
                .collect();
        } else {
            pitches = await ctx.db
                .query("pitches")
                .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
                .order("desc")
                .collect();
        }

        // Add favorite status
        const favorites = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_org_pitch", (q) =>
                q.eq("userId", identity.subject).eq("orgId", args.orgId)
            )
            .collect();

        const favoritedIds = new Set(favorites.map((f) => f.pitchId));

        return pitches.map((pitch) => ({
            ...pitch,
            isFavorite: favoritedIds.has(pitch._id),
        }));
    },
});

// Get a single pitch
export const getPitch = query({
    args: {
        id: v.id("pitches"),
    },
    handler: async (ctx, { id }) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(id);
        if (!pitch) {
            throw new ConvexError("Pitch not found");
        }
        if (pitch.userId !== identity.subject) {
            throw new ConvexError("Unauthorized");
        }
        return pitch;
    },
});

// Update existing pitch
export const update = mutation({
    args: {
        id: v.id("pitches"),
        title: v.optional(v.string()),
        text: v.optional(v.string()),
        status: v.optional(v.string()),
        evaluation: v.optional(evaluationData),
        questions: v.optional(v.array(questionAnswer)),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.id);
        if (!pitch) throw new ConvexError("Pitch not found");
        if (pitch.userId !== identity.subject) throw new ConvexError("Unauthorized");

        const updates = {
            ...(args.title && { title: args.title }),
            ...(args.text && { text: args.text }),
            ...(args.status && { status: args.status }),
            ...(args.evaluation && { evaluation: args.evaluation }),
            ...(args.questions && { questions: args.questions }),
            updatedAt: Date.now(),
        };

        return ctx.db.patch(args.id, updates);
    },
});

// Delete a pitch
export const remove = mutation({
    args: { id: v.id("pitches") },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.id);
        if (!pitch) throw new ConvexError("Pitch not found");
        if (pitch.userId !== identity.subject) throw new ConvexError("Unauthorized");

        // Delete associated favorites
        const favorites = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_pitch", (q) =>
                q.eq("userId", identity.subject).eq("pitchId", args.id)
            )
            .collect();

        await Promise.all(favorites.map((favorite) => ctx.db.delete(favorite._id)));
        await ctx.db.delete(args.id);
    },
});

// Favorite/unfavorite functions
export const favorite = mutation({
    args: {
        id: v.id("pitches"),
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.id);
        if (!pitch) throw new ConvexError("Pitch not found");

        const existing = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_org_pitch", (q) =>
                q
                    .eq("userId", identity.subject)
                    .eq("orgId", args.orgId)
                    .eq("pitchId", args.id)
            )
            .unique();

        if (existing) throw new ConvexError("Already favorited");

        await ctx.db.insert("userFavorites", {
            userId: identity.subject,
            pitchId: args.id,
            orgId: args.orgId,
        });
    },
});

export const unfavorite = mutation({
    args: {
        id: v.id("pitches"),
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const favorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_org_pitch", (q) =>
                q
                    .eq("userId", identity.subject)
                    .eq("orgId", args.orgId)
                    .eq("pitchId", args.id)
            )
            .unique();

        if (!favorite) throw new ConvexError("Not favorited");

        await ctx.db.delete(favorite._id);
    },
});

// Get filtered pitches
export const getFilteredPitches = query({
    args: {
        orgId: v.string(),
        search: v.optional(v.string()),
        favorites: v.optional(v.boolean()),
        sortBy: v.optional(v.union(v.literal("date"), v.literal("score"))),
        scoreRange: v.optional(
            v.object({
                min: v.number(),
                max: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        // Base query
        let pitches = await ctx.db
            .query("pitches")
            .withIndex("by_user_org", (q) =>
                q.eq("userId", identity.subject).eq("orgId", args.orgId)
            )
            .collect();

        // Apply filters
        if (args.search) {
            const searchTerm = args.search.trim().toLowerCase();
            pitches = pitches.filter(
                (pitch) =>
                    pitch.title.toLowerCase().includes(searchTerm) ||
                    pitch.text.toLowerCase().includes(searchTerm)
            );
        }

        if (args.scoreRange) {
            pitches = pitches.filter(
                (pitch) =>
                    pitch.evaluation.overallScore >= args.scoreRange!.min &&
                    pitch.evaluation.overallScore <= args.scoreRange!.max
            );
        }

        // Sort pitches
        if (args.sortBy) {
            pitches.sort((a, b) =>
                args.sortBy === "date"
                    ? b._creationTime - a._creationTime
                    : b.evaluation.overallScore - a.evaluation.overallScore
            );
        }

        // Get favorites status
        const favorites = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_org_pitch", (q) =>
                q.eq("userId", identity.subject).eq("orgId", args.orgId)
            )
            .collect();

        const favoritedIds = new Set(favorites.map((f) => f.pitchId));

        // Filter by favorites if requested
        if (args.favorites) {
            pitches = pitches.filter((pitch) => favoritedIds.has(pitch._id));
        }

        return pitches.map((pitch) => ({
            ...pitch,
            isFavorite: favoritedIds.has(pitch._id),
        }));
    },
});

// Get pitch statistics
export const getPitchStats = query({
    args: {},
    handler: async (ctx): Promise<PitchStats> => {
        const identity = await validateUser(ctx);

        const pitches = await ctx.db
            .query("pitches")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .collect();

        if (pitches.length === 0) {
            return {
                totalPitches: 0,
                averageScore: 0,
                bestPitch: undefined,
                recentPitches: [],
                scoreDistribution: {},
            };
        }

        const totalScores = pitches.reduce(
            (acc, pitch) => acc + pitch.evaluation.overallScore,
            0
        );

        const bestPitch = pitches.reduce((best, current) =>
            !best || current.evaluation.overallScore > best.evaluation.overallScore
                ? current
                : best
        );

        return {
            totalPitches: pitches.length,
            averageScore: totalScores / pitches.length,
            bestPitch,
            recentPitches: pitches.slice(-RECENT_PITCH_COUNT),
            scoreDistribution: pitches.reduce((acc, pitch) => {
                const score = Math.floor(pitch.evaluation.overallScore);
                acc[score] = (acc[score] || 0) + 1;
                return acc;
            }, {} as Record<number, number>),
        };
    },
});

// Add a prefetch mutation to warm up the cache
export const prefetch = mutation({
    args: {
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        // Prefetch recent pitches
        await ctx.db
            .query("pitches")
            .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
            .order("desc")
            .take(PREFETCH_COUNT);

        // Prefetch user's favorites
        const favorites = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_org_pitch", (q) =>
                q.eq("userId", identity.subject).eq("orgId", args.orgId)
            )
            .collect();

        const favoritedIds = favorites.map((f) => f.pitchId);

        // Prefetch the actual favorite pitches if there are any
        if (favoritedIds.length > 0) {
            await Promise.all(
                favoritedIds.slice(0, PREFETCH_COUNT).map((id) => ctx.db.get(id))
            );
        }

        return { success: true };
    },
});
