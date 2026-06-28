"use client";

import React, { useEffect, useState } from "react";
import { FileText, Clock3, CheckCircle2, DollarSign, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function FreelancerOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (isPending) return;
    if (!email) {
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/freelancer/stats?email=${email}`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [email, isPending]);

  const data = stats || {
    totalProposals: 0,
    pendingProposals: 0,
    acceptedProposals: 0,
    totalEarnings: 0,
  };

  const statItems = [
    {
      title: "Total Proposals",
      value: data.totalProposals,
      icon: FileText,
      color: "bg-blue-500/10 text-blue-400",
      border: "border-blue-500/20",
    },
    {
      title: "Pending",
      value: data.pendingProposals,
      icon: Clock3,
      color: "bg-amber-500/10 text-amber-400",
      border: "border-amber-500/20",
    },
    {
      title: "Accepted",
      value: data.acceptedProposals,
      icon: CheckCircle2,
      color: "bg-emerald-500/10 text-emerald-400",
      border: "border-emerald-500/20",
    },
    {
      title: "Total Earnings",
      value: `$${(data.totalEarnings || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-indigo-500/10 text-indigo-400",
      border: "border-indigo-500/20",
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
            Freelancer Overview
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Track your proposals, project approvals, and earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
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