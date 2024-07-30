import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

export const get = query({
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
//
// export const create = mutation({
//     args: {
//         evaluation: v.string(),
//         text: v.string(),
//         name: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity();
//
//         if (!identity) {
//             throw new Error("Unauthorized");
//         }
//
//         return await ctx.db.insert("pitches", {
//             evaluation: args.evaluation,
//             name: args.name,
//             text: args.text,
//
//             userId: identity.subject
//         });
//     },
// });

export const create = mutation({
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
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        return await ctx.db.insert("pitches", {
            evaluation: args.evaluation,
            name: args.name,
            text: args.text,
            userId: identity.subject,
        });
    },
});
