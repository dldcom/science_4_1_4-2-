import React, { useState } from 'react';
import { baseMicrobes, combinedMicrobes, recipes, combine } from '../utils/recipes';

export default function Synthesizer({ isOpen, onClose, microbes, onSynthesizeSuccess }) {
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const [synthesizeResult, setSynthesizeResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // 우주 공간에 배치되어 합성 재료로 쓸 수 있는 미생물 리스트 필터링
  // 현재 슬롯에 꽂힌 개체는 제외해야 함
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl p-8 bg-slate-900 border-2 border-fuchsia-500 rounded-3xl shadow-3xl shadow-fuchsia-500/20 text-white flex flex-col max-h-[90vh]">
        
        {/* 모달 닫기 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-fuchsia-400 transition-colors text-2xl"
        >
          ✕
        </button>

        {/* 타이틀 */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-fuchsia-950/60 border border-fuchsia-500/50 rounded-full text-xs font-semibold text-fuchsia-400 uppercase tracking-widest font-mono">
            합성 연구소
          </span>
          <h2 className="text-xl font-bold text-fuchsia-100 font-mono">성간 생명 합성 융합기</h2>
        </div>

        {/* 융합기 핵심 영역 (슬롯 및 합성 버튼) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-center gap-10">
            {/* 슬롯 A */}
            <div className="text-center">
              <div 
                onClick={() => slotA && handleClearSlot('A')}
                className={`w-28 h-28 border-2 ${slotA ? 'border-fuchsia-500 bg-fuchsia-950/20 cursor-pointer hover:bg-fuchsia-950/40' : 'border-dashed border-slate-700 bg-slate-900'} rounded-2xl flex flex-col items-center justify-center transition-all`}
              >
                {slotA ? (
                  <>
                    <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(245,64,245,0.5)] block mb-1">
                      {slotA.name === '버섯' && '🍄'}
                      {slotA.name === '곰팡이' && '🦠'}
                      {slotA.name === '짚신벌레' && '🥿'}
                      {slotA.name === '아메바' && '🧬'}
                      {slotA.name === '해캄' && '🌿'}
                      {slotA.name === '대장균' && '🧪'}
                      {slotA.name === '젖산균' && '🥛'}
                    </span>
                    <span className="text-xs font-mono font-bold text-fuchsia-300">{slotA.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">클릭해 제거</span>
                  </>
                ) : (
                  <span className="text-slate-500 font-mono text-sm">재료 슬롯 A</span>
                )}
              </div>
            </div>

            {/* 융합 기호 */}
            <div className="text-3xl text-fuchsia-500 font-bold font-mono animate-pulse">
              +
            </div>

            {/* 슬롯 B */}
            <div className="text-center">
              <div 
                onClick={() => slotB && handleClearSlot('B')}
                className={`w-28 h-28 border-2 ${slotB ? 'border-fuchsia-500 bg-fuchsia-950/20 cursor-pointer hover:bg-fuchsia-950/40' : 'border-dashed border-slate-700 bg-slate-900'} rounded-2xl flex flex-col items-center justify-center transition-all`}
              >
                {slotB ? (
                  <>
                    <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(245,64,245,0.5)] block mb-1">
                      {slotB.name === '버섯' && '🍄'}
                      {slotB.name === '곰팡이' && '🦠'}
                      {slotB.name === '짚신벌레' && '🥿'}
                      {slotB.name === '아메바' && '🧬'}
                      {slotB.name === '해캄' && '🌿'}
                      {slotB.name === '대장균' && '🧪'}
                      {slotB.name === '젖산균' && '🥛'}
                    </span>
                    <span className="text-xs font-mono font-bold text-fuchsia-300">{slotB.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">클릭해 제거</span>
                  </>
                ) : (
                  <span className="text-slate-500 font-mono text-sm">재료 슬롯 B</span>
                )}
              </div>
            </div>

            {/* 가리키는 화살표 */}
            <div className="text-3xl text-fuchsia-500 font-bold font-mono">
              →
            </div>

            {/* 조합 버튼 */}
            <button
              onClick={handleSynthesize}
              disabled={!slotA || !slotB}
              className={`px-8 py-5 rounded-2xl font-bold font-mono text-lg transition-all shadow-lg ${
                slotA && slotB 
                  ? 'bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 shadow-fuchsia-500/20 hover:scale-105' 
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              융합 합성하기
            </button>
          </div>

          {/* 에러 메시지 */}
          {errorMsg && (
            <div className="mt-4 text-center text-sm font-mono text-rose-400 animate-shake">
              ⚠ {errorMsg}
            </div>
          )}
        </div>

        {/* 인벤토리 목록 (내 우주 생물 중 선택 가능) */}
        <h3 className="text-sm font-mono text-slate-400 mb-3">
          보유 중인 미생물 목록 (합성에 등록할 생물을 선택하세요)
        </h3>
        
        <div className="flex-1 overflow-y-auto bg-slate-950/40 border border-slate-800 rounded-2xl p-4 mb-4 grid grid-cols-4 gap-3 max-h-[300px]">
          {availableMicrobes.length === 0 ? (
            <div className="col-span-4 flex items-center justify-center h-28 text-slate-500 font-mono">
              합성에 사용할 수 있는 여분의 미생물이 없습니다. (퀴즈를 통해 더 소환하세요!)
            </div>
          ) : (
            availableMicrobes.map((m, idx) => (
              <div
                key={m.id || idx}
                onClick={() => handleSelectMicrobe(m)}
                className="p-3 bg-slate-800/60 border border-slate-700 hover:border-fuchsia-400 rounded-xl cursor-pointer hover:bg-slate-800 transition-all text-center flex flex-col items-center justify-center gap-1"
              >
                <span className="text-3xl block mb-1">
                  {m.name === '버섯' && '🍄'}
                  {m.name === '곰팡이' && '🦠'}
                  {m.name === '짚신벌레' && '🥿'}
                  {m.name === '아메바' && '🧬'}
                  {m.name === '해캄' && '🌿'}
                  {m.name === '대장균' && '🧪'}
                  {m.name === '젖산균' && '🥛'}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-100">{m.name}</span>
                <span className="text-[9px] text-fuchsia-400 font-mono uppercase tracking-wider">{m.type}</span>
              </div>
            ))
          )}
        </div>

        {/* 레시피 도감 안내 가이드 */}
        <div className="bg-slate-950/20 border border-slate-800/80 rounded-xl p-3">
          <p className="text-xs text-slate-400 font-mono">
            ℹ <strong>합성 힌트:</strong> 
            [버섯 + 버섯], [곰팡이 + 곰팡이], [버섯 + 곰팡이], [짚신벌레 + 짚신벌레], [아메바 + 아메바], [해캄 + 아메바]
          </p>
        </div>

        {/* 합성 성공 팝업 오버레이 */}
        {synthesizeResult && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center rounded-3xl p-8 z-10 animate-fade-in">
            {/* 찬란한 네온 효과 */}
            <div className="w-32 h-32 rounded-full bg-fuchsia-500/10 border-4 border-fuchsia-500 flex items-center justify-center shadow-2xl shadow-fuchsia-500/50 mb-6 animate-bounce">
              <span className="text-7xl filter drop-shadow-[0_0_15px_rgba(245,64,245,0.7)]">
                {synthesizeResult.name === '화산 버섯' && '🌋'}
                {synthesizeResult.name === '네온 곰팡이' && '💎'}
                {synthesizeResult.name === '포자버섯 젤리' && '🔮'}
                {synthesizeResult.name === '제트 짚신벌레' && '🚀'}
                {synthesizeResult.name === '블랙홀 아메바' && '🌀'}
                {synthesizeResult.name === '우주 태양 아메바' && '☀'}
              </span>
            </div>
            
            <span className="text-xs font-mono text-fuchsia-400 uppercase tracking-widest mb-1">
              신종 생명체 탄생 성공!
            </span>
            <h3 className="text-3xl font-black text-white font-mono mb-4">
              [{synthesizeResult.name}]
            </h3>
            
            <p className="text-center text-slate-300 max-w-md mb-6 leading-relaxed text-sm">
              {synthesizeResult.description}
            </p>

            <div className="flex gap-10 text-center mb-8 border-t border-b border-slate-800 py-3 w-full max-w-sm justify-around font-mono">
              <div>
                <span className="block text-slate-500 text-xs">수집 속도</span>
                <span className="text-emerald-400 font-bold text-lg">x{synthesizeResult.miningSpeed}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">에너지 용량</span>
                <span className="text-cyan-400 font-bold text-lg">{synthesizeResult.capacity}</span>
              </div>
            </div>

            <button
              onClick={handleCloseSuccessPopup}
              className="px-8 py-3 bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 font-bold font-mono rounded-xl shadow-lg shadow-fuchsia-500/20 transition-all hover:scale-105"
            >
              우주로 방출하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
