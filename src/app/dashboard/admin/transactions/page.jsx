"use client";

import { useEffect, useState } from "react";
import { Loader2, DollarSign, Calendar, User, ArrowLeftRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/transactions`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load transactions.");
        return res.json();
      })
      .then((data) => setTransactions(data.transactions || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isPending]);

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            All Transactions
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Platform-wide payment history.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-950 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Total Revenue</p>
              <p className="text-3xl font-black text-white">${total.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-zinc-950 border border-blue-500/20 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Transactions</p>
              <p className="text-3xl font-black text-white">{transactions.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-zinc-950 border border-amber-500/20 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Avg. Payment</p>
              <p className="text-3xl font-black text-white">
                ${transactions.length > 0 ? Math.round(total / transactions.length).toLocaleString() : 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl mb-6">
            {error}
          </p>
        )}

        {!error && transactions.length === 0 ? (
          <p className="text-zinc-500 text-sm">No transactions yet.</p>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Task</th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Client</th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Freelancer</th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Amount</th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Date</th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-5 py-4 text-white font-medium max-w-[140px]">
                        <span className="block truncate">{t.task_id}</span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-zinc-300 text-xs">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="truncate max-w-[120px]">{t.client_email}</span>
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-zinc-300 text-xs">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="truncate max-w-[120px]">{t.freelancer_email}</span>
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <DollarSign className="w-3.5 h-3.5" />
                          {t.amount.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-zinc-400 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(t.paid_at).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 capitalize">
                          {t.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-zinc-700">
                    <td colSpan={3} className="px-5 py-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                      Total
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-white font-black text-base">
                        <DollarSign className="w-4 h-4" />
                        {total.toLocaleString()}
                      </span>
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}