"use client";

import { useEffect, useState } from "react";
import { Loader2, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ActiveProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State to hold the input URLs for each task
  const [deliverableUrls, setDeliverableUrls] = useState({});
  // State to track which specific task is currently being submitted
  const [submittingId, setSubmittingId] = useState(null);

  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (isPending) return;
    if (!email) {
      setError("Please sign in to view your active projects.");
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/freelancer/active-projects?email=${email}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load active projects.");
        return res.json();
      })
      .then((data) => setProjects(data.projects || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [email, isPending]);

  const handleUrlChange = (projectId, value) => {
    setDeliverableUrls((prev) => ({
      ...prev,
      [projectId]: value,
    }));
  };

  const handleCompleteTask = async (projectId) => {
    const url = deliverableUrls[projectId];
    if (!url || url.trim() === "") {
      alert("Please provide a valid deliverable link.");
      return;
    }

    setSubmittingId(projectId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${projectId}/deliver`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deliverable_url: url,
            freelancer_email: email,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit deliverable.");
      }

      // Update local state to reflect the new status and URL without refreshing the page
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, status: "completed", deliverable_url: url }
            : project
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-800 rounded-xl text-zinc-100 py-12 px-4 sm:px-6 lg:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Active Projects
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Your ongoing accepted tasks and contracts
          </p>
        </div>

        {error && (
          <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
            {error}
          </p>
        )}

        {!error && projects.length === 0 && (
          <p className="text-zinc-500 text-sm">
            You do not have any active projects at the moment.
          </p>
        )}

        {projects.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Project Title
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Budget
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Deliverable & Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {projects.map((project) => (
                    <tr
                      key={project._id}
                      className="hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-5 py-4 text-white font-medium">
                        {project.title}
                      </td>
                      <td className="px-5 py-4 text-emerald-400 font-bold whitespace-nowrap">
                        ${project.budget}{" "}
                        <span className="text-zinc-500 font-normal text-xs">USD</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${
                            project.status === "completed"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {project.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {project.status === "completed" ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-blue-400" />
                            <a
                              href={project.deliverable_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1.5 text-xs font-medium truncate max-w-[200px]"
                            >
                              <LinkIcon size={12} />
                              View Work
                            </a>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 max-w-[300px]">
                            <input
                              type="url"
                              placeholder="https://github.com/..."
                              value={deliverableUrls[project._id] || ""}
                              onChange={(e) =>
                                handleUrlChange(project._id, e.target.value)
                              }
                              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                            />
                            <button
                              onClick={() => handleCompleteTask(project._id)}
                              disabled={submittingId === project._id}
                              className="shrink-0 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submittingId === project._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                "Complete"
                              )}
                            </button>
                          </div>
                        )}
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