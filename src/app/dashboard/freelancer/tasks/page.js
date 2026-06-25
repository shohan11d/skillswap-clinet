"use client";

import React, { useEffect, useState } from "react";
import { Calendar, User, Loader2, Search, SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["All", "Design", "Writing", "Development", "Marketing", "Other"];

export default function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "All") params.append("category", category);

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks?${params.toString()}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load task listings.");
        return res.json();
      })
      .then((data) => setTasks(data.tasks || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, category]); // refetches whenever search or category changes

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Browse Tasks
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Find open tasks and submit your proposal
          </p>
        </div>

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks by title..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white outline-none focus:border-zinc-600 transition-colors cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-xs text-zinc-500 mb-5">
            Showing {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            {search && ` for "${search}"`}
            {category !== "All" && ` in ${category}`}
          </p>
        )}

        {/* States */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
            {error}
          </p>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-zinc-500 text-sm">No tasks found.</p>
            {(search || category !== "All") && (
              <button
                onClick={() => { setSearch(""); setCategory("All"); }}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {task.category}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-zinc-800 border border-zinc-700 text-zinc-400 uppercase">
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
                    <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl transition-colors">
                      View Details
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