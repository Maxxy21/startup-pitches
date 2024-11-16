// convex/schema.ts
import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

// convex/schema.ts
export default defineSchema({
    pitches: defineTable({
        name: v.string(),
        text: v.string(),
        evaluation: v.object({
            evaluations: v.array(v.object({
                criteria: v.string(),
                comment: v.string(),
                score: v.number(),
                strengths: v.array(v.string()),
                improvements: v.array(v.string()),
                aspects: v.array(v.string()),
            })),
            overallScore: v.number(),
            overallFeedback: v.string(),
        }),
        status: v.string(),
        type: v.string(),
        userId: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_status", ["status"]),
    // ... rest of your schema
});