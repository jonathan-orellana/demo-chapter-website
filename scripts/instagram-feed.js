const INSTAGRAM_POST_URLS = [
  "https://www.instagram.com/p/DWmDXocEWIU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/p/DWrM08XESTB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/p/DWw8gmgkgbC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
];

async function loadInstagramPosts() {
  const feed = document.getElementById("instagram-feed");

  if (!feed) {
    return;
  }

  const createStatusMarkup = (message) =>
    `<p class="instagram-section__status">${message}</p>`;

  const normalizedUrls = INSTAGRAM_POST_URLS.map((url) => {
    try {
      const parsedUrl = new URL(url);

      if (!/^www\.instagram\.com$/i.test(parsedUrl.hostname)) {
        return null;
      }

      const match = parsedUrl.pathname.match(/^\/p\/([^/]+)\/?$/i);

      if (!match) {
        return null;
      }

      return `https://www.instagram.com/p/${match[1]}/`;
    } catch {
      return null;
    }
  }).filter(Boolean).slice(0, 3);

  if (normalizedUrls.length === 0) {
    feed.innerHTML = createStatusMarkup("Add Instagram post links in scripts/instagram-feed.js to show posts here.");
    return;
  }

  feed.innerHTML = normalizedUrls
    .map((url, index) => `
      <div class="instagram-section__embed">
        <div class="instagram-section__embed-frame">
          <blockquote
            class="instagram-media"
            data-instgrm-permalink="${url}"
            data-instgrm-version="14"
            style="background:#FFF; border:0; border-radius:0; margin:0; min-width:280px; padding:0; width:100%;"
          ></blockquote>
        </div>
        <a
          class="instagram-section__overlay"
          href="${url}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Instagram post ${index + 1}"
        ></a>
      </div>
    `)
    .join("");

  if (window.instgrm?.Embeds?.process) {
    window.instgrm.Embeds.process();
    return;
  }

  window.addEventListener(
    "load",
    () => {
      if (window.instgrm?.Embeds?.process) {
        window.instgrm.Embeds.process();
      }
    },
    { once: true }
  );
}

loadInstagramPosts();
