"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // router.push("/dashboard");
      // router.refresh();
      console.log("login success",data);
    } catch (err) {
      setError("An unexpected system exception occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    /* This outer div wrapper expands to full height and centers the card completely */
    <div className="flex min-h-screen items-center justify-center bg-[#212121] px-4 py-12 text-neutral-200">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-[#262626] p-8 shadow-2xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Sign in to access your SkillSwap workspace
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-red-900/30 bg-red-950/20 p-3.5 text-sm text-red-400 animate-in fade-in zoom-in-95 duration-150">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Area */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-800 bg-[#212121] py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-800 bg-[#212121] py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 shadow-lg shadow-blue-900/10"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing you in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 border-t border-neutral-800 pt-6 text-center text-sm text-neutral-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}