"use client";

import React, { useEffect, useState } from 'react';
import { Users, Briefcase, DollarSign, Activity, Loader2 } from 'lucide-react';
import { authClient } from "@/lib/auth-client";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isPending]);

  const data = stats || {
    totalUsers: 0,
    totalTasks: 0,
    totalRevenue: 0,
    activeTasks: 0,
  };

  const statItems = [
    {
      title: 'Total Users',
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500/10 text-blue-400',
      border: 'border-blue-500/20',
    },
    {
      title: 'Total Tasks',
      value: data.totalTasks.toLocaleString(),
      icon: Briefcase,
      color: 'bg-purple-500/10 text-purple-400',
      border: 'border-purple-500/20',
    },
    {
      title: 'Total Revenue',
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500/10 text-emerald-400',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Active Tasks',
      value: data.activeTasks.toLocaleString(),
      icon: Activity,
      color: 'bg-amber-500/10 text-amber-400',
      border: 'border-amber-500/20',
    },
  ];

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Admin Overview
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Global platform stats, user traction, and ecosystem revenue tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`bg-zinc-950 border ${item.border} rounded-2xl p-6 flex items-center justify-between`}
              >
                <div>
                  <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">
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