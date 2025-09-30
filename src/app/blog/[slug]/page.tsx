
"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { database } from '@/lib/firebase';
import { ref, get, set, onValue } from 'firebase/database';
import { Post } from '@/lib/types';
import RecommendedPosts from '@/components/RecommendedPosts';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postRef = ref(database, `posts/${params.slug}`);

    const getPost = async () => {
      try {
        const snapshot = await get(postRef);
        if (snapshot.exists()) {
          const postData = snapshot.val() as Post;
          setPost(postData);
          setLikes(postData.likes || 0);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    getPost();

    // Listen for real-time updates on likes
    const likesRef = ref(database, `posts/${params.slug}/likes`);
    const unsubscribe = onValue(likesRef, (snapshot) => {
      if (snapshot.exists()) {
        setLikes(snapshot.val());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [params.slug]);

  const handleLike = async () => {
    if (post) {
      const newLikes = likes + 1;
      const likesRef = ref(database, `posts/${params.slug}/likes`);
      await set(likesRef, newLikes);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{post.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{post.content}</p>
        <div className="flex items-center">
          <button
            onClick={handleLike}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-blue-600"
          >
            Like
          </button>
          <span className="text-gray-600 dark:text-gray-400">{likes} likes</span>
        </div>
      </div>
      {post && <RecommendedPosts currentPostTags={post.tags} currentPostId={post.id} />}
    </div>
  );
}
