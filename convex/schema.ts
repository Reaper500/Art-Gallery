import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  artworks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    imageId: v.id("_storage"),
    artist: v.optional(v.string()),
    likes: v.optional(v.number()),
    dislikes: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),
});
