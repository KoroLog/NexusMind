
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { database } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { Post } from '@/lib/types';

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsRef = ref(database, 'posts');

    const getPosts = async () => {
      try {
        const snapshot = await get(postsRef);
        if (snapshot.exists()) {
          const postsData = snapshot.val();
          const postsList = Object.keys(postsData).map((key) => ({
            ...postsData[key],
            id: key,
          }));
          setPosts(postsList);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{post.content}</p>
              <Link href={`/blog/${post.id}`}>
                 <span className="text-blue-500 hover:underline">Read more</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
