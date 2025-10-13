"use client";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import {
  doc, setDoc, deleteDoc,
  collection, addDoc, serverTimestamp,
  getDoc
} from "firebase/firestore";

/** Da like: crea/actualiza un doc con id = articleId */
export async function likeArticle(articleId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Debes iniciar sesión.");
  const ref = doc(db, "user_interactions", user.uid, "likes", articleId);
  await setDoc(ref, {
    articleId,
    liked: true,
    ts: serverTimestamp(),
  }, { merge: true });
}

/** Quita like: elimina el doc del artículo */
export async function unlikeArticle(articleId: string) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not logged in for unlike.");
  }
  const path = `user_interactions/${user.uid}/likes/${articleId}`;
  console.log(`[interactions] Attempting to delete doc at path: ${path}`);
  const ref = doc(db, "user_interactions", user.uid, "likes", articleId);
  try {
    await deleteDoc(ref);
    console.log(`[interactions] Successfully sent delete request for path: ${path}`);
  } catch (error) {
    console.error(`[interactions] Error deleting doc at path: ${path}`, error);
    throw error; // re-throw the error to be caught by the UI
  }
}

/** Registra una vista (1 doc por evento) */
export async function registerView(articleId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Debes iniciar sesión."); // si quieres permitir anónimo, ver nota abajo
  const ref = collection(db, "user_interactions", user.uid, "views");
  await addDoc(ref, {
    articleId,
    ts: serverTimestamp(),
  });
}

/** Checks if a user has liked a specific article. */
export async function hasLikedArticle(articleId: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  const ref = doc(db, "user_interactions", user.uid, "likes", articleId);
  const docSnap = await getDoc(ref);
  return docSnap.exists();
}
