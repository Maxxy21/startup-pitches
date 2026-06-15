import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Doc } from "@/convex/_generated/dataModel";
import { evaluationData, questionAnswer } from "./schema";

interface PitchStats {
    totalPitches: number;
    averageScore: number;
    bestPitch: Doc<"pitches"> | undefined;
    recentCount: number;
}

const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const validateUser = async (ctx: QueryCtx | MutationCtx) => {
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
        orgId: v.optional(v.string()),
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
            orgId: args.orgId ?? "",
            userId: identity.subject,
            authorName: identity.name!,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

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

        const favorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_pitch", (q) =>
                q.eq("userId", identity.subject).eq("pitchId", id)
            )
            .unique();

        return {
            ...pitch,
            isFavorite: !!favorite,
        };
    },
});

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

export const remove = mutation({
    args: { id: v.id("pitches") },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.id);
        if (!pitch) throw new ConvexError("Pitch not found");
        if (pitch.userId !== identity.subject) throw new ConvexError("Unauthorized");

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

export const favorite = mutation({
    args: {
        id: v.id("pitches"),
        orgId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        const pitch = await ctx.db.get(args.id);
        if (!pitch) throw new ConvexError("Pitch not found");

        if (args.orgId) {
            const existing = await ctx.db
                .query("userFavorites")
                .withIndex("by_user_org_pitch", (q) =>
                    q
                        .eq("userId", identity.subject)
                        .eq("orgId", args.orgId!)
                        .eq("pitchId", args.id)
                )
                .unique();
            if (existing) throw new ConvexError("Already favorited");
            await ctx.db.insert("userFavorites", {
                userId: identity.subject,
                pitchId: args.id,
                orgId: args.orgId!,
            });
        } else {
            const existing = await ctx.db
                .query("userFavorites")
                .withIndex("by_user_pitch", (q) =>
                    q.eq("userId", identity.subject).eq("pitchId", args.id)
                )
                .unique();
            if (existing) throw new ConvexError("Already favorited");
            await ctx.db.insert("userFavorites", {
                userId: identity.subject,
                pitchId: args.id,
                orgId: "", // personal workspace marker
            });
        }
    },
});

export const unfavorite = mutation({
    args: {
        id: v.id("pitches"),
        orgId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await validateUser(ctx);

        let favorite;
        if (args.orgId) {
            favorite = await ctx.db
                .query("userFavorites")
                .withIndex("by_user_org_pitch", (q) =>
                    q
                        .eq("userId", identity.subject)
                        .eq("orgId", args.orgId!)
                        .eq("pitchId", args.id)
                )
                .unique();
        } else {
            favorite = await ctx.db
                .query("userFavorites")
                .withIndex("by_user_pitch", (q) =>
                    q.eq("userId", identity.subject).eq("pitchId", args.id)
                )
                .unique();
        }

        if (!favorite) throw new ConvexError("Not favorited");

        await ctx.db.delete(favorite._id);
    },
});

export const getFilteredPitches = query({
    args: {
        orgId: v.optional(v.string()),
        ownerUserId: v.optional(v.string()),
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

        if (args.ownerUserId && args.ownerUserId !== identity.subject) {
            throw new ConvexError("Unauthorized: cannot query another user's pitches");
        }

        // Use the search index when a search term is provided
        let pitches: Doc<"pitches">[] = [];
        if (args.search) {
            const orgId = args.orgId ?? "";
            pitches = await ctx.db
                .query("pitches")
                .withSearchIndex("search_title", (q) =>
                    q.search("title", args.search!).eq("orgId", orgId)
                )
                .collect();

            // If searching in personal workspace, filter to this user's pitches only
            if (!args.orgId) {
                const userId = args.ownerUserId ?? identity.subject;
                pitches = pitches.filter((p) => p.userId === userId);
            }
        } else if (args.orgId) {
            pitches = await ctx.db
                .query("pitches")
                .withIndex("by_org", (q) => q.eq("orgId", args.orgId!))
                .collect();
        } else if (args.ownerUserId) {
            // Personal workspace: only pitches with empty orgId
            pitches = await ctx.db
                .query("pitches")
                .withIndex("by_user_org", (q) =>
                    q.eq("userId", args.ownerUserId!).eq("orgId", "")
                )
                .collect();
        } else {
            pitches = await ctx.db
                .query("pitches")
                .withIndex("by_user_org", (q) =>
                    q.eq("userId", identity.subject).eq("orgId", "")
                )
                .collect();
        }

        if (args.scoreRange) {
            pitches = pitches.filter(
                (pitch) =>
                    pitch.evaluation.overallScore >= args.scoreRange!.min &&
                    pitch.evaluation.overallScore <= args.scoreRange!.max
            );
        }

        if (args.sortBy) {
            pitches.sort((a, b) =>
                args.sortBy === "date"
                    ? b._creationTime - a._creationTime
                    : b.evaluation.overallScore - a.evaluation.overallScore
            );
        }

        let favorites: Doc<"userFavorites">[] = [];
        if (args.orgId) {
            favorites = await ctx.db
                .query("userFavorites")
                .withIndex("by_user_org_pitch", (q) =>
                    q.eq("userId", identity.subject).eq("orgId", args.orgId!)
                )
                .collect();
        } else {
            favorites = await ctx.db
                .query("userFavorites")
                .withIndex("by_user", (q) => q.eq("userId", identity.subject))
                .collect();
        }

        const favoritedIds = new Set(favorites.map((f) => f.pitchId));

        if (args.favorites) {
            pitches = pitches.filter((pitch) => favoritedIds.has(pitch._id));
        }

        return pitches.map((pitch) => ({
            ...pitch,
            isFavorite: favoritedIds.has(pitch._id),
        }));
    },
});

export const getPitchStats = query({
    args: {
        orgId: v.optional(v.string()),
        ownerUserId: v.optional(v.string()),
    },
    handler: async (ctx, args): Promise<PitchStats> => {
        const identity = await validateUser(ctx);

        if (args.ownerUserId && args.ownerUserId !== identity.subject) {
            throw new ConvexError("Unauthorized: cannot query another user's pitches");
        }

        let pitches: Doc<"pitches">[] = [];
        if (args.orgId) {
            pitches = await ctx.db
                .query("pitches")
                .withIndex("by_org", (q) => q.eq("orgId", args.orgId!))
                .collect();
        } else if (args.ownerUserId) {
            pitches = await ctx.db
                .query("pitches")
                .withIndex("by_user_org", (q) =>
                    q.eq("userId", args.ownerUserId!).eq("orgId", "")
                )
                .collect();
        } else {
            pitches = await ctx.db
                .query("pitches")
                .withIndex("by_user_org", (q) =>
                    q.eq("userId", identity.subject).eq("orgId", "")
                )
                .collect();
        }

        if (pitches.length === 0) {
            return {
                totalPitches: 0,
                averageScore: 0,
                bestPitch: undefined,
                recentCount: 0,
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

        const recentThreshold = Date.now() - RECENT_WINDOW_MS;
        return {
            totalPitches: pitches.length,
            averageScore: totalScores / pitches.length,
            bestPitch,
            recentCount: pitches.filter((pitch) => pitch.createdAt >= recentThreshold).length,
        };
    },
});

