import Navbar from "@/components/Navbar";
import { fetchArticleById } from "@/lib/fetchers";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export default async function ArticlePage({ params }: Props) {
  let article: Awaited<ReturnType<typeof fetchArticleById>> | null = null;

  try {
    article = await fetchArticleById(params.id);
  } catch {
    return notFound();
  }

  if (!article) return notFound();

  const date = new Date(article.created_at).toLocaleDateString();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl p-6">
        <article>
          <h1 className="text-3xl font-bold">{article.title}</h1>
          <p className="mt-2 text-sm text-neutral-500">
            {article.author ? `Por ${article.author}` : "Autor desconocido"} · {date}
          </p>

          <div className="prose prose-neutral mt-6 max-w-none">
            {/* Si tu contenido viene en Markdown/HTML, ajusta el render aquí */}
            <p className="whitespace-pre-wrap">{article.content}</p>
          </div>
        </article>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">También te podría interesar</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Aquí irá el bloque de recomendaciones (Fase 3).
          </p>
        </section>
      </main>
    </>
  );
}
