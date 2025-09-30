
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { database } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { Post } from '@/lib/types';

interface RecommendedPostsProps {
  currentPostTags: string[];
  currentPostId: string;
}

export default function RecommendedPosts({ currentPostTags, currentPostId }: RecommendedPostsProps) {
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      try {
        const postsRef = ref(database, 'posts');
        const snapshot = await get(postsRef);

        if (snapshot.exists()) {
          const postsData = snapshot.val();
          const allPosts: Post[] = Object.keys(postsData).map((key) => ({
            ...postsData[key],
            id: key,
          }));

          // Simple recommendation logic: find posts with at least one common tag
          const recommended = allPosts.filter((post) => {
            if (post.id === currentPostId) {
              return false; // Exclude the current post
            }
            return post.tags.some((tag) => currentPostTags.includes(tag));
          });

          setRecommendedPosts(recommended);
        }
      } catch (error) {
        console.error("Error fetching recommended posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedPosts();
  }, [currentPostTags, currentPostId]);

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (recommendedPosts.length === 0) {
    return <div>No recommendations found.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recommended for You</h3>
      <ul>
        {recommendedPosts.map((post) => (
          <li key={post.id} className="mb-4">
            <Link href={`/blog/${post.id}`}>
              <span className="text-blue-500 hover:underline">{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
