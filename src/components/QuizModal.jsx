import React, { useState } from 'react';
import { quizzes } from '../utils/quizzes';

export default function QuizModal({ isOpen, onClose, onQuizSuccess }) {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

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
      // 맞췄을 경우에만 생물 획득 및 소환 연출 작동
      onQuizSuccess(quiz.targetMicrobe);
    }
    handleNextQuiz();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl p-8 bg-slate-900 border-2 border-cyan-500 rounded-3xl shadow-3xl shadow-cyan-500/30 text-white">
        
        {/* 우주적인 모달 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-400 transition-colors text-2xl"
        >
          ✕
        </button>

        {/* 타이틀 */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-cyan-900/60 border border-cyan-500/50 rounded-full text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            생명 연구 과제 ({quiz.category === 'fungi' ? '균류' : quiz.category === 'protist' ? '원생생물' : '세균'})
          </span>
          <h2 className="text-xl font-bold text-cyan-100 font-mono">성간 현미경 성분 분석</h2>
        </div>

        {/* 돋보기 관찰창 형태의 시각자료 박스 */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center w-48 h-48 border-4 border-dashed border-cyan-500/40 rounded-full bg-slate-950/80 shadow-inner overflow-hidden">
            {/* 현미경 조준선 십자선 */}
            <div className="absolute inset-0 border-t border-b border-cyan-500/10 pointer-events-none top-1/2 -translate-y-1/2"></div>
            <div className="absolute inset-0 border-l border-r border-cyan-500/10 pointer-events-none left-1/2 -translate-x-1/2"></div>
            
            {/* 퀴즈 생물 그래픽 실루엣 */}
            <div className="text-center">
              <span className="text-6xl filter drop-shadow-[0_0_15px_rgba(0,255,255,0.6)] block mb-1">
                {quiz.targetMicrobe === '버섯' && '🍄'}
                {quiz.targetMicrobe === '곰팡이' && '🦠'}
                {quiz.targetMicrobe === '짚신벌레' && '🥿'}
                {quiz.targetMicrobe === '아메바' && '🧬'}
                {quiz.targetMicrobe === '해캄' && '🌿'}
                {quiz.targetMicrobe === '대장균' && '🧪'}
                {quiz.targetMicrobe === '젖산균' && '🥛'}
                {!quiz.targetMicrobe && '🔬'}
              </span>
              <span className="text-xs font-mono text-cyan-400">{quiz.targetMicrobe || '미확인 시료'}</span>
            </div>
          </div>
        </div>

        {/* 문제 텍스트 */}
        <p className="text-lg leading-relaxed mb-6 font-semibold font-mono text-slate-100 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
          Q. {quiz.question}
        </p>

        {/* 4지선다 버튼 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quiz.options.map((option, idx) => {
            let btnStyle = "p-4 bg-slate-800/80 border border-slate-700 hover:border-cyan-400 text-left rounded-xl transition-all font-mono hover:bg-slate-800";
            
            if (isSubmitted) {
              if (idx === quiz.answerIndex) {
                btnStyle = "p-4 bg-emerald-950/80 border-2 border-emerald-500 text-left text-emerald-300 rounded-xl font-mono shadow-md shadow-emerald-500/20";
              } else if (selectedOption === idx) {
                btnStyle = "p-4 bg-rose-950/80 border-2 border-rose-500 text-left text-rose-300 rounded-xl font-mono shadow-md shadow-rose-500/20";
              } else {
                btnStyle = "p-4 bg-slate-800/40 border border-slate-800 text-left text-slate-500 rounded-xl font-mono pointer-events-none";
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSubmit(idx)}
                className={btnStyle}
              >
                <span className="inline-block w-6 h-6 mr-3 text-center rounded-full bg-slate-900 border border-slate-600 text-sm font-semibold text-cyan-400">
                  {idx + 1}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* 해설 및 다음 단계 */}
        {isSubmitted && (
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl animate-slide-up">
            <h3 className={`text-lg font-bold mb-2 font-mono flex items-center gap-2 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isCorrect ? '✔ 정답입니다! 연구 성공.' : '❌ 아쉽군요! 더 공부해보세요.'}
            </h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed font-sans">
              {quiz.explanation}
            </p>
            <div className="flex justify-end gap-3">
              {!isCorrect && (
                <button
                  onClick={handleNextQuiz}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-sm font-bold font-mono transition-all"
                >
                  다른 문제 풀기
                </button>
              )}
              <button
                onClick={handleCollect}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold font-mono transition-all shadow-lg ${
                  isCorrect 
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 hover:scale-105' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {isCorrect ? `🧬 [${quiz.targetMicrobe}] 우주에 소환` : '창 닫기'}
              </button>
            </div>
          </div>
        )}

        {/* 힌트 토글 */}
        {!isSubmitted && (
          <div className="text-center">
            <span className="text-xs text-slate-500 font-mono italic">
              💡 힌트: {quiz.hintText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
