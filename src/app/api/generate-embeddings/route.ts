import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  pipeline,
  env,
  PipelineType,
  FeatureExtractionPipeline,
} from "@xenova/transformers";

// Evita que la app busque modelos locales
env.allowLocalModels = false;

// Asegúrate de que estas variables de entorno están en tu .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Evita fugas de memoria y reutiliza el pipeline si ya está cargado
class EmbeddingPipeline {
  static task: PipelineType = "feature-extraction";
  static model = "Xenova/all-MiniLM-L6-v2";
  static instance: FeatureExtractionPipeline | null = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = (await pipeline(
        this.task,
        this.model,
        { progress_callback }
      )) as FeatureExtractionPipeline;
    }
    return this.instance;
  }
}

export async function GET() {
  // Usamos la service key para tener permisos de escritura
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 1. Obtener artículos sin embedding
    const { data: articles, error } = await supabaseAdmin
      .from("articles")
      .select("id, content")
      .is("embedding", null);

    if (error) {
      console.error("Error fetching articles:", error);
      return NextResponse.json(
        { error: "Failed to fetch articles from Supabase." },
        { status: 500 }
      );
    }

    if (!articles || articles.length === 0) {
      return NextResponse.json({
        message: "No articles found without embeddings.",
      });
    }

    // 2. Cargar el modelo para generar embeddings
    const extractor = await EmbeddingPipeline.getInstance();
    if (!extractor) {
      return NextResponse.json(
        { error: "Failed to load the embedding model." },
        { status: 500 }
      );
    }

    // 3. Generar y actualizar embeddings para cada artículo
    for (const article of articles) {
      if (!article.content || article.content.trim() === "") {
        continue; // Omitir artículos sin contenido
      }

      // Generar embedding
      const output = await extractor(article.content, {
        pooling: "mean",
        normalize: true,
      });
      
      // El resultado es un array Float32Array, conviértelo a un array normal
      const embedding = Array.from(output.data);

      // 4. Actualizar el artículo en Supabase
      const { error: updateError } = await supabaseAdmin
        .from("articles")
        .update({ embedding: embedding })
        .eq("id", article.id);

      if (updateError) {
        console.error(
          `Failed to update article ${article.id}:`,
          updateError
        );
        // Considera si quieres detenerte en un error o continuar
      }
    }

    return NextResponse.json({
      message: `Successfully generated and updated embeddings for ${articles.length} articles.`,
    });
  } catch (e: any) {
    console.error("An unexpected error occurred:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
