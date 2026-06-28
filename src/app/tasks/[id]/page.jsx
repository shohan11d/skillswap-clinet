import { notFound } from "next/navigation";
import { Calendar, DollarSign, Tag, User, Clock } from "lucide-react";

export default async function TaskDetailsPage({ params }) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const task = await res.json();

  return (
    <div className="min-h-screen bg-zinc-800 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold leading-tight">{task.title}</h1>
            <span className="shrink-0 px-3 py-1 rounded-full text-xs uppercase bg-green-500/10 text-green-400 border border-green-500/20">
              {task.status}
            </span>
          </div>

          <span className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {task.category}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: DollarSign, label: "Budget", value: `$${task.budget}` },
            { icon: Calendar, label: "Deadline", value: new Date(task.deadline).toLocaleDateString() },
            { icon: User, label: "Posted by", value: task.client_name },
            { icon: Clock, label: "Posted", value: new Date(task.createdAt).toLocaleDateString() },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                <Icon size={13} />
                {label}
              </div>
              <p className="text-white font-semibold text-sm truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Description</h2>
          <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{task.description}</p>
        </div>

      </div>
    </div>
  );
}