import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  const { data: articles, error } = await supabase.from("articles").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(articles);
}
