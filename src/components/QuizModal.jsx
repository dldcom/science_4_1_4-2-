import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { quizzes } from '../utils/quizzes';
import { MicrobeIcon } from './VectorIcons';

export default function QuizModal({ isOpen, onClose, onQuizSuccess }) {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSummoning, setIsSummoning] = useState(false);
  const microscopeRef = useRef(null);
  const [summonCoords, setSummonCoords] = useState({ startX: 0, startY: 0, diffX: 0, diffY: 0 });

  if (!isOpen) return null;

  const quiz = quizzes[currentQuizIndex];

  const handleSubmit = (optionIdx) => {
    if (isSubmitted) return;
    setSelectedOption(optionIdx);
    setIsSubmitted(true);
    const correct = optionIdx === quiz.answerIndex;
    setIsCorrect(correct);
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    const nextIdx = Math.floor(Math.random() * quizzes.length);
    setCurrentQuizIndex(nextIdx);
  };

  const handleCollect = () => {
    if (isCorrect) {
      const canvasEl = document.getElementById('space-canvas');
      const microscopeEl = microscopeRef.current;
      
      let targetWorldX = 4000 + (Math.random() - 0.5) * 240;
      let targetWorldY = 3000 + (Math.random() - 0.5) * 240;

      if (canvasEl && microscopeEl) {
        const canvasRect = canvasEl.getBoundingClientRect();
        const microRect = microscopeEl.getBoundingClientRect();
        
        const scaleX = 1.0;
        const scaleY = 1.0;
        
        const defaultCamX = 4000 - canvasRect.width / 2;
        const defaultCamY = 3000 - canvasRect.height / 2;
        const camX = parseFloat(canvasEl.getAttribute('data-camera-x') || defaultCamX.toString());
        const camY = parseFloat(canvasEl.getAttribute('data-camera-y') || defaultCamY.toString());
        
        const portalLocalX = targetWorldX - camX;
        const portalLocalY = targetWorldY - camY;
        
        const portalCenterX = canvasRect.left + (portalLocalX * scaleX);
        const portalCenterY = canvasRect.top + (portalLocalY * scaleY);
        
        const microCenterX = microRect.left + (microRect.width / 2);
        const microCenterY = microRect.top + (microRect.height / 2);
        
        setSummonCoords({
          startX: microCenterX,
          startY: microCenterY,
          diffX: portalCenterX - microCenterX,
          diffY: portalCenterY - microCenterY
        });
      }

      setIsSummoning(true);
      setTimeout(() => {
        onQuizSuccess(quiz.targetMicrobe, targetWorldX, targetWorldY);
        setIsSummoning(false);
        handleNextQuiz();
        onClose();
      }, 1200);
    } else {
      handleNextQuiz();
      onClose();
    }
  };

  return (
    <div className={`fixed top-0 left-0 h-[100dvh] w-screen z-50 flex items-center justify-center transition-all duration-500 ${isSummoning ? 'bg-black/20 backdrop-blur-none' : 'bg-black/50 backdrop-blur-sm'} animate-fade-in`}>
      <motion.div 
        animate={isSummoning ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-5xl p-8 wood-modal rounded-xl text-[#343a40] flex flex-col max-h-[90vh] overflow-hidden"
      >
        
        {/* 모달 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-[#e63946] hover:bg-[#ff4d4d] active:translate-y-1 text-white border-4 border-[#9b2226] rounded-md cursor-pointer transition-all text-2xl font-bold font-pixel shadow-md z-10"
        >
          ✕
        </button>

        {/* 타이틀 */}
        <div className="flex items-center gap-4 mb-6">
          <span className="px-4 py-2 bg-[#adb5bd] text-white border-4 border-[#868e96] rounded-md text-sm font-bold uppercase tracking-wider font-pixel">
            연구 ({quiz.category === 'fungi' ? '균류' : quiz.category === 'protist' ? '원생생물' : '세균'})
          </span>
          <h2 className="text-3xl font-bold text-[#212529] font-sans">생물 성분 분석 퀴즈</h2>
        </div>

        {/* 수평 레이아웃 컨테이너 */}
        <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
          
          {/* 좌측: 현미경 뷰 */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center bg-[#f8f9fa] border-4 border-[#dee2e6] rounded-xl p-8 shadow-inner w-full md:w-1/3 relative">
            <div ref={microscopeRef} className="relative flex items-center justify-center w-56 h-56 border-8 border-[#ced4da] rounded-full bg-[#e9ecef] shadow-inner overflow-hidden mb-6">
              <div className="absolute inset-0 border-4 border-dashed border-[#adb5bd] m-2 rounded-full animate-rotate-slow"></div>
              
              {/* 소환 중일 때는 원래 이미지를 숨깁니다 */}
              <div className={`text-center flex flex-col items-center justify-center z-10 transition-opacity duration-300 ${isSummoning ? 'opacity-0' : 'opacity-100'}`}>
                <MicrobeIcon name={quiz.targetMicrobe} className="w-28 h-28" glowColor="#adb5bd" />
              </div>
            </div>
            <span className="text-base font-bold text-[#495057] font-pixel tracking-wider bg-[#f1f3f5] px-4 py-2 rounded-md border-2 border-[#ced4da]">
              {quiz.targetMicrobe || '???'}
            </span>
            
            {/* 힌트 토글 */}
            {!isSubmitted && (
              <div className="text-center mt-6">
                <span className="text-base text-[#868e96] font-sans font-bold">
                  HINT: {quiz.hintText}
                </span>
              </div>
            )}
          </div>

          {/* 우측: 문제와 답안 영역 */}
          <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar pr-2">
            {/* 문제 텍스트 */}
            <p className="text-xl leading-relaxed mb-6 font-bold font-sans text-[#212529] bg-[#f8f9fa] p-6 rounded-xl border-4 border-[#dee2e6]">
              Q. {quiz.question}
            </p>

            {/* 4지선다 버튼 */}
            {!isSubmitted ? (
              <div className="grid grid-cols-1 gap-3 mb-6">
                {quiz.options.map((option, idx) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSubmit(idx)}
                      className="p-4 bg-[#f8f9fa] text-[#343a40] border-4 border-[#dee2e6] hover:border-[#ced4da] hover:bg-[#f1f3f5] hover:-translate-y-1 rounded-xl cursor-pointer transition-all text-left flex items-center text-lg font-bold"
                    >
                      <span className="flex-shrink-0 w-8 h-8 mr-4 flex items-center justify-center rounded-lg bg-[#ced4da] border-2 border-[#adb5bd] text-sm font-bold text-white leading-none font-pixel shadow-inner">
                        {idx + 1}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {/* 해설 및 다음 단계 */}
            {isSubmitted && (
              <div className="p-8 bg-[#e9ecef] border-4 border-[#ced4da] rounded-2xl animate-slide-up mt-auto shadow-inner flex flex-col items-center justify-center h-full">
                <h3 className={`text-3xl font-bold mb-4 font-pixel flex items-center gap-2 ${isCorrect ? 'text-[#343a40]' : 'text-[#9b2226]'}`}>
                  {isCorrect ? '연구 성공!' : '연구 실패...'}
                </h3>
                <p className="text-lg text-[#495057] mb-8 leading-relaxed font-sans font-bold bg-[#f8f9fa] p-4 rounded-xl border-2 border-[#dee2e6] w-full text-center">
                  {quiz.explanation}
                </p>
                <div className="flex justify-center gap-4 w-full">
                  {!isCorrect && (
                    <button
                      onClick={handleNextQuiz}
                      className="px-8 py-4 pixel-btn-gray rounded-xl text-xl font-bold transition-all cursor-pointer w-full max-w-sm"
                    >
                      다른 문제 풀기
                    </button>
                  )}
                  {isCorrect && (
                    <button
                      onClick={handleCollect}
                      className="px-8 py-4 pixel-btn-gray rounded-xl text-xl font-bold transition-all cursor-pointer w-full max-w-sm animate-bounce shadow-lg"
                    >
                      [{quiz.targetMicrobe}] 배양조 소환하기
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </motion.div>

        {/* 생물 소환 스르륵 애니메이션 오버레이 (viewport 좌표계와 1:1 매칭을 위해 모달 밖 fixed 영역으로 이동) */}
        {isSummoning && (
          <div className="fixed inset-0 pointer-events-none z-[100] top-0 left-0 overflow-hidden">
            <motion.div
              initial={{ 
                x: summonCoords.startX - 56, 
                y: summonCoords.startY - 56,
                scale: 1,
                opacity: 1
              }}
              animate={{ 
                x: [
                  summonCoords.startX - 56,
                  summonCoords.startX - 56,
                  summonCoords.startX - 56,
                  summonCoords.startX - 56,
                  summonCoords.startX + summonCoords.diffX - 56
                ],
                y: [
                  summonCoords.startY - 56,
                  summonCoords.startY - 56,
                  summonCoords.startY - 56,
                  summonCoords.startY - 56,
                  summonCoords.startY + summonCoords.diffY - 56
                ],
                scale: [1, 1.2, 0.8, 1.2, 0.3],
                opacity: [1, 0.5, 1, 1, 1],
                filter: [
                  "brightness(1) drop-shadow(0px 0px 0px rgba(255,255,255,0))",
                  "brightness(2) drop-shadow(0px 0px 20px rgba(255,255,255,1))",
                  "brightness(1) drop-shadow(0px 0px 0px rgba(255,255,255,0))",
                  "brightness(2) drop-shadow(0px 0px 20px rgba(255,255,255,1))",
                  "brightness(1) drop-shadow(0px 0px 0px rgba(255,255,255,0))"
                ]
              }}
              transition={{ 
                duration: 1.2, 
                times: [0, 0.1, 0.2, 0.4, 1], 
                ease: "easeInOut" 
              }}
              className="absolute top-0 left-0 w-28 h-28 flex items-center justify-center z-[110]"
            >
              <MicrobeIcon name={quiz.targetMicrobe} className="w-full h-full" glowColor="#ffffff" />
            </motion.div>

            {/* 함께 날아가는 입자들 */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  scale: 0, 
                  x: summonCoords.startX, 
                  y: summonCoords.startY 
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, Math.random() * 2 + 1, 0],
                  x: [
                    summonCoords.startX,
                    summonCoords.startX,
                    summonCoords.startX + summonCoords.diffX + (Math.random() - 0.5) * 100
                  ],
                  y: [
                    summonCoords.startY,
                    summonCoords.startY,
                    summonCoords.startY + summonCoords.diffY + (Math.random() - 0.5) * 100
                  ]
                }}
                transition={{ 
                  duration: 1.2, 
                  times: [0, 0.4, 1], 
                  ease: "easeInOut", 
                  delay: Math.random() * 0.1 
                }}
                className="absolute top-0 left-0 w-4 h-4 rounded-full bg-[#adb5bd] shadow-[0_0_15px_#adb5bd]"
              />
            ))}
          </div>
        )}
    </div>
  );
}
