"use client";

import { useUser, usePrints } from "@/lib/hooks";
import UserPicker from "@/components/UserPicker";
import NavBar from "@/components/NavBar";
import PrintCard from "@/components/PrintCard";

export default function HistoryPage() {
  const { user, login, logout } = useUser();
  const { prints, loading, refetch } = usePrints();

  if (!user) {
    return <UserPicker onSelect={(u) => login(u.name, u.avatar || undefined)} />;
  }

  const completedPrints = prints
    .filter((p) => p.status === "done" || p.status === "cancelled")
    .sort(
      (a, b) =>
        new Date(b.completedAt || b.updatedAt).getTime() -
        new Date(a.completedAt || a.updatedAt).getTime()
    );

  return (
    <div className="min-h-screen">
      <NavBar user={user} onLogout={logout} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Print History</h2>
        {loading ? (
          <div className="text-center py-12 text-text-muted">Loading...</div>
        ) : completedPrints.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <div className="text-4xl mb-3">📭</div>
            <p>No completed prints yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedPrints.map((print) => (
              <PrintCard
                key={print.id}
                print={print}
                user={user}
                onUpdate={refetch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
