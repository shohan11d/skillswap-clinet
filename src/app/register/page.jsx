"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Lock, Shield, Loader2, AlertCircle, Check, X } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    { label: "At least one uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
    { label: "At least one lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  ];

  const onSubmit = async (formData) => {
    setLoading(true);
    setServerError("");

    try {
      // BetterAuth signUp automatically creates the user AND signs them in
      const { data,error: authError } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        data: {
          role: formData.role, // Passes custom metadata safely to your DB
        },
        callbackURL: "/dashboard", 
      });

      if (authError) {
        setServerError(authError.message || "Account creation failed.");
        setLoading(false);
        return;
      }

      // If successful, push straight to the dashboard
      router.push("/login");
      router.refresh();
      console.log(data);
      alert ("Account created successfully!");
    } catch (err) {
      setServerError("An unexpected authentication error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#212121] px-4 py-12 text-neutral-200">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-[#262626] p-8 shadow-2xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Account</h1>
          <p className="mt-2 text-sm text-neutral-400">Join the workspace platform today</p>
        </div>

        {/* Server Error Display */}
        {serverError && (
          <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-red-900/30 bg-red-950/20 p-3.5 text-sm text-red-400">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <User size={18} />
              </div>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full rounded-lg border border-neutral-800 bg-[#212121] py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:border-neutral-700"
                placeholder="Shohan"
              />
            </div>
            {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                })}
                className="w-full rounded-lg border border-neutral-800 bg-[#212121] py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:border-neutral-700"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          {/* Role Choice */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">I want to join as a</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <Shield size={18} />
              </div>
              <select
                {...register("role")}
                className="w-full appearance-none rounded-lg border border-neutral-800 bg-[#212121] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-neutral-700"
              >
                <option value="client">Client (Hire Talents)</option>
                <option value="freelancer">Freelancer (Work on Projects)</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 pointer-events-none">
                <Lock size={18} />
              </div>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  validate: (value) => 
                    passwordRequirements.every((req) => req.test(value)) || "Password is too weak"
                })}
                className="w-full rounded-lg border border-neutral-800 bg-[#212121] py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:border-neutral-700"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}

            {/* Dynamic UI Checklist */}
            <div className="mt-3 space-y-1.5 rounded-lg bg-[#212121] p-3 text-xs border border-neutral-800">
              {passwordRequirements.map((req, index) => {
                const isPassed = req.test(watchedPassword);
                return (
                  <div key={index} className={`flex items-center gap-2 ${isPassed ? "text-emerald-400" : "text-neutral-500"}`}>
                    {isPassed ? <Check size={14} /> : <X size={14} className="text-neutral-600" />}
                    <span>{req.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing you in...
              </>
            ) : (
              "Sign Up & Login"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 border-t border-neutral-800 pt-6 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}