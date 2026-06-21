import React, { useState } from 'react';
import { baseMicrobes, combinedMicrobes } from '../utils/recipes';
import { MicrobeIcon } from './VectorIcons';

export default function Encyclopedia({ isOpen, onClose, discoveredNames }) {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!isOpen) return null;

  // 전체 도감 목록 구성 (1티어 기초 생물 + 2~3티어 합성 변종)
  const allItems = [
    ...Object.values(baseMicrobes),
    ...Object.values(combinedMicrobes)
  ];

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="fixed top-0 left-0 h-[100dvh] w-screen z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-6xl p-8 wood-modal flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-hidden">
        
        {/* 모달 닫기 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-[#e63946] hover:bg-[#ff4d4d] active:transform active:translate-y-1 text-white border-4 border-[#9b2226] rounded-md cursor-pointer transition-all text-3xl font-bold font-pixel shadow-md z-10"
        >
          ✕
        </button>

        {/* 좌측 리스트 영역 */}
        <div className="flex-1 flex flex-col min-w-[360px] overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-[#ced4da] text-[#495057] border-4 border-[#adb5bd] rounded-md text-sm font-bold uppercase tracking-wider font-pixel">
              도감
            </span>
            <h2 className="text-3xl font-bold text-[#343a40]">생물 관찰 일지</h2>
          </div>

          {/* 도감 그리드 리스트 */}
          <div className="flex-1 overflow-y-auto wood-panel p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {allItems.map((item, idx) => {
              const isDiscovered = discoveredNames.includes(item.name);
              
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectItem(item)}
                  className={`p-4 border-4 rounded-lg cursor-pointer text-center flex flex-col items-center justify-center gap-2 transition-all ${
                    isDiscovered 
                      ? 'bg-[#e9ecef] border-[#adb5bd] hover:border-[#868e96] hover:bg-[#dee2e6] hover:-translate-y-1' 
                      : 'bg-[#f8f9fa] border-[#dee2e6] opacity-60 hover:opacity-100 hover:-translate-y-1'
                  }`}
                >
                  {isDiscovered ? (
                    <>
                      <MicrobeIcon name={item.name} className="w-14 h-14 mb-1" glowColor={item.glowColor} />
                      <span className="text-lg font-bold text-[#343a40]">{item.name}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6c757d] font-pixel bg-[#f1f3f5] px-2 py-1 rounded-sm border border-[#dee2e6]">{item.type}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 flex items-center justify-center border-4 border-dashed border-[#ced4da] rounded-full text-[#ced4da] text-3xl font-bold mb-1 font-pixel">?</div>
                      <span className="text-lg font-medium text-[#adb5bd]">미발견 생물</span>
                      <span className="text-xs text-[#868e96] font-pixel tracking-wider">Tier {item.tier}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 우측 상세 설명 영역 */}
        <div className="w-full md:w-[420px] wood-panel p-8 flex flex-col items-center justify-start text-center min-h-[400px]">
          {selectedItem ? (
            discoveredNames.includes(selectedItem.name) ? (
              <div className="w-full flex flex-col items-center h-full animate-fade-in">
                {/* 돋보기형 원형 그래픽 프레임 (그레이스타일) */}
                <div className="w-48 h-48 border-8 border-[#adb5bd] rounded-full bg-[#f8f9fa] flex items-center justify-center shadow-inner mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 border-4 border-dashed border-[#dee2e6] rounded-full animate-rotate-slow m-2"></div>
                  <MicrobeIcon name={selectedItem.name} className="w-32 h-32 z-10" glowColor={selectedItem.glowColor} />
                </div>

                <div className="w-full flex-1 flex flex-col">
                  <span className="text-sm font-pixel font-bold uppercase tracking-wider block mb-2 text-[#6c757d] bg-[#e9ecef] inline-block mx-auto px-3 py-1 rounded-md border-2 border-[#ced4da]">
                    {selectedItem.type} (T-{selectedItem.tier})
                  </span>
                  <h3 className="text-4xl font-bold text-[#343a40] mb-4">
                    {selectedItem.name}
                  </h3>
                  
                  {/* 생물 도감 설명 */}
                  <div className="text-left bg-[#f8f9fa] border-4 border-[#dee2e6] p-5 rounded-lg text-lg text-[#495057] leading-relaxed flex-1 overflow-y-auto mb-4 custom-scrollbar">
                    <p><strong>도감 설명:</strong> {selectedItem.description}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-pulse flex flex-col items-center justify-center h-full">
                <p className="text-xl text-[#adb5bd] font-bold">아직 발견하지 못한 생물입니다.</p>
                <p className="text-base text-[#868e96] mt-3">연구를 하거나 융합하여 획득해 보세요.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-2xl text-[#adb5bd] font-bold">도감을 펼쳤습니다.</p>
              <p className="text-lg text-[#868e96] mt-3">리스트에서 생물을 선택해 보세요.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
