"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks";
import {
  toggleLikeArticle,
  hasLikedArticle,
  getArticleStats,
  registerView,
} from "@/lib/interactions";
import { Eye, Heart } from "lucide-react";

type Props = {
  articleId: string;
};

export default function InteractionButtons({ articleId }: Props) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // For logged-out users, just get the public stats
      getArticleStats(articleId).then((stats) => {
        setLikeCount(stats.likes);
        setViewCount(stats.views);
        setIsLoading(false);
      });
      return;
    }

    let isCancelled = false;

    async function fetchInitialData() {
      setIsLoading(true);
      try {
        // Register the view first
        await registerView(articleId);

        // Fetch stats and like status in parallel
        const [stats, liked] = await Promise.all([
          getArticleStats(articleId),
          hasLikedArticle(articleId),
        ]);

        if (!isCancelled) {
          setLikeCount(stats.likes);
          setViewCount(stats.views);
          setIsLiked(liked);
        }
      } catch (error) {
        console.error("Error fetching interaction data:", error);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchInitialData();

    return () => {
      isCancelled = true;
    };
  }, [articleId, user]);

  const handleToggleLike = async () => {
    if (!user || isLoading) return;

    const originalIsLiked = isLiked;

    // Optimistic UI update
    setIsLiked(!originalIsLiked);
    setLikeCount((prev) => (originalIsLiked ? prev - 1 : prev + 1));
    setIsLoading(true);

    try {
      await toggleLikeArticle(articleId);
      // Optional: re-fetch stats from server to ensure consistency
      const updatedStats = await getArticleStats(articleId);
      setLikeCount(updatedStats.likes);

    } catch (err: any) {
      console.error("Error toggling like:", err);
      // Revert on error
      setIsLiked(originalIsLiked);
      setLikeCount((prev) => (originalIsLiked ? prev + 1 : prev - 1));
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Render for logged-out users
  if (!user) {
    return (
      <div className="mt-6 flex items-center gap-6 text-sm text-neutral-500">
        <div className="flex items-center gap-2">
          <Heart size={18} />
          <span>{likeCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye size={18} />
          <span>{viewCount}</span>
        </div>
      </div>
    );
  }

  // Render for logged-in users
  const buttonClass = isLiked
    ? "bg-blue-50 text-blue-600 border-blue-200"
    : "hover:bg-neutral-100 border-neutral-200";

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center gap-6 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <Heart
            size={18}
            className={isLiked ? "fill-current text-blue-600" : ""}
          />
          <span>{likeCount} Me gusta</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye size={18} />
          <span>{viewCount} Vistas</span>
        </div>
      </div>
      <button
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${buttonClass}`}
        onClick={handleToggleLike}
        disabled={isLoading}
      >
        <Heart size={16} className="mr-2 inline-block" />
        {isLiked ? "Te gusta" : "Me gusta"}
      </button>
    </div>
  );
}
