import { useState, useEffect } from "react";
import { fetchBlogspotPosts, type BlogspotPost } from "../utils/fetchBlogspotPosts";

export function useBlogspotFeed(blogBaseUrl: string) {
  const [posts, setPosts] = useState<BlogspotPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchBlogspotPosts(blogBaseUrl)
      .then((fetched) => setPosts(fetched))
      .catch(() => setPosts([]))
      .finally(() => setIsLoading(false));
  }, [blogBaseUrl]);

  return { posts, isLoading };
}
