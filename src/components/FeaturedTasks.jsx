"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, User, Loader2, ArrowRight } from "lucide-react";

export default function FeaturedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/featured`)
      .then((res) => res.json())
      .then((data) => setTasks((data.tasks || []).slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-[#27272a] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Latest Tasks</h2>
            <p className="text-zinc-400 mt-1 text-sm">Fresh opportunities posted by clients</p>
          </div>
          <Link href="/tasks" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task._id} className="flex flex-col bg-zinc-800 border border-zinc-700 rounded-2xl p-6 hover:border-zinc-600 transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {task.category}
                  </span>
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {task.deadline}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{task.title}</h3>

                <div className="mt-auto pt-4 border-t border-zinc-700 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mb-1">
                      <User size={11} /> {task.client_name || task.client_email}
                    </p>
                    <p className="text-xl font-bold text-white">${task.budget}</p>
                  </div>
                  <Link
                    href={`/tasks/${task._id}`}
                    className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-sm font-medium text-white"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}