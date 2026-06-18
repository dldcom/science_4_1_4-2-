import React, { useEffect } from 'react';

export default function LaunchAnimation({ planetName, onComplete }) {
  useEffect(() => {
    // 3초간 애니메이션 진행 후 완료 콜백 호출
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 overflow-hidden select-none animate-shake-screen">
      {/* 별빛 가득한 우주 배경 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a1c38_0%,#04050d_100%)]"></div>
      
      {/* 촘촘한 도트 그리드 스캔라인 */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%]"></div>
      
      {/* 관제소 타이틀 */}
      <div className="z-10 text-center mb-16 animate-pulse">
        <span className="text-[10px] text-[#ff7043] font-black tracking-widest block mb-2 font-mono uppercase">
          🚨 MISSION CONTROL : LAUNCH SEQUENCE
        </span>
        <h2 className="text-xl font-black text-white font-mono">{planetName} 원정대 출격!</h2>
      </div>

      {/* 발사 튜브 샤프트 */}
      <div className="relative w-24 h-96 border-x-4 border-dashed border-[#ff7043]/30 flex items-end justify-center">
        {/* 발사되는 우주선 이모지 */}
        <div className="absolute bottom-4 text-7xl select-none animate-rocket-thrust">
          🚀
          {/* 추진 엔진 불꽃 (깜빡임 애니메이션) */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="text-3xl animate-flicker">🔥</span>
            <span className="text-2xl opacity-60 animate-ping -mt-1">💥</span>
          </div>
        </div>
      </div>

      {/* 바닥 자욱한 발사 연기 구름 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent flex justify-around items-end pb-4 opacity-90 z-20 pointer-events-none">
        <span className="text-6xl animate-bounce" style={{ animationDelay: '0.1s' }}>💨</span>
        <span className="text-5xl animate-bounce" style={{ animationDelay: '0.4s' }}>💨</span>
        <span className="text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>💨</span>
        <span className="text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>💨</span>
      </div>

      {/* 우주선 발사 전용 애니메이션 스타일링 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rocket-thrust-anim {
          0% { transform: translateY(0) scale(1); }
          15% { transform: translateY(10px) scale(1.05); }
          30% { transform: translateY(5px) scale(1.08); }
          100% { transform: translateY(-700px) scale(0.6); }
        }
        @keyframes flicker-anim {
          0%, 100% { transform: scale(1) rotate(-2deg); opacity: 0.9; }
          50% { transform: scale(1.25) rotate(2deg); opacity: 1; }
        }
        @keyframes shake-anim {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-2px, 2px) rotate(-0.5deg); }
          20%, 40%, 60%, 80% { transform: translate(2px, -2px) rotate(0.5deg); }
        }
        .animate-rocket-thrust {
          animation: rocket-thrust-anim 3.0s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
        }
        .animate-flicker {
          animation: flicker-anim 0.08s infinite;
        }
        .animate-shake-screen {
          animation: shake-anim 2.5s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
