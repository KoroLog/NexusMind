"use client";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  runTransaction,
  increment,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Toggles a like on an article based on the current database state.
 * This function is idempotent and relies on the database as the single source of truth.
 * @param articleId The ID of the article to like/unlike.
 */
export async function toggleLikeArticle(articleId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be logged in to like an article.");

  const likeRef = doc(db, "user_interactions", user.uid, "likes", articleId);
  const statsRef = doc(db, "article_stats", articleId);

  await runTransaction(db, async (transaction) => {
    // 1. First, read all documents.
    const likeDoc = await transaction.get(likeRef);
    const statsDoc = await transaction.get(statsRef);

    // 2. Now, perform all writes.
    if (likeDoc.exists()) {
      // The user has liked the article, so unlike it.
      transaction.delete(likeRef);
      transaction.update(statsRef, { likes: increment(-1) });
    } else {
      // The user has not liked the article, so like it.
      transaction.set(likeRef, {
        articleId,
        ts: serverTimestamp(),
      });

      if (statsDoc.exists()) {
        transaction.update(statsRef, { likes: increment(1) });
      } else {
        // The stats doc doesn't exist, create it.
        transaction.set(statsRef, { likes: 1, views: 0 });
      }
    }
  });
}

/**
 * Registers a view for an article if the user hasn't viewed it before.
 * Uses a transaction to ensure we only increment the view counter once per user.
 * @param articleId The ID of the article being viewed.
 */
export async function registerView(articleId: string) {
  const user = auth.currentUser;
  if (!user) return; // Do not track views for non-logged-in users

  const viewRef = doc(db, "user_interactions", user.uid, "views", articleId);
  const statsRef = doc(db, "article_stats", articleId);

  try {
    await runTransaction(db, async (transaction) => {
      // 1. First, read all documents.
      const viewDoc = await transaction.get(viewRef);
      const statsDoc = await transaction.get(statsRef);

      // 2. Now, perform writes if the user hasn't viewed this article before.
      if (!viewDoc.exists()) {
        // Record the user's view
        transaction.set(viewRef, {
          articleId,
          ts: serverTimestamp(),
        });

        // Update the public view count
        if (statsDoc.exists()) {
          transaction.update(statsRef, { views: increment(1) });
        } else {
          // The stats doc doesn't exist, create it with the first view.
          transaction.set(statsRef, { views: 1, likes: 0 });
        }
      }
    });
  } catch (error) {
    console.error("Transaction failed: ", error);
  }
}

/**
 * Checks if a user has liked a specific article.
 * @param articleId The ID of the article to check.
 * @returns A boolean indicating if the user has liked the article.
 */
export async function hasLikedArticle(articleId: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  const likeRef = doc(db, "user_interactions", user.uid, "likes", articleId);
  const docSnap = await getDoc(likeRef);
  return docSnap.exists();
}

/**
 * Fetches the view and like counts for a specific article.
 * @param articleId The ID of the article.
 * @returns An object with view and like counts.
 */
export async function getArticleStats(articleId: string): Promise<{ views: number; likes: number }> {
  const statsRef = doc(db, "article_stats", articleId);
  const docSnap = await getDoc(statsRef);

  if (docSnap.exists()) {
    return {
      views: docSnap.data().views || 0,
      likes: docSnap.data().likes || 0,
    };
  } else {
    // If no stats document exists, return 0 for both.
    return { views: 0, likes: 0 };
  }
}

// Note: The old `likeArticle` and `unlikeArticle` are now replaced by `toggleLikeArticle`.
// This simplifies the logic in the component.