"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      console.log("login success", data);
      router.push("/dashboard/client");
      router.refresh();
    } catch (err) {
      setError("An unexpected system exception occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      setError("Failed to initialize Google authentication. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#212121] px-4 py-6 text-neutral-200 w-full">
      <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-[#262626] p-6 shadow-2xl flex flex-col items-stretch">
        
        <div className="flex justify-center mb-4 scale-90">
          <Logo />
        </div>

        <div className="mb-5 text-center">
          <h1 className="text-xl font-bold tracking-tight text-white">Welcome Back</h1>
          <p className="mt-1 text-xs text-neutral-400">
            Sign in to access your SkillSwap workspace
          </p>
        </div>

        <button
          type="button"
          disabled={loading || googleLoading}
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-neutral-800 bg-[#212121] py-2 text-sm font-semibold text-white transition-all hover:bg-neutral-800 disabled:opacity-50 shadow-md mb-4"
        >
          {googleLoading ? (
            <Loader2 size={16} className="animate-spin text-neutral-400" />
          ) : (
            <FcGoogle size={18} />
          )}
          <span className="text-xs">Continue with Google</span>
        </button>

        <div className="relative mb-4 flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-neutral-800" />
          <span className="relative bg-[#262626] px-2.5 text-[10px] uppercase tracking-wider text-neutral-500">
            Or use email
          </span>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-900/30 bg-red-950/20 p-2.5 text-xs text-red-400 animate-in fade-in zoom-in-95 duration-150">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <Mail size={16} />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-800 bg-[#212121] py-1.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 outline-none transition-all focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <Lock size={16} />
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-800 bg-[#212121] py-1.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 outline-none transition-all focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 shadow-lg shadow-blue-900/10 mt-1"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Signing you in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-5 border-t border-neutral-800 pt-4 text-center text-xs text-neutral-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}