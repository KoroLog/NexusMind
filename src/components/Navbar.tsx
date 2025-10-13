"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const { user } = useAuth();

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  }

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
          {user ? (
            <>
              <span>{user.email}</span>
              <button
                onClick={handleLogout}
                className="rounded-md border px-3 py-1 hover:bg-neutral-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-md border px-3 py-1 hover:bg-neutral-50"
            >
              Login / Registro
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}