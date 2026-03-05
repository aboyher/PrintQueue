import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Support MakerWorld URLs
  const makerWorldMatch = url.match(
    /makerworld\.com\/(?:en\/)?model\/(\d+)/
  );

  if (makerWorldMatch) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; PrintQueue/1.0)",
        },
      });
      const html = await res.text();

      const title =
        extractMeta(html, "og:title") ||
        extractTag(html, "title") ||
        "Untitled Print";
      const thumbnailUrl =
        extractMeta(html, "og:image") || null;
      const description =
        extractMeta(html, "og:description") || null;

      return NextResponse.json({ title, thumbnailUrl, description, url });
    } catch {
      return NextResponse.json({
        title: "MakerWorld Print",
        thumbnailUrl: null,
        description: null,
        url,
      });
    }
  }

  // Generic URL - try OG tags
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PrintQueue/1.0)" },
    });
    const html = await res.text();
    const title = extractMeta(html, "og:title") || extractTag(html, "title") || url;
    const thumbnailUrl = extractMeta(html, "og:image") || null;
    const description = extractMeta(html, "og:description") || null;

    return NextResponse.json({ title, thumbnailUrl, description, url });
  } catch {
    return NextResponse.json({ title: url, thumbnailUrl: null, description: null, url });
  }
}

function extractMeta(html: string, property: string): string | null {
  const regex = new RegExp(
    `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const match = html.match(regex);
  if (match) return match[1];
  // Try reversed attribute order
  const regex2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`,
    "i"
  );
  const match2 = html.match(regex2);
  return match2 ? match2[1] : null;
}

function extractTag(html: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i");
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}
