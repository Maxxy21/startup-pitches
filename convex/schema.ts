import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";
import {evaluationArgs} from "./pitches";

export default defineSchema({
    pitches: defineTable({
        title: v.string(),
        text: v.string(),
        type: v.string(),
        status: v.string(),
        evaluation: evaluationArgs,
        userId: v.string(),
        isFavorite: v.optional(v.boolean()),
        categories: v.optional(v.array(v.string())),
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
        .searchIndex("search_title", {
            searchField: "title",
            filterFields: ["userId"]
        })
        .index("by_status", ["status"])
        .index("by_categories", ["categories"]),

    categories: defineTable({
        userId: v.string(),
        name: v.string(),
        color: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_name", ["userId", "name"]),

    userFavorites: defineTable({
        userId: v.string(),
        pitchId: v.id("pitches"),
    })
        .index("by_user", ["userId"])
        .index("by_user_pitch", ["userId", "pitchId"])
});