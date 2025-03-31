"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMail, FiMessageSquare, FiGithub } from "react-icons/fi";
import { FaWeixin, FaQq, FaTiktok } from "react-icons/fa";
import { SiBilibili } from "react-icons/si";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-24">
      <div className="mb-16 text-center">
        <motion.h1
          className="mb-4 text-4xl font-bold tracking-tight text-bl-blue-accent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          CONTACT ME
        </motion.h1>
        <motion.p
          className="mx-auto max-w-2xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Let's connect and discuss how we can work together on your next creative project.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="overflow-hidden bg-card/60 p-6 backdrop-blur-sm max-w-2xl mx-auto">
          {/* 联系信息部分 - 居中布局 */}
          <div className="text-center">
            <h2 className="mb-6 text-2xl font-semibold text-bl-blue-accent">Get In Touch</h2>
            
            {/* Email 部分 */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bl-blue-dark/40 text-bl-blue-accent mb-3">
                <FiMail size={24} />
              </div>
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-muted-foreground mt-1">boar24@icloud.com</p>
            </div>
            
            {/* Social Media 部分 */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bl-blue-dark/40 text-bl-blue-accent mb-3">
                <FiMessageSquare size={24} />
              </div>
              <h3 className="font-medium mb-2">Social Media</h3>
              <div className="flex gap-4 justify-center">
                <a 
                  href="https://github.com/Botamon-24" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-bl-blue-dark/40 p-2 text-bl-blue-accent transition-colors hover:bg-bl-blue/20"
                >
                  <FiGithub size={20} />
                </a>
                <a 
                  href="https://space.bilibili.com/1718872865" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-bl-blue-dark/40 p-2 text-bl-blue-accent transition-colors hover:bg-bl-blue/20"
                >
                  <SiBilibili size={20} />
                </a>
                <a 
                  href="https://v.douyin.com/i5Tn7QT1/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-bl-blue-dark/40 p-2 text-bl-blue-accent transition-colors hover:bg-bl-blue/20"
                >
                  <FaTiktok size={20} />
                </a>
              </div>
            </div>
            
            {/* 描述文字 */}
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Looking forward to collaborating on innovative projects. Whether you need 3D models,
              video editing, or design work, I'm here to bring your vision to life.
            </p>
          </div>

          {/* 分隔线 */}
          <div className="my-8 border-t border-border/10"></div>

          {/* 二维码区域 */}
          <div>
            <h3 className="mb-6 text-center font-medium text-bl-blue-light">Scan to Connect</h3>
            
            <div className="flex justify-center gap-16">
              {/* QQ二维码 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-[150px] w-[150px]">
                  <Image 
                    src="/qq.png"
                    alt="QQ Code" 
                    width={140}
                    height={140}
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 text-sm text-center text-muted-foreground">QQ</p>
              </div>
              
              {/* 微信二维码 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-[150px] w-[150px]">
                  <Image 
                    src="/wx.png"
                    alt="WeChat Code" 
                    width={140}
                    height={140}
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 text-sm text-center text-muted-foreground">WeChat</p>
              </div>
            </div>
          </div>
        </Card>
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
        {/* Contact Form 暂时注释掉 需要在恢复 */}
         {/* <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="overflow-hidden bg-card/60 p-8 backdrop-blur-sm">
            <h2 className="mb-6 text-2xl font-semibold text-bl-blue-light">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <FiUser size={16} className="text-bl-blue" />
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-bl-blue"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <FiMail size={16} className="text-bl-blue" />
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-bl-blue"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <FiMessageSquare size={16} className="text-bl-blue" />
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                </div>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project..."
                  required
                  className="min-h-32 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-bl-blue"
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-bl-blue text-white hover:bg-bl-blue-light"
              >
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </motion.div> */}

