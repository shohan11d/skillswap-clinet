"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Briefcase, Users, LogIn, freelancers, House } from "lucide-react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  if (pathname.includes("dashboard")) return null;
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = authClient.useSession();

  return (
    <nav className="border-b border-neutral-800 bg-[#262626] text-neutral-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-white tracking-wide hover:opacity-90"
            >
              Skill<span className="text-blue-500">Swap</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium hover:bg-neutral-800 hover:text-blue-400"
            >
              <House size={16} />
              Home
            </Link>
            <Link
              href="/tasks"
              className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
            >
              <Briefcase size={16} /> Browse Tasks
            </Link>
            <Link
              href="/freelancers"
              className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
            >
              <Users size={16} /> Find Freelancers
            </Link>
            <div className="h-4 w-[1px] bg-neutral-700" /> {/* Divider */}
            {session ? (
              <div className="flex gap-4">
                <Link
                  href={`/dashboard/${session?.user?.role}`}
                  className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                >
                  <LogIn size={16} /> Dashboard
                </Link>
                <span>
                  {session?.user?.name} {session?.user?.role}
                </span>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
              >
                <LogIn size={16} /> Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-[#262626] px-2 pb-4 pt-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="/tasks"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium hover:bg-neutral-800 hover:text-white"
          >
            <Briefcase size={18} /> Browse Tasks
          </Link>
          <Link
            href="/freelancers"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium hover:bg-neutral-800 hover:text-blue-400"
          >
            <Users size={18} /> Find Freelancers
          </Link>

          <hr className="my-2 border-neutral-800" />

          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium hover:bg-neutral-800 hover:text-blue-400"
          >
            <LogIn size={18} /> Login
          </Link>
          <Link
            href="/register"
            onClick={() => setIsOpen(false)}
            className="mt-2 block w-full text-center rounded-md bg-blue-600 px-3 py-2 text-base font-medium text-blue-400 hover:bg-blue-500"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
