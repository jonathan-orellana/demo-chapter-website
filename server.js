import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/instagram-posts", async (req, res) => {
  try {
    const igUserId = process.env.IG_USER_ID;
    const accessToken = process.env.IG_ACCESS_TOKEN;

    if (!igUserId || !accessToken) {
      return res.status(500).json({
        error: "Missing Instagram environment variables."
      });
    }

    const fields = [
      "id",
      "caption",
      "media_type",
      "media_url",
      "thumbnail_url",
      "permalink",
      "timestamp"
    ].join(",");

    const url =
      `https://graph.facebook.com/v25.0/${igUserId}/media` +
      `?fields=${encodeURIComponent(fields)}` +
      `&limit=4` +
      `&access_token=${encodeURIComponent(accessToken)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Failed to fetch Instagram posts."
      });
    }

    const posts = (data.data || []).map((post) => ({
      id: post.id,
      caption: post.caption || "",
      mediaType: post.media_type,
      mediaUrl: post.media_url || "",
      thumbnailUrl: post.thumbnail_url || "",
      permalink: post.permalink || ""
    }));

    res.json(posts);
  } catch (error) {
    console.error("Instagram API error:", error);
    res.status(500).json({
      error: "Something went wrong while loading Instagram posts."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});