"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Calendar, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/tasks`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks.");
        return res.json();
      })
      .then((data) => setTasks(data.tasks || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isPending]);

  const handleDelete = async (taskId) => {
    if (!confirm("Permanently delete this task?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/tasks/${taskId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete task.");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-800 rounded-xl text-zinc-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">All Tasks</h1>
            <p className="text-zinc-400 text-sm mt-1">{tasks.length} total tasks on the platform</p>
          </div>
        </div>

        {error ? (
          <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
            {error}
          </p>
        ) : tasks.length === 0 ? (
          <p className="text-zinc-500 text-sm">No tasks found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {task.category}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded border uppercase ${
                    task.status === "completed"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : task.status === "in_progress"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400"
                  }`}>
                    {task.status}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{task.title}</h3>
                  <p className="text-zinc-400 text-sm line-clamp-3">{task.description}</p>
                </div>

                <div className="border-t border-zinc-800 pt-4 mt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      {task.client_email}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {task.deadline}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white">
                      ${task.budget}{" "}
                      <span className="text-xs text-zinc-500">USD</span>
                    </span>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold text-xs rounded-xl transition-colors"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}