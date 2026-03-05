"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks";
import UserPicker from "@/components/UserPicker";
import NavBar from "@/components/NavBar";

interface StatsData {
  totalPrints: number;
  queued: number;
  printing: number;
  done: number;
  cancelled: number;
  topRequesters: { name: string; avatar: string | null; count: number }[];
  weeklyData: Record<string, number>;
}

export default function StatsPage() {
  const { user, login, logout } = useUser();
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!user) {
    return <UserPicker onSelect={(u) => login(u.name, u.avatar || undefined)} />;
  }

  return (
    <div className="min-h-screen">
      <NavBar user={user} onLogout={logout} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-6">Print Stats</h2>

        {!stats ? (
          <div className="text-center py-12 text-text-muted">Loading...</div>
        ) : (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Total Prints",
                  value: stats.totalPrints,
                  color: "text-primary-light",
                },
                {
                  label: "Completed",
                  value: stats.done,
                  color: "text-green-400",
                },
                {
                  label: "In Queue",
                  value: stats.queued,
                  color: "text-yellow-400",
                },
                {
                  label: "Cancelled",
                  value: stats.cancelled,
                  color: "text-red-400",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="bg-surface-light rounded-xl p-4 text-center"
                >
                  <div className={`text-3xl font-bold ${color}`}>{value}</div>
                  <div className="text-sm text-text-muted mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Weekly Chart (simple bar chart) */}
            {Object.keys(stats.weeklyData).length > 0 && (
              <div className="bg-surface-light rounded-xl p-4">
                <h3 className="font-semibold mb-4">Prints per Week</h3>
                <div className="flex items-end gap-2 h-32">
                  {Object.entries(stats.weeklyData)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([week, count]) => {
                      const max = Math.max(
                        ...Object.values(stats.weeklyData)
                      );
                      const height = max > 0 ? (count / max) * 100 : 0;
                      return (
                        <div
                          key={week}
                          className="flex-1 flex flex-col items-center gap-1"
                        >
                          <span className="text-xs text-text-muted">
                            {count}
                          </span>
                          <div
                            className="w-full bg-primary rounded-t-md transition-all"
                            style={{ height: `${height}%`, minHeight: count > 0 ? "4px" : "0" }}
                          />
                          <span className="text-xs text-text-muted">
                            {new Date(week).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Top Requesters */}
            {stats.topRequesters.length > 0 && (
              <div className="bg-surface-light rounded-xl p-4">
                <h3 className="font-semibold mb-3">Top Requesters</h3>
                <div className="space-y-3">
                  {stats.topRequesters.map((r, i) => (
                    <div key={r.name} className="flex items-center gap-3">
                      <span className="text-lg w-8 text-center">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </span>
                      <span className="text-xl">{r.avatar || "🧑"}</span>
                      <span className="flex-1 font-medium">{r.name}</span>
                      <span className="text-text-muted">
                        {r.count} print{r.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Rate */}
            {stats.totalPrints > 0 && (
              <div className="bg-surface-light rounded-xl p-4">
                <h3 className="font-semibold mb-3">Completion Rate</h3>
                <div className="relative h-4 bg-surface rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all"
                    style={{
                      width: `${(stats.done / stats.totalPrints) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-text-muted mt-2">
                  {Math.round((stats.done / stats.totalPrints) * 100)}% of
                  prints completed successfully
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
