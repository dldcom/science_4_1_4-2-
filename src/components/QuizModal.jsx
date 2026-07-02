import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { quizzes } from '../utils/quizzes';
import { MicrobeIcon } from './VectorIcons';

const baseMicrobes = [
  { name: '짚신벌레', category: '원생생물' },
  { name: '해캄', category: '원생생물' },
  { name: '아메바', category: '원생생물' },
  { name: '버섯', category: '균류' },
  { name: '곰팡이', category: '균류' },
  { name: '이스트', category: '균류' },
  { name: '젖산균', category: '세균' },
  { name: '고초균', category: '세균' },
  { name: '대장균', category: '세균' },
];

export default function QuizModal({ isOpen, onClose, onQuizSuccess, onSpendResearchCost }) {
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSummoning, setIsSummoning] = useState(false);
  const [costError, setCostError] = useState('');
  const microscopeRef = useRef(null);
  const summonStartedRef = useRef(false);
  const summonTimeoutRef = useRef(null);
  const [summonCoords, setSummonCoords] = useState({ startX: 0, startY: 0, diffX: 0, diffY: 0 });

  useEffect(() => {
    if (isOpen) {
      if (summonTimeoutRef.current) {
        clearTimeout(summonTimeoutRef.current);
        summonTimeoutRef.current = null;
      }
      summonStartedRef.current = false;
      setSelectedTarget(null);
      setCurrentQuiz(null);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(false);
      setIsSummoning(false);
      setCostError('');
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (summonTimeoutRef.current) {
        clearTimeout(summonTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleSelectTarget = (targetName) => {
    setSelectedTarget(targetName);
    const targetQuizzes = quizzes.filter(q => q.targetMicrobe === targetName);
    const randomQuiz = targetQuizzes[Math.floor(Math.random() * targetQuizzes.length)];
    setCurrentQuiz(randomQuiz);
    setCostError('');
  };

  const handleSubmit = (optionIdx) => {
    if (isSubmitted) return;
    const paid = onSpendResearchCost ? onSpendResearchCost() : true;
    if (!paid) {
      setCostError('바이오 에너지가 부족합니다. 연구에는 100 Bio가 필요합니다.');
      return;
    }
    setCostError('');
    setSelectedOption(optionIdx);
    setIsSubmitted(true);
    const correct = optionIdx === currentQuiz.answerIndex;
    setIsCorrect(correct);
  };

  const handleBack = () => {
    if (selectedTarget && !isSubmitted) {
      setSelectedTarget(null);
      setCurrentQuiz(null);
      setSelectedOption(null);
      setCostError('');
      return;
    }
    onClose();
  };

  const handleCollect = () => {
    if (summonStartedRef.current) return;
    summonStartedRef.current = true;

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
      summonTimeoutRef.current = setTimeout(() => {
        onQuizSuccess(currentQuiz.targetMicrobe, targetWorldX, targetWorldY);
        setIsSummoning(false);
        summonTimeoutRef.current = null;
        onClose();
      }, 1200);
    } else {
      summonStartedRef.current = false;
      onClose();
    }
  };

  return (
    <div className={`fixed top-0 left-0 h-[100dvh] w-screen z-50 flex items-center justify-center transition-all duration-500 ${isSummoning ? 'bg-black/20 backdrop-blur-none' : 'bg-black/50 backdrop-blur-sm'} animate-fade-in`}>
      <motion.div 
        animate={isSummoning ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-5xl p-8 wood-modal font-pixel rounded-xl text-[#343a40] flex flex-col max-h-[90vh] overflow-hidden"
      >
        
        {/* 모달 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-[#e63946] hover:bg-[#ff4d4d] active:translate-y-1 text-white border-4 border-[#9b2226] rounded-md cursor-pointer transition-all text-2xl font-bold font-pixel shadow-md z-10"
        >
          ✕
        </button>

        <button
          onClick={handleBack}
          className="absolute top-4 left-4 px-4 h-12 flex items-center justify-center pixel-btn-gray text-[#343a40] cursor-pointer font-bold leading-none text-sm shadow-md z-10"
        >
          뒤로가기
        </button>

        {/* 타이틀 */}
        <div className="flex items-center gap-4 mb-6 pl-28">
          <span className="px-4 py-2 bg-[#adb5bd] text-white border-4 border-[#868e96] rounded-md text-sm font-bold uppercase tracking-wider font-pixel">
            연구 센터
          </span>
          <h2 className="text-3xl font-bold text-[#212529]">
            {!selectedTarget ? '배양할 1차 미생물 선택' : '생물 특성 분석 퀴즈'}
          </h2>
        </div>

        {/* 메인 뷰: 선택 화면 OR 퀴즈 화면 */}
        {!selectedTarget ? (
          <div className="flex flex-col items-center justify-start flex-1 w-full mt-2 overflow-y-auto custom-scrollbar pr-2 py-2">
            <div className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl pb-6">
              {baseMicrobes.map(m => (
                <button
                  key={m.name}
                  onClick={() => handleSelectTarget(m.name)}
                  className="flex flex-col items-center justify-center p-4 md:p-6 bg-[#f8f9fa] border-4 border-[#dee2e6] hover:border-[#ced4da] hover:bg-[#e9ecef] hover:-translate-y-1 active:translate-y-0 rounded-2xl cursor-pointer transition-all gap-3 shadow-sm group"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-[#e9ecef] border-4 border-[#ced4da] group-hover:border-[#adb5bd] rounded-full flex items-center justify-center shadow-inner transition-colors">
                    <MicrobeIcon name={m.name} className="w-10 h-10 md:w-12 md:h-12" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg md:text-xl font-bold text-[#495057]">{m.name}</span>
                    <span className="text-xs text-[#868e96] px-2 py-1 bg-[#e9ecef] rounded-md leading-none">{m.category}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-2 mb-4 text-[#868e96] font-bold text-sm md:text-base">연구할 미생물을 선택하면 해당 미생물에 대한 퀴즈가 시작됩니다.</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
            {/* 좌측: 현미경 뷰 */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-[#f8f9fa] border-4 border-[#dee2e6] rounded-xl p-8 shadow-inner w-full md:w-1/3 relative">
              <div ref={microscopeRef} className="relative flex items-center justify-center w-56 h-56 border-8 border-[#ced4da] rounded-full bg-[#e9ecef] shadow-inner overflow-hidden mb-6">
                <div className="absolute inset-0 border-4 border-dashed border-[#adb5bd] m-2 rounded-full animate-rotate-slow"></div>
                
                <div className={`text-center flex flex-col items-center justify-center z-10 transition-opacity duration-300 ${isSummoning ? 'opacity-0' : 'opacity-100'}`}>
                  <MicrobeIcon name={currentQuiz.targetMicrobe} className="w-28 h-28" glowColor="#adb5bd" />
                </div>
              </div>
              <span className="text-base font-bold text-[#495057] font-pixel tracking-wider bg-[#f1f3f5] px-4 py-2 rounded-md border-2 border-[#ced4da]">
                {currentQuiz.targetMicrobe}
              </span>
              
              {!isSubmitted && (
                <div className="text-center mt-6">
                  <span className="text-base text-[#868e96] font-bold">
                    HINT: {currentQuiz.hintText}
                  </span>
                </div>
              )}
            </div>

            {/* 우측: 문제와 답안 영역 */}
            <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar pr-2">
              <p className="text-xl leading-relaxed mb-6 font-bold text-[#212529] bg-[#f8f9fa] p-6 rounded-xl border-4 border-[#dee2e6]">
                Q. {currentQuiz.question}
              </p>

              {costError && (
                <div className="mb-4 p-3 bg-[#fff3cd] border-4 border-[#ffec99] rounded-xl text-center text-[#9b2226] font-bold">
                  {costError}
                </div>
              )}

              {!isSubmitted ? (
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {currentQuiz.options.map((option, idx) => {
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

              {isSubmitted && (
                <div className="p-8 bg-[#e9ecef] border-4 border-[#ced4da] rounded-2xl animate-slide-up mt-auto shadow-inner flex flex-col items-center justify-center h-full">
                  <h3 className={`text-3xl font-bold mb-4 font-pixel flex items-center gap-2 ${isCorrect ? 'text-[#343a40]' : 'text-[#9b2226]'}`}>
                    {isCorrect ? '연구 성공!' : '연구 실패...'}
                  </h3>
                  <p className="text-lg text-[#495057] mb-8 leading-relaxed font-bold bg-[#f8f9fa] p-4 rounded-xl border-2 border-[#dee2e6] w-full text-center">
                    {currentQuiz.explanation}
                  </p>
                  <div className="flex justify-center gap-4 w-full">
                    {!isCorrect && (
                      <button
                        onClick={onClose}
                        className="px-8 py-4 pixel-btn-gray rounded-xl text-xl font-bold transition-all cursor-pointer w-full max-w-sm"
                      >
                        확인
                      </button>
                    )}
                    {isCorrect && (
                      <button
                        onClick={handleCollect}
                        disabled={isSummoning}
                        className={`px-8 py-4 pixel-btn-gray rounded-xl text-xl font-bold transition-all w-full max-w-sm shadow-lg ${isSummoning ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer animate-bounce'}`}
                      >
                        [{currentQuiz.targetMicrobe}] 배양조 소환하기
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </motion.div>

        {/* 생물 소환 스르륵 애니메이션 오버레이 */}
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
              <MicrobeIcon name={currentQuiz.targetMicrobe} className="w-full h-full" glowColor="#ffffff" />
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
