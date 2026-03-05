"use client";

import { useState } from "react";
import { PrintJobWithUser, Priority, Status, PRIORITY_COLORS, STATUS_COLORS, UserType } from "@/lib/types";

interface Props {
  print: PrintJobWithUser;
  user: UserType;
  onUpdate: () => void;
}

export default function PrintCard({ print, user, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateStatus = async (status: Status) => {
    await fetch(`/api/prints/${print.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    onUpdate();
  };

  const updatePriority = async (priority: Priority) => {
    await fetch(`/api/prints/${print.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    });
    onUpdate();
  };

  const deletePrint = async () => {
    if (!confirm("Remove this print from the queue?")) return;
    await fetch(`/api/prints/${print.id}`, { method: "DELETE" });
    onUpdate();
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    await fetch(`/api/prints/${print.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: comment.trim(), userId: user.id }),
    });
    setComment("");
    setSubmitting(false);
    onUpdate();
  };

  const statusActions: Record<string, { label: string; status: Status }[]> = {
    queued: [
      { label: "▶ Start Printing", status: "printing" },
      { label: "✕ Cancel", status: "cancelled" },
    ],
    printing: [
      { label: "✓ Done!", status: "done" },
      { label: "✕ Cancel", status: "cancelled" },
    ],
    done: [],
    cancelled: [{ label: "↻ Re-queue", status: "queued" }],
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div
      className={`bg-surface-light rounded-xl overflow-hidden transition-all ${
        print.status === "done" || print.status === "cancelled"
          ? "opacity-60"
          : ""
      }`}
    >
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex gap-3">
          {print.thumbnailUrl && (
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={print.thumbnailUrl}
                alt={print.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold truncate">{print.title}</h3>
              <div className="flex gap-1.5 flex-shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${
                    PRIORITY_COLORS[print.priority as Priority]
                  }`}
                >
                  {print.priority}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${
                    STATUS_COLORS[print.status as Status]
                  }`}
                >
                  {print.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-text-muted">
              <span>
                {print.requestedBy.avatar} {print.requestedBy.name}
              </span>
              <span>·</span>
              <span>{timeAgo(print.createdAt)}</span>
              {print.comments.length > 0 && (
                <>
                  <span>·</span>
                  <span>💬 {print.comments.length}</span>
                </>
              )}
            </div>
            {print.description && (
              <p className="text-sm text-text-muted mt-1 truncate">
                {print.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-surface-lighter pt-3">
          {print.url && (
            <a
              href={print.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-light hover:underline block truncate"
            >
              🔗 {print.url}
            </a>
          )}

          {print.description && (
            <p className="text-sm text-text-muted">{print.description}</p>
          )}

          {/* Status Actions */}
          {statusActions[print.status]?.length > 0 && (
            <div className="flex gap-2">
              {statusActions[print.status].map(({ label, status }) => (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus(status);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    status === "done"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : status === "printing"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : status === "cancelled"
                      ? "bg-red-600/20 hover:bg-red-600/30 text-red-400"
                      : "bg-surface hover:bg-surface-lighter"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Priority Selector */}
          {(print.status === "queued" || print.status === "printing") && (
            <div>
              <span className="text-xs text-text-muted block mb-1">Priority:</span>
              <div className="flex gap-1">
                {(["low", "normal", "high", "urgent"] as Priority[]).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePriority(p);
                      }}
                      className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
                        print.priority === p
                          ? `${PRIORITY_COLORS[p]} text-white`
                          : "bg-surface text-text-muted hover:bg-surface-lighter"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Comments */}
          {print.comments.length > 0 && (
            <div className="space-y-2">
              {print.comments.map((c) => (
                <div key={c.id} className="text-sm bg-surface rounded-lg p-2">
                  <span className="font-medium">
                    {c.author.avatar} {c.author.name}
                  </span>
                  <span className="text-text-muted ml-2 text-xs">
                    {timeAgo(c.createdAt)}
                  </span>
                  <p className="text-text-muted mt-0.5">{c.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
              onClick={(e) => e.stopPropagation()}
              placeholder="Add a comment..."
              className="flex-1 p-2 bg-surface rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                addComment();
              }}
              disabled={!comment.trim() || submitting}
              className="px-3 py-2 bg-primary rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              deletePrint();
            }}
            className="text-xs text-red-400 hover:text-red-300"
          >
            🗑 Remove from queue
          </button>
        </div>
      )}
    </div>
  );
}
