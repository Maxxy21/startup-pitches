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

    // Pitch created in an ORG context, then favorited.
    const pitchId = await alice.mutation(api.pitches.create, newPitch({ orgId: "org_x" }));
    await alice.mutation(api.pitches.favorite, { id: pitchId });

    // Reading the ORG workspace list shows it favorited...
    const orgList = await alice.query(api.pitches.getFilteredPitches, { orgId: "org_x" });
    expect(orgList.find((p) => p._id === pitchId)?.isFavorite).toBe(true);

    // ...and the favorites set is built from by_user (not org-scoped), so the
    // favorite row exists independent of any workspace arg.
    const favRows = await t.run(async (ctx) =>
      ctx.db
        .query("userFavorites")
        .withIndex("by_user", (q) => q.eq("userId", "user_alice"))
        .collect()
    );
    expect(favRows).toHaveLength(1);
    expect(favRows[0].pitchId).toBe(pitchId);
  });
});

describe("getPitch authorization", () => {
  test("owner reads their own personal pitch", async () => {
    const t = convexTest(schema, modules);
    const alice = t.withIdentity({ subject: "user_alice", name: "Alice" });

    const pitchId = await alice.mutation(api.pitches.create, newPitch());
    const pitch = await alice.query(api.pitches.getPitch, { id: pitchId });
    expect(pitch._id).toBe(pitchId);
  });

  test("a different user cannot read someone else's personal pitch", async () => {
    const t = convexTest(schema, modules);
    const alice = t.withIdentity({ subject: "user_alice", name: "Alice" });
    const bob = t.withIdentity({ subject: "user_bob", name: "Bob" });

    const pitchId = await alice.mutation(api.pitches.create, newPitch());

    await expect(
      bob.query(api.pitches.getPitch, { id: pitchId })
    ).rejects.toThrow("Unauthorized");
  });

  test("an org member reads an org pitch when asserting the matching orgId", async () => {
    const t = convexTest(schema, modules);
    const alice = t.withIdentity({ subject: "user_alice", name: "Alice" });
    const bob = t.withIdentity({ subject: "user_bob", name: "Bob" });

    const pitchId = await alice.mutation(api.pitches.create, newPitch({ orgId: "org_x" }));

    const pitch = await bob.query(api.pitches.getPitch, { id: pitchId, orgId: "org_x" });
    expect(pitch._id).toBe(pitchId);
    expect(pitch.isFavorite).toBe(false);
  });

  test("a non-owner with no/mismatched orgId is denied an org pitch", async () => {
    const t = convexTest(schema, modules);
    const alice = t.withIdentity({ subject: "user_alice", name: "Alice" });
    const bob = t.withIdentity({ subject: "user_bob", name: "Bob" });

    const pitchId = await alice.mutation(api.pitches.create, newPitch({ orgId: "org_x" }));

    await expect(
      bob.query(api.pitches.getPitch, { id: pitchId })
    ).rejects.toThrow("Unauthorized");

    await expect(
      bob.query(api.pitches.getPitch, { id: pitchId, orgId: "org_y" })
    ).rejects.toThrow("Unauthorized");
  });
});
