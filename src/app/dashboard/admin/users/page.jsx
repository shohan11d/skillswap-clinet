"use client";

import React, { useEffect, useState } from "react";
import { Loader2, ShieldAlert, ShieldCheck, UserX, UserCheck } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load platform directory accounts.");
        return res.json();
      })
      .then((data) => setUsers(data.users || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const toggleBlockStatus = async (userId, isCurrentlyBlocked) => {
    setProcessingId(userId);
    const endpoint = isCurrentlyBlocked ? "unblock" : "block";
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users/${userId}/${endpoint}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) throw new Error(`Could not complete action execution.`);

      // Optimistically update UI status local map state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked: !isCurrentlyBlocked } : user
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white tracking-tight">Manage System Users</h1>
          <p className="text-zinc-400 text-xs mt-1">
            Review user registration states, profile roles, and manage access restrictions.
          </p>
        </div>

        {error ? (
          <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
            {error}
          </p>
        ) : users.length === 0 ? (
          <p className="text-zinc-500 text-sm">No registered user profiles found.</p>
        ) : (
          <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-950">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900 text-[11px] font-bold text-zinc-400 tracking-wider uppercase">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Platform Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-sm">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">{user.name || "N/A"}</td>
                    <td className="py-4 px-6 text-zinc-400 font-mono text-xs">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-zinc-800 border border-zinc-700 text-zinc-300 uppercase">
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {user.isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <ShieldAlert size={12} /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck size={12} /> Active
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => toggleBlockStatus(user._id, user.isBlocked)}
                        disabled={processingId === user._id}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                          user.isBlocked
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-zinc-800 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-900/30 text-zinc-300 border border-zinc-700"
                        } disabled:opacity-40`}
                      >
                        {processingId === user._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : user.isBlocked ? (
                          <>
                            <UserCheck size={14} /> Unblock Account
                          </>
                        ) : (
                          <>
                            <UserX size={14} /> Block User
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}