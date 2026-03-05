"use client";

import { useState, useEffect } from "react";
import { Priority, UserType } from "@/lib/types";

interface Props {
  user: UserType;
  onAdd: () => void;
  onClose: () => void;
  initialUrl?: string;
  initialTitle?: string;
}

export default function AddPrintModal({
  user,
  onAdd,
  onClose,
  initialUrl,
  initialTitle,
}: Props) {
  const [url, setUrl] = useState(initialUrl || "");
  const [title, setTitle] = useState(initialTitle || "");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [loading, setLoading] = useState(false);
  const [scraped, setScraped] = useState(false);

  useEffect(() => {
    if (initialUrl && !scraped) {
      scrapeUrl(initialUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  const scrapeUrl = async (targetUrl: string) => {
    if (!targetUrl) return;
    setLoading(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.thumbnailUrl) setThumbnailUrl(data.thumbnailUrl);
      if (data.description) setDescription(data.description);
      setScraped(true);
    } catch {
      // ignore scrape errors
    }
    setLoading(false);
  };

  const handleUrlBlur = () => {
    if (url && !scraped) scrapeUrl(url);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await fetch("/api/prints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        url: url || null,
        thumbnailUrl: thumbnailUrl || null,
        description: description || null,
        priority,
        userId: user.id,
      }),
    });
    setLoading(false);
    onAdd();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-surface-light rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Add to Queue</h2>
            <button onClick={onClose} className="text-text-muted hover:text-text text-2xl">
              ×
            </button>
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">
              MakerWorld / URL (optional)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setScraped(false);
              }}
              onBlur={handleUrlBlur}
              placeholder="https://makerworld.com/en/model/..."
              className="w-full p-3 bg-surface rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {thumbnailUrl && (
            <div className="rounded-xl overflow-hidden bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-text-muted mb-1">
              Print Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are we printing?"
              className="w-full p-3 bg-surface rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">
              Notes (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Color, size, special instructions..."
              rows={2}
              className="w-full p-3 bg-surface rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              {(["low", "normal", "high", "urgent"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                    priority === p
                      ? p === "urgent"
                        ? "bg-red-500 text-white"
                        : p === "high"
                        ? "bg-orange-500 text-white"
                        : p === "normal"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-500 text-white"
                      : "bg-surface text-text-muted hover:bg-surface-lighter"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 p-3 bg-surface rounded-xl hover:bg-surface-lighter transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || loading}
              className="flex-1 p-3 bg-primary rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Print"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
