"use client";

import Navbar from "@/components/Navbar";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
        setMsg("Cuenta creada. Ya puedes iniciar sesión.");
        setMode("login");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // Redirection will be handled by the useEffect
      }
    } catch (err: any) {
      setMsg(err?.message ?? "Ocurrió un error.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || user) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-md p-6 text-center">
          <h1 className="text-2xl font-semibold">Cargando...</h1>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md p-6">
        <h1 className="text-2xl font-semibold">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Usa email y contraseña. (Podemos agregar OAuth más adelante).
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input
              type="email"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Contraseña</label>
            <input
              type="password"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {busy ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        {msg && (
          <div className="mt-4 rounded-md border bg-neutral-50 p-3 text-sm text-neutral-700">
            {msg}
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          {mode === "login" ? (
            <>
              ¿No tienes cuenta?{" "}
              <button
                className="underline"
                onClick={() => {
                  setMsg(null);
                  setMode("register");
                }}
              >
                Regístrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                className="underline"
                onClick={() => {
                  setMsg(null);
                  setMode("login");
                }}
              >
                Inicia sesión
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
