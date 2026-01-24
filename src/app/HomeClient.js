"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function HomeClient({ images }) {
  const [bgUrl, setBgUrl] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    // 首页完全禁止滚动，彻底解决滚动条闪烁
    document.body.style.overflow = 'hidden';
    
    // 直接从传入的 images 中随机挑选，大幅减少边缘 API 请求
    const allImages = [...(images.pc || []), ...(images.mobile || [])];
    if (allImages.length > 0) {
      const randomImg = allImages[Math.floor(Math.random() * allImages.length)];
      const url = `/${randomImg.src}`;
      
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setBgUrl(url);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setBgUrl('/api/random');
        setIsLoaded(true);
      };
    } else {
      setBgUrl('/api/random');
      setIsLoaded(true);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [images]);

  return (
    <div className="relative h-[100dvh] w-full bg-[#fafafa] dark:bg-black text-neutral-900 dark:text-white flex items-center justify-center overflow-hidden transition-colors duration-500">
      {/* Theme Toggle */}
      <div className="fixed top-8 right-8 z-50">
        <button
          onClick={() => {
            const root = document.documentElement;
            if (root.classList.contains('dark')) {
              root.classList.remove('dark');
              localStorage.setItem('theme', 'light');
            } else {
              root.classList.add('dark');
              localStorage.setItem('theme', 'dark');
            }
            window.dispatchEvent(new Event('storage'));
          }}
          className="p-2.5 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/40 transition-all border border-white/30 shadow-lg drop-shadow-md"
          aria-label="Toggle Dark Mode"
        >
          {typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Immersive Background */}
      <div className="fixed inset-0 z-0 transition-opacity duration-1500 ease-in-out" style={{ opacity: isLoaded ? 1 : 0 }}>
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 z-10 backdrop-blur-[3px]" />
        {bgUrl && (
          <div 
            className="absolute inset-0 animate-slow-zoom"
            style={{
              backgroundImage: `url("${bgUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
      </div>

      {/* Content Area */}
      <main className="relative z-20 w-full max-w-[600px] px-8 flex flex-col items-center">
        <div className="text-center animate-slide-up">
          <p className="text-sm md:text-base font-light tracking-[0.5em] text-white mb-12 uppercase drop-shadow-lg">
            Random picture
          </p>
          
          <div className="flex flex-col items-center space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <code className="block text-[11px] md:text-xs tracking-[0.1em] text-white font-mono shadow-sm lowercase drop-shadow-md bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  {origin ? `${origin}/api/random` : '/api/random'}
                </code>
                <div className="h-px w-8 bg-white/50 mx-auto" />
              </div>
              
              <div className="flex flex-col gap-1.5 text-[9px] md:text-[10px] tracking-[0.15em] text-white/90 font-light lowercase drop-shadow-md">
                <p>指定类型: ?type=[pc|mobile]</p>
                <p>json 格式: ?redirect=false</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[9px] text-white/70 font-medium tracking-[0.2em] uppercase drop-shadow-md">分类 API</div>
              <div className="flex flex-col gap-2 text-[10px] tracking-[0.1em] text-white/90 font-mono lowercase">
                <code className="bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm drop-shadow-md">{origin ? `${origin}/api/anime` : '/api/anime'}</code>
                <code className="bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm drop-shadow-md">{origin ? `${origin}/api/landscape` : '/api/landscape'}</code>
                <code className="bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm drop-shadow-md">{origin ? `${origin}/api/portrait` : '/api/portrait'}</code>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center text-white pt-4">
              <a 
                href="/api/random" 
                className="text-sm tracking-[0.3em] uppercase hover:text-white/80 transition-colors py-2 border-b border-transparent hover:border-white/40 drop-shadow-md"
              >
                随机一张
              </a>
              
              <Link 
                href="/gallery" 
                className="text-sm tracking-[0.3em] uppercase hover:text-white/80 transition-colors py-2 border-b border-transparent hover:border-white/60 drop-shadow-md"
              >
                所有图片
              </Link>
            </div>

            <div className="flex flex-col gap-3 items-center">
              <div className="text-[9px] text-white/70 font-medium tracking-[0.2em] uppercase drop-shadow-md">按分类浏览</div>
              <div className="flex gap-3">
                <Link 
                  href="/gallery?category=anime" 
                  className="text-[10px] tracking-[0.2em] uppercase hover:text-white/90 transition-colors py-1.5 px-3 border border-white/30 bg-black/20 backdrop-blur-sm rounded-full hover:border-white/60 hover:bg-black/30 drop-shadow-md"
                >
                  动漫
                </Link>
                <Link 
                  href="/gallery?category=landscape" 
                  className="text-[10px] tracking-[0.2em] uppercase hover:text-white/90 transition-colors py-1.5 px-3 border border-white/30 bg-black/20 backdrop-blur-sm rounded-full hover:border-white/60 hover:bg-black/30 drop-shadow-md"
                >
                  风景
                </Link>
                <Link 
                  href="/gallery?category=portrait" 
                  className="text-[10px] tracking-[0.2em] uppercase hover:text-white/90 transition-colors py-1.5 px-3 border border-white/30 bg-black/20 backdrop-blur-sm rounded-full hover:border-white/60 hover:bg-black/30 drop-shadow-md"
                >
                  人物
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
