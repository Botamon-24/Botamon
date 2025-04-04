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
  // 使用三种存储机制来持久化缓存
  // 1. React状态 - 当前会话的内存缓存
  const [preloadedVideos, setPreloadedVideos] = useState<Set<string>>(new Set<string>());
  // 2. 本地存储 - 长期缓存，跨会话
  const localStorageKey = 'video-cache-v1'; // 版本化缓存键
  // 3. 会话存储 - 当前浏览会话
  const sessionStorageKey = 'preloadedVideos';
  
  // 使用标记确保预加载过程只发生一次
  const hasStartedPreloading = useRef<boolean>(false);
  
  // 以下函数帮助检查视频是否已缓存
  const isVideoCached = useCallback((url: string): boolean => {
    // 检查视频是否在浏览器缓存中
    // 不幸的是，JavaScript无法直接检查浏览器HTTP缓存
    // 我们只能检查我们自己的缓存记录
    return preloadedVideos.has(url);
  }, [preloadedVideos]);
  
  // 从存储中加载缓存记录
  useEffect(() => {
    try {
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
        
        // 如果已有缓存记录，表示已经进行过预加载
        hasStartedPreloading.current = uniqueUrls.length > 0;
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

  // 强化缓存的预加载函数
  const preloadVideo = useCallback((url: string): void => {
    // 如果已缓存或不是直接视频URL，则跳过
    if (isVideoCached(url) || !isDirectVideoUrl(url)) return;
    
    console.log(`开始缓存视频: ${url}`);
    
    // 使用XHR发送HEAD请求，设置缓存控制头
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, true);
    xhr.setRequestHeader('Cache-Control', 'max-age=31536000'); // 缓存一年
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // HEAD请求成功，现在创建视频元素进行预加载
          const videoElement = document.createElement('video');
          videoElement.preload = 'metadata'; // 仅预加载元数据
          
          // 添加加载元数据事件处理器
          videoElement.addEventListener('loadedmetadata', function() {
            console.log(`已成功缓存视频元数据: ${url}`);
            
            // 更新缓存记录
            updateCacheRecord(url);
          });
          
          // 设置视频源并加载
          videoElement.src = url;
          videoElement.load();
        }
      }
    };
    xhr.send();
  }, [isVideoCached, isDirectVideoUrl]);
  
  // 更新缓存记录到三个存储位置
  const updateCacheRecord = useCallback((url: string) => {
    // 1. 更新React状态
    const newCache = new Set([...preloadedVideos, url]);
    setPreloadedVideos(newCache);
    
    // 2. 更新会话存储
    try {
      const urlArray = [...newCache];
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(urlArray));
    } catch (e) {
      console.error("保存到会话存储失败:", e);
    }
    
    // 3. 更新本地存储（长期缓存）
    try {
      // 先读取现有记录，避免覆盖
      const existingData = localStorage.getItem(localStorageKey);
      let urlsToStore: string[] = [];
      
      if (existingData) {
        urlsToStore = JSON.parse(existingData) as string[];
      }
      
      // 添加新URL并去重
      if (!urlsToStore.includes(url)) {
        urlsToStore.push(url);
      }
      
      localStorage.setItem(localStorageKey, JSON.stringify(urlsToStore));
    } catch (e) {
      console.error("保存到本地存储失败:", e);
    }
  }, [preloadedVideos]);
  
  // 批量预加载多个视频（限制数量，减少流量）
  const preloadVideoBatch = useCallback((videos: VideoData[]): void => {
    // 如果已经开始预加载，跳过
    if (hasStartedPreloading.current) {
      console.log("已经进行过预加载，跳过此次操作");
      return;
    }
    
    hasStartedPreloading.current = true;
    
    // 减少预加载数量到2个
    const maxPreloadCount = 2; // 从3个减少到2个
    console.log(`开始预加载前${maxPreloadCount}个视频...`);
    
    // 筛选出直接视频URL
    const directVideoUrls = videos
      .filter(video => isDirectVideoUrl(video.videoUrl))
      .slice(0, maxPreloadCount)
      .map(video => video.videoUrl);
      
    // 过滤掉已缓存的视频
    const urlsToPreload = directVideoUrls.filter(url => !isVideoCached(url));
    
    if (urlsToPreload.length === 0) {
      console.log("所有视频已经缓存过，无需再次预加载");
      return;
    }
    
    console.log(`实际需要预加载的视频数量: ${urlsToPreload.length}`);
    
    // 延长预加载间隔到1000毫秒，减轻服务器负担
    urlsToPreload.forEach((url, index) => {
      setTimeout(() => {
        preloadVideo(url);
        console.log(`预加载视频 ${index + 1}/${urlsToPreload.length}: ${url}`);
      }, index * 1000); // 从500ms增加到1000ms
    });
  }, [isDirectVideoUrl, isVideoCached, preloadVideo]);

  // 返回相关函数和状态
  return { 
    preloadVideo, 
    preloadVideoBatch, 
    preloadedVideos,
    isVideoCached 
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
  
  // 当页面加载后，延迟5秒再预加载，避免与页面加载竞争资源
  useEffect(() => {
    // 延长等待时间到5秒
    const timer = setTimeout(() => {
      console.log("页面加载完成5秒后，开始预加载视频...");
      preloadVideoBatch(videosData);
    }, 5000); // 从3秒增加到5秒
    
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

// 优化后的视频卡片组件
function VideoCard({ video, index }: VideoCardProps) {
  // 使用预加载钩子
  const { preloadVideo, preloadedVideos, isVideoCached } = useVideoPreloader();
  const [hasHovered, setHasHovered] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  
  // 检查是否为B站视频
  const isBilibiliVideo = video.videoUrl.includes('bilibili.com');
  
  // 当用户悬停在视频卡片上5秒后才预加载视频，而不是立即预加载
  const handleMouseEnter = useCallback(() => {
    if (hasHovered || isBilibiliVideo) return; // 已悬停过或B站视频，不预加载
    
    // 使用更长的悬停时间触发预加载（5秒）
    const hoverTimer = setTimeout(() => {
      if (
        video.videoUrl.includes('qiniucs.com') || 
        video.videoUrl.includes('sabkt.gdipper.com') || 
        video.videoUrl.includes('myqcloud.com') ||
        video.videoUrl.endsWith('.mp4') || 
        video.videoUrl.endsWith('.webm')
      ) {
        console.log(`用户长时间悬停在视频 ${video.title} 上，开始预加载...`);
        preloadVideo(video.videoUrl);
        setHasHovered(true); // 标记为已悬停预加载过
      }
    }, 5000); // 从3秒增加到5秒
    
    // 当鼠标移开时清除定时器
    return () => clearTimeout(hoverTimer);
  }, [hasHovered, isBilibiliVideo, video, preloadVideo]);

  // 点击播放按钮处理
  const handlePlayClick = useCallback(() => {
    setHasClicked(true);
    if (!isBilibiliVideo && !isVideoCached(video.videoUrl)) {
      // 用户真正点击了，此时预加载是必要的
      preloadVideo(video.videoUrl);
    }
  }, [isBilibiliVideo, isVideoCached, preloadVideo, video.videoUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={handleMouseEnter}
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
          <Dialog>
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
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{video.title || "Video Player"}</DialogTitle>
                <DialogDescription>{video.description}</DialogDescription>
              </DialogHeader>
              <div className="aspect-video">
                {(video.videoUrl.includes('qiniucs.com') || 
                 video.videoUrl.includes('sabkt.gdipper.com') || 
                 video.videoUrl.includes('myqcloud.com') ||
                 video.videoUrl.endsWith('.mp4') || 
                 video.videoUrl.endsWith('.webm'))? (
                  <video
                    src={video.videoUrl}
                    controls
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    preload={isVideoCached(video.videoUrl) ? "auto" : "metadata"}
                    className="h-full w-full"
                    poster={video.thumbnail}
                    crossOrigin="anonymous"
                    // 添加加载开始和成功事件处理
                    onLoadStart={() => console.log(`开始加载视频: ${video.title}`)}
                    onCanPlay={() => {
                      console.log(`视频可以播放了: ${video.title}`);
                      // 将视频标记为已缓存
                      if (!isVideoCached(video.videoUrl)) {
                        preloadVideo(video.videoUrl);
                      }
                    }}
                  >
                    <track kind="captions" src="" label="English" />
                  </video>
                ) : video.videoUrl.includes('bilibili.com') ? (
                  <iframe
                    src={`//player.bilibili.com/player.html?${new URLSearchParams({
                      bvid: video.videoUrl.match(/video\/(BV\w+)/)?.[1] || '',
                      page: '1',
                      high_quality: '1',
                      // 如果用户点击了播放，则自动播放
                      autoplay: hasClicked ? '1' : '0',
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
          {/* 显示视频来源和缓存状态 */}
          <span className="text-xs text-muted-foreground">
            {isBilibiliVideo ? "Bilibili" : isVideoCached(video.videoUrl) ? "已缓存" : "COS"}
          </span>
        </CardFooter>
      </Card>
    </motion.div>
  );
}