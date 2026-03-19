import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchBlogspotPosts, type BlogspotPost } from '../utils/fetchBlogspotPosts';

interface BlogspotContextType {
  posts: BlogspotPost[];
  isLoading: boolean;
}

const BlogspotContext = createContext<BlogspotContextType>({ posts: [], isLoading: true });

export function BlogspotProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogspotPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogspotPosts()
      .then((fetchedPosts) => {
        console.log('Fetched Blogspot posts:', fetchedPosts.length);
        setPosts(fetchedPosts);
      })
      .catch((err) => {
        console.error('Error fetching Blogspot:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <BlogspotContext.Provider value={{ posts, isLoading }}>
      {children}
    </BlogspotContext.Provider>
  );
}

export function useBlogspot() {
  return useContext(BlogspotContext);
}
