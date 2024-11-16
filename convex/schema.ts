import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";
import {evaluationArgs} from "./pitches";

export default defineSchema({
    pitches: defineTable({
        name: v.string(),
        text: v.string(),
        type: v.string(),
        status: v.string(),
        evaluation: evaluationArgs,
        userId: v.string(),
        categories: v.optional(v.array(v.string())),
        isFavorite: v.optional(v.boolean()),
        notes: v.optional(v.array(v.object({
            content: v.string(),
            createdAt: v.number(),
            updatedAt: v.number(),
        }))),

        versions: v.optional(v.array(v.object({
            text: v.string(),
            evaluation: evaluationArgs,
            createdAt: v.number(),
        }))),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_status", ["status"])
        .index("by_categories", ["categories"])
        .index("by_score", ["evaluation.overallScore"]),
});