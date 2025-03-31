"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

// 设计作品类型
type DesignCategory = "Graphic Design" | "Botamon" | "Botamon 3D";

interface DesignWork {
  id: string;
  title: string;
  description: string;
  //date: string;
  thumbnail: string;
  category: DesignCategory;
  fullImages: string[];
  detailedDescription?: string;
  tools?: string[];
  clientName?: string;
  duration?: string;
  challenge?: string;
  solution?: string;
}

// 示例设计作品数据
const designWorks: DesignWork[] = [
  {
    id: "01",
    title: "Trace Esports",
    description: "Honor of Kings",
    //date: "2024.01",
    thumbnail: "/thumbnails/05.jpg",
    category: "Graphic Design",
    fullImages: [
      "/thumbnails/05.jpg",
    ],
  },
  {
    id: "02",
    title: "Trace Esports",
    description: "TE Annual Meeting",
    //date: "2024.02",
    thumbnail: "/thumbnails/11.jpg",
    category: "Graphic Design",
    fullImages: [
      "/thumbnails/11.jpg"
    ],
  },
  {
    id: "03",
    title: "Trace Esports",
    description: "Honor of Kings",
    //date: "2024.03",
    thumbnail: "/design/01.webp",
    category: "Graphic Design",
    fullImages: [
      "/design/01.webpg"
    ],
  },
  {
    id: "04",
    title: "Trace Esports",
    description: "Naraka",
    //date: "2024.04",
    thumbnail: "/design/02.webp",
    category: "Graphic Design",
    fullImages: [
      "/design/02.webp"
    ],
  },
  {
    id: "05",
    title: "Trace Esports",
    description: "Naraka",
    //date: "2024.05",
    thumbnail: "/design/03.webp",
    category: "Graphic Design",
    fullImages: [
      "/design/03.webp"
    ],
  },
  {
    id: "06",
    title: "Trace Esports",
    description: "Valorant",
    //date: "2024.06",
    thumbnail: "/design/04.jpg",
    category: "Graphic Design",
    fullImages: [
      "/design/04.jpg"
    ],
  },
  {
    id: "07",
    title: "Trace Esports",
    description: "Valorant",
    //date: "2024.07",
    thumbnail: "/design/05.webp",
    category: "Graphic Design",
    fullImages: [
      "/design/05.webp"
    ],
  },
  {
    id: "08",
    title: "Trace Esports",
    description: "Naraka",
    //date: "2024.08",
    thumbnail: "/design/07.webp",
    category: "Graphic Design",
    fullImages: [
      "/design/07.webp"
    ],
  }
];

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<DesignWork | null>(null);
  const [loading, setLoading] = useState(true);

  // 根据ID查找项目
  useEffect(() => {
    const foundProject = designWorks.find((p) => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
    }
    setLoading(false);
  }, [projectId]);

  // 如果没有找到项目
  if (!loading && !project) {
    notFound();
  }

  // 加载状态
  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
        <div className="loading-animation"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
              {/* 项目标题和类别 */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center">
          <Link href="/design" passHref>
            <Button variant="ghost" className="mr-2 text-bl-blue">
              ← 所有作品
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground">|
            {project.category === "Graphic Design" ? "GRAPHIC" : 
            project.category === "Botamon" ? "BOTAMON" : 
            project.category === "Botamon 3D" ? "BOTAMON 3D" : ""} 项目
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-bl-blue-accent sm:text-4xl md:text-5xl">
          {project.title}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {project.description}  {/* 使用描述作为副标题，替换原来的日期 */}
        </p>
      </div>

        {/* 主要项目图片 */}
        <div className="relative mb-10 w-full max-w-4xl mx-auto overflow-hidden rounded-lg">
          <div className="flex justify-center">
            <Image
              src={project.thumbnail}
              alt={project.title}
              width={1080}
              height={1080}
              className="max-h-[70vh] w-auto h-auto object-contain rounded-lg"
              priority
            />
          </div>
        </div>

        {/* 项目导航 */}
        <div className="mx-auto max-w-4xl mt-16 flex justify-between">
          <Link href="/design" passHref>
            <Button variant="outline" className="text-bl-blue">
              ← 返回设计作品
            </Button>
          </Link>
          <Link href="/contact" passHref>
            <Button className="bg-bl-blue text-white hover:bg-bl-blue-light">
              联系我
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}