"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Calendar, User, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "use-debounce";
import Footer from "@/components/Footer";

const CATEGORIES = ["All", "Design", "Writing", "Development", "Marketing", "Other"];
const PAGE_SIZE = 9;

export default function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [debouncedSearch] = useDebounce(search, 400);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchTasks = useCallback(() => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page,
      limit: PAGE_SIZE,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(category !== "All" && { category }),
    });

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks?${params}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks.");
        return res.json();
      })
      .then((data) => {
        setTasks(data.tasks || []);
        setTotal(data.total ?? data.tasks?.length ?? 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, page]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-zinc-800 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Browse Tasks</h1>
          <p className="text-zinc-400 mt-2">Discover freelance opportunities posted by clients.</p>
        </div>

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-zinc-500 text-sm mb-6">
            {total} task{total !== 1 ? "s" : ""} found
            {debouncedSearch && <> for "<span className="text-zinc-300">{debouncedSearch}</span>"</>}
            {category !== "All" && <> in <span className="text-zinc-300">{category}</span></>}
          </p>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
            {error}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
            <Search size={40} className="mb-3 opacity-40" />
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {task.category}
                  </span>
                  <span className="px-2 py-1 rounded text-xs uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                    {task.status}
                  </span>
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{task.title}</h2>
                  <p className="text-zinc-400 text-sm line-clamp-3">{task.description}</p>
                </div>

                <div className="border-t border-zinc-800 mt-6 pt-4 space-y-3">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {task.client_email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {task.deadline}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">${task.budget}</span>
                    <Link
                      href={`/tasks/${task._id}`}
                      className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    page === n
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
      <Footer/>
    </div>
  );
}