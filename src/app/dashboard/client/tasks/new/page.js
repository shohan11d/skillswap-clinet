"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PlusCircle, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getClientToken } from "@/lib/get-token";

export default function PostTask() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();
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
    // const { data: token } = await authClient.token();
    // console.log("token", token);
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
      status: "open", // Assignment requirement: Default state text: open
      client_email: email,
    };

    try {
      // Points directly to your Next.js API route route handlers
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
        throw new Error(
          result.message || "Something went wrong while posting the task.",
        );
      }

      setSuccessMessage("Task published successfully!");
      reset();
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Header Block */}
        <div className="mb-8 border-b border-gray-100 dark:border-zinc-800 pb-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            Post a New Task
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill out the details below to find and hire the right freelancer for
            your micro-task.
          </p>
        </div>

        {/* Status Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium">
            {successMessage}
          </div>
        )}

        {serverError && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium">
            {serverError}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              placeholder="e.g., Fix CSS alignment bug on landing page"
              className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? "border-rose-500 focus:ring-rose-500/20"
                  : "border-gray-200 dark:border-zinc-800 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
              {...register("title", { required: "Task title is required." })}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs font-medium text-rose-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category Dropdown Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                errors.category
                  ? "border-rose-500 focus:ring-rose-500/20"
                  : "border-gray-200 dark:border-zinc-800 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
              {...register("category", {
                required: "Please select a valid category.",
              })}
            >
              <option value="">Select a category</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Development">Development</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="mt-1.5 text-xs font-medium text-rose-500">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Budget and Deadline Layout Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Budget Box */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Budget (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-400 font-medium">
                  $
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  min="1"
                  step="any"
                  className={`w-full pl-8 pr-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.budget
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-gray-200 dark:border-zinc-800 focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
                  {...register("budget", {
                    required: "Budget allocation is required.",
                    min: {
                      value: 1,
                      message: "Budget must be greater than $0.",
                    },
                  })}
                />
              </div>
              {errors.budget && (
                <p className="mt-1.5 text-xs font-medium text-rose-500">
                  {errors.budget.message}
                </p>
              )}
            </div>

            {/* Deadline Target */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Deadline Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.deadline
                    ? "border-rose-500 focus:ring-rose-500/20"
                    : "border-gray-200 dark:border-zinc-800 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
                {...register("deadline", {
                  required: "Please specify a deadline date.",
                })}
              />
              {errors.deadline && (
                <p className="mt-1.5 text-xs font-medium text-rose-500">
                  {errors.deadline.message}
                </p>
              )}
            </div>
          </div>

          {/* Text Description Box */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Task Description
            </label>
            <textarea
              rows={5}
              placeholder="Provide clean instructions, asset files required, and specific structural features expected..."
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.description
                  ? "border-rose-500 focus:ring-rose-500/20"
                  : "border-gray-200 dark:border-zinc-800 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
              {...register("description", {
                required: "A detailed descriptive summary is required.",
                minLength: {
                  value: 20,
                  message:
                    "Please write a clearer description (min 20 characters).",
                },
              })}
            ></textarea>
            {errors.description && (
              <p className="mt-1.5 text-xs font-medium text-rose-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Action Call */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publishing Task...
                </>
              ) : (
                "Publish Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
