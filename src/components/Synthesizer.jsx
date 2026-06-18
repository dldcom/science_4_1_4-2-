import React, { useState } from 'react';
import { baseMicrobes, combinedMicrobes, recipes, combine } from '../utils/recipes';
import { MicrobeIcon } from './VectorIcons';

export default function Synthesizer({ isOpen, onClose, microbes, onSynthesizeSuccess }) {
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const [synthesizeResult, setSynthesizeResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // 우주 공간에 배치되어 합성 재료로 쓸 수 있는 미생물 리스트 필터링
  const availableMicrobes = microbes.filter(m => 
    (!slotA || m.id !== slotA.id) && 
    (!slotB || m.id !== slotB.id)
  );

  const handleSelectMicrobe = (microbe) => {
    if (!slotA) {
      setSlotA(microbe);
    } else if (!slotB) {
      setSlotB(microbe);
    }
    setErrorMsg('');
  };

  const handleClearSlot = (slotType) => {
    if (slotType === 'A') setSlotA(null);
    if (slotType === 'B') setSlotB(null);
    setErrorMsg('');
    setSynthesizeResult(null);
  };

  const handleSynthesize = () => {
    if (!slotA || !slotB) {
      setErrorMsg('합성할 두 미생물을 슬롯에 등록해 주세요.');
      return;
    }

    const result = combine(slotA.name, slotB.name);

    if (result) {
      // 합성 성공!
      setSynthesizeResult(result);
      setErrorMsg('');
      // 부모 컴포넌트에 알림 (슬롯에 꽂힌 2개 삭제, 새 생물 추가)
      onSynthesizeSuccess(slotA.id, slotB.id, result.name);
    } else {
      // 레시피가 없음 (합성 실패)
      setErrorMsg('두 미생물은 서로 융합하지 못하고 서로를 밀어냅니다. (잘못된 조합법)');
      setSynthesizeResult(null);
    }
  };

  const handleCloseSuccessPopup = () => {
    setSlotA(null);
    setSlotB(null);
    setSynthesizeResult(null);
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl p-8 glass-modal rounded-3xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* 모달 닫기 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/35 rounded-xl cursor-pointer transition-all text-lg font-bold font-scifi"
        >
          ✕
        </button>

        {/* 타이틀 */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-bold uppercase tracking-wider font-scifi">
            SYNTHESIZER
          </span>
          <h2 className="text-lg font-bold text-slate-100 font-scifi">성간 생명 합성 융합기</h2>
        </div>

        {/* 융합기 핵심 영역 (슬롯 및 합성 버튼) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mb-6 shadow-inner">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            {/* 슬롯 A */}
            <div className="text-center">
              <div 
                onClick={() => slotA && handleClearSlot('A')}
                className={`w-28 h-28 border ${slotA ? 'border-cyan-500/40 bg-cyan-500/5 cursor-pointer hover:bg-cyan-500/10' : 'border-dashed border-slate-800 bg-slate-950/40'} rounded-2xl flex flex-col items-center justify-center transition-all`}
              >
                {slotA ? (
                  <>
                    <MicrobeIcon name={slotA.name} className="w-14 h-14 mb-1" glowColor={slotA.glowColor} />
                    <span className="text-xs font-bold text-slate-200">{slotA.name}</span>
                    <span className="text-[8px] text-slate-500 font-mono">제거하기</span>
                  </>
                ) : (
                  <span className="text-slate-600 font-mono text-[10px] tracking-wider">SLOT A</span>
                )}
              </div>
            </div>

            {/* 융합 기호 */}
            <div className="text-2xl text-cyan-400 font-bold font-scifi animate-pulse">
              +
            </div>

            {/* 슬롯 B */}
            <div className="text-center">
              <div 
                onClick={() => slotB && handleClearSlot('B')}
                className={`w-28 h-28 border ${slotB ? 'border-cyan-500/40 bg-cyan-500/5 cursor-pointer hover:bg-cyan-500/10' : 'border-dashed border-slate-800 bg-slate-950/40'} rounded-2xl flex flex-col items-center justify-center transition-all`}
              >
                {slotB ? (
                  <>
                    <MicrobeIcon name={slotB.name} className="w-14 h-14 mb-1" glowColor={slotB.glowColor} />
                    <span className="text-xs font-bold text-slate-200">{slotB.name}</span>
                    <span className="text-[8px] text-slate-500 font-mono">제거하기</span>
                  </>
                ) : (
                  <span className="text-slate-600 font-mono text-[10px] tracking-wider">SLOT B</span>
                )}
              </div>
            </div>

            {/* 가리키는 화살표 */}
            <div className="text-2xl text-cyan-400 font-bold font-scifi hidden sm:block">
              →
            </div>

            {/* 조합 버튼 */}
            <button
              onClick={handleSynthesize}
              disabled={!slotA || !slotB}
              className={`px-6 py-4 rounded-xl font-bold font-scifi text-sm transition-all cursor-pointer ${
                slotA && slotB 
                  ? 'scifi-btn-emerald' 
                  : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed opacity-40'
              }`}
            >
              FUSE LIFEFORM
            </button>
          </div>

          {/* 에러 메시지 */}
          {errorMsg && (
            <div className="mt-4 text-center text-xs font-bold text-red-400 animate-shake">
              ⚠ {errorMsg}
            </div>
          )}
        </div>

        {/* 인벤토리 목록 (내 우주 생물 중 선택 가능) */}
        <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider font-scifi">
          AVAILABLE LAB SPECIMENS (합성 재료 선택)
        </h3>
        
        <div className="flex-1 overflow-y-auto bg-slate-950/40 border border-slate-800 rounded-2xl p-4 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[260px] shadow-inner">
          {availableMicrobes.length === 0 ? (
            <div className="col-span-4 flex items-center justify-center h-28 text-slate-600 font-mono text-xs">
              합성에 사용할 수 있는 여분의 미생물이 없습니다. (연구실 퀴즈로 소환하세요!)
            </div>
          ) : (
            availableMicrobes.map((m, idx) => (
              <div
                key={m.id || idx}
                onClick={() => handleSelectMicrobe(m)}
                className="p-3 bg-slate-900/60 border border-slate-700 hover:border-cyan-500 rounded-xl cursor-pointer hover:bg-slate-800/80 transition-all text-center flex flex-col items-center justify-center gap-1 shadow-sm text-slate-200"
              >
                <MicrobeIcon name={m.name} className="w-10 h-10 mb-1" glowColor={m.glowColor} />
                <span className="text-xs font-bold text-slate-200">{m.name}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: m.glowColor }}>{m.type}</span>
              </div>
            ))
          )}
        </div>

        {/* 레시피 도감 안내 가이드 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 select-none">
          <p className="text-[10px] text-slate-400 text-center font-mono">
            ℹ <strong>MUTATION RECIPES:</strong> [버섯+버섯] ➔ 화산 버섯 | [곰팡이+곰팡이] ➔ 네온 곰팡이 | [버섯+곰팡이] ➔ 포자버섯 젤리 | [짚신벌레+짚신벌레] ➔ 제트 짚신벌레 | [아메바+아메바] ➔ 블랙홀 아메바 | [해캄+아메바] ➔ 우주 태양 아메바
          </p>
        </div>

        {/* 합성 성공 팝업 오버레이 */}
        {synthesizeResult && (
          <div className="absolute inset-0 bg-[#070814] flex flex-col items-center justify-center rounded-3xl p-8 z-10 animate-fade-in border-2 border-cyan-500/30">
            {/* 찬란한 네온 효과 */}
            <div className="w-32 h-32 rounded-full bg-cyan-500/10 border-2 border-cyan-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30 mb-6 animate-bounce">
              <MicrobeIcon name={synthesizeResult.name} className="w-20 h-20" glowColor={synthesizeResult.glowColor} />
            </div>
            
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1 font-scifi">
              MUTATION SYNTHESIS SUCCESS
            </span>
            <h3 className="text-2xl font-bold text-slate-100 font-scifi mb-4">
              [{synthesizeResult.name}]
            </h3>
            
            <p className="text-center text-slate-300 max-w-md mb-6 leading-relaxed text-xs">
              {synthesizeResult.description}
            </p>

            <div className="flex gap-10 text-center mb-8 border-t border-b border-slate-800 py-3.5 w-full max-w-sm justify-around font-mono">
              <div>
                <span className="block text-slate-500 text-[10px] font-semibold">수집 속도</span>
                <span className="text-emerald-400 font-bold text-lg">x{synthesizeResult.miningSpeed}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[10px] font-semibold">에너지 용량</span>
                <span className="text-cyan-400 font-bold text-lg">{synthesizeResult.capacity}</span>
              </div>
            </div>

            <button
              onClick={handleCloseSuccessPopup}
              className="px-8 py-3 scifi-btn-cyan rounded-xl text-xs font-bold cursor-pointer transition-all"
            >
              RELEASE INTO COSMOS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
