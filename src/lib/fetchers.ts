import { supabase } from "@/lib/supabase";

export type Article = {
  id: string;
  title: string;
  content: string;
  author: string | null;
  created_at: string;
};

export async function fetchArticles(limit = 20): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("id,title,author,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Article[];
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
