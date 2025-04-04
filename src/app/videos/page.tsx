"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

// 定义视频分类类型
type VideoCategory = "Trace Esports" | "Yuetui Productions" | "Botamon" | "Botamon 3D";

// 视频数据接口
interface VideoData {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  videoUrl: string; // 通用链接字段
  category: VideoCategory;
}

// 增强的视频预加载功能（专注于缓存增强）
function useVideoPreloader() {
  // 使用三种存储机制来持久化缓存状态记录（注意：这只是记录，不是实际缓存）
  // 1. React状态 - 当前会话的内存缓存状态记录
  const [preloadedVideos, setPreloadedVideos] = useState<Set<string>>(new Set<string>());
  // 实际预加载的视频元素引用存储
  const preloadedElements = useRef<Map<string, HTMLVideoElement>>(new Map());
  // 2. 本地存储 - 长期缓存记录，跨会话
  const localStorageKey = 'video-cache-v2'; // 更新版本号
  // 3. 会话存储 - 当前浏览会话
  const sessionStorageKey = 'preloadedVideos-v2'; // 更新版本号
  
  // 使用标记确保预加载过程只发生一次
  const hasStartedPreloading = useRef<boolean>(false);
  
  // 检查视频是否已经真正加载（不仅仅检查状态记录）
  const isVideoCached = useCallback((url: string): boolean => {
    // 首先检查是否有预加载元素
    if (preloadedElements.current.has(url)) {
      return true;
    }
    // 然后检查记录
    return preloadedVideos.has(url);
  }, [preloadedVideos]);
  
  // 从存储中加载缓存记录
  useEffect(() => {
    try {
      // 尝试清除旧版本缓存记录
      localStorage.removeItem('video-cache-v1');
      sessionStorage.removeItem('preloadedVideos');
      
      // 尝试从会话存储中恢复
      const sessionData = sessionStorage.getItem(sessionStorageKey);
      // 尝试从本地存储中恢复（更持久）
      const localData = localStorage.getItem(localStorageKey);
      
      let combinedUrls: string[] = [];
      
      if (sessionData) {
        const urls = JSON.parse(sessionData) as string[];
        combinedUrls = [...combinedUrls, ...urls];
      }
      
      if (localData) {
        const urls = JSON.parse(localData) as string[];
        combinedUrls = [...combinedUrls, ...urls];
      }
      
      if (combinedUrls.length > 0) {
        // 数组去重并创建Set
        const uniqueUrls = [...new Set(combinedUrls)];
        setPreloadedVideos(new Set(uniqueUrls));
        console.log(`从存储中恢复了${uniqueUrls.length}个预加载视频记录`);
        
        // 注意：恢复记录不等于恢复缓存，我们只恢复了"曾经加载过"的记录
        // 实际的视频内容可能已经从浏览器缓存中被清除
      }
    } catch (e) {
      console.error("恢复缓存记录失败:", e);
    }
  }, []);
  
  // 判断URL是否是直接的视频链接（可以缓存）
  const isDirectVideoUrl = useCallback((url: string): boolean => {
    // B站视频不需要预加载
    if (url.includes('bilibili.com')) return false;
    
    return url.includes('qiniucs.com') || 
           url.includes('sabkt.gdipper.com') || 
           url.includes('myqcloud.com') ||
           url.endsWith('.mp4') || 
           url.endsWith('.webm');
  }, []);

  // 彻底重写的预加载函数 - 更可靠的实现
  const preloadVideo = useCallback((url: string): void => {
    // 如果已缓存或不是直接视频URL，则跳过
    if (preloadedElements.current.has(url) || !isDirectVideoUrl(url)) return;
    
    console.log(`开始真正预加载视频: ${url}`);
    
    // 创建一个新的视频元素用于预加载
    const videoElement = document.createElement('video');
    videoElement.muted = true; // 静音加载
    videoElement.playsInline = true;
    videoElement.crossOrigin = "anonymous"; // 确保跨域加载
    
    // 设置事件监听器
    videoElement.addEventListener('loadedmetadata', () => {
      console.log(`视频元数据已加载: ${url}`);
    });
    
    videoElement.addEventListener('canplay', () => {
      console.log(`视频可以播放了: ${url}`);
      // 视频可以播放时，更新缓存记录
      updateCacheRecord(url);
      
      // 存储预加载的元素，以便后续使用
      preloadedElements.current.set(url, videoElement);
    });
    
    videoElement.addEventListener('error', (e) => {
      console.error(`视频加载失败: ${url}`, e);
      // 从预加载记录中移除
      preloadedElements.current.delete(url);
    });
    
    // 设置视频源并加载
    // 添加时间戳参数以避免缓存问题
    const timestampedUrl = url.includes('?') 
      ? `${url}&_t=${Date.now()}` 
      : `${url}?_t=${Date.now()}`;
    
    videoElement.src = timestampedUrl;
    videoElement.preload = 'auto'; // 使用auto而不是metadata，确保完整加载
    videoElement.load();
    
    // 尝试预先缓冲一些内容（这会帮助更好地缓存视频）
    videoElement.play().then(() => {
      // 播放一小段后暂停
      setTimeout(() => {
        videoElement.pause();
        console.log(`视频已预缓冲: ${url}`);
      }, 500);
    }).catch(err => {
      console.warn(`自动播放被阻止，这是正常的: ${url}`, err);
      // 自动播放被阻止不是错误，我们继续
    });
  }, [isDirectVideoUrl]);
  
  // 更新缓存记录到三个存储位置
  const updateCacheRecord = useCallback((url: string) => {
    // 1. 更新React状态
    setPreloadedVideos(prev => new Set([...prev, url]));
    
    // 2. 更新会话存储
    try {
      const current = sessionStorage.getItem(sessionStorageKey);
      let urls = current ? JSON.parse(current) as string[] : [];
      if (!urls.includes(url)) {
        urls.push(url);
        sessionStorage.setItem(sessionStorageKey, JSON.stringify(urls));
      }
    } catch (e) {
      console.error("保存到会话存储失败:", e);
    }
    
    // 3. 更新本地存储（长期缓存）
    try {
      const current = localStorage.getItem(localStorageKey);
      let urls = current ? JSON.parse(current) as string[] : [];
      if (!urls.includes(url)) {
        urls.push(url);
        localStorage.setItem(localStorageKey, JSON.stringify(urls));
      }
    } catch (e) {
      console.error("保存到本地存储失败:", e);
    }
  }, []);
  
  // 获取预加载的视频元素（如果有）
  const getPreloadedElement = useCallback((url: string): HTMLVideoElement | null => {
    return preloadedElements.current.get(url) || null;
  }, []);
  
  // 批量预加载多个视频（限制数量，减少流量）
  const preloadVideoBatch = useCallback((videos: VideoData[]): void => {
    // 如果已经开始预加载，跳过
    if (hasStartedPreloading.current) {
      console.log("已经进行过预加载，跳过此次操作");
      return;
    }
    
    hasStartedPreloading.current = true;
    
    // 减少预加载数量到1个（仅预加载第一个视频）
    const maxPreloadCount = 1; // 从2个减少到1个
    console.log(`开始预加载前${maxPreloadCount}个视频...`);
    
    // 筛选出直接视频URL
    const directVideoUrls = videos
      .filter(video => isDirectVideoUrl(video.videoUrl))
      .slice(0, maxPreloadCount)
      .map(video => video.videoUrl);
      
    // 过滤掉已缓存的视频
    const urlsToPreload = directVideoUrls.filter(url => !preloadedElements.current.has(url));
    
    if (urlsToPreload.length === 0) {
      console.log("所有视频已经缓存过，无需再次预加载");
      return;
    }
    
    console.log(`实际需要预加载的视频数量: ${urlsToPreload.length}`);
    
    // 增加预加载间隔到3000毫秒
    urlsToPreload.forEach((url, index) => {
      setTimeout(() => {
        preloadVideo(url);
        console.log(`预加载视频 ${index + 1}/${urlsToPreload.length}: ${url}`);
      }, index * 3000); // 从1000ms增加到3000ms
    });
  }, [isDirectVideoUrl, preloadVideo]);

  // 返回相关函数和状态
  return { 
    preloadVideo, 
    preloadVideoBatch,
    preloadedVideos,
    isVideoCached,
    getPreloadedElement
  };
}


// 您可以在这里修改视频数据
// 要替换视频：
// 1. 修改 title, description 和 date 为您的视频信息
// 2. 替换 thumbnail 为您的视频缩略图URL
// 3. 将 videoUrl 替换为您的YouTube、Vimeo 或其他视频嵌入链接
// 4. 根据视频类型选择合适的 category
const videosData: VideoData[] = [
  {
    id: "",
    title: "Valorant",
    description: "2024VCT CN联赛启点赛·TE溯无畏契约出征片",
    date: "",
    thumbnail: "/thumbnails/01.webp",
    videoUrl: "https://www.bilibili.com/video/BV1Rz42197ht/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 将此替换为您的YouTube嵌入链接
    category: "Trace Esports"
  },
  {
    id: "",
    title: "LOLM",
    description: "峡谷第一课：血港鬼影 派克 英雄介绍",
    date: "",
    thumbnail: "/thumbnails/04.jpg",
    videoUrl: "https://www.bilibili.com/video/BV1qF411c7qp/?spm_id_from=333.1387.search.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "Honor of Kings",
    description: "王者荣耀女队 24夺冠纪录片",
    date: "",
    thumbnail: "/thumbnails/05.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%BA%AF%E5%BF%83%E6%96%87%E5%8C%96%2F%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80%E5%A5%B3%E9%98%9F%2F%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80%E5%A5%B3%E9%98%9F%20%E5%A4%BA%E5%86%A0%E7%BA%AA%E5%BD%95%E7%89%87%202024.1.17%20B.mp4", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "LPL",
    description: "Player Story | JDG 369",
    date: "",
    thumbnail: "/thumbnails/03.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%9C%88%E9%80%80%E6%96%87%E5%8C%96%2F%E8%8B%B1%E6%96%87%E6%B5%81%E9%80%89%E6%89%8B%20369%20LPL%20YouTube%2F369%20%E9%80%89%E6%89%8B%E4%BB%8B%E7%BB%8D%20Bco%20B.mp4", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "Naraka",
    description: "TE溯永劫无间分部2023年劫杯世界冠军铸神系列皮肤",
    date: "",
    thumbnail: "/thumbnails/02.webp",
    videoUrl: "https://www.bilibili.com/video/BV1ST42167g2/?spm_id_from=333.1387.favlist.content.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Trace Esports"
  },
  
  
  {
    id: "",
    title: "LOLM",
    description: "Champion Tips",
    date: "",
    thumbnail: "/thumbnails/06.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%9C%88%E9%80%80%E6%96%87%E5%8C%96%2F%E5%B0%8F%E6%8A%80%E5%B7%A7%20Tips%E7%B3%BB%E5%88%97%2F%E5%B0%8F%E6%8A%80%E5%B7%A7%20%E8%90%A8%E5%8B%92%E8%8A%AC%E5%A6%AEB.mp4", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "Identity V",
    description: "TE溯宝麦克风",
    date: "",
    thumbnail: "/thumbnails/07.jpg",
    videoUrl: "https://www.bilibili.com/video/BV11YQwYSEPw/?spm_id_from=333.1387.homepage.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "LOLM",
    description: "TE LOLM 晋级之路",
    date: "",
    thumbnail: "/thumbnails/08.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%BA%AF%E5%BF%83%E6%96%87%E5%8C%96%2FLOL%E6%89%8B%E6%B8%B8%2FTE%20LOLM%20%E6%99%8B%E7%BA%A7%E4%B9%8B%E8%B7%AF%20B.mp4", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Valorant",
    description: "TE 溯问溯答 EP1",
    date: "",
    thumbnail: "/thumbnails/09.webp",
    videoUrl: "https://www.bilibili.com/video/BV1qG411S7Uf/?spm_id_from=333.1387.upload.video_card.click", // 将此替换为您的YouTube嵌入链接
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Valorant",
    description: "TE 溯问溯答 EP2",
    date: "",
    thumbnail: "/thumbnails/09.webp",
    videoUrl: "https://www.bilibili.com/video/BV1Ev411c7UM/?spm_id_from=333.1387.upload.video_card.click", // 将此替换为您的YouTube嵌入链接
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Valorant",
    description: "TE 年会包装",
    date: "",
    thumbnail: "/thumbnails/10.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%BA%AF%E5%BF%83%E6%96%87%E5%8C%96%2FTE%20%E6%BA%AF%20%E5%8C%85%E8%A3%85%E5%8A%A8%E6%80%81%2F%E5%88%9D%E5%BF%83%E4%B8%8D%E9%B8%A3%E5%88%99%E5%B7%B2%20%E4%B8%80%E9%B8%A3%E6%83%8A%E4%BA%BAB.mp4", // 将此替换为您的YouTube嵌入链接
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Valorant",
    description: "TE 年会包装",
    date: "",
    thumbnail: "/thumbnails/11.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%BA%AF%E5%BF%83%E6%96%87%E5%8C%96%2FTE%20%E6%BA%AF%20%E5%8C%85%E8%A3%85%E5%8A%A8%E6%80%81%2F%E5%B9%B4%E4%BC%9A%E6%A0%87%E9%A2%98B.mp4", // 将此替换为您的YouTube嵌入链接
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Identity V",
    description: "TE溯预告动图WBG",
    date: "",
    thumbnail: "/thumbnails/12.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%BA%AF%E5%BF%83%E6%96%87%E5%8C%96%2F%E7%AC%AC%E4%BA%94%E4%BA%BA%E6%A0%BC%2F%E9%A2%84%E5%91%8A%E5%8A%A8%E5%9B%BEWBGB.mp4", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Identity V",
    description: "TE YANGY VLOG",
    date: "",
    thumbnail: "/thumbnails/13.jpg",
    videoUrl: "https://www.bilibili.com/video/BV14uWxeKEj7/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Naraka",
    description: "TE溯永劫无间分部X海南文旅活动宣传",
    date: "",
    thumbnail: "/thumbnails/14.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%BA%AF%E5%BF%83%E6%96%87%E5%8C%96%2F%E6%B0%B8%E5%8A%AB%E6%97%A0%E9%97%B4%2F%E6%B0%B8%E5%8A%AB%E6%97%A0%E9%97%B4X%E6%B5%B7%E5%8D%97%E6%96%87%E6%97%85%E6%B4%BB%E5%8A%A8%E5%AE%A3%E4%BC%A0%E8%A7%86%E9%A2%91%2010.25B.mp4", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Naraka",
    description: "TE溯永劫无间分部X捏蓝联动",
    date: "",
    thumbnail: "/thumbnails/15.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%BA%AF%E5%BF%83%E6%96%87%E5%8C%96%2F%E6%B0%B8%E5%8A%AB%E6%97%A0%E9%97%B4%2F%E6%B0%B8%E5%8A%AB%E6%97%A0%E9%97%B4%20TE%20x%20%E6%8D%8F%E8%93%9D%20%E8%81%94%E5%8A%A8%2010.8B.mp4", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Naraka",
    description: "TE 孤高之人岳山抖音热点",
    date: "",
    thumbnail: "/thumbnails/16.jpg",
    videoUrl: "https://www.bilibili.com/video/BV1Qy411z7ns/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Naraka",
    description: "TE 超电磁炮 比赛高光",
    date: "",
    thumbnail: "/thumbnails/17.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%BA%AF%E5%BF%83%E6%96%87%E5%8C%96%2F%E6%B0%B8%E5%8A%AB%E6%97%A0%E9%97%B4%2FTE%20%E8%B6%85%E7%94%B5%E7%A3%81%E7%82%AE%20%E6%AF%94%E8%B5%9B%E9%AB%98%E5%85%89B.mp4", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Naraka",
    description: "TE STAR 比赛高光",
    date: "",
    thumbnail: "/thumbnails/18.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%BA%AF%E5%BF%83%E6%96%87%E5%8C%96%2F%E6%B0%B8%E5%8A%AB%E6%97%A0%E9%97%B4%2FTE%20STAR%20%E6%AF%94%E8%B5%9B%E9%AB%98%E5%85%89B.mp4", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Naraka",
    description: "TE TXJ 单人海报",
    date: "",
    thumbnail: "/thumbnails/19.jpg",
    videoUrl: "https://www.bilibili.com/video/BV1WS411w7Xw/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Naraka",
    description: "TE VVV 单人海报 ",
    date: "",
    thumbnail: "/thumbnails/20.jpg",
    videoUrl: "https://www.bilibili.com/video/BV12H4y1w74y/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Naraka",
    description: "TE LYD 单人海报 ",
    date: "",
    thumbnail: "/thumbnails/21.jpg",
    videoUrl: "https://www.bilibili.com/video/BV1CM4m127TW/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Naraka",
    description: "TE LEO 单人海报",
    date: "",
    thumbnail: "/thumbnails/22.jpg",
    videoUrl: "https://www.bilibili.com/video/BV1ri421Y7TF/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "Naraka",
    description: "TE 战队海报",
    date: "",
    thumbnail: "/thumbnails/23.jpg",
    videoUrl: "https://www.bilibili.com/video/BV1RE4m1X7na/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Trace Esports"
  },
  {
    id: "",
    title: "LOL",
    description: "以7明志 希冀重新开始-Clearlove",
    date: "",
    thumbnail: "/thumbnails/24.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%9C%88%E9%80%80%E6%96%87%E5%8C%96%2FLPL%E7%94%B5%E7%AB%9E%E9%80%89%E6%89%8B%E7%9F%AD%E7%89%87%E4%BB%8B%E7%BB%8D%2F%E4%BB%A57%E6%98%8E%E5%BF%97%EF%BC%8C%E5%B8%8C%E5%86%80%E9%87%8D%E6%96%B0%E5%BC%80%E5%A7%8B-Clearlove.mp4", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOL",
    description: "武艺超群 任重道远-Beichuan",
    date: "",
    thumbnail: "/thumbnails/25.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%9C%88%E9%80%80%E6%96%87%E5%8C%96%2FLPL%E7%94%B5%E7%AB%9E%E9%80%89%E6%89%8B%E7%9F%AD%E7%89%87%E4%BB%8B%E7%BB%8D%2F%E6%AD%A6%E8%89%BA%E8%B6%85%E7%BE%A4%EF%BC%8C%E4%BB%BB%E9%87%8D%E9%81%93%E8%BF%9C-Beichuan.mp4", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOL",
    description: "稳定出场 国电新希望-Xiaoxiang",
    date: "",
    thumbnail: "/thumbnails/26.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%9C%88%E9%80%80%E6%96%87%E5%8C%96%2FLPL%E7%94%B5%E7%AB%9E%E9%80%89%E6%89%8B%E7%9F%AD%E7%89%87%E4%BB%8B%E7%BB%8D%2F%E7%A8%B3%E5%AE%9A%E5%87%BA%E5%9C%BA%EF%BC%8C%E5%9B%BD%E7%94%B5%E6%96%B0%E5%B8%8C%E6%9C%9B-Xiaoxiang.mp4", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOLM",
    description: "Tips 伊芙琳",
    date: "",
    thumbnail: "/thumbnails/27.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%9C%88%E9%80%80%E6%96%87%E5%8C%96%2F%E5%B0%8F%E6%8A%80%E5%B7%A7%20Tips%E7%B3%BB%E5%88%97%2F%E5%B0%8F%E6%8A%80%E5%B7%A7%20%E4%BC%8A%E8%8A%99%E7%90%B3B.mp4", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOLM",
    description: "真是最了 系列",
    date: "",
    thumbnail: "/thumbnails/28.jpg",
    videoUrl: "https://botamon24-1351813449.cos.ap-shanghai.myqcloud.com/%E6%9C%88%E9%80%80%E6%96%87%E5%8C%96%2F%E7%9C%9F%E6%98%AF%E6%9C%80%E4%BA%86%20%E7%B3%BB%E5%88%97%2F%E7%9C%9F%E6%98%AF%E6%9C%80%E4%BA%86%20EP04B.mp4", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOLM",
    description: "《乘风归》X阿辰cchen",
    date: "",
    thumbnail: "/thumbnails/29.webp",
    videoUrl: "https://www.bilibili.com/video/BV1R841177Sg/?spm_id_from=333.1387.0.0&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOLM",
    description: "KOL一口金克酥系列",
    date: "",
    thumbnail: "/thumbnails/30.webp",
    videoUrl: "https://www.bilibili.com/video/BV1XL411s7xC/?spm_id_from=333.1387.0.0&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOLM",
    description: "KOL一口金克酥系列",
    date: "",
    thumbnail: "/thumbnails/31.webp",
    videoUrl: "https://www.bilibili.com/video/BV1nf4y1K71L/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOLM",
    description: "KOL一口金克酥系列",
    date: "",
    thumbnail: "/thumbnails/32.webp",
    videoUrl: "https://www.bilibili.com/video/BV1vM4y1P7nd/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOLM",
    description: "KOL一口金克酥系列",
    date: "",
    thumbnail: "/thumbnails/33.webp",
    videoUrl: "https://www.bilibili.com/video/BV14u411o7Q8/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOLM",
    description: "KOL一口金克酥系列",
    date: "",
    thumbnail: "/thumbnails/34.webp",
    videoUrl: "https://www.bilibili.com/video/BV1vq4y167c8/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOLM",
    description: "KOL一口金克酥系列",
    date: "",
    thumbnail: "/thumbnails/35.webp",
    videoUrl: "https://www.bilibili.com/video/BV1sf4y1T7CJ/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOLM",
    description: "KOL一口金克酥系列",
    date: "",
    thumbnail: "/thumbnails/36.webp",
    videoUrl: "https://www.bilibili.com/video/BV1TL4y1n72V/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOLM",
    description: "KOL一口金克酥系列",
    date: "",
    thumbnail: "/thumbnails/37.webp",
    videoUrl: "https://www.bilibili.com/video/BV1Dq4y1H7iY/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Yuetui Productions"
  },
  {
    id: "",
    title: "LOLM",
    description: "KOL一口金克酥系列",
    date: "",
    thumbnail: "/thumbnails/38.webp",
    videoUrl: "https://www.bilibili.com/video/BV1Hh411b7xs/?spm_id_from=333.1387.upload.video_card.click&vd_source=6f146b26a3b38df590f9144fc8f3304f", // 示例链接，可替换
    category: "Yuetui Productions"
  },
];

// 定义页面组件
export default function VideosPage() {
  // 使用预加载钩子
  const { preloadVideoBatch } = useVideoPreloader();
  
  // 当页面加载后，延迟8秒再预加载，避免与页面加载竞争资源
  useEffect(() => {
    // 延长等待时间到8秒
    const timer = setTimeout(() => {
      console.log("页面加载完成8秒后，开始预加载视频...");
      preloadVideoBatch(videosData);
    }, 8000); // 从5秒增加到8秒
    
    // 组件卸载时清除定时器
    return () => clearTimeout(timer);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 页面组件的渲染部分保持不变
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      {/* 现有内容不变 */}
      <div className="mb-16 text-center">
        <motion.h1
          className="mb-4 text-4xl font-bold tracking-tight text-bl-blue-accent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          VIDEO WORKS
        </motion.h1>
        <motion.p
          className="mx-auto max-w-2xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          A Collection of My Video Editing Projects:
          Where Technology Meets Imagination — Bridging Esports and Creative Innovation to Redefine Visual Language.
        </motion.p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="mb-16 md:mb-8 flex justify-center">
          <TabsList className="bg-bl-dark/40 flex-col sm:flex-row sticky top-0 z-10">
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="Trace Esports">Trace Esports</TabsTrigger>
            <TabsTrigger value="Yuetui Productions">Yuetui Productions</TabsTrigger>
            <TabsTrigger value="Botamon">Botamon</TabsTrigger>
            <TabsTrigger value="Botamon 3D">Botamon 3D</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videosData.map((video, index) => (
              <VideoCard key={`video-${index}`} video={video} index={index} />
            ))}
          </div>
        </TabsContent>

        {["Trace Esports", "Yuetui Productions", "Botamon", "Botamon 3D"].map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videosData
                .filter((video) => video.category === category)
                .map((video, index) => (
                  <VideoCard key={`${video.id || ''}-${index}`} video={video} index={index} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

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

// 视频卡片组件
interface VideoCardProps {
  video: VideoData;
  index: number;
}

// 完全重写的视频卡片组件
function VideoCard({ video, index }: VideoCardProps) {
  // 使用预加载钩子
  const { preloadVideo, isVideoCached, getPreloadedElement } = useVideoPreloader();
  const [loadError, setLoadError] = useState(false);  // 新增：跟踪加载错误
  const [isPlaying, setIsPlaying] = useState(false);  // 新增：跟踪视频是否正在播放
  const [dialogOpen, setDialogOpen] = useState(false); // 新增：跟踪对话框是否打开
  const videoRef = useRef<HTMLVideoElement | null>(null); // 新增：引用当前视频元素
  
  // 检查是否为B站视频
  const isBilibiliVideo = video.videoUrl.includes('bilibili.com');
  const isDirectVideo = !isBilibiliVideo && (
    video.videoUrl.includes('qiniucs.com') || 
    video.videoUrl.includes('sabkt.gdipper.com') || 
    video.videoUrl.includes('myqcloud.com') ||
    video.videoUrl.endsWith('.mp4') || 
    video.videoUrl.endsWith('.webm')
  );
  
  // 当对话框打开时尝试加载视频
  useEffect(() => {
    if (dialogOpen && isDirectVideo && !isBilibiliVideo) {
      console.log(`对话框已打开，正在尝试加载视频: ${video.title}`);
      
      // 重置错误状态
      setLoadError(false);
      
      // 尝试获取预加载的元素
      const preloadedElement = getPreloadedElement(video.videoUrl);
      if (preloadedElement && videoRef.current) {
        console.log(`使用预加载的视频元素: ${video.title}`);
        
        // 复制预加载元素的源到当前视频元素
        videoRef.current.src = preloadedElement.src;
        videoRef.current.load();
      } else if (videoRef.current) {
        // 没有预加载元素，直接加载
        console.log(`没有预加载元素，直接加载: ${video.title}`);
        
        // 添加时间戳参数以避免缓存问题
        const timestampedUrl = video.videoUrl.includes('?') 
          ? `${video.videoUrl}&_t=${Date.now()}` 
          : `${video.videoUrl}?_t=${Date.now()}`;
        
        videoRef.current.src = timestampedUrl;
        videoRef.current.load();
        
        // 顺便标记为已预加载
        preloadVideo(video.videoUrl);
      }
    }
  }, [dialogOpen, isDirectVideo, isBilibiliVideo, getPreloadedElement, preloadVideo, video.title, video.videoUrl]);
  
  // 点击播放按钮处理
  const handlePlayClick = useCallback(() => {
    console.log(`点击播放: ${video.title}`);
    setDialogOpen(true);
    
    // 如果是直接视频且未缓存，则尝试预加载
    if (isDirectVideo && !isVideoCached(video.videoUrl)) {
      preloadVideo(video.videoUrl);
    }
  }, [isDirectVideo, isVideoCached, preloadVideo, video.title, video.videoUrl]);
  
  // 对话框关闭时暂停视频
  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setIsPlaying(false);
    
    // 如果有视频元素，暂停它
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);
  
  // 处理视频加载错误
  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error(`视频加载失败: ${video.title}`, e);
    setLoadError(true);
    
    // 尝试使用直接URL（不带时间戳）重新加载
    if (videoRef.current && videoRef.current.src.includes('_t=')) {
      console.log(`尝试使用原始URL重新加载: ${video.title}`);
      videoRef.current.src = video.videoUrl;
      videoRef.current.load();
    }
  }, [video.title, video.videoUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="overflow-hidden bg-card/80 backdrop-blur-sm transition-all hover:shadow-md hover:shadow-bl-blue/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-bl-blue-light">
              {video.id} {video.title}
            </CardTitle>
            <span className="text-xs text-muted-foreground">{video.date}</span>
          </div>
          <CardDescription>{video.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <div 
                className="relative w-full cursor-pointer overflow-hidden transition-all hover:opacity-90"
                onClick={handlePlayClick}
              >
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                    loading="lazy" // 使用懒加载减少缩略图流量
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
                    <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white/20">
                      Play Video
                    </Button>
                  </div>
                </AspectRatio>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl" onEscapeKeyDown={handleDialogClose} onInteractOutside={handleDialogClose}>
              <DialogHeader>
                <DialogTitle>{video.title || "Video Player"}</DialogTitle>
                <DialogDescription>{video.description}</DialogDescription>
              </DialogHeader>
              <div className="aspect-video">
                {isDirectVideo ? (
                  <>
                    {loadError ? (
                      <div className="flex h-full w-full items-center justify-center bg-black/80 text-white">
                        <div className="text-center">
                          <p className="mb-4">视频加载失败，请尝试刷新页面或稍后再试</p>
                          <Button 
                            variant="outline" 
                            className="border-white bg-transparent text-white hover:bg-white/20"
                            onClick={() => {
                              // 重置错误状态
                              setLoadError(false);
                              // 尝试重新加载
                              if (videoRef.current) {
                                videoRef.current.load();
                              }
                            }}
                          >
                            重试
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <video
                        ref={videoRef}
                        controls
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                        className="h-full w-full"
                        poster={video.thumbnail}
                        crossOrigin="anonymous"
                        playsInline
                        onError={handleVideoError}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      >
                        <track kind="captions" src="" label="Chinese" />
                        抱歉，您的浏览器不支持HTML5视频。
                      </video>
                    )}
                  </>
                ) : video.videoUrl.includes('bilibili.com') ? (
                  <iframe
                    src={`//player.bilibili.com/player.html?${new URLSearchParams({
                      bvid: video.videoUrl.match(/video\/(BV\w+)/)?.[1] || '',
                      page: '1',
                      high_quality: '1',
                      // 如果对话框打开，则自动播放
                      autoplay: dialogOpen ? '1' : '0',
                      danmaku: '0'
                    })}`}
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    scrolling="no"
                    frameBorder="no"
                    sandbox="allow-scripts allow-same-origin"
                    title={video.title}
                  />
                ) : (
                  <iframe
                    src={video.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={video.title}
                    frameBorder="0"
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter className="flex justify-between pt-4">
          <span className="inline-block rounded-full bg-bl-blue-dark/40 px-3 py-1 text-xs font-medium uppercase text-bl-blue-light">
            {video.category}
          </span>
          {/* 显示视频来源和状态 - 更准确的状态描述 */}
          <span className="text-xs text-muted-foreground">
            {isBilibiliVideo ? "Bilibili" : (
              isVideoCached(video.videoUrl) ? "点击播放" : "COS"
            )}
          </span>
        </CardFooter>
      </Card>
    </motion.div>
  );
}