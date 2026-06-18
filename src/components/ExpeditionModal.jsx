import React from 'react';
import { foodPlanets } from '../utils/expeditions';
import { FoodIcon } from './VectorIcons';

export default function ExpeditionModal({
  isOpen,
  onClose,
  planetId,
  microbes,
  expeditions,
  startExpedition,
  completeExpedition
}) {
  if (!isOpen || !planetId) return null;

  const planet = foodPlanets.find(p => p.id === planetId);
  if (!planet) return null;

  const statusInfo = expeditions[planet.id] || { status: 'locked', timer: 0 };

  // 현재 대기 중인 필요한 미생물이 있는지 확인
  const getAvailableMicrobe = (name) => {
    return microbes.find(m => m.name === name && m.state !== 'expedition');
  };

  const availableMicrobe = getAvailableMicrobe(planet.requiredMicrobe);
  const hasRequiredMicrobe = !!availableMicrobe;

  const handleStartLaunch = () => {
    if (!hasRequiredMicrobe) return;
    // 부모 App.jsx에 발사 명령 전달
    startExpedition(planet.id, availableMicrobe.id);
    // 모달을 닫지 않고 탐사 카운트다운을 모달 내에서 실시간 관측 처리
  };

  const handleCompleteJournal = () => {
    completeExpedition(planet.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 glass-modal rounded-3xl text-slate-100 flex flex-col items-center">
        
        {/* 모달 닫기 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/35 rounded-xl cursor-pointer transition-all text-lg font-bold font-scifi"
        >
          ✕
        </button>

        {/* SF 홀로그램 관측 스캐너 콘솔 */}
        <div className="relative w-full aspect-video max-w-sm bg-[#0d0e1b]/95 border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(0,240,255,0.05)] mb-5 overflow-hidden flex flex-col items-center justify-center">
          {/* 홀로그램 모니터 노이즈 그리드 */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,255,0.06),rgba(255,0,0,0.02),rgba(0,255,255,0.06))] bg-[size:100%_4px,6px_100%]"></div>
          
          {/* 스캐닝 레이저 라인 (탐사 중일 때만 작동) */}
          {statusInfo.status === 'exploring' && <div className="animate-scan z-10"></div>}

          {/* 중앙 시각화 그래픽 */}
          <div className="relative w-24 h-24 flex items-center justify-center z-10">
            {/* 뒤쪽 홀로그램 원형 그리드 데코 */}
            <div className="absolute inset-0 border-2 border-dashed border-[#00ffff]/20 rounded-full animate-rotate-slow"></div>
            
            {/* 상태별 시각적 내용 */}
            {statusInfo.status === 'locked' ? (
              hasRequiredMicrobe ? (
                /* 원정 가능 상태 */
                <div 
                  className="w-16 h-16 rounded-full border border-[#00ffcc] flex items-center justify-center shadow-lg bg-[#00ffcc]/10 animate-pulse-fast text-cyan-400"
                >
                  <FoodIcon name={planet.id} className="w-10 h-10" />
                </div>
              ) : (
                /* 미보유 잠금 상태 */
                <div className="w-16 h-16 rounded-full border border-red-500/40 flex items-center justify-center text-3xl bg-red-500/5 text-slate-500 animate-pulse font-scifi">
                  ❓
                </div>
              )
            ) : statusInfo.status === 'exploring' ? (
              /* 탐사 비행/스캐닝 중 */
              <div className="flex flex-col items-center justify-center">
                <span className="text-5xl animate-bounce mb-1">
                  🛸
                </span>
                <span className="absolute -bottom-2 text-[9px] font-mono font-black text-[#00ffcc] tracking-wider bg-[#00ffcc]/10 px-1.5 py-0.5 rounded border border-[#00ffcc]/30 font-scifi">
                  SCANNING
                </span>
              </div>
            ) : (
              /* 탐사 성공(complete) 또는 자원 보급 중(supplying) */
              <div 
                className="w-20 h-20 rounded-full border-2 border-[#ffb300] flex items-center justify-center shadow-lg animate-pulse-fast text-amber-400"
                style={{ 
                  backgroundColor: 'rgba(251, 233, 231, 0.05)',
                  boxShadow: `0 0 20px ${planet.color}aa`
                }}
              >
                <FoodIcon name={planet.id} className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* 하단 시스템 인포 메시지 자막 */}
          <div className="mt-3 text-[10px] font-mono font-black text-center text-[#ff7043] tracking-widest z-10 font-scifi">
            {statusInfo.status === 'locked' && (
              hasRequiredMicrobe ? "● SCANNER READY / EXPLORATION AVAILABLE" : "▲ REQUIRE MICROBES / TARGET SIGNAL UNSTABLE"
            )}
            {statusInfo.status === 'exploring' && (
              `● SCANNING BIOME: ${Math.round(((planet.duration - statusInfo.timer) / planet.duration) * 100)}%`
            )}
            {statusInfo.status === 'complete' && "★ EXPEDITION SUCCESSFUL / DISCOVERY COMPLETE"}
            {statusInfo.status === 'supplying' && "◆ ESTABLISHED REGULAR CARGO ROUTE"}
          </div>
        </div>

        {/* 타이틀 */}
        <span className="px-3 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2 font-scifi">
          PLANET DISCOVERY
        </span>
        <h3 className="text-lg font-bold text-slate-100 font-scifi mb-4 text-center">
          {planet.name}
        </h3>

        {/* 상황별 내용 분기 */}
        
        {/* 1. 잠금(locked) 상태 */}
        {statusInfo.status === 'locked' && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center mb-5">
              <p className="text-[11px] font-semibold text-slate-300">
                이 미지의 행성을 개척하려면 아래의 미생물이 필요합니다.
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 font-bold rounded-lg border border-amber-500/30 text-[10px] font-scifi">
                  {planet.requiredMicrobe} 필요
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  (보유 상태: {hasRequiredMicrobe ? '✓ 준비 완료' : '✕ 미보유'})
                </span>
              </div>
            </div>

            {hasRequiredMicrobe ? (
              <button
                onClick={handleStartLaunch}
                className="w-full py-3 scifi-btn-emerald rounded-xl text-xs cursor-pointer transition-all"
              >
                🚀 원정대 파견 (우주선 발사!)
              </button>
            ) : (
              <div className="w-full text-center">
                <p className="text-[10px] text-red-400 font-semibold font-mono">
                  ⚠️ 필요한 미생물이 연구실 배양조에 없습니다.<br />
                  퀴즈 연구나 합성을 통해 [ {planet.requiredMicrobe} ]을(를) 먼저 준비하세요!
                </p>
              </div>
            )}
          </div>
        )}

        {/* 2. 원정 중(exploring) 상태 */}
        {statusInfo.status === 'exploring' && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-center mb-4">
              <span className="text-xs font-mono font-bold text-amber-400 animate-pulse block">
                🛸 원정 우주선 비행 및 행성 대기 분석 중... {statusInfo.timer}초 남음
              </span>
              <div className="w-full h-2.5 bg-slate-800 border border-slate-700 rounded-full overflow-hidden mt-3">
                <div 
                  className="h-full bg-cyan-400 transition-all duration-1000"
                  style={{ width: `${((planet.duration - statusInfo.timer) / planet.duration) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-[9px] text-slate-400 font-semibold text-center">
              대원들이 행성에 안착하여 유기 물질을 수집하고 있습니다. 잠시만 기다려 주세요!
            </p>
          </div>
        )}

        {/* 3. 개척 성공(complete) 상태 */}
        {statusInfo.status === 'complete' && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-left text-[11px] leading-relaxed mb-5 max-h-[160px] overflow-y-auto font-sans text-slate-200">
              <h4 className="text-center font-bold text-xs text-amber-400 mb-2 font-scifi">
                {planet.storyTitle}
              </h4>
              <p>{planet.storyContent}</p>
            </div>
            
            <button
              onClick={handleCompleteJournal}
              className="w-full py-3 scifi-btn-emerald rounded-xl text-xs cursor-pointer transition-all animate-bounce"
            >
              확인 (수송 캡슐 배달 개시!)
            </button>
          </div>
        )}

        {/* 4. 자원 보급(supplying) 상태 */}
        {statusInfo.status === 'supplying' && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-left text-[11px] leading-relaxed mb-4 max-h-[140px] overflow-y-auto font-sans text-slate-200">
              <h4 className="text-center font-bold text-xs text-amber-400 mb-2 font-scifi">
                {planet.storyTitle} (기록 보관함)
              </h4>
              <p>{planet.storyContent}</p>
            </div>
            <div className="w-full py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-emerald-400 text-[10px] font-bold font-scifi">
              ✓ 우주선 본국으로 자원 정기 수송 중 (+{planet.rewardAmount} Bio)
            </div>
          </div>
        )}

      </div>

      {/* 홀로그램 모니터 전용 애니메이션 스타일링 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan-line-anim {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scan {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(to right, transparent, #00ffcc, transparent);
          box-shadow: 0 0 10px #00ffcc, 0 0 20px #00ffcc;
          animation: scan-line-anim 3.0s linear infinite;
        }
        @keyframes rotate-slow-anim {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-rotate-slow {
          animation: rotate-slow-anim 20s linear infinite;
        }
        @keyframes pulse-fast-anim {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        .animate-pulse-fast {
          animation: pulse-fast-anim 1.5s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
