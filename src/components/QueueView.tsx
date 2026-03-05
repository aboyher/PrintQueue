"use client";

import { useState, useMemo } from "react";
import { PrintJobWithUser, Status, UserType } from "@/lib/types";
import PrintCard from "./PrintCard";
import AddPrintModal from "./AddPrintModal";

interface Props {
  prints: PrintJobWithUser[];
  user: UserType;
  onRefresh: () => void;
  initialAddUrl?: string;
  initialAddTitle?: string;
}

type Tab = "active" | "done" | "all";

export default function QueueView({
  prints,
  user,
  onRefresh,
  initialAddUrl,
  initialAddTitle,
}: Props) {
  const [showAdd, setShowAdd] = useState(!!initialAddUrl);
  const [tab, setTab] = useState<Tab>("active");
  const [filterUser, setFilterUser] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = prints;

    if (tab === "active") {
      list = list.filter(
        (p) => p.status === "queued" || p.status === "printing"
      );
    } else if (tab === "done") {
      list = list.filter(
        (p) => p.status === "done" || p.status === "cancelled"
      );
    }

    if (filterUser) {
      list = list.filter((p) => p.userId === filterUser);
    }

    return list;
  }, [prints, tab, filterUser]);

  const activePrints = prints.filter(
    (p) => p.status === "queued" || p.status === "printing"
  );
  const printingNow = prints.find((p) => p.status === "printing");
  const uniqueUsers = Array.from(
    new Map(prints.map((p) => [p.userId, p.requestedBy])).values()
  );

  const statusCounts: Record<Status, number> = {
    queued: prints.filter((p) => p.status === "queued").length,
    printing: prints.filter((p) => p.status === "printing").length,
    done: prints.filter((p) => p.status === "done").length,
    cancelled: prints.filter((p) => p.status === "cancelled").length,
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Now Printing Banner */}
      {printingNow && (
        <div className="mx-4 mt-4 p-4 bg-green-900/30 border border-green-700/50 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-400">
              Now Printing
            </span>
          </div>
          <p className="font-semibold">{printingNow.title}</p>
          <p className="text-sm text-text-muted">
            Requested by {printingNow.requestedBy.avatar}{" "}
            {printingNow.requestedBy.name}
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="flex gap-3 px-4 mt-4 overflow-x-auto">
        {[
          { label: "Queued", count: statusCounts.queued, color: "text-yellow-400" },
          { label: "Printing", count: statusCounts.printing, color: "text-green-400" },
          { label: "Done", count: statusCounts.done, color: "text-gray-400" },
        ].map(({ label, count, color }) => (
          <div
            key={label}
            className="flex-1 min-w-[80px] bg-surface-light rounded-xl p-3 text-center"
          >
            <div className={`text-2xl font-bold ${color}`}>{count}</div>
            <div className="text-xs text-text-muted">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 mt-4">
        {(["active", "done", "all"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-primary text-white"
                : "bg-surface-light text-text-muted hover:bg-surface-lighter"
            }`}
          >
            {t} {t === "active" ? `(${activePrints.length})` : ""}
          </button>
        ))}
      </div>

      {/* User Filter */}
      {uniqueUsers.length > 1 && (
        <div className="flex gap-1 px-4 mt-2 overflow-x-auto">
          <button
            onClick={() => setFilterUser(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !filterUser
                ? "bg-primary/20 text-primary-light"
                : "bg-surface-light text-text-muted"
            }`}
          >
            All
          </button>
          {uniqueUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => setFilterUser(filterUser === u.id ? null : u.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                filterUser === u.id
                  ? "bg-primary/20 text-primary-light"
                  : "bg-surface-light text-text-muted"
              }`}
            >
              {u.avatar} {u.name}
            </button>
          ))}
        </div>
      )}

      {/* Print List */}
      <div className="px-4 mt-4 space-y-3 pb-24">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <div className="text-4xl mb-3">📭</div>
            <p>
              {tab === "active"
                ? "Queue is empty! Add something to print."
                : "No prints here yet."}
            </p>
          </div>
        )}
        {filtered.map((print) => (
          <PrintCard
            key={print.id}
            print={print}
            user={user}
            onUpdate={onRefresh}
          />
        ))}
      </div>

      {/* FAB - Add Print */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-primary-dark transition-colors z-40"
      >
        +
      </button>

      {showAdd && (
        <AddPrintModal
          user={user}
          onAdd={() => {
            setShowAdd(false);
            onRefresh();
          }}
          onClose={() => setShowAdd(false)}
          initialUrl={initialAddUrl}
          initialTitle={initialAddTitle}
        />
      )}
    </div>
  );
}
