"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Briefcase, User, Loader2, ArrowRight } from "lucide-react";

export default function TopFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/freelancers`)
      .then((res) => res.json())
      .then((data) => {
        // Sort by rating then completed jobs, take top 3
        const sorted = (data.freelancers || [])
          .sort((a, b) => b.averageRating - a.averageRating || b.completedJobs - a.completedJobs)
          .slice(0, 3);
        setFreelancers(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-zinc-800 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Top Freelancers</h2>
            <p className="text-zinc-400 mt-1 text-sm">Trusted professionals ready to help</p>
          </div>
          <Link href="/freelancers" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {freelancers.map((f) => (
              <div key={f._id} className="flex flex-col bg-zinc-900 border border-zinc-700 rounded-2xl p-6 hover:border-zinc-600 transition">
                {/* Avatar + Name */}
                <div className="flex items-center gap-4 mb-4">
                  {f.image ? (
                    <img src={f.image} alt={f.name} className="w-14 h-14 rounded-full object-cover border border-zinc-700" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400">
                      <User size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-white">{f.name || "Unnamed"}</h3>
                    {f.hourlyRate > 0 && (
                      <p className="text-zinc-400 text-sm">${f.hourlyRate}/hr</p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {f.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {f.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {skill}
                      </span>
                    ))}
                    {f.skills.length > 3 && (
                      <span className="px-2.5 py-1 rounded-full text-xs bg-zinc-700 text-zinc-400">
                        +{f.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Stats + Link */}
                <div className="mt-auto pt-4 border-t border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      {f.averageRating > 0 ? f.averageRating : "New"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} />
                      {f.completedJobs} job{f.completedJobs !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <Link
                    href={`/freelancers/${encodeURIComponent(f.email)}`}
                    className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-sm font-medium text-white"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}