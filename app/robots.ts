import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // AI search / assistant crawlers explicitly welcome
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"], allow: "/" },
    ],
    sitemap: "https://wearetob.com/sitemap.xml",
    host: "https://wearetob.com",
  };
}
