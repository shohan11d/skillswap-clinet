"use client";

import { useEffect, useState } from "react";
import { Loader2, DollarSign, Calendar, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function FreelancerEarnings() {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (isPending) return;
    if (!email) {
      setError("Please sign in.");
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/freelancer/earnings?email=${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load earnings.");
        return res.json();
      })
      .then((data) => setEarnings(data.earnings || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [email, isPending]);

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const total = earnings.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Earnings History
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            All payments received from clients for completed tasks.
          </p>
        </div>

        {/* Summary card */}
        <div className="bg-zinc-950 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">
              Total Earned
            </p>
            <p className="text-4xl font-black text-white">
              ${total.toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-7 h-7" />
          </div>
        </div>

        {error && (
          <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl mb-6">
            {error}
          </p>
        )}

        {!error && earnings.length === 0 ? (
          <p className="text-zinc-500 text-sm">No earnings yet.</p>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Task
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Client
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Amount
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Date
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {earnings.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-5 py-4 text-white font-medium max-w-[160px]">
                        <span className="block truncate">
                          {payment.task_title || payment.task_id}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-zinc-300 text-xs">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          {payment.client_name || payment.client_email}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <DollarSign className="w-3.5 h-3.5" />
                          {payment.amount.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-zinc-400 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(payment.paid_at).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 capitalize">
                          {payment.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}