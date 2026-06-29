import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoryboardModal({ planet, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef(null);

  let slides = [];
  if (planet.storyboard && planet.storyboard.length > 0) {
    slides = planet.storyboard;
  } else {
    // Fallback in case storyboard is missing
    slides = [{ image: '/images/spaceship_interior.png', text: planet.storyContent }];
  }

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;
  const fullText = slide.text;

  // 타이핑 효과 로직
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        setIsTyping(false);
        clearInterval(typingIntervalRef.current);
      }
    }, 40); // 글자당 40ms 속도

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [currentSlide, fullText]);

  // 화면/패널 터치 시 동작
  const handleInteraction = () => {
    if (isTyping) {
      // 1. 아직 타이핑 중이라면 즉시 모두 출력
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      setDisplayedText(fullText);
      setIsTyping(false);
    } else {
      // 2. 타이핑이 끝났다면 다음 슬라이드로
      if (isLast) onClose();
      else setCurrentSlide(prev => prev + 1);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-[100dvh] z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="relative w-full h-full max-w-5xl wood-modal flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 wood-panel-dark border-t-0 border-l-0 border-r-0 border-b-4 flex justify-between items-center rounded-none">
          <h2 className="text-xl sm:text-2xl font-bold text-[#343a40] flex items-center gap-2">
            <span className="text-3xl">{planet.foodIcon}</span> {planet.storyTitle}
          </h2>
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full ${i === currentSlide ? 'bg-[#339af0]' : 'bg-[#ced4da]'}`}
              />
            ))}
          </div>
        </div>

        {/* Content Wrapper for Layout */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Image Area (Top) */}
          <div className="relative flex-1 bg-[#212529] overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={slide.image}
                initial={currentSlide === 0 ? false : { opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
                transition={{ duration: currentSlide === 0 ? 0 : 0.4 }}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Story illustration"
                loading="eager"
                decoding="sync"
                fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
              />
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          {/* Story Text Area (Bottom) */}
          <div 
            onClick={handleInteraction}
            className="flex-shrink-0 w-full p-6 wood-panel border-t-4 border-l-0 border-r-0 border-b-0 rounded-none flex flex-col justify-between h-[120px] sm:h-[150px] cursor-pointer select-none"
          >
            <p className="text-lg sm:text-2xl text-[#495057] font-semibold leading-relaxed whitespace-pre-wrap break-keep">
              {displayedText}
            </p>

            <div className="flex justify-end items-center mt-2 h-8">
              {!isTyping && (
                <span className="text-[#adb5bd] animate-pulse text-2xl font-bold drop-shadow-sm">
                  {isLast ? '■' : '▼'}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
