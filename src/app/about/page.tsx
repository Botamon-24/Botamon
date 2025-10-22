"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiMonitor, FiVideo, FiPenTool, FiLayers, FiBox, FiLayout } from "react-icons/fi";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="mb-16 text-center">
        <motion.h1
          className="mb-4 text-4xl font-bold tracking-tight text-bl-blue-accent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ABOUT ME
        </motion.h1>
        <motion.p
          className="mx-auto max-w-2xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Botamon | Focusing on turning imagination into reality through cutting-edge digital art techniques and innovative design solutions.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <h2 className="mb-6 text-3xl font-semibold text-bl-blue-light">Hello, I'm Botamon (ZXF) </h2>
          <p className="mb-4 text-lg">
          全流程制作能力：精通视频策划、剪辑及后期全流程，熟练使用 Premiere Pro、Photoshop、After Effects、Audition、Media Encoder、Final Cut Pro、Adobe Illustrator、剪映，掌握 Blender 3D制作；
          <br /><br />技术拓展：熟悉 HTML+CSS+JS 前端开发（配合Visual Studio Code）；运用 ChatGPT/DeepSeek 辅助内容优化与热点分析；运用ComfyUI 生成文生图，图生图，
          对运用checkpoints二次元IL大模型,LORA模型，通过精准提示词生成符合需求的视觉素材，对生成内容进行筛选优化。Topaz Gigapixel AI图文放大。
          </p>
          <p className="mb-8 text-lg">
          爆款内容经验：累计制作 600+条短视频（200+条来自“一口金克酥”，其余来自电竞俱乐部项目），抖音/快手/B站综合爆款占比超20%（‘一口金克酥’全平台10w播放量以上内容占比35%），擅长数据驱动型运营；
          <br /><br />游戏项目后期全栈经验：熟悉 腾讯系（无畏契约、LOLM、王者荣耀、LOL、三角洲）、拳头官方（LPL赛事）、网易赛事系（永劫无间、第五人格） 项目规范与审核标准；
          <br /><br />团队赋能：主导新人培训与流程标准化，提升团队协作效率.
          </p>
            {/* 暂时不展示 */}
          {/*<div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="mb-2 text-xl font-medium text-bl-blue">Experience</h3>
              <ul className="space-y-1 text-sm">
                <li>• 4+ 年后期制作经验</li>
                <li>• 3+ 年平面设计经验</li>
                <li>• 1+ 年3D建模制作经验</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-medium text-bl-blue">Education</h3>
              <ul className="space-y-1 text-sm">
                <li>• BFA in Digital Arts</li>
                <li>• Certified Motion Designer</li>
                <li>• Advanced 3D Modeling Course</li>
              </ul>
            </div>
          </div>*/}

          <div className="mt-8">
            <Link href="/contact" passHref>
              <Button className="bg-bl-blue text-white hover:bg-bl-blue-light">
                Get In Touch
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <div className="relative h-[400px] w-[400px] overflow-hidden rounded-full border-4 border-bl-blue-dark bg-bl-dark/30">
          <Image 
              src="/ID photo.jpg" // 替换为您的头像图片路径
              alt="Botamon Profile"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[url('/portrait-placeholder.jpg')] bg-cover bg-center opacity-70">
              {/* Replace with your actual portrait image */}
              <div className="absolute inset-0 bg-gradient-to-t from-bl-dark via-transparent to-transparent"></div>
            </div>
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-cover bg-center opacity-15 mix-blend-overlay"></div>
          </div>
        </motion.div>
      </div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-24"
      >
        <h2 className="mb-12 text-center text-3xl font-bold text-bl-blue-light">Skills & Expertise</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SkillCard
            title="3D Modeling"
            description="Creating detailed 3D models and environments with attention to realism and aesthetics."
            icon={<FiBox className="h-8 w-8" />}
          />
          <SkillCard
            title="Video Editing"
            description="Crafting compelling visual stories through expert editing, color grading, and effects."
            icon={<FiVideo className="h-8 w-8" />}
          />
          <SkillCard
            title="Graphic Design"
            description="Developing impactful visual concepts for branding, marketing materials, and digital content."
            icon={<FiPenTool className="h-8 w-8" />}
          />
         {/* <SkillCard
            title="Motion Graphics"
            description="Bringing static designs to life with dynamic animations and visual effects."
            icon={<FiLayers className="h-8 w-8" />}
          />
          <SkillCard
            title="UI/UX Design"
            description="Creating intuitive and aesthetically pleasing user interfaces for digital products."
            icon={<FiLayout className="h-8 w-8" />}
          />
          <SkillCard
            title="Digital Illustration"
            description="Drawing detailed illustrations for various mediums and purposes."
            icon={<FiMonitor className="h-8 w-8" />}
          />*/}
        </div>
      </motion.div>

      {/* Software & Tools */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-24"
      >
        <h2 className="mb-8 text-center text-3xl font-bold text-bl-blue-light">Software & Tools</h2>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {["Premiere Pro", "Photoshop", "After Effects", "Audition", "Media Encoder", "Final Cut Pro",
            "Adobe Illustrator", "Blender", "Visual Studio Code", "ChatGPT", "DeepSeek"].map((tool, index) => (
            <div
              key={index}
              className="rounded-full bg-bl-blue-dark/40 px-4 py-2 text-bl-blue-light transition-all hover:bg-bl-blue/20"
            >
              {tool}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-16 flex justify-center">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-bl-blue hover:bg-bl-dark/20">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SkillCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="overflow-hidden bg-card/60 backdrop-blur-sm transition-all hover:bg-card hover:shadow-md hover:shadow-bl-blue/10">
      <CardHeader>
        <div className="mb-2 text-bl-blue">{icon}</div>
        <CardTitle className="text-xl font-medium text-bl-blue-light">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
