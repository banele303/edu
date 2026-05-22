import { mutation } from "./_generated/server";

export const fixDuplicateYears = mutation({
  args: {},
  handler: async (ctx) => {
    const currentYears = await ctx.db
      .query("academicYears")
      .filter((q) => q.eq(q.field("isCurrent"), true))
      .collect();
    
    if (currentYears.length > 1) {
      // Keep only the newest one as current
      const sorted = currentYears.sort((a, b) => b._creationTime - a._creationTime);
      for (let i = 1; i < sorted.length; i++) {
        await ctx.db.patch(sorted[i]._id, { isCurrent: false });
      }
      return `Fixed ${currentYears.length - 1} duplicate academic years.`;
    }
    return "No duplicates found.";
  },
});
