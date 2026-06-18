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
    // 랜덤하게 다음 문제 출제
    const nextIdx = Math.floor(Math.random() * quizzes.length);
    setCurrentQuizIndex(nextIdx);
  };

  const handleCollect = () => {
    if (isCorrect) {
      const canvasEl = document.getElementById('space-canvas');
      const microscopeEl = microscopeRef.current;
      
      if (canvasEl && microscopeEl) {
        const canvasRect = canvasEl.getBoundingClientRect();
        const microRect = microscopeEl.getBoundingClientRect();
        
        const scaleX = 1.0;
        const scaleY = 1.0;
        
        // Read camera coordinates from canvas DOM attributes to account for camera scrolling
        const defaultCamX = 2000 - canvasRect.width / 2;
        const defaultCamY = 1500 - canvasRect.height / 2;
        const camX = parseFloat(canvasEl.getAttribute('data-camera-x') || defaultCamX.toString());
        const camY = parseFloat(canvasEl.getAttribute('data-camera-y') || defaultCamY.toString());
        
        // Portal center is (2000, 1500) in world coordinates
        const portalLocalX = 2000 - camX;
        const portalLocalY = 1500 - camY;
        
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
        onQuizSuccess(quiz.targetMicrobe);
        setIsSummoning(false);
        handleNextQuiz();
        onClose();
      }, 1000);
    } else {
      handleNextQuiz();
      onClose();
    }
  };

  return (
    <div className={`fixed inset-0 h-[100dvh] w-screen z-50 flex items-center justify-center transition-all duration-500 ${isSummoning ? 'bg-slate-950/20 backdrop-blur-none' : 'bg-slate-950/80 backdrop-blur-sm'} animate-fade-in`}>
      <motion.div 
        animate={isSummoning ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-2xl p-8 glass-modal rounded-3xl text-slate-100 flex flex-col max-h-[95vh] overflow-y-auto"
      >
        
        {/* 우주적인 모달 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/35 rounded-xl cursor-pointer transition-all text-lg font-bold font-scifi"
        >
          ✕
        </button>

        {/* 타이틀 */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider font-scifi">
            QUIZ RESEARCH ({quiz.category === 'fungi' ? '균류' : quiz.category === 'protist' ? '원생생물' : '세균'})
          </span>
          <h2 className="text-lg font-bold text-slate-100 font-scifi">성간 현미경 성분 분석</h2>
        </div>

        {/* 돋보기 관찰창 형태의 시각자료 박스 */}
        <div className="flex justify-center mb-6">
          <div ref={microscopeRef} className="relative flex items-center justify-center w-44 h-44 border border-cyan-500/30 rounded-full bg-[#0d0e1b] shadow-inner overflow-hidden">
            {/* 현미경 조준선 십자선 */}
            <div className="absolute inset-0 border-t border-b border-cyan-500/10 pointer-events-none top-1/2 -translate-y-1/2"></div>
            <div className="absolute inset-0 border-l border-r border-cyan-500/10 pointer-events-none left-1/2 -translate-x-1/2"></div>
            <div className="absolute inset-0 border border-dashed border-cyan-500/10 rounded-full animate-rotate-slow"></div>
            
            {/* 퀴즈 생물 그래픽 실루엣 */}
            <div className="text-center flex flex-col items-center justify-center z-10">
              <MicrobeIcon name={quiz.targetMicrobe} className="w-20 h-20" glowColor="#ffb300" />
              <span className="text-[10px] font-bold text-amber-400 mt-1.5 font-scifi tracking-wider">{quiz.targetMicrobe || 'UNIDENTIFIED'}</span>
            </div>
          </div>
        </div>

        {/* 문제 텍스트 */}
        <p className="text-sm leading-relaxed mb-6 font-semibold font-sans text-slate-100 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          Q. {quiz.question}
        </p>

        {/* 4지선다 버튼 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {quiz.options.map((option, idx) => {
            let btnStyle = "p-4 bg-slate-900/40 text-slate-200 border border-slate-700 hover:border-cyan-500 hover:bg-slate-800/60 rounded-xl cursor-pointer transition-all text-left flex items-center";
            
            if (isSubmitted) {
              if (idx === quiz.answerIndex) {
                btnStyle = "p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 text-left rounded-xl font-bold shadow-md pointer-events-none flex items-center";
              } else if (selectedOption === idx) {
                btnStyle = "p-4 bg-red-500/10 text-red-400 border border-red-500/50 text-left rounded-xl font-bold shadow-md pointer-events-none flex items-center";
              } else {
                btnStyle = "p-4 bg-slate-950/20 border-slate-800 text-slate-600 text-left rounded-xl pointer-events-none opacity-40 flex items-center";
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSubmit(idx)}
                className={btnStyle}
              >
                <span className="flex-shrink-0 w-6 h-6 mr-3 flex items-center justify-center rounded-lg bg-slate-950 border border-slate-700 text-xs font-bold text-amber-400 leading-none font-scifi">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold">{option}</span>
              </button>
            );
          })}
        </div>

        {/* 해설 및 다음 단계 */}
        {isSubmitted && (
          <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl animate-slide-up">
            <h3 className={`text-sm font-bold mb-2 font-scifi flex items-center gap-2 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
              {isCorrect ? '✔ RESEARCH SUCCESSFUL' : '❌ RESEARCH FAILED'}
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed font-sans font-medium">
              {quiz.explanation}
            </p>
            <div className="flex justify-end gap-3">
              {!isCorrect && (
                <button
                  onClick={handleNextQuiz}
                  className="px-5 py-2 scifi-btn-glass rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  다른 문제 풀기
                </button>
              )}
              <button
                onClick={handleCollect}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCorrect 
                    ? 'scifi-btn-emerald' 
                    : 'scifi-btn-glass'
                }`}
              >
                {isCorrect ? `🧬 [${quiz.targetMicrobe}] 소환` : '창 닫기'}
              </button>
            </div>
          </div>
        )}

        {/* 힌트 토글 */}
        {!isSubmitted && (
          <div className="text-center">
            <span className="text-xs text-slate-500 font-mono italic">
              💡 HINT: {quiz.hintText}
            </span>
          </div>
        )}
      </motion.div>

      {/* 4. 소환 비행 애니메이션 오버레이 */}
      {isSummoning && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <motion.div
            initial={{ x: 0, y: 0, scale: 1.2, rotate: 0, opacity: 1 }}
            animate={{ x: summonCoords.diffX, y: summonCoords.diffY, scale: 0.1, rotate: 720, opacity: 0.3 }}
            transition={{ 
              duration: 1.0,
              ease: "easeOut"
            }}
            style={{
              position: 'fixed',
              left: summonCoords.startX - 60,
              top: summonCoords.startY - 60,
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MicrobeIcon name={quiz.targetMicrobe} className="w-24 h-24" glowColor="#ffb300" />
          </motion.div>
        </div>
      )}
    </div>
  );
}
