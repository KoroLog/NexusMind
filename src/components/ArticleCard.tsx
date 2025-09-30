import Link from "next/link";

type Props = {
  id: string;
  title: string;
  author?: string | null;
  created_at?: string;
};

export default function ArticleCard({ id, title, author, created_at }: Props) {
  const date = created_at ? new Date(created_at).toLocaleDateString() : "";
  return (
    <Link
      href={`/article/${id}`}
      className="block rounded-xl border p-4 transition hover:shadow-lg"
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-xs text-neutral-500">
        {author ? `Por ${author}` : "Autor desconocido"} · {date}
      </p>
    </Link>
  );
}
