import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-semibold">
          NexusMind
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/auth" className="rounded-md border px-3 py-1 hover:bg-neutral-50">
            Login / Registro
          </Link>
        </div>
      </nav>
    </header>
  );
}
