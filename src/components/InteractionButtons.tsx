"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks";
import { likeArticle, unlikeArticle, hasLikedArticle } from "@/lib/interactions";

type Props = {
  articleId: string;
};

export default function InteractionButtons({ articleId }: Props) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    async function checkLikeStatus() {
      try {
        setIsLoading(true);
        const liked = await hasLikedArticle(articleId);
        if (!isCancelled) {
          setIsLiked(liked);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    checkLikeStatus();

    return () => {
      isCancelled = true;
    };
  }, [articleId, user]);

  const handleToggleLike = async () => {
    if (!user || isLoading) {
      console.log("Toggle like blocked: user not logged in or already loading.");
      return;
    }

    const originalIsLiked = isLiked;
    console.log(`Toggling like. Original state: ${originalIsLiked}`);

    setIsLiked(!originalIsLiked); // Optimistic update
    setIsLoading(true);

    try {
      if (!originalIsLiked) {
        console.log(`Calling likeArticle for article ${articleId}`);
        await likeArticle(articleId);
        console.log("likeArticle finished.");
      } else {
        console.log(`Calling unlikeArticle for article ${articleId}`);
        await unlikeArticle(articleId);
        console.log("unlikeArticle finished.");
      }
    } catch (err: any) {
      console.error("Error toggling like:", err);
      setIsLiked(originalIsLiked); // Revert on error
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
      console.log("Finished toggling like. New loading state: false");
    }
  };

  if (!user) {
    return null;
  }

  const buttonText = isLiked ? "Te gusta" : "Me gusta";
  const buttonClass = isLiked
    ? "bg-blue-500 text-white"
    : "hover:bg-neutral-100";

  return (
    <div className="flex items-center gap-4">
      <button
        className={`mt-4 rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${buttonClass}`}
        onClick={handleToggleLike}
        disabled={isLoading}
      >
        {isLoading ? "Cargando..." : buttonText}
      </button>
    </div>
  );
}
