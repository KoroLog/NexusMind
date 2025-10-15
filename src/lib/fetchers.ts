import { supabase } from "@/lib/supabase";

export type Article = {
  id: string;
  title: string;
  content: string;
  author: string | null;
  created_at: string;
};

export async function fetchArticles(limit = 20): Promise<Article[]> {
  // In a real app, you'd use the limit.
  // We fetch from the API route for this example.
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/articles`, {
    next: { revalidate: 0 }, // no cache
  });
  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }
  const articles = await res.json();
  return articles as Article[];
}

export async function fetchArticleById(id: string): Promise<Article> {
  const { data, error } = await supabase
    .from("articles")
    .select("id,title,content,author,created_at")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Article;
}
