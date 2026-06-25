import React from 'react';
import { Briefcase, FolderOpen, Flame, DollarSign } from 'lucide-react';

export default function StatsGrid({ stats }) {
  // Fallback default values if data is still loading or undefined
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
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-100 dark:border-blue-900/50',
    },
    {
      title: 'Open Tasks',
      value: data.openTasks,
      icon: FolderOpen,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-100 dark:border-emerald-900/50',
    },
    {
      title: 'Tasks In Progress',
      value: data.tasksInProgress,
      icon: Flame,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-100 dark:border-amber-900/50',
    },
    {
      title: 'Total Spent',
      value: `$${data.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-indigo-100 dark:border-indigo-900/50',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor your project allocations, open listings, and budget breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`bg-white dark:bg-zinc-900 border ${item.borderColor} rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                    {item.title}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">
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