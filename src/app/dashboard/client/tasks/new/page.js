"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PlusCircle, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getClientToken } from "@/lib/get-token";

export default function PostTask() {
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const token = await getClientToken();
    setLoading(true);
    setServerError("");
    setSuccessMessage("");

    const taskPayload = {
      title: data.title,
      category: data.category,
      description: data.description,
      budget: parseFloat(data.budget),
      deadline: data.deadline,
      status: "open",
      client_email: email,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskPayload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong while posting the task.");
      }

      setSuccessMessage("Task published successfully!");
      reset();
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-xl border bg-zinc-950 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all ${
      hasError
        ? "border-rose-500/50 focus:ring-rose-500/20"
        : "border-zinc-800 focus:ring-blue-500/20 focus:border-blue-500/50"
    }`;

  return (
    <div className="min-h-screen bg-zinc-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <PlusCircle className="w-7 h-7 text-blue-500" />
            Post a New Task
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Fill out the details below to find and hire the right freelancer.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium">
              {successMessage}
            </div>
          )}

          {serverError && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                Task Title
              </label>
              <input
                type="text"
                placeholder="e.g., Fix CSS alignment bug on landing page"
                className={inputClass(errors.title)}
                {...register("title", { required: "Task title is required." })}
              />
              {errors.title && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                Category
              </label>
              <select
                className={inputClass(errors.category)}
                {...register("category", { required: "Please select a category." })}
              >
                <option value="">Select a category</option>
                <option value="Design">Design</option>
                <option value="Writing">Writing</option>
                <option value="Development">Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.category.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                  Budget (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-zinc-500 font-medium">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    min="1"
                    step="any"
                    className={`${inputClass(errors.budget)} pl-8`}
                    {...register("budget", {
                      required: "Budget is required.",
                      min: { value: 1, message: "Budget must be greater than $0." },
                    })}
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1.5 text-xs text-rose-400">{errors.budget.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                  Deadline Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className={inputClass(errors.deadline)}
                  {...register("deadline", { required: "Please specify a deadline." })}
                />
                {errors.deadline && (
                  <p className="mt-1.5 text-xs text-rose-400">{errors.deadline.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                Task Description
              </label>
              <textarea
                rows={5}
                placeholder="Provide clear instructions, required assets, and expected deliverables..."
                className={`${inputClass(errors.description)} resize-none`}
                {...register("description", {
                  required: "A description is required.",
                  minLength: { value: 20, message: "Min 20 characters." },
                })}
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.description.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Task"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}