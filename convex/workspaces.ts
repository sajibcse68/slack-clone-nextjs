import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { auth } from './auth';

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return null;
    }

    const joinCode = Math.random().toString(36).substring(2, 9);

    const workspaceId = await ctx.db.insert('workspaces', {
      name: args.name,
      userId,
      joinCode,
    });

    // const workspace = await ctx.db.get(workspaceId);

    return workspaceId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('workspaces').collect();
  },
});
