"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function EditFreelancerProfile() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Manage tags array with local state
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const { data: session, isPending: sessionPending } = authClient.useSession();
  const email = session?.user?.email;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      image: "",
      bio: "",
      hourlyRate: 0,
    },
  });

  useEffect(() => {
    if (sessionPending || !email) return;

    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load your authentication document.");
        return res.json();
      })
      .then((data) => {
        if (data.role !== "freelancer") {
          setMessage({ type: "error", text: "Access denied. Only freelancers can modify these fields." });
          return;
        }
        
        // Safeguard against missing optional profile parameters in BetterAuth scheme
        reset({
          name: data.name || "",
          image: data.image || "",
          bio: data.bio || "",
          hourlyRate: data.hourlyRate ? Number(data.hourlyRate) : 0,
        });
        
        // Fallback to empty array if BetterAuth user document lacks skills array
        setSkills(Array.isArray(data.skills) ? data.skills : []);
      })
      .catch((err) => setMessage({ type: "error", text: err.message }));
  }, [email, sessionPending, reset]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = skillInput.trim();
      
      if (trimmedValue && !skills.includes(trimmedValue)) {
        setSkills([...skills, trimmedValue]);
        setSkillInput("");
      }
    }
  };

  const removeSkill = (indexToRemove) => {
    setSkills(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = async (values) => {
    setLoading(true);
    setMessage(null);

    const payload = {
      ...values,
      hourlyRate: Number(values.hourlyRate),
      skills,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile settings.");

      setMessage({ type: "success", text: "Public changes updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (sessionPending) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <p className="text-zinc-400 bg-zinc-900 border border-zinc-800 p-6 rounded-xl max-w-md text-center">
          Please sign in to modify your professional information.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Public Profile Settings</h1>
          <p className="text-zinc-400 text-sm mt-1">Freelancers can change their public details here anytime.</p>
        </div>

        {message && (
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border text-sm mb-6 ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Display Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Your professional name"
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>}
          </div>

          {/* Profile Image Link Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Profile Image Link
            </label>
            <input
              type="url"
              {...register("image")}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="https://yourwebsite.com/photo.jpg"
            />
          </div>

          {/* Hourly Rate Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Hourly Rate ($ USD)
            </label>
            <input
              type="number"
              {...register("hourlyRate", {
                required: "Hourly rate is required",
                min: { value: 0, message: "Rate cannot be negative" },
              })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="45"
            />
            {errors.hourlyRate && <p className="text-xs text-rose-400 mt-1">{errors.hourlyRate.message}</p>}
          </div>

          {/* Skills (Tags System) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Skills <span className="text-zinc-500 font-normal lowercase">(Type skill and press enter)</span>
            </label>
            
            <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 min-h-[50px] flex flex-wrap gap-2 items-center focus-within:border-blue-500/50 transition-colors">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium px-2.5 py-1 rounded-lg"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="hover:text-blue-200 p-0.5 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow bg-transparent text-sm text-white outline-none min-w-[120px]"
                placeholder={skills.length === 0 ? "e.g. Next.js, Node.js" : ""}
              />
            </div>
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Bio Description
            </label>
            <textarea
              rows={4}
              {...register("bio")}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
              placeholder="Introduce your software development background, accomplishments, and stack specialties..."
            />
          </div>

          {/* Action Trigger Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-medium text-sm py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Updating Details..." : "Save Profile Details"}
          </button>
        </form>
      </div>
    </div>
  );
}