"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// 示例设计作品数据
type DesignCategory = "Graphic Design" | "Botamon" | "Botamon 3D";

interface DesignWork {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  category: DesignCategory;
  fullImages: string[];
}

const designWorks: DesignWork[] = [
  {
    id: "01",
    title: "Trace Esports",
    description: "Honor of Kings",
    date: "2024.01",
    thumbnail: "/thumbnails/05.jpg",
    category: "Graphic Design",
    fullImages: [
      "/thumbnails/05.jpg"
    ]
  },
  {
    id: "02",
    title: "Trace Esports",
    description: "TE Annual Meeting",
    date: "2024.02",
    thumbnail: "/thumbnails/11.jpg",
    category: "Graphic Design",
    fullImages: [
      "/thumbnails/11.jpg"
    ]
  },
  {
    id: "03",
    title: "Trace Esports",
    description: "Honor of Kings",
    date: "2024.03",
    thumbnail: "/design/01.webp",
    category: "Graphic Design",
    fullImages: [
      "/design/01.webp"
    ]
  },
  {
    id: "04",
    title: "Trace Esports",
    description: "Naraka",
    date: "2024.04",
    thumbnail: "/design/02.webp",
    category: "Graphic Design",
    fullImages: [
      "/design/02.webp"
    ]
  },
  {
    id: "05",
    title: "Trace Esports",
    description: "Naraka",
    date: "2024.05",
    thumbnail: "/design/03.webp",
    category: "Graphic Design",
    fullImages: [
      "/design/03.webp"
    ]
  },
  {
    id: "06",
    title: "Trace Esports",
    description: "Valorant",
    date: "2024.06",
    thumbnail: "/design/04.jpg",
    category: "Graphic Design",
    fullImages: [
      "/design/04.jpg"
    ]
  },
  {
    id: "07",
    title: "Trace Esports",
    description: "Valorant",
    date: "2024.07",
    thumbnail: "/design/05.webp",
    category: "Graphic Design",
    fullImages: [
      "/design/05.webp"
    ]
  },
  {
    id: "08",
    title: "Trace Esports",
    description: "Naraka",
    date: "2024.08",
    thumbnail: "/design/07.webp",
    category: "Graphic Design",
    fullImages: [
      "/design/07.webp"
    ]
  },
];

export default function DesignPage() {
  const [selectedWork, setSelectedWork] = useState<DesignWork | null>(null);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="mb-16 text-center">
        <motion.h1
          className="mb-4 text-4xl font-bold tracking-tight text-bl-blue-accent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          DESIGN WORKS
        </motion.h1>
        <motion.p
          className="mx-auto max-w-2xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          A Collection of My Design Projects: Where Code Meets Canvas — Bridging Graphic Design and 3D Artistry to Redefine Digital Aesthetics.
        </motion.p>
      </div>

      <Tabs defaultValue="all" className="w-full">
      <div className="mb-16 md:mb-8 flex justify-center">
        <TabsList className="bg-bl-dark/40 flex-col sm:flex-row sticky top-0 z-10">
          <TabsTrigger value="all" className="px-3 py-1.5 text-sm">All Designs</TabsTrigger>
          <TabsTrigger value="Graphic Design" className="px-3 py-1.5 text-sm">Graphic Design</TabsTrigger>
          <TabsTrigger value="Botamon" className="px-3 py-1.5 text-sm">Botamon</TabsTrigger>
          <TabsTrigger value="Botamon 3D" className="px-3 py-1.5 text-sm">Botamon 3D</TabsTrigger>
        </TabsList>
      </div>

        <TabsContent value="all" className="mt-0">
          <DesignGrid
            works={designWorks}
            setSelectedWork={setSelectedWork}
          />
        </TabsContent>

        <TabsContent value="Graphic Design" className="mt-0">  
          <DesignGrid
            works={designWorks.filter(work => work.category === "Graphic Design")}
            setSelectedWork={setSelectedWork}
          />
        </TabsContent>

        <TabsContent value="Botamon" className="mt-0">  
          <DesignGrid
            works={designWorks.filter(work => work.category === "Botamon")}
            setSelectedWork={setSelectedWork}
          />
        </TabsContent>

        <TabsContent value="Botamon 3D" className="mt-0">  
          <DesignGrid
            works={designWorks.filter(work => work.category === "Botamon 3D")}  
            setSelectedWork={setSelectedWork}
          />
        </TabsContent>
      </Tabs>

      <Dialog
        open={selectedWork !== null}
        onOpenChange={(open) => !open && setSelectedWork(null)}
      >
        {selectedWork && (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedWork.title}</DialogTitle>
              <DialogDescription>{selectedWork.description}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              {selectedWork.fullImages.map((img, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-lg">
                  <AspectRatio ratio={16/9}>
                    <Image
                      src={img}
                      alt={`${selectedWork.title} - Image ${idx + 1}`}
                      fill
                      className="object-contain"
                    />
                  </AspectRatio>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <span className="text-sm font-medium text-bl-blue-light">{selectedWork.category.toUpperCase()}</span>
            </div>
            <div className="mt-6 flex justify-center">
              <Link href={`/design/${selectedWork.id}`} passHref>
                <Button className="bg-bl-blue text-white hover:bg-bl-blue-light">
                  View Project Details
                </Button>
              </Link>
            </div>
          </DialogContent>
        )}
      </Dialog>

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

interface DesignGridProps {
  works: DesignWork[];
  setSelectedWork: (work: DesignWork) => void;
}

function DesignGrid({ works, setSelectedWork }: DesignGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {works.map((work, index) => (
        <DesignCard
          key={work.id}
          work={work}
          index={index}
          setSelectedWork={setSelectedWork}
        />
      ))}
    </div>
  );
}

interface DesignCardProps {
  work: DesignWork;
  index: number;
  setSelectedWork: (work: DesignWork) => void;
}

function DesignCard({ work, index, setSelectedWork }: DesignCardProps) {
  // 使用基础的 CSS 类来创建卡片
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/design/${work.id}`} passHref>
        <Card className="group overflow-hidden bg-card/80 backdrop-blur-sm transition-all hover:shadow-md hover:shadow-bl-blue/10">
          <CardContent className="p-0">
            <div
              className="relative w-full cursor-pointer overflow-hidden"
              onClick={(e) => {
                e.preventDefault();
                setSelectedWork(work);
              }}
            >
              <AspectRatio ratio={1}>
                <Image
                  src={work.thumbnail}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="mb-2 text-lg font-semibold text-white">{work.title}</span>
                  <span className="text-sm text-white/80">{work.description}</span>
                </div>
              </AspectRatio>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="p-0 text-sm text-foreground/80">
                  {work.title}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{work.title}</h4>
                    <p className="text-sm">{work.description}</p>
                    <div className="flex items-center pt-2">
                      <span className="text-xs text-muted-foreground">{work.category.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <span className="inline-block rounded-full bg-bl-blue-dark/40 px-2 py-1 text-xs font-medium uppercase text-bl-blue-light">
              {work.category === "Graphic Design" ? "GRAPHIC DESIGN" : 
              work.category === "Botamon" ? "BOTAMON" : 
              work.category === "Botamon 3D" ? "BOTAMON 3D" : 
              String(work.category).toUpperCase()}
            </span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}