"use client";

import { useEffect, useState } from "react";
import { Loader2, DollarSign, Clock, Check, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getClientToken } from "@/lib/get-token";

const STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function ManageProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
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

    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/proposals/client?email=${email}`,
      { cache: "no-store" },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load proposals.");
        return res.json();
      })
      .then((data) => setProposals(data.proposals || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [email, isPending]);

const handleAction = async (proposalId, status) => {
  const token = await getClientToken();
  setActionLoading((prev) => ({ ...prev, [proposalId]: true }));

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/proposals/${proposalId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Action failed.");
      return;
    }

    // If accepted, record payment
    if (status === "accepted") {
      const proposal = proposals.find((p) => p._id === proposalId);
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: proposal.task_id,
          proposal_id: proposalId,
          client_email: proposal.client_email,
          freelancer_email: proposal.freelancer_email,
          amount: proposal.proposed_budget,
        }),
      });
    }

    setProposals((prev) =>
      prev.map((p) => (p._id === proposalId ? { ...p, status } : p)),
    );
  } catch {
    alert("An unexpected error occurred.");
  } finally {
    setActionLoading((prev) => ({ ...prev, [proposalId]: false }));
  }
};

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-800 rounded-xl text-zinc-100 py-12 px-4 sm:px-6 lg:px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Manage Proposals
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Review and respond to freelancer proposals
          </p>
        </div>

        {error && (
          <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
            {error}
          </p>
        )}

        {!error && proposals.length === 0 && (
          <p className="text-zinc-500 text-sm">
            No proposals received on your tasks yet.
          </p>
        )}

        {proposals.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Task
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Freelancer
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Budget
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Days
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Cover Note
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {proposals.map((proposal) => (
                    <tr
                      key={proposal._id}
                      className="hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-5 py-4 text-white font-medium max-w-[140px]">
                        <span className="block truncate">
                          {proposal.task_title}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-white text-xs font-semibold">
                          {proposal.freelancer_name}
                        </p>
                        <p className="text-zinc-500 text-[11px] truncate max-w-[140px]">
                          {proposal.freelancer_email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <DollarSign className="w-3.5 h-3.5" />
                          {proposal.proposed_budget}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-blue-400 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {proposal.estimated_days}d
                        </span>
                      </td>

                      <td className="px-5 py-4 text-zinc-400 text-xs max-w-[180px]">
                        <span className="line-clamp-2">
                          {proposal.cover_note}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${
                            STATUS_STYLES[proposal.status] ||
                            "bg-zinc-800 text-zinc-400 border-zinc-700"
                          }`}
                        >
                          {proposal.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {proposal.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              disabled={actionLoading[proposal._id]}
                              onClick={() =>
                                handleAction(proposal._id, "accepted")
                              }
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                              {actionLoading[proposal._id] ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              Accept
                            </button>
                            <button
                              disabled={actionLoading[proposal._id]}
                              onClick={() =>
                                handleAction(proposal._id, "rejected")
                              }
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-700 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                              {actionLoading[proposal._id] ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                              Reject
                            </button>
                          </div>
                        ) : proposal.status === "accepted" ? (
                          <form action="/api/subscription" method="POST">
                            <button
                              type="submit"
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                              <DollarSign className="w-3 h-3" />
                              Pay Now
                            </button>
                          </form>
                        ) : (
                          <span className="text-zinc-600 text-xs">—</span>
                        )}
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
