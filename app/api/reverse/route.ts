import { NextRequest, NextResponse } from "next/server";

/**
 * Uses SerpAPI's google_reverse_image engine instead of the
 * unofficial third-party scraper (google-reverse-image-api.vercel.app)
 * which was unreliable and returned inconsistent data.
 */
export async function POST(req: NextRequest) {
  const { imageUrl } = await req.json();
  const key = process.env.SERPAPI_KEY;
  const encoded = encodeURIComponent(imageUrl);

  try {
    const res = await fetch(
      `https://serpapi.com/search.json?engine=google_reverse_image&image_url=${encoded}&api_key=${key}`
    );

    if (!res.ok) {
      throw new Error(`SerpAPI error: ${res.status}`);
    }

    const data = await res.json();

    // Normalize: return image_results + organic_results merged
    const results = [
      ...(data.image_results ?? []),
      ...(data.organic_results ?? []),
    ].map((r: Record<string, string>) => ({
      title: r.title ?? "",
      link: r.link ?? r.url ?? "",
      thumbnail: r.thumbnail ?? "",
      snippet: r.snippet ?? "",
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Reverse image error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}