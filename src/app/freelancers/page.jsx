"use client";

import { useEffect, useState } from "react";
import { Loader2, Star, Briefcase, User } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function BrowseFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/freelancers`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch freelancers.");
        return res.json();
      })
      .then((data) => setFreelancers(data.freelancers || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-800">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-800 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-bold">Browse Freelancers</h1>
          <p className="text-zinc-400 mt-2">
            Find skilled professionals ready to get your tasks done.
          </p>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
            {error}
          </div>
        ) : freelancers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
            <User size={40} className="mb-3 opacity-40" />
            <p className="text-lg font-medium">No freelancers found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((f) => (
              <div
                key={f._id}
                className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-4 mb-4">
                  {f.image ? (
                    <img
                      src={f.image}
                      alt={f.name}
                      className="w-14 h-14 rounded-full object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400">
                      <User size={24} />
                    </div>
                  )}
                  <div>
                    <h2 className="font-bold text-lg leading-tight">{f.name || "Unnamed"}</h2>
                    {f.hourlyRate > 0 && (
                      <p className="text-zinc-400 text-sm">${f.hourlyRate}/hr</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {f.bio && (
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{f.bio}</p>
                )}

                {/* Skills */}
                {f.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {f.skills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                    {f.skills.length > 4 && (
                      <span className="px-2.5 py-1 rounded-full text-xs bg-zinc-700 text-zinc-400">
                        +{f.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Stats + Link */}
                <div className="border-t border-zinc-800 mt-auto pt-4 flex items-center justify-between">
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
                    className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}