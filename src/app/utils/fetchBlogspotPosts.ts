export interface BlogspotPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  link: string;
  author: string;
}

export async function fetchBlogspotPosts(
  blogBaseUrl = "https://learn2singwithomega.blogspot.com"
): Promise<BlogspotPost[]> {
  try {
    const callbackName = `blogspotCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const feedUrl = `${blogBaseUrl}/feeds/posts/default?alt=json-in-script&callback=${callbackName}&max-results=50`;

    console.log("Fetching Blogspot feed:", feedUrl);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        console.error("Blogspot feed request timed out after 10 seconds");
        resolve([]);
      }, 10000);

      (window as any)[callbackName] = (data: any) => {
        cleanup();
        try {
          const entries = data.feed?.entry || [];
          const posts = entries.map((entry: any) => {
            let image = "";
            if (entry.media$thumbnail?.url) {
              image = entry.media$thumbnail.url.replace(/s72-c/, "s800");
            } else if (entry.content?.$t) {
              const imgMatch = entry.content.$t.match(/<img[^>]+src="([^">]+)"/);
              if (imgMatch) image = imgMatch[1];
            }

            let excerpt = "";
            if (entry.summary?.$t) {
              excerpt = entry.summary.$t.replace(/<[^>]*>/g, "").substring(0, 150) + "...";
            } else if (entry.content?.$t) {
              excerpt = entry.content.$t.replace(/<[^>]*>/g, "").substring(0, 150) + "...";
            }

            const category = entry.category?.[0]?.term || "Vocal Training";
            const wordCount =
              entry.content?.$t.replace(/<[^>]*>/g, "").split(/\s+/).length || 500;
            const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

            const slug = entry.title.$t
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");

            return {
              title: entry.title.$t,
              slug,
              excerpt,
              content: entry.content?.$t || entry.summary?.$t || "",
              date: new Date(entry.published.$t).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              readTime,
              category,
              image,
              link: entry.link.find((l: any) => l.rel === "alternate")?.href || "",
              author: entry.author?.[0]?.name?.$t || "Omega",
            };
          });
          resolve(posts);
        } catch (error) {
          console.error("Error parsing Blogspot data:", error);
          resolve([]);
        }
      };

      function cleanup() {
        clearTimeout(timeout);
        delete (window as any)[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      const script = document.createElement("script");
      script.src = feedUrl;
      script.onerror = () => {
        cleanup();
        console.error("Failed to load Blogspot feed");
        resolve([]);
      };
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error("Error fetching Blogspot posts:", error);
    return [];
  }
}