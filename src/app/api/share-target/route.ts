import { NextRequest, NextResponse } from "next/server";

// PWA Share Target handler - receives shared links
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get("title") as string || "";
  const text = formData.get("text") as string || "";
  const url = formData.get("url") as string || "";

  // The shared content might have the URL in the text field
  const sharedUrl = url || extractUrl(text) || "";
  const sharedTitle = title || text || "Shared Print";

  // Redirect to the add page with pre-filled data
  const params = new URLSearchParams();
  if (sharedUrl) params.set("url", sharedUrl);
  if (sharedTitle && sharedTitle !== sharedUrl) params.set("title", sharedTitle);

  return NextResponse.redirect(
    new URL(`/?add=true&${params.toString()}`, req.url)
  );
}

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : null;
}
