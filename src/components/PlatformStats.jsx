"use client";

import { motion } from "framer-motion";
import { Briefcase, Users, Landmark } from "lucide-react";

export default function PlatformStats() {
  const stats = [
    {
      icon: <Briefcase className="text-blue-500" size={24} />,
      value: "14,820+",
      label: "Total Tasks Posted",
    },
    {
      icon: <Users className="text-indigo-400" size={24} />,
      value: "9,450+",
      label: "Total Vetted Users",
    },
    {
      icon: <Landmark className="text-emerald-400" size={24} />,
      value: "$320K+",
      label: "Total Payout Completed",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#262626] px-4 py-20 text-neutral-200 border-t border-b border-neutral-800 w-full">
      {/* Subtle background overlay elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.03),transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5, type: "spring" }}
              className="flex flex-col items-center p-4 group"
            >
              {/* Outer soft glow ring on metric focus */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#212121] border border-neutral-800 group-hover:border-neutral-700 transition-colors duration-300 shadow-inner">
                {stat.icon}
              </div>
              
              <motion.div 
                className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {stat.value}
              </motion.div>
              
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}