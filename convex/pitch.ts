import {v} from "convex/values";
import {query, mutation} from "./_generated/server";

export const get = query({
    args: { id: v.id("pitches") },
    handler: async (ctx, args) => {
        return ctx.db.get(args.id);
    },
});
