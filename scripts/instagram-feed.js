async function loadInstagramPosts() {
  const feed = document.getElementById("instagram-feed");

  try {
    const response = await fetch("/api/instagram-posts");
    const posts = await response.json();

    if (!response.ok) {
      throw new Error(posts.error || "Failed to load posts.");
    }

    if (!Array.isArray(posts) || posts.length === 0) {
      feed.innerHTML = "<p>No Instagram posts available right now.</p>";
      return;
    }

    feed.innerHTML = posts
      .slice(0, 4)
      .map((post) => {
        const imageSrc =
          post.mediaType === "VIDEO" ? post.thumbnailUrl : post.mediaUrl;

        return `
          <a
            class="instagram-section__card"
            href="${post.permalink}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Instagram post"
          >
            <img
              class="instagram-section__image"
              src="${imageSrc}"
              alt="Recent Instagram post"
              loading="lazy"
            />
          </a>
        `;
      })
      .join("");
  } catch (error) {
    console.error(error);
    feed.innerHTML = "<p>Unable to load Instagram posts right now.</p>";
  }
}

loadInstagramPosts();