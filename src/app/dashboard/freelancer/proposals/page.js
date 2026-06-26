"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function MyProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (isPending) return;
    if (!email) {
      setError("Please sign in to view your proposals.");
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/proposals/mine?email=${email}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load proposals.");
        return res.json();
      })
      .then((data) => setProposals(data.proposals || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [email, isPending]);

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
            My Proposals
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            All proposals you have submitted
          </p>
        </div>

        {error && (
          <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
            {error}
          </p>
        )}

        {!error && proposals.length === 0 && (
          <p className="text-zinc-500 text-sm">
            You have not submitted any proposals yet.
          </p>
        )}

        {proposals.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Task Title
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Budget Bid
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Date Sent
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {proposals.map((proposal) => (
                    <tr
                      key={proposal._id}
                      className="hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-5 py-4 text-white font-medium">
                        {proposal.task_title}
                      </td>
                      <td className="px-5 py-4 text-emerald-400 font-bold">
                        ${proposal.proposed_budget}{" "}
                        <span className="text-zinc-500 font-normal text-xs">USD</span>
                      </td>
                      <td className="px-5 py-4 text-zinc-400 text-xs">
                        {new Date(proposal.submitted_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
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