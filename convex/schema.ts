// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    pitches: defineTable({
        name: v.string(),
        text: v.string(),
        evaluation: v.array(v.object({
            criteria: v.string(),
            comment: v.string(),
            score: v.number(),
        })),
        userId: v.string(),
    }),
    users: defineTable({
        name: v.string(),
        tokenIdentifier: v.string(),
    }).index("by_token", ["tokenIdentifier"]),
});
