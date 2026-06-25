"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Lock, Shield, Loader2, AlertCircle, Check, X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "client",
    },
  });

  const watchedPassword = watch("password", "");

  const passwordRequirements = [
    { label: "At least 6 characters", test: (pw) => pw.length >= 6 },
    { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
    { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  ];

  const onSubmit = async (formData) => {
    setLoading(true);
    setServerError("");

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        data: {
          role: formData.role,
        },
        callbackURL: `/dashboard/${formData.role}`, 
      });

      if (authError) {
        setServerError(authError.message || "Account creation failed.");
        setLoading(false);
        return;
      }

      console.log("Registration success", data);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setServerError("An unexpected authentication error occurred.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setServerError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      setServerError("Failed to initialize Google authentication. Please try again.");
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
          <h1 className="text-xl font-bold tracking-tight text-white">Create Account</h1>
          <p className="mt-1 text-xs text-neutral-400">Join the workspace platform today</p>
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
            Or register with email
          </span>
        </div>

        {serverError && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-900/30 bg-red-950/20 p-2.5 text-xs text-red-400">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <User size={16} />
              </div>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full rounded-lg border border-neutral-800 bg-[#212121] py-1.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 outline-none transition-all focus:border-neutral-700"
                placeholder="Shohan"
              />
            </div>
            {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <Mail size={16} />
              </div>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                })}
                className="w-full rounded-lg border border-neutral-800 bg-[#212121] py-1.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 outline-none transition-all focus:border-neutral-700"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-1.5">I want to join as a</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <Shield size={16} />
              </div>
              <select
                {...register("role")}
                className="w-full appearance-none rounded-lg border border-neutral-800 bg-[#212121] py-1.5 pl-9 pr-3 text-xs text-white outline-none transition-all focus:border-neutral-700"
              >
                <option value="client">Client (Hire Talents)</option>
                <option value="freelancer">Freelancer (Work on Projects)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <Lock size={16} />
              </div>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  validate: (value) => 
                    passwordRequirements.every((req) => req.test(value)) || "Password is too weak"
                })}
                className="w-full rounded-lg border border-neutral-800 bg-[#212121] py-1.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 outline-none transition-all focus:border-neutral-700"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-[11px] text-red-400">{errors.password.message}</p>}

            <div className="mt-2 space-y-1 rounded-lg bg-[#212121] p-2 text-[11px] border border-neutral-800">
              {passwordRequirements.map((req, index) => {
                const isPassed = req.test(watchedPassword);
                return (
                  <div key={index} className={`flex items-center gap-1.5 ${isPassed ? "text-emerald-400" : "text-neutral-500"}`}>
                    {isPassed ? <Check size={12} /> : <X size={12} className="text-neutral-600" />}
                    <span>{req.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50 shadow-lg mt-1"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Setting up workspace...
              </>
            ) : (
              "Sign Up & Login"
            )}
          </button>
        </form>

        <div className="mt-5 border-t border-neutral-800 pt-4 text-center text-xs text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}