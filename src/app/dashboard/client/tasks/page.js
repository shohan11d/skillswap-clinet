"use client";

import React, { useEffect, useState } from "react";
import { Calendar, User, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (isPending) return;

    if (!email) {
      setError("Please sign in to view your tasks.");
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/tasks?email=${email}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load your personal task entries.");
        return res.json();
      })
      .then((data) => setTasks(data.tasks || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [email, isPending]);

  const handleDelete = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task.");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-800 rounded-xl text-zinc-100 py-12 px-4 sm:px-6 lg:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Posted Tasks
          </h1>
        </div>

        {error ? (
          <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
            {error}
          </p>
        ) : tasks.length === 0 ? (
          <p className="text-zinc-500 text-sm">
            You have not posted any marketplace tasks yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {task.category}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded border uppercase ${
                    task.status === "completed"
                      ? "bg-blue-950/40 text-blue-400 border-blue-900/30"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400"
                  }`}>
                    {task.status}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {task.title}
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-3 mb-6">
                    {task.description}
                  </p>
                </div>

                <div className="border-t border-zinc-800 pt-4 mt-auto space-y-2.5">
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

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-2xl font-black text-white">
                      ${task.budget}{" "}
                      <span className="text-xs text-zinc-500">USD</span>
                    </span>

                    {task.status === "completed" || task.status === "in_progress" ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-zinc-800 text-white font-semibold text-xs rounded-xl opacity-40 cursor-not-allowed"
                      >
                        Locked
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/client/tasks/${task._id}`}
                          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl transition-colors inline-block text-center"
                        >
                          Edit Task
                        </Link>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="px-4 py-2 cursor-pointer bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold text-xs rounded-xl transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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