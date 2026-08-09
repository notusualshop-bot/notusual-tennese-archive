"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TENNESSEE_ARCHIVE_DATA, ArchiveItem } from "@/data";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  // 初始化：随机打乱内容索引池（洗牌算法）
  useEffect(() => {
    const indices = Array.from({ length: TENNESSEE_ARCHIVE_DATA.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
  }, []);

  // 随机赛场图背景
  const stadiumImages = [
    "/stadium-1.jpg", "/stadium-2.jpg", "/stadium-3.jpg",
    "/stadium-4.jpg", "/stadium-5.jpg", "/stadium-6.jpg",
  ];
  const randomBg = stadiumImages[Math.floor(Math.random() * stadiumImages.length)];

  if (shuffledIndices.length === 0) return null;

  // 获取当前的档案项
  const currentActualIndex = shuffledIndices[currentIndex];
  const currentItem: ArchiveItem = TENNESSEE_ARCHIVE_DATA[currentActualIndex];

  // 智能提取：优先抓取年份/年代，无年份时提取 dateTag 首个核心词（如 ROAD、FALLL 等）
  const yearMatch = currentItem.dateTag.match(/\b(18\d{2}|19\d{2}|20\d{2})\b/i) || currentItem.title.match(/\b(18\d{2}|19\d{2}|20\d{2})\b/i);
  const decadeMatch = currentItem.dateTag.match(/\b(20\d{0,2}S|19\d{0,2}S)\b/i);
  const fallbackTag = currentItem.dateTag.split("•")[0].trim().split(" ")[0] || "VOLS";
  const displayYear = yearMatch ? yearMatch[0] : (decadeMatch ? decadeMatch[0] : fallbackTag);

  // 点击下一篇：在洗牌池中前进；全部播完后自动重新洗牌
  const handleNext = () => {
    if (currentIndex < shuffledIndices.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const indices = Array.from({ length: TENNESSEE_ARCHIVE_DATA.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledIndices(indices);
      setCurrentIndex(0);
    }
  };

  // 真实的网页分享功能（支持手机原生分享 / 复制链接）
  const handleShare = async () => {
    const shareData = {
      title: currentItem.espnTitle,
      text: currentItem.narrative,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Archive link copied to clipboard!");
    }
  };

  return (
    <main className="min-h-screen bg-[#FF8200] text-white flex flex-col justify-between selection:bg-white selection:text-[#FF8200]">
      {/* 挂载自定义复古字体 AlfaSlabOne */}
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face {
          font-family: 'AlfaSlabOne';
          src: url('/AlfaSlabOne-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        .vintage-number {
          font-family: 'AlfaSlabOne', Impact, sans-serif;
        }
      `}} />

      {/* 顶部：品牌与档案声明区块 */}
      <header className="w-full pt-4 pb-2 px-4 text-center">
        <div className="max-w-md mx-auto space-y-0.5">
          <p className="tracking-[0.3em] uppercase text-[10px] text-white/70 font-light">
            EST. 1794/1891 • ARCHIVE DATABASE V1.0
          </p>
          <p className="tracking-[0.25em] uppercase text-xs text-white/90 font-medium">
            NOTUSUAL CREATIVE STUDIO
          </p>
          <p className="tracking-[0.2em] uppercase text-xs text-white/70 font-sans font-light">
            TENNESSEE VOLUNTEERS FOOTBALL STORY
          </p>
        </div>
      </header>

      {/* 中间核心信息区域：沉浸式卡片翻页模式 */}
      <div className="max-w-md sm:max-w-lg mx-auto px-4 pt-2 pb-4 w-full relative my-auto">
        
        {/* 背景堆叠层 2（底层卡片阴影位） */}
        <div className="absolute inset-x-4 top-4 bottom-2 bg-stone-300 border-2 border-stone-900 translate-y-3 translate-x-2 pointer-events-none"></div>
        {/* 背景堆叠层 1（中间层卡片） */}
        <div className="absolute inset-x-4 top-2 bottom-1 bg-stone-100 border-2 border-stone-900 translate-y-1.5 translate-x-1 pointer-events-none"></div>

        {/* 主卡片（最顶层） */}
        <div className="relative bg-white text-stone-950 overflow-hidden border-2 border-stone-900 rounded-none">
          
          {/* 卡片上半部分：黑白图片背景 + 叠印层 */}
          <div className="relative w-full h-[220px] sm:h-[250px] flex flex-col items-center justify-center overflow-hidden border-b-2 border-stone-900 px-2">
            {/* 纯黑白图片背景 */}
            <div className="absolute inset-0 z-0 grayscale contrast-150 brightness-90">
              <Image
                src={randomBg}
                alt="Tennessee Volunteers Football Stadium Archive"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            
            {/* 压暗遮罩确保文字清晰 */}
            <div className="absolute inset-0 z-1 bg-black/15"></div>

            {/* 内容区：时间线标签与动态年份/主题词 */}
            <div className="relative z-10 flex flex-col items-center text-center px-2 space-y-1">
              <p className="tracking-[0.15em] uppercase text-[10px] sm:text-xs font-bold text-stone-900 bg-white/85 px-2 py-0.5 border border-stone-900 max-w-[300px] truncate">
                {currentItem.dateTag}
              </p>
              <div className="transform -rotate-1 mt-1">
                <span className="block tracking-tight text-[36px] sm:text-[52px] leading-none text-[#FF8200] vintage-number drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)] uppercase break-words max-w-[300px]">
                  {displayYear}
                </span>
              </div>
            </div>
          </div>

          {/* 卡片下半部分：标题、完整正文与操作按钮 */}
          <div className="p-6 sm:p-7 bg-white text-center">
            <h3 className="text-xl sm:text-2xl font-serif font-extrabold mb-3 leading-snug text-stone-950 tracking-tight">
              &ldquo;{currentItem.espnTitle}&rdquo;
            </h3>

            <p className="text-stone-800 text-xs sm:text-sm leading-relaxed font-serif mb-6 font-medium tracking-wide">
              &ldquo;{currentItem.narrative}&rdquo;
            </p>

            {/* 操作按钮区 */}
            <div className="space-y-3">
              <button
                onClick={handleNext}
                className="w-full bg-[#FF8200] hover:bg-[#e07200] text-white font-serif font-bold tracking-widest text-xs uppercase py-3.5 transition-all duration-300 text-center rounded-none border border-black shadow-sm cursor-pointer"
              >
                NEXT CHAPTER IN TENNESSEE
              </button>

              <button
                onClick={handleShare}
                className="w-full bg-white hover:bg-stone-100 text-stone-950 font-serif font-bold tracking-widest text-xs uppercase py-3.5 transition-all duration-300 text-center block rounded-none border border-black shadow-sm cursor-pointer"
              >
                SHARE WITH THE VOL FAITHFUL
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 底部：无缝衔接 */}
      <footer className="w-full bg-[#FF8200] pt-4 pb-6 px-4 text-center">
        <div className="max-w-md mx-auto space-y-1">
          <p className="font-serif italic text-[10px] tracking-widest text-white/80 uppercase font-bold">
            NOTUSUAL EDITION • TENNESSEE
          </p>
          <p className="font-serif italic text-xs text-white/90 leading-relaxed font-medium">
            Love the vintage Tennessee look? Grab our prints & goods.
          </p>
          <div>
            <a
              href="https://www.etsy.com/shop/notusualcreative"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white font-serif tracking-widest text-xs uppercase underline underline-offset-4 hover:text-white/70 transition-colors font-bold"
            >
              VISIT OUR ETSY SHOP
            </a>
          </div>
          <div className="pt-2 border-t border-white/10">
            <p className="text-[9px] tracking-widest uppercase text-white/50 font-semibold">
              © TENNESSEE ARCHIVE DATABASE • NOTUSUAL CREATIVE
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
