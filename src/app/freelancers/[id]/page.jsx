import { notFound } from "next/navigation";
import { Mail, Clock } from "lucide-react";

export default async function FreelancerProfilePage({ params }) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/freelancers/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) notFound();

  const f = await res.json();

  return (
    <div className="min-h-screen bg-zinc-800 text-white py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex items-center gap-6">
          {f.image ? (
            <img src={f.image} alt={f.name} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center text-3xl font-bold text-zinc-400">
              {f.name?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{f.name || "Unnamed"}</h1>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <Mail size={13} />
              {f.email}
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <Clock size={12} />
              Joined {new Date(f.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}