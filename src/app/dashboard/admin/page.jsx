import React from 'react';
import { Users, Briefcase, DollarSign, Activity } from 'lucide-react';

export default function AdminStatsGrid({ stats }) {
  // Fallback default values if data is still loading or undefined
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
      borderColor: 'border-zinc-800',
    },
    {
      title: 'Total Tasks',
      value: data.totalTasks.toLocaleString(),
      icon: Briefcase,
      color: 'bg-purple-500/10 text-purple-400',
      borderColor: 'border-zinc-800',
    },
    {
      title: 'Total Revenue',
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500/10 text-emerald-400',
      borderColor: 'border-zinc-800',
    },
    {
      title: 'Active Tasks',
      value: data.activeTasks.toLocaleString(),
      icon: Activity,
      color: 'bg-amber-500/10 text-amber-400',
      borderColor: 'border-zinc-800',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-zinc-950 text-zinc-100 rounded-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Admin Dashboard Overview
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Global platform stats, user traction, and ecosystem revenue tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`bg-zinc-900 border ${item.borderColor} rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-zinc-500 tracking-wider uppercase">
                    {item.title}
                  </p>
                  <h3 className="text-3xl font-black text-white mt-2 tracking-tight">
                    {item.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}