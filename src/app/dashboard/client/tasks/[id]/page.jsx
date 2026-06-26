"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, ArrowLeft } from "lucide-react";

export default function TaskEditDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      budget: "",
      deadline: "",
    }
  });

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not retrieve details for this task.");
        return res.json();
      })
      .then((data) => {
        // Enforce the constraint: if retrieved via deep link directly but completed, bounce them out
        if (data.status === "completed") {
          router.replace("/dashboard/client/tasks");
          return;
        }

        // Pre-fill react-hook-form fields cleanly
        setValue("title", data.title);
        setValue("category", data.category);
        setValue("description", data.description);
        setValue("budget", data.budget);
        setValue("deadline", data.deadline);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, setValue, router]);

  const onUpdateSubmit = async (formData) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save data mutations.");
      }

      router.push("/dashboard/client/tasks");
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        
        <button
          onClick={() => router.push("/dashboard/client/tasks")}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to My Tasks
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Edit Task Details</h1>
          <p className="text-zinc-400 text-xs mt-1">Modify properties of your active project listing below.</p>
        </div>

        {error ? (
          <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
            {error}
          </p>
        ) : (
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Task Title</label>
              <input
                type="text"
                {...register("title", { required: "A task title is explicitly required." })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-zinc-700 outline-none transition-colors"
              />
              {errors.title && <p className="text-rose-400 text-xs mt-1.5">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Category</label>
              <input
                type="text"
                {...register("category", { required: "Category field cannot look empty." })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-zinc-700 outline-none transition-colors"
              />
              {errors.category && <p className="text-rose-400 text-xs mt-1.5">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Description</label>
              <textarea
                rows={4}
                {...register("description", { required: "Please supplement a core workflow description." })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-zinc-700 outline-none transition-colors resize-none"
              />
              {errors.description && <p className="text-rose-400 text-xs mt-1.5">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Budget (USD)</label>
                <input
                  type="number"
                  {...register("budget", { required: "Budget valuation amount required." })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-zinc-700 outline-none transition-colors"
                />
                {errors.budget && <p className="text-rose-400 text-xs mt-1.5">{errors.budget.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Deadline Date</label>
                <input
                  type="text"
                  {...register("deadline", { required: "Provide clean milestone constraints." })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-zinc-700 outline-none transition-colors"
                />
                {errors.deadline && <p className="text-rose-400 text-xs mt-1.5">{errors.deadline.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full flex items-center justify-center gap-2 font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3.5 transition-colors disabled:opacity-50 mt-4"
            >
              {isUpdating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Task Settings"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

