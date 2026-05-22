import { query } from "./_generated/server";
import { v } from "convex/values";

export const globalSearch = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];

    const searchStr = args.query.toLowerCase();

    // Search Materials
    const materials = await ctx.db.query("materials").collect();
    const matchedMaterials = materials.filter(m => 
      m.title.toLowerCase().includes(searchStr) || 
      m.description.toLowerCase().includes(searchStr)
    ).map(m => ({
      id: m._id,
      title: m.title,
      type: "document",
      score: 1.0
    }));

    // Search Subjects
    const subjects = await ctx.db.query("subjects").collect();
    const matchedSubjects = subjects.filter(s => 
      s.name.toLowerCase().includes(searchStr) || 
      s.code.toLowerCase().includes(searchStr)
    ).map(s => ({
      id: s._id,
      title: s.name,
      type: "subject",
      score: 1.0
    }));

    // Search Announcements
    const announcements = await ctx.db.query("announcements").collect();
    const matchedAnnouncements = announcements.filter(a => 
      a.title.toLowerCase().includes(searchStr) || 
      a.content.toLowerCase().includes(searchStr)
    ).map(a => ({
      id: a._id,
      title: a.title,
      type: "announcement",
      score: 0.8
    }));

    return [...matchedMaterials, ...matchedSubjects, ...matchedAnnouncements]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  },
});
