"use client";

import { useState, useEffect } from "react";
import { UserType } from "@/lib/types";

const AVATARS = ["🧑", "👦", "👧", "👨", "👩", "🤖", "👽", "🦊", "🐸", "🎮", "🚀", "⚡"];

export default function UserPicker({
  onSelect,
}: {
  onSelect: (user: UserType) => void;
}) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [newName, setNewName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🧑");
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers);
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), avatar: selectedAvatar }),
    });
    const user = await res.json();
    onSelect(user);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🖨️</div>
          <h1 className="text-3xl font-bold">PrintQueue</h1>
          <p className="text-text-muted mt-2">Who&apos;s using the printer?</p>
        </div>

        {users.length > 0 && !showNew && (
          <div className="space-y-3 mb-6">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => onSelect(u)}
                className="w-full flex items-center gap-3 p-4 bg-surface-light rounded-xl hover:bg-surface-lighter transition-colors"
              >
                <span className="text-2xl">{u.avatar || "🧑"}</span>
                <span className="text-lg font-medium">{u.name}</span>
              </button>
            ))}
          </div>
        )}

        {!showNew && (
          <button
            onClick={() => setShowNew(true)}
            className="w-full p-4 border-2 border-dashed border-surface-lighter rounded-xl text-text-muted hover:border-primary hover:text-primary transition-colors"
          >
            + New Person
          </button>
        )}

        {showNew && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setSelectedAvatar(a)}
                  className={`text-2xl p-2 rounded-lg transition-colors ${
                    selectedAvatar === a
                      ? "bg-primary"
                      : "bg-surface-light hover:bg-surface-lighter"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Your name..."
              className="w-full p-4 bg-surface-light rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNew(false)}
                className="flex-1 p-3 bg-surface-light rounded-xl hover:bg-surface-lighter transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="flex-1 p-3 bg-primary rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                Join
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
