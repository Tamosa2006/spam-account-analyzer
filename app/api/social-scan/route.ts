import { NextRequest, NextResponse } from "next/server";
import { SocialResult } from "../../types";

// ── Platform helpers ──────────────────────────────────────────────────────────

function detectPlatform(url: string): SocialResult["platform"] {
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("x.com") || url.includes("twitter.com")) return "X";
  if (url.includes("facebook.com") || url.includes("fb.com")) return "Facebook";
  if (url.includes("pinterest.com") || url.includes("pin.it")) return "Pinterest";
  return "Other";
}

const SOCIAL_PLATFORMS = [
  "instagram.com", "x.com", "twitter.com",
  "facebook.com", "fb.com", "pinterest.com", "pin.it",
];

function isSocialUrl(url: string) {
  return SOCIAL_PLATFORMS.some((p) => url.includes(p));
}

function isProfileUrl(url: string): boolean {
  try {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    if (url.includes("instagram.com"))
      return segments.length === 1 && !["p","reel","stories","tv","explore","accounts"].includes(segments[0]);
    if (url.includes("facebook.com") || url.includes("fb.com"))
      return (segments.length === 1 && !["groups","events","pages","watch","share"].includes(segments[0]))
          || url.includes("profile.php") || url.includes("people/");
    if (url.includes("x.com") || url.includes("twitter.com"))
      return segments.length === 1 && !["i","search","explore","home","hashtag","intent"].includes(segments[0]);
    if (url.includes("pinterest.com"))
      return segments.length === 1 && !["search","ideas","pin","today","topics","category"].includes(segments[0]);
    return false;
  } catch { return false; }
}

// ── Name extraction ───────────────────────────────────────────────────────────
function extractPersonName(lensData: any): string | null {
  const kg = lensData?.knowledge_graph;
  if (kg?.title && kg?.type?.toLowerCase().includes("person")) {
    return kg.title.trim();
  }
  if (kg?.title && kg.title.split(" ").length >= 2) {
    return kg.title.trim();
  }

  const titles: string[] = (lensData?.visual_matches || [])
    .slice(0, 15)
    .map((r: any) => r.title || "")
    .filter(Boolean);

  const namePattern = /\b([A-Z][a-zÀ-ž]{1,}(?:\s[A-Z][a-zÀ-ž]{1,}){1,3})\b/g;
  const counts: Record<string, number> = {};

  for (const title of titles) {
    const found = new Set(title.match(namePattern) || []);
    for (const name of found) {
      const words = name.split(" ");
      if (words.length < 2 || words.length > 4) continue;
      counts[name] = (counts[name] || 0) + 1;
    }
  }

  const best = Object.entries(counts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])[0];

  return best ? best[0] : null;
}

// ── Search by person name (FIXED: Uses serpApiKey parameter) ──────────────────
async function searchByName(name: string, serpApiKey: string): Promise<SocialResult[]> {
  const queries = [
    `"${name}" site:instagram.com`,
    `"${name}" site:x.com OR site:twitter.com`,
    `"${name}" site:facebook.com`,
    `"${name}" site:pinterest.com`,
  ];

  const results = await Promise.allSettled(
    queries.map((q) =>
      fetch(
        `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&api_key=${serpApiKey}&num=5`
      ).then((r) => r.json())
    )
  );

  const out: SocialResult[] = [];
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value?.organic_results || []) {
      const url = item.link || "";
      if (!isSocialUrl(url)) continue;
      const isProfile = isProfileUrl(url);
      out.push({
        platform: detectPlatform(url),
        url,
        title: item.title || "",
        thumbnail: item.thumbnail || "",
        snippet: isProfile ? "👤 Profile Page" : item.snippet || "",
        matchScore: isProfile ? 97 : 82,
        isProfile,
      });
    }
  }
  return out;
}

function toVisualResult(
  r: Record<string, any>,
  source: "lens" | "yandex"
): SocialResult | null {
  const url = r.link || r.source || r.url || "";
  if (!url || !isSocialUrl(url)) return null;

  const isProfile = isProfileUrl(url);
  let score = 35;
  if (source === "lens") score += 18;
  else score += 10;
  if (isProfile) score += 22;
  if (r.position !== undefined) {
    if (r.position <= 3) score += 15;
    else if (r.position <= 10) score += 8;
  }
  if (r.thumbnail) score += 3;

  return {
    platform: detectPlatform(url),
    url,
    title: r.title || "",
    thumbnail: r.thumbnail || "",
    snippet: isProfile ? "👤 Profile Page" : r.source || "",
    matchScore: Math.min(score, 99),
    isProfile,
  };
}

// ── Main route ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { imageUrl } = await req.json();
  
  // FIXED: Renamed and added fallback check
  const serpApiKey = process.env.SERPAPI_KEY;

  if (!serpApiKey) {
    return NextResponse.json({ error: "Missing SERPAPI_KEY in environment variables" }, { status: 500 });
  }

  const encoded = encodeURIComponent(imageUrl);
  const allMatches: SocialResult[] = [];
  let personName: string | null = null;

  try {
    // Step 1: Run Google Lens + Yandex in parallel
    const [lensRes, yandexRes] = await Promise.allSettled([
      fetch(`https://serpapi.com/search.json?engine=google_lens&url=${encoded}&api_key=${serpApiKey}`).then((r) => r.json()),
      fetch(`https://serpapi.com/search.json?engine=yandex_images&url=${encoded}&api_key=${serpApiKey}`).then((r) => r.json()),
    ]);

    const lensData = lensRes.status === "fulfilled" ? lensRes.value : null;
    const yandexData = yandexRes.status === "fulfilled" ? yandexRes.value : null;

    // Step 2: Try to extract person's name
    if (lensData) {
      personName = extractPersonName(lensData);
    }

    // Step 3a: If name found → targeted search (FIXED: passing serpApiKey correctly)
    if (personName) {
      const nameResults = await searchByName(personName, serpApiKey);
      allMatches.push(...nameResults);
    }

    // Step 3b: Visual social matches
    if (lensData?.visual_matches) {
      for (const r of lensData.visual_matches) {
        const result = toVisualResult(r, "lens");
        if (result) allMatches.push(result);
      }
    }
    
    if (yandexData?.images_results) {
      for (const r of yandexData.images_results) {
        const result = toVisualResult(r, "yandex");
        if (result) allMatches.push(result);
      }
    }

    // Step 4: Deduplicate and Sort
    const seen = new Set<string>();
    const unique = allMatches.filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });

    const sorted = unique.sort((a, b) => {
      if (a.isProfile && !b.isProfile) return -1;
      if (!a.isProfile && b.isProfile) return 1;
      return (b.matchScore ?? 0) - (a.matchScore ?? 0);
    });

    return NextResponse.json({
      found: sorted.filter((r) => (r.matchScore ?? 0) >= 70),
      profiles: sorted.filter((r) => r.isProfile),
      posts: sorted.filter((r) => !r.isProfile),
      allFound: sorted,
      personName,
      totalFound: sorted.filter((r) => (r.matchScore ?? 0) >= 70).length,
      totalProfiles: sorted.filter((r) => r.isProfile).length,
      totalAll: sorted.length,
      scannedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Social scan error:", error);
    return NextResponse.json({
      found: [], profiles: [], posts: [], allFound: [],
      personName: null,
      totalFound: 0, totalProfiles: 0, totalAll: 0,
      scannedAt: new Date().toISOString(),
    });
  }
}