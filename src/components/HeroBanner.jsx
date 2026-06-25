"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { PlusCircle, Search, ArrowRight, Sparkles } from "lucide-react";

export default function HeroBanner() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);


//   const userRole = session?.user?.data?.role;
//   console.log("userRole",userRole)
  const userRole = "client";

  // Animation variants for staggered orchestrations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="relative flex min-h-[75vh] w-full items-center justify-center overflow-hidden bg-[#212121] px-4 py-20 text-neutral-200">
      
      {/* Subtle Background Radial Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent_55%)]" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        {/* Animated Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-[#262626] px-4 py-1.5 text-xs font-medium text-neutral-400 backdrop-blur-md mb-6">
          <Sparkles size={14} className="text-blue-500" />
          <span>The Modern Freelance Marketplace Workspace</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Get your tasks done by <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
            skilled freelancers
          </span>
        </motion.h1>

        {/* Subtext Paragraph */}
        <motion.p 
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-base text-neutral-400 sm:text-lg"
        >
          Connect with trusted global talents to scale your workflow, or browse open micro-tasks 
          to stack up earnings. Safe milestone escrows, transparent profiles, zero overhead.
        </motion.p>

        {/* Context-Aware Conditional Action Layout Blocks */}
        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {loading ? (
            // Skeleton state placeholder frame while parsing session layers
            <div className="h-12 w-48 animate-pulse rounded-lg bg-neutral-800" />
          ) : userRole === "client" ? (
            /* Context A: Logged in Client Flow */
            <Link 
              href="/dashboard/post-task" 
              className="group flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-500 shadow-xl shadow-blue-900/20"
            >
              <PlusCircle size={18} />
              <span>Post a New Task</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          ) : userRole === "freelancer" ? (
            /* Context B: Logged in Freelancer Flow */
            <Link 
              href="/tasks" 
              className="group flex items-center gap-2 rounded-lg bg-neutral-100 px-6 py-3 font-semibold text-neutral-900 transition-all hover:bg-white shadow-xl"
            >
              <Search size={18} />
              <span>Browse Open Tasks</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            /* Context C: Unauthenticated / Guest Flow (Showcases both entryways) */
            <>
              <Link 
                href="/register?role=client" 
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-500 shadow-xl shadow-blue-900/20"
              >
                <PlusCircle size={18} />
                <span>Post a Task</span>
              </Link>
              <Link 
                href="/tasks" 
                className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-[#262626] px-6 py-3 font-semibold text-white transition-all hover:bg-neutral-800"
              >
                <Search size={18} />
                <span>Browse Tasks</span>
              </Link>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Decorative Grid Mesh Alignment Marks */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
    </section>
  );
}