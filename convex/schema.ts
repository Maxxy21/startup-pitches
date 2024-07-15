import {v} from "convex/values";
import {defineSchema, defineTable} from "convex/server";

export default defineSchema({
    pitches: defineTable({
        text: v.string(),
        evaluation: v.string(),
        userId: v.string(),
    }),
    users: defineTable({
        name: v.string(),
        tokenIdentifier: v.string(),
    })
        .index("by_token", ["tokenIdentifier"]),

});
