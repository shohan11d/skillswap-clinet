"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Menu, X, Briefcase, Users, LogIn, House, LogOut, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  const { data: session } = authClient.useSession();
  console.log(session);

  if (pathname.includes("dashboard")) return null;

  const userRole = session?.user?.data?.role || session?.user?.role;

  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (err) {
      console.error("Sign out failed:", err);
    } finally {
      setIsSignOutLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <nav className="border-b border-neutral-800 bg-[#262626] text-neutral-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <House size={16} /> Home
            </Link>
            <Link
              href="/tasks"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Briefcase size={16} /> Browse Tasks
            </Link>
            <Link
              href="/freelancers"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Users size={16} /> Find Freelancers
            </Link>
          </div>

          {/* Authentication Actions */}
          <div className="hidden md:flex items-center space-x-4 text-sm font-medium">
            <div className="h-4 w-[1px] bg-neutral-700 mr-2" />
            {session ? (
              <div className="flex items-center gap-4">
                <Link
                  href={`/dashboard/${session.user.role?.toLowerCase()}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <LogIn size={16} /> Dashboard
                </Link>
                
                <div className="flex items-center gap-2 rounded-md bg-[#212121] border border-neutral-800 pl-2 pr-3 py-1 text-xs text-neutral-300">
                  {/* Dynamic Desktop Profile Avatar Image */}
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User avatar"}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full border border-neutral-700 object-cover"
                    />
                  ) : null}
                  <span className="font-semibold text-white max-w-[100px] truncate ml-1">
                    {session.user.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-blue-400 bg-blue-950/40 border border-blue-900/30">
                    {session.user.role}
                  </span>
                </div>

                <button
                  onClick={handleSignOut}
                  disabled={isSignOutLoading}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-red-400 transition-colors disabled:opacity-50 font-medium py-1.5"
                >
                  {isSignOutLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-500 shadow-md shadow-blue-900/10"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-[#262626] px-3 pb-5 pt-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
          >
            <House size={18} /> Home
          </Link>
          <Link
            href="/tasks"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
          >
            <Briefcase size={18} /> Browse Tasks
          </Link>
          <Link
            href="/freelancers"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
          >
            <Users size={18} /> Find Freelancers
          </Link>

          <hr className="my-3 border-neutral-800" />

          {session ? (
            <div className="space-y-3 px-3">
              <div className="flex items-center justify-between rounded-lg bg-[#212121] p-3 border border-neutral-800">
                <div className="flex items-center gap-2.5 truncate">
                  {/* Dynamic Mobile Profile Avatar Image */}
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User avatar"}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full border border-neutral-700 object-cover shrink-0"
                    />
                  )}
                  <span className="text-sm font-semibold text-white truncate">
                    {session.user.name}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold text-blue-400 bg-blue-950/40 shrink-0">
                  {userRole}
                </span>
              </div>
              <Link
                href={`/dashboard/${session.user.role.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-[#212121] py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
              >
                <LogIn size={16} /> Go to Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                disabled={isSignOutLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-900/30 bg-red-950/10 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-950/20 transition-colors disabled:opacity-50"
              >
                {isSignOutLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogOut size={16} />
                )}
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 pt-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-[#212121] py-2.5 text-base font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all"
              >
                <LogIn size={18} /> Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center rounded-lg bg-blue-600 py-2.5 text-base font-semibold text-white hover:bg-blue-500 transition-all shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}