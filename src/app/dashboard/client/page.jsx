"use client";

import React, { useEffect, useState } from 'react';
import { Briefcase, FolderOpen, Flame, DollarSign, Loader2 } from 'lucide-react';
import { authClient } from "@/lib/auth-client";

export default function ClientDashboard() {
  const [stats, setStats] = useState(null);
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/stats?email=${email}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error);
  }, [email]);

  const data = stats || {
    totalTasks: 0,
    openTasks: 0,
    tasksInProgress: 0,
    totalSpent: 0,
  };

  const statItems = [
    {
      title: 'Total Tasks',
      value: data.totalTasks,
      icon: Briefcase,
      color: 'bg-blue-500/10 text-blue-400',
      border: 'border-blue-500/20',
    },
    {
      title: 'Open Tasks',
      value: data.openTasks,
      icon: FolderOpen,
      color: 'bg-emerald-500/10 text-emerald-400',
      border: 'border-emerald-500/20',
    },
    {
      title: 'In Progress',
      value: data.tasksInProgress,
      icon: Flame,
      color: 'bg-amber-500/10 text-amber-400',
      border: 'border-amber-500/20',
    },
    {
      title: 'Total Spent',
      value: `$${data.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-indigo-500/10 text-indigo-400',
      border: 'border-indigo-500/20',
    },
  ];

  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-800 text-zinc-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Monitor your project allocations, open listings, and budget breakdown.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`bg-zinc-900 border ${item.border} rounded-2xl p-6 flex items-center justify-between`}
              >
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
                    {item.title}
                  </p>
                  <h3 className="text-3xl font-black text-white">
                    {item.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}