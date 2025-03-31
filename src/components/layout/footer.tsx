"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { FiGithub, FiInstagram, FiTwitter, FiBriefcase, FiMail } from "react-icons/fi";
import { FaWeixin,FaQq,FaTiktok } from "react-icons/fa";
import { SiBilibili } from "react-icons/si";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo and description */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-bl-blue-accent">BOTAMON</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Creative portfolio showcasing 3D modeling, video editing, and graphic design work.
             
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col">
            <h3 className="mb-4 text-sm font-medium">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-bl-blue-light">
                Home
              </Link>
              <Link href="/videos" className="text-muted-foreground hover:text-bl-blue-light">
                Videos
              </Link>
              <Link href="/design" className="text-muted-foreground hover:text-bl-blue-light">
                Design
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-bl-blue-light">
                About Me
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-bl-blue-light">
                Contact
              </Link>
            </div>
          </div>

          {/* Social media */}
          <div className="flex flex-col">
            <h3 className="mb-4 text-sm font-medium">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/Botamon-24"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-bl-blue-dark/40 text-bl-blue-accent transition-colors hover:bg-bl-blue-dark"
              >
                <FiGithub size={18} />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://space.bilibili.com/1718872865?spm_id_from=333.1387.0.0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-bl-blue-dark/40 text-bl-blue-accent transition-colors hover:bg-bl-blue-dark"
              >
                <SiBilibili size={18} />
                <span className="sr-only">Bilibili</span>
              </a>
              <a
                href="https://v.douyin.com/i5Tn7QT1/ 7@8.com :0pm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-bl-blue-dark/40 text-bl-blue-accent transition-colors hover:bg-bl-blue-dark"
              >
                <FaTiktok size={18} />
                <span className="sr-only">Tiktok</span>
              </a>
              <a
                href="mailto:boar24@icloud.com"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-bl-blue-dark/40 text-bl-blue-accent transition-colors hover:bg-bl-blue-dark"
              >
                <FiMail size={18} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-border/20 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Botamon. All rights reserved.
          </p>
          <p className="mt-4 text-sm text-muted-foreground md:mt-0">
            Created with passion for visual storytelling
          </p>
        </div>
      </div>
    </footer>
  );
}
