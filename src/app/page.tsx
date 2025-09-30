import Navbar from "@/components/Navbar";
import ArticleCard from "@/components/ArticleCard";
import { fetchArticles, type Article } from "@/lib/fetchers";

export const revalidate = 30; // cache ISR simple

export default async function Page() {
  let articles: Article[] = [];
  try {
    articles = await fetchArticles();
  } catch {
    // si falla Supabase, mostramos vacío
    articles = [];
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-semibold">Artículos</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Listado inicial (desde Supabase). Haz clic para ver el detalle.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {articles.length === 0 && (
            <div className="rounded-lg border p-6 text-sm text-neutral-600">
              No hay artículos aún. Inserta algunos registros en la tabla <code>articles</code>.
            </div>
          )}
          {articles.map((a) => (
            <ArticleCard
              key={a.id}
              id={a.id}
              title={a.title}
              author={a.author}
              created_at={a.created_at}
            />
          ))}
        </div>
      </main>
    </>
  );
}