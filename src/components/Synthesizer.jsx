import React, { useState } from 'react';
import { baseMicrobes, combinedMicrobes, recipes, combine } from '../utils/recipes';
import { MicrobeIcon } from './VectorIcons';

export default function Synthesizer({ isOpen, onClose, microbes, onSynthesizeSuccess }) {
  const [slotA, setSlotA] = useState(null);
  const [slotB, setSlotB] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // 우주 공간에 배치되어 합성 재료로 쓸 수 있는 미생물 리스트 필터링
  const availableMicrobes = microbes.filter(m => 
    m.state !== 'expedition' &&
    m.state !== 'merging' &&
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
  };
  const handleSynthesize = () => {
    if (!slotA || !slotB) {
      setErrorMsg('합성할 두 생물을 슬롯에 등록해 주세요.');
      return;
    }

    const result = combine(slotA.name, slotB.name);

    if (result) {
      // 합성 성공!
      setErrorMsg('');
      // 부모 컴포넌트에 알림 (슬롯에 꽂힌 2개 삭제, 새 생물 추가 애니메이션 시작)
      onSynthesizeSuccess(slotA.id, slotB.id, result.name);
      
      // 즉시 모달 닫기
      setSlotA(null);
      setSlotB(null);
      onClose();
    } else {
      // 레시피가 없음 (합성 실패)
      setErrorMsg('두 생물은 서로 융합하지 못하고 밀어냅니다. (잘못된 조합)');
    }
  };

  return (
    <div className="fixed top-0 left-0 h-[100dvh] w-screen z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl p-8 wood-modal font-pixel rounded-xl text-[#343a40] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* 모달 닫기 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-[#e63946] hover:bg-[#ff4d4d] active:translate-y-1 text-white border-4 border-[#9b2226] rounded-md cursor-pointer transition-all text-2xl font-bold font-pixel shadow-md z-10"
        >
          ✕
        </button>

        {/* 타이틀 */}
        <div className="flex items-center gap-4 mb-8">
          <span className="px-4 py-2 bg-[#ced4da] text-[#495057] border-4 border-[#adb5bd] rounded-md text-sm font-bold uppercase tracking-wider font-pixel">
            합성 (조합)
          </span>
          <h2 className="text-3xl font-bold text-[#212529]">생명체 융합 연구소</h2>
        </div>

        {/* 융합기 핵심 영역 (슬롯 및 합성 버튼) */}
        <div className="bg-[#f8f9fa] border-4 border-[#dee2e6] rounded-xl p-8 mb-8 shadow-inner">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
            {/* 슬롯 A */}
            <div className="text-center">
              <div 
                onClick={() => slotA && handleClearSlot('A')}
                className={`w-32 h-32 border-4 ${slotA ? 'border-[#adb5bd] bg-[#e9ecef] cursor-pointer hover:bg-[#dee2e6] hover:-translate-y-1' : 'border-dashed border-[#ced4da] bg-[#f1f3f5]'} rounded-xl flex flex-col items-center justify-center transition-all`}
              >
                {slotA ? (
                  <>
                    <MicrobeIcon name={slotA.name} className="w-16 h-16 mb-2" glowColor={slotA.glowColor} />
                    <span className="text-base font-bold text-[#343a40]">{slotA.name}</span>
                    <span className="text-xs text-[#868e96] font-bold">제거하기</span>
                  </>
                ) : (
                  <span className="text-[#adb5bd] font-pixel text-sm tracking-wider">슬롯 A</span>
                )}
              </div>
            </div>

            {/* 융합 기호 */}
            <div className="text-5xl text-[#6c757d] font-bold animate-pulse">
              +
            </div>

            {/* 슬롯 B */}
            <div className="text-center">
              <div 
                onClick={() => slotB && handleClearSlot('B')}
                className={`w-32 h-32 border-4 ${slotB ? 'border-[#adb5bd] bg-[#e9ecef] cursor-pointer hover:bg-[#dee2e6] hover:-translate-y-1' : 'border-dashed border-[#ced4da] bg-[#f1f3f5]'} rounded-xl flex flex-col items-center justify-center transition-all`}
              >
                {slotB ? (
                  <>
                    <MicrobeIcon name={slotB.name} className="w-16 h-16 mb-2" glowColor={slotB.glowColor} />
                    <span className="text-base font-bold text-[#343a40]">{slotB.name}</span>
                    <span className="text-xs text-[#868e96] font-bold">제거하기</span>
                  </>
                ) : (
                  <span className="text-[#adb5bd] font-pixel text-sm tracking-wider">슬롯 B</span>
                )}
              </div>
            </div>

            {/* 가리키는 화살표 */}
            <div className="text-5xl text-[#adb5bd] font-bold hidden sm:block">
              →
            </div>

            {/* 조합 버튼 */}
            <button
              onClick={handleSynthesize}
              disabled={!slotA || !slotB}
              className={`px-8 py-5 rounded-xl font-bold font-pixel text-xl transition-all cursor-pointer ${
                slotA && slotB 
                  ? 'pixel-btn-gray' 
                  : 'bg-[#e9ecef] text-[#adb5bd] border-4 border-[#dee2e6] cursor-not-allowed opacity-60'
              }`}
            >
              융합 시작
            </button>
          </div>

          {/* 에러 메시지 */}
          {errorMsg && (
            <div className="mt-6 text-center text-lg font-bold text-[#d62828] animate-shake">
              ⚠ {errorMsg}
            </div>
          )}
        </div>

        {/* 인벤토리 목록 */}
        <h3 className="text-lg font-bold text-[#495057] mb-4 uppercase tracking-wider">
          내 배양조 생물 (재료 선택)
        </h3>
        
        <div className="flex-1 overflow-y-auto wood-panel p-5 mb-6 grid grid-cols-3 sm:grid-cols-5 gap-4 max-h-[300px] shadow-inner custom-scrollbar">
          {availableMicrobes.length === 0 ? (
            <div className="col-span-5 flex items-center justify-center h-32 text-[#868e96] font-bold text-lg">
              합성에 사용할 생물이 없습니다. (연구 탭에서 퀴즈로 소환하세요!)
            </div>
          ) : (
            availableMicrobes.map((m, idx) => (
              <div
                key={m.id || idx}
                onClick={() => handleSelectMicrobe(m)}
                className="p-4 bg-[#f8f9fa] border-4 border-[#dee2e6] hover:border-[#adb5bd] rounded-xl cursor-pointer hover:bg-[#e9ecef] hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-center gap-2 shadow-sm text-[#495057]"
              >
                <MicrobeIcon name={m.name} className="w-14 h-14 mb-1" glowColor={m.glowColor} />
                <span className="text-sm font-bold text-[#343a40]">{m.name}</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-[#ced4da] text-white px-2 py-0.5 rounded-sm font-pixel">{m.type}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
