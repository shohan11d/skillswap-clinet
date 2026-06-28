"use client";

import React, { useEffect, useState, use } from "react";
import {
  Calendar,
  User,
  Loader2,
  ArrowLeft,
  DollarSign,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { getClientToken } from "@/lib/get-token";

export default function TaskDetailsPage({ params }) {
  const { id } = use(params);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [proposalLoading, setProposalLoading] = useState(false);
  const [proposalError, setProposalError] = useState("");
  const [proposalSuccess, setProposalSuccess] = useState("");

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      proposed_budget: "",
      estimated_days: "",
      cover_note: "",
    },
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${id}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Task not found.");
        return res.json();
      })
      .then((data) => setTask(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (formData) => {
    const token = await getClientToken();
    setProposalError("");
    setProposalSuccess("");
    setProposalLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/proposals`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
          body: JSON.stringify({
            task_id: id,
            freelancer_email: user.email,
            proposed_budget: formData.proposed_budget,
            estimated_days: formData.estimated_days,
            cover_note: formData.cover_note,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setProposalError(data.message || "Failed to submit proposal.");
        return;
      }
      setProposalSuccess("Proposal submitted successfully!");
      reset();
    } catch (err) {
      setProposalError("An unexpected error occurred.");
    } finally {
      setProposalLoading(false);
    }
  };

  if (loading || isPending) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <p className="text-rose-400 text-sm">{error || "Task not found."}</p>
        <Link
          href="/tasks"
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          ← Back to Browse Tasks
        </Link>
      </div>
    );
  }

  const isFreelancer = user?.role === "freelancer";
  const isOwnTask = user?.email === task.client_email;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Browse Tasks
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Details */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-extrabold text-white leading-tight">
                  {task.title}
                </h1>
                <span className="shrink-0 px-2 py-0.5 text-xs font-medium rounded bg-zinc-800 border border-zinc-700 text-zinc-400 uppercase">
                  {task.status}
                </span>
              </div>

              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
                {task.category}
              </span>

              <div className="mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Description
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-zinc-800 pt-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Budget
                  </span>
                  <span className="flex items-center gap-1 text-white font-bold text-lg">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    {task.budget}
                    <span className="text-xs text-zinc-500 font-normal">
                      USD
                    </span>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Deadline
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400 text-sm font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    {task.deadline}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Posted by
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-300 text-sm truncate">
                    <User className="w-3.5 h-3.5 text-zinc-500" />
                    {task.client_name || task.client_email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Proposal Form */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-6">
              <h2 className="text-sm font-bold text-white mb-4">
                Submit a Proposal
              </h2>

              {!user && (
                <div className="space-y-3 text-center">
                  <p className="text-zinc-400 text-xs">
                    Login as a freelancer to apply.
                  </p>
                  <Link
                    href="/login"
                    className="block w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Login to Apply
                  </Link>
                </div>
              )}

              {user && !isFreelancer && (
                <p className="text-zinc-500 text-xs">
                  Only freelancer accounts can submit proposals.
                </p>
              )}

              {user && isFreelancer && isOwnTask && (
                <p className="text-zinc-500 text-xs">
                  You cannot apply to your own task.
                </p>
              )}

              {user && isFreelancer && !isOwnTask && task.status !== "open" && (
                <p className="text-zinc-500 text-xs">
                  This task is no longer accepting proposals.
                </p>
              )}

              {user && isFreelancer && !isOwnTask && task.status === "open" && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Your Budget (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                      <input
                        type="number"
                        {...register("proposed_budget", {
                          required: "Budget is required",
                          min: {
                            value: 1,
                            message: "Budget must be at least $1",
                          },
                        })}
                        placeholder="150"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
                      />
                    </div>
                    {errors.proposed_budget && (
                      <p className="mt-1 text-[11px] text-rose-400">
                        {errors.proposed_budget.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Estimated Days
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                      <input
                        type="number"
                        {...register("estimated_days", {
                          required: "Estimated days is required",
                          min: { value: 1, message: "Must be at least 1 day" },
                        })}
                        placeholder="7"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
                      />
                    </div>
                    {errors.estimated_days && (
                      <p className="mt-1 text-[11px] text-rose-400">
                        {errors.estimated_days.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Cover Note
                    </label>
                    <textarea
                      {...register("cover_note", {
                        required: "Cover note is required",
                        minLength: {
                          value: 20,
                          message: "At least 20 characters required",
                        },
                      })}
                      rows={4}
                      placeholder="Briefly explain why you're a great fit..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors resize-none"
                    />
                    {errors.cover_note && (
                      <p className="mt-1 text-[11px] text-rose-400">
                        {errors.cover_note.message}
                      </p>
                    )}
                  </div>

                  {proposalError && (
                    <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                      {proposalError}
                    </p>
                  )}
                  {proposalSuccess && (
                    <p className="text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                      {proposalSuccess}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={proposalLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    {proposalLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Proposal"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
