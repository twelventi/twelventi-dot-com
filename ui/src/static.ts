const GH_USER = "twelventi";
const REPO = "twel-blog";
const BRANCH = "main";

export const BLOG_SRC_URL = `https://raw.githubusercontent.com/${GH_USER}/${REPO}/${BRANCH}/`;
export const BLOG_RSS_URL = `https://raw.githubusercontent.com/${GH_USER}/${REPO}/${BRANCH}/feed.rss`;
export const ABOUT_CONTENT = `https://raw.githubusercontent.com/${GH_USER}/${REPO}/${BRANCH}/about.md`;
export const WS_URL =
  import.meta.env.MODE == "production"
    ? `wss://${window.location.host}`
    : "ws://localhost:3001";

console.log(import.meta.env.MODE);
console.log(WS_URL);
