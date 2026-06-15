import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

const modules = import.meta.glob("./**/*.{js,ts}");

const evaluation = {
  evaluations: [],
  overallScore: 7,
  overallFeedback: "ok",
};

function newPitch(overrides: Record<string, unknown> = {}) {
  return {
    title: "Test pitch",
    text: "Some pitch text",
    type: "text",
    status: "completed",
    evaluation,
    questions: [],
    ...overrides,
  };
}

describe("favorites", () => {
  test("favorite creates exactly one row and reads back as favorite", async () => {
    const t = convexTest(schema, modules);
    const alice = t.withIdentity({ subject: "user_alice", name: "Alice" });

    const pitchId = await alice.mutation(api.pitches.create, newPitch());
    await alice.mutation(api.pitches.favorite, { id: pitchId });

    const rows = await t.run(async (ctx) => ctx.db.query("userFavorites").collect());
    expect(rows).toHaveLength(1);

    const pitch = await alice.query(api.pitches.getPitch, { id: pitchId });
    expect(pitch.isFavorite).toBe(true);

    const list = await alice.query(api.pitches.getFilteredPitches, { ownerUserId: "user_alice" });
    expect(list.find((p) => p._id === pitchId)?.isFavorite).toBe(true);
  });

  test("favoriting twice throws and keeps a single row", async () => {
    const t = convexTest(schema, modules);
    const alice = t.withIdentity({ subject: "user_alice", name: "Alice" });

    const pitchId = await alice.mutation(api.pitches.create, newPitch());
    await alice.mutation(api.pitches.favorite, { id: pitchId });

    await expect(
      alice.mutation(api.pitches.favorite, { id: pitchId })
    ).rejects.toThrow("Already favorited");

    const rows = await t.run(async (ctx) => ctx.db.query("userFavorites").collect());
    expect(rows).toHaveLength(1);
  });

  test("unfavorite removes the row", async () => {
    const t = convexTest(schema, modules);
    const alice = t.withIdentity({ subject: "user_alice", name: "Alice" });

    const pitchId = await alice.mutation(api.pitches.create, newPitch());
    await alice.mutation(api.pitches.favorite, { id: pitchId });
    await alice.mutation(api.pitches.unfavorite, { id: pitchId });

    const rows = await t.run(async (ctx) => ctx.db.query("userFavorites").collect());
    expect(rows).toHaveLength(0);

    const pitch = await alice.query(api.pitches.getPitch, { id: pitchId });
    expect(pitch.isFavorite).toBe(false);
  });

  test("unfavorite with no existing favorite throws", async () => {
    const t = convexTest(schema, modules);
    const alice = t.withIdentity({ subject: "user_alice", name: "Alice" });

    const pitchId = await alice.mutation(api.pitches.create, newPitch());

    await expect(
      alice.mutation(api.pitches.unfavorite, { id: pitchId })
    ).rejects.toThrow("Not favorited");
  });

  test("unfavorite self-heals duplicate rows", async () => {
    const t = convexTest(schema, modules);
    const alice = t.withIdentity({ subject: "user_alice", name: "Alice" });

    const pitchId = await alice.mutation(api.pitches.create, newPitch());

    await t.run(async (ctx) => {
      await ctx.db.insert("userFavorites", { userId: "user_alice", pitchId, orgId: "" });
      await ctx.db.insert("userFavorites", { userId: "user_alice", pitchId, orgId: "org_x" });
    });

    let rows = await t.run(async (ctx) => ctx.db.query("userFavorites").collect());
    expect(rows).toHaveLength(2);

    await alice.mutation(api.pitches.unfavorite, { id: pitchId });

    rows = await t.run(async (ctx) => ctx.db.query("userFavorites").collect());
    expect(rows).toHaveLength(0);
  });

  test("favorite state is workspace-agnostic", async () => {
    const t = convexTest(schema, modules);
    const alice = t.withIdentity({ subject: "user_alice", name: "Alice" });

    const pitchId = await alice.mutation(api.pitches.create, newPitch());
    await alice.mutation(api.pitches.favorite, { id: pitchId });

    const list = await alice.query(api.pitches.getFilteredPitches, { ownerUserId: "user_alice" });
    expect(list.find((p) => p._id === pitchId)?.isFavorite).toBe(true);
  });
});
