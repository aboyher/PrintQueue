"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useUser, usePrints } from "@/lib/hooks";
import UserPicker from "@/components/UserPicker";
import NavBar from "@/components/NavBar";
import QueueView from "@/components/QueueView";

function QueuePage() {
  const { user, login, logout } = useUser();
  const { prints, loading, refetch } = usePrints();
  const searchParams = useSearchParams();

  const addUrl = searchParams.get("url") || undefined;
  const addTitle = searchParams.get("title") || undefined;

  if (!user) {
    return <UserPicker onSelect={(u) => login(u.name, u.avatar || undefined)} />;
  }

  return (
    <div className="min-h-screen">
      <NavBar user={user} onLogout={logout} />
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-text-muted">Loading queue...</div>
        </div>
      ) : (
        <QueueView
          prints={prints}
          user={user}
          onRefresh={refetch}
          initialAddUrl={addUrl}
          initialAddTitle={addTitle}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <QueuePage />
    </Suspense>
  );
}
