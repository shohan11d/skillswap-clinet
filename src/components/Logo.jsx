"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* Animated Logo Icon Wrapper */}
      <motion.div 
        whileHover={{ rotate: 15, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20"
      >
        {/* Custom SVG representing dynamic skill exchange */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-white"
        >
          {/* Intersecting arrows / exchange nodes loop */}
          <path d="M7 7h10v10" />
          <path d="M17 17H7V7" />
          <circle cx="7" cy="7" r="1" fill="currentColor" />
          <circle cx="17" cy="17" r="1" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Assignment Correct Brand Name Typography */}
      <span className="text-xl font-extrabold tracking-tight text-white">
        Skill<span className="text-blue-500 group-hover:text-blue-400 transition-colors duration-200">Swap</span>
      </span>
    </Link>
  );
}