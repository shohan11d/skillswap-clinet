"use client";

import { motion } from "framer-motion";
import { FileText, Send, CheckSquare, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FileText className="text-blue-500" size={28} />,
      title: "1. Post a Task",
      desc: "Describe what you need done in minutes. Specify your budget framework, core timelines, and structural scope.",
    },
    {
      icon: <Send className="text-indigo-400" size={28} />,
      title: "2. Get Proposals",
      desc: "Receive real-time, competitive applications from our vetted pool of skilled global engineering and design talents.",
    },
    {
      icon: <CheckSquare className="text-emerald-400" size={28} />,
      title: "3. Hire & Pay Safely",
      desc: "Review portfolio metrics, choose your ideal provider, and release secure funds only when milestones are completed.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
  };

  return (
    <section className="bg-[#212121] w-full px-4 py-24 text-neutral-200 border-t border-neutral-800">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-7xl"
      >
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-sm text-neutral-400 max-w-xl mx-auto">
            Get your milestones cleared cleanly in three simple steps without navigating complex administrative overhead.
          </p>
        </div>

        {/* Steps Grid Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -6, borderColor: "#404040" }}
              className="relative rounded-xl border border-neutral-800 bg-[#262626] p-8 shadow-xl transition-colors duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon Circle */}
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-[#212121] border border-neutral-800">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
              </div>

              {/* Connector Arrow for Desktop layouts */}
              {idx < 2 && (
                <div className="absolute top-1/2 -right-6 hidden md:flex items-center text-neutral-700 z-10 translate-y-[-50%] pointer-events-none">
                  <ArrowRight size={20} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}