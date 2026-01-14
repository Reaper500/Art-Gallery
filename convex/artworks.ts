import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all artworks
export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("artworks")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

// Query to get a single artwork
export const get = query({
  args: { id: v.id("artworks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutation to create a new artwork
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    imageId: v.id("_storage"),
    artist: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const artworkId = await ctx.db.insert("artworks", {
      title: args.title,
      description: args.description,
      imageId: args.imageId,
      artist: args.artist,
      likes: 0,
      dislikes: 0,
      createdAt: Date.now(),
    });
    return artworkId;
  },
});

// Mutation to like an artwork (removes dislike if exists)
export const like = mutation({
  args: { id: v.id("artworks"), hadDisliked: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const artwork = await ctx.db.get(args.id);
    if (artwork) {
      const currentLikes = artwork.likes ?? 0;
      const currentDislikes = artwork.dislikes ?? 0;
      
      if (args.hadDisliked && currentDislikes > 0) {
        // Remove dislike and add like
        await ctx.db.patch(args.id, {
          likes: currentLikes + 1,
          dislikes: Math.max(0, currentDislikes - 1),
        });
      } else {
        // Just add like
        await ctx.db.patch(args.id, {
          likes: currentLikes + 1,
        });
      }
    }
  },
});

// Mutation to dislike an artwork (removes like if exists)
export const dislike = mutation({
  args: { id: v.id("artworks"), hadLiked: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const artwork = await ctx.db.get(args.id);
    if (artwork) {
      const currentLikes = artwork.likes ?? 0;
      const currentDislikes = artwork.dislikes ?? 0;
      
      if (args.hadLiked && currentLikes > 0) {
        // Remove like and add dislike
        await ctx.db.patch(args.id, {
          likes: Math.max(0, currentLikes - 1),
          dislikes: currentDislikes + 1,
        });
      } else {
        // Just add dislike
        await ctx.db.patch(args.id, {
          dislikes: currentDislikes + 1,
        });
      }
    }
  },
});

// Mutation to delete an artwork
export const remove = mutation({
  args: { id: v.id("artworks") },
  handler: async (ctx, args) => {
    const artwork = await ctx.db.get(args.id);
    if (artwork) {
      // Delete the stored image file
      await ctx.storage.delete(artwork.imageId);
      // Delete the artwork record
      await ctx.db.delete(args.id);
    }
  },
});
