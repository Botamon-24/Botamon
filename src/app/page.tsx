"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiVideo, FiGrid, FiUser, FiMail, FiFileText } from "react-icons/fi";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 主区域 */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-20">
        {/* 背景效果 */}
        <div className="absolute inset-0 -z-10 bg-prison-gradient opacity-90"></div>
        <div className="absolute inset-0 -z-10 bg-blue-mesh opacity-15"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bl-dark-darker/50 to-transparent"></div>

        {/* 内容 */}
        <div className="container relative z-10 flex flex-col items-center justify-center py-16 text-center md:py-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center justify-center"
          >
            <div className="h-1 w-16 bg-bl-blue-accent"></div>
            <span className="mx-4 text-bl-blue-accent">Visual Creator</span>
            <div className="h-1 w-16 bg-bl-blue-accent"></div>
          </motion.div>

          <motion.h1
            className="mb-6 text-5xl font-bold tracking-tight text-bl-blue-accent sm:text-6xl md:text-7xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            BOTAMON
          </motion.h1>

          <motion.p
            className="mb-10 max-w-2xl text-sm text-blue-100/90 md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Botamon | Focusing on turning imagination into reality 
            through cutting-edge digital art techniques and innovative design solutions.
          </motion.p>

          <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
            {/* Video Navigation Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Link href="/videos">
                <div className="rounded-lg bg-white/5 border border-white/10 group flex cursor-pointer flex-col items-center p-6 text-center transition-all duration-300 hover:bg-white/10 hover:shadow-md hover:shadow-bl-blue/10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bl-blue-dark text-bl-blue-accent transition-all duration-300 group-hover:bg-bl-blue group-hover:text-white">
                    <FiVideo className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 font-semibold text-white transition-all group-hover:text-bl-blue-accent">
                    Videos
                  </h3>
                  <p className="text-sm text-blue-100/70">Video editing & VFX</p>
                </div>
              </Link>
            </motion.div>

            {/* Design Navigation Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Link href="/design">
                <div className="rounded-lg bg-white/5 border border-white/10 group flex cursor-pointer flex-col items-center p-6 text-center transition-all duration-300 hover:bg-white/10 hover:shadow-md hover:shadow-bl-blue/10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bl-blue-dark text-bl-blue-accent transition-all duration-300 group-hover:bg-bl-blue group-hover:text-white">
                    <FiGrid className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 font-semibold text-white transition-all group-hover:text-bl-blue-accent">
                    Design
                  </h3>
                  <p className="text-sm text-blue-100/70">3D & graphic design</p>
                </div>
              </Link>
            </motion.div>

           

            {/* About Navigation Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <Link href="/about">
                <div className="rounded-lg bg-white/5 border border-white/10 group flex cursor-pointer flex-col items-center p-6 text-center transition-all duration-300 hover:bg-white/10 hover:shadow-md hover:shadow-bl-blue/10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bl-blue-dark text-bl-blue-accent transition-all duration-300 group-hover:bg-bl-blue group-hover:text-white">
                    <FiUser className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 font-semibold text-white transition-all group-hover:text-bl-blue-accent">
                    About Me
                  </h3>
                  <p className="text-sm text-blue-100/70">Experience & skills</p>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Link href="/contact">
              <Button className="bg-bl-blue text-white group flex items-center gap-2 hover:bg-bl-blue-light hover:shadow-md hover:shadow-bl-blue/20">
                <FiMail className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                <span>CONTACT ME</span>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* 底部装饰 */}
<div className="absolute bottom-8 left-0 right-0 flex justify-center">
  <div className="flex flex-col items-center">
    <div className="mb-2 h-16 w-0.5 bg-gradient-to-b from-transparent via-bl-blue-accent to-bl-blue glow-effect"></div>
    <div className="rounded-full bg-bl-blue-dark/40 p-1.5 shadow-lg shadow-bl-blue/20 backdrop-blur-sm">
      <div className="h-3 w-3 rounded-full bg-bl-blue-accent animate-pulse"></div>
    </div>
  </div>
</div>
      </section>
    </div>
  );
}
