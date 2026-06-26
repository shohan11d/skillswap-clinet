"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { PlusCircle, Search, ArrowRight, Sparkles } from "lucide-react";

export default function HeroBanner() {
  const { data: session, isPending } = useSession();

  const userRole = session?.user?.role;

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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent_55%)]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-[#262626] px-4 py-1.5 text-xs font-medium text-neutral-400 backdrop-blur-md mb-6">
          <Sparkles size={14} className="text-blue-500" />
          <span>The Modern Freelance Marketplace Workspace</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Get your tasks done by <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
            skilled freelancers
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-base text-neutral-400 sm:text-lg"
        >
          Connect with trusted global talents to scale your workflow, or browse open micro-tasks
          to stack up earnings. Safe milestone escrows, transparent profiles, zero overhead.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {isPending ? (
            <div className="h-12 w-48 animate-pulse rounded-lg bg-neutral-800" />
          ) : (
            <>
              {(!session || userRole === "client") && (
                <Link
                  href={session ? "/dashboard/post-task" : "/register?role=client"}
                  className="group flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-500 shadow-xl shadow-blue-900/20"
                >
                  <PlusCircle size={18} />
                  <span>Post a Task</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}

              {(!session || userRole === "freelancer") && (
                <Link
                  href="/tasks"
                  className="group flex items-center gap-2 rounded-lg border border-neutral-800 bg-[#262626] px-6 py-3 font-semibold text-white transition-all hover:bg-neutral-800"
                >
                  <Search size={18} />
                  <span>Browse Tasks</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </>
          )}
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
    </section>
  );
}