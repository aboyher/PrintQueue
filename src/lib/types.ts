export type Priority = "low" | "normal" | "high" | "urgent";
export type Status = "queued" | "printing" | "done" | "cancelled";

export interface PrintJobWithUser {
  id: string;
  title: string;
  url: string | null;
  thumbnailUrl: string | null;
  description: string | null;
  priority: Priority;
  status: Status;
  position: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  requestedBy: { id: string; name: string; avatar: string | null };
  comments: CommentWithAuthor[];
}

export interface CommentWithAuthor {
  id: string;
  text: string;
  userId: string;
  printJobId: string;
  createdAt: string;
  author: { id: string; name: string; avatar: string | null };
}

export interface UserType {
  id: string;
  name: string;
  avatar: string | null;
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  normal: "bg-blue-500",
  low: "bg-gray-400",
};

export const STATUS_COLORS: Record<Status, string> = {
  queued: "bg-yellow-500",
  printing: "bg-green-500",
  done: "bg-gray-500",
  cancelled: "bg-red-400",
};
