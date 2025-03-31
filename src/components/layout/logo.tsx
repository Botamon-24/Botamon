"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  textColor?: string;
}

// 要修改Logo，有两种方法：
// 1. 文字Logo：直接修改下方的"BOTAMON"为您的品牌名称
// 2. 图片Logo：取消注释下方的图片代码，并提供您的logo图片URL
export function Logo({ className, textColor = "text-bl-blue-accent" }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <div className="relative overflow-hidden">
        {/* 文字Logo - 修改以下文本 */}
        <span className={cn("text-2xl font-bold tracking-tighter", textColor)}>
          BOTAMON
        </span>

        {/* 图片Logo - 取消以下注释并修改路径以使用图片
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-8 w-auto"
        />
        */}

        <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-bl-blue-accent/70" />
      </div>
    </Link>
  );
}
