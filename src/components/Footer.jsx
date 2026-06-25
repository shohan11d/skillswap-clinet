"use client";

import Link from "next/link";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Globe } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t md:py-20 border-neutral-800 bg-[#262626] text-neutral-400 divide-y divide-neutral-800/60">
      {/* Upper Main Grid Section */}
      <div className="container flex flex-col justify-between py-12 mx-auto space-y-8 lg:flex-row lg:space-y-0 px-6 max-w-7xl">
        {/* Brand Presentation Column */}
        <div className="lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <Logo />
          <p className="text-sm max-w-xs leading-relaxed">
            Helping businesses achieve their goals with professional services
            and expert marketplace solutions.
          </p>
        </div>

        {/* Navigation Categories Row */}
        <div className="grid grid-cols-2 text-sm gap-x-6 gap-y-8 lg:w-2/3 sm:grid-cols-4 place-items-center sm:place-items-stretch text-center sm:text-left">
          {/* Column 1: Product Marketplace */}
          <div className="space-y-3">
            <h3 className="tracking-wide uppercase font-bold text-white text-xs">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tasks"
                  className="hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="hover:text-white transition-colors"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal / Company */}
          <div className="space-y-3">
            <h3 className="tracking-wide uppercase font-bold text-white text-xs">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Schema
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Workspace Access */}
          <div className="space-y-3">
            <h3 className="uppercase font-bold text-white text-xs">
              Developers
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Public API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Dynamic Social Handles */}
          <div className="space-y-3 flex flex-col items-center sm:items-start">
            <h3 className="uppercase font-bold text-white text-xs">
              Social media
            </h3>
            <div className="flex justify-center space-x-4 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                <FaXTwitter size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Copyright Base Footer Frame */}
      <div className="py-6 text-xs text-center text-neutral-500 bg-[#212121]/30 w-full">
        &copy; {currentYear} SkillSwap Platform. All rights reserved.
      </div>
    </footer>
  );
}
