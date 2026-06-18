import React, { useState } from 'react';
import { baseMicrobes, combinedMicrobes } from '../utils/recipes';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl p-8 bg-slate-900 border-2 border-emerald-500 rounded-3xl shadow-3xl shadow-emerald-500/20 text-white flex gap-6 max-h-[85vh]">
        
        {/* 모달 닫기 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-emerald-400 transition-colors text-2xl"
        >
          ✕
        </button>

        {/* 좌측 리스트 영역 */}
        <div className="flex-1 flex flex-col min-w-[320px]">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-emerald-950/60 border border-emerald-500/50 rounded-full text-xs font-semibold text-emerald-400 uppercase tracking-widest font-mono">
              생물 도감
            </span>
            <h2 className="text-xl font-bold text-emerald-100 font-mono">과학2 미생물 관찰 일지</h2>
          </div>

          {/* 도감 그리드 리스트 */}
          <div className="flex-1 overflow-y-auto bg-slate-950/50 border border-slate-800 rounded-2xl p-4 grid grid-cols-3 gap-3">
            {allItems.map((item, idx) => {
              const isDiscovered = discoveredNames.includes(item.name);
              
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectItem(item)}
                  className={`p-3 border rounded-xl cursor-pointer text-center flex flex-col items-center justify-center gap-1 transition-all ${
                    isDiscovered 
                      ? 'bg-slate-800/80 border-emerald-500/40 hover:border-emerald-400 hover:bg-slate-800' 
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-60'
                  }`}
                >
                  {isDiscovered ? (
                    <>
                      <span className="text-4xl block mb-1 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                        {item.name === '버섯' && '🍄'}
                        {item.name === '곰팡이' && '🦠'}
                        {item.name === '짚신벌레' && '🥿'}
                        {item.name === '아메바' && '🧬'}
                        {item.name === '해캄' && '🌿'}
                        {item.name === '대장균' && '🧪'}
                        {item.name === '젖산균' && '🥛'}
                        {item.name === '화산 버섯' && '🌋'}
                        {item.name === '네온 곰팡이' && '💎'}
                        {item.name === '포자버섯 젤리' && '🔮'}
                        {item.name === '제트 짚신벌레' && '🚀'}
                        {item.name === '블랙홀 아메바' && '🌀'}
                        {item.name === '우주 태양 아메바' && '☀'}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-100">{item.name}</span>
                      <span className="text-[9px] text-emerald-400 font-mono uppercase tracking-wider">{item.type}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl block mb-1 text-slate-700">❓</span>
                      <span className="text-xs font-mono font-bold text-slate-500">미발견 생물</span>
                      <span className="text-[9px] text-slate-600 font-mono uppercase tracking-wider">Tier {item.tier}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 우측 상세 설명 영역 */}
        <div className="w-[320px] bg-slate-950/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          {selectedItem ? (
            discoveredNames.includes(selectedItem.name) ? (
              <div className="w-full flex flex-col items-center h-full justify-between animate-fade-in">
                {/* 돋보기형 원형 그래픽 프레임 */}
                <div className="w-36 h-36 border-2 border-emerald-500/40 rounded-full bg-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-4">
                  <span className="text-6xl filter drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                    {selectedItem.name === '버섯' && '🍄'}
                    {selectedItem.name === '곰팡이' && '🦠'}
                    {selectedItem.name === '짚신벌레' && '🥿'}
                    {selectedItem.name === '아메바' && '🧬'}
                    {selectedItem.name === '해캄' && '🌿'}
                    {selectedItem.name === '대장균' && '🧪'}
                    {selectedItem.name === '젖산균' && '🥛'}
                    {selectedItem.name === '화산 버섯' && '🌋'}
                    {selectedItem.name === '네온 곰팡이' && '💎'}
                    {selectedItem.name === '포자버섯 젤리' && '🔮'}
                    {selectedItem.name === '제트 짚신벌레' && '🚀'}
                    {selectedItem.name === '블랙홀 아메바' && '🌀'}
                    {selectedItem.name === '우주 태양 아메바' && '☀'}
                  </span>
                </div>

                <div className="w-full">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                    {selectedItem.type} (T-{selectedItem.tier})
                  </span>
                  <h3 className="text-2xl font-black font-mono text-white mb-3">
                    {selectedItem.name}
                  </h3>
                  
                  {/* 실제 교과서 지식 설명 */}
                  <div className="text-left bg-slate-900/60 border border-slate-850 p-4 rounded-xl text-xs text-slate-300 leading-relaxed font-sans max-h-[180px] overflow-y-auto">
                    {selectedItem.name === '버섯' && (
                      <p>🍄 <strong>교과서 과학 상식:</strong> 버섯은 곰팡이와 함께 '균류'에 속합니다. 엽록소가 없어 식물처럼 스스로 양분을 만들지 못하므로, 주변의 낙엽이나 죽은 나무 등을 분해하여 영양분을 흡수하며 살아갑니다. 땅속의 실 모양 '균사'가 진짜 몸통입니다.</p>
                    )}
                    {selectedItem.name === '곰팡이' && (
                      <p>🦠 <strong>교과서 과학 상식:</strong> 균류인 곰팡이는 주로 따뜻하고 축축한 음식물이나 벽면 등에 실 같은 균사체로 번식합니다. 다 자라면 머리의 포자낭에서 수많은 먼지 같은 포자를 흩뿌려 바람을 타고 번식합니다.</p>
                    )}
                    {selectedItem.name === '짚신벌레' && (
                      <p>🥿 <strong>교과서 과학 상식:</strong> 논이나 연못 등 고인 물에 사는 대표적인 '원생생물'입니다. 몸 표면 전체에 돋아난 아주 짧고 미세한 털인 <strong>'섬모'</strong>를 끊임없이 움직여 물속을 빠르게 헤엄쳐 다닙니다.</p>
                    )}
                    {selectedItem.name === '아메바' && (
                      <p>🧬 <strong>교과서 과학 상식:</strong> 고인 물에 사는 단세포 원생생물입니다. 몸 전체의 형태가 고정되어 있지 않고, 위족(가짜발)을 느릿느릿 밀어내면서 기어 다닙니다. 먹이를 둘러싸서 가두어 식균 작용으로 삼킵니다.</p>
                    )}
                    {selectedItem.name === '해캄' && (
                      <p>🌿 <strong>교과서 과학 상식:</strong> 논이나 강가에 엉켜 사는 초록색 원생생물(녹조류)입니다. 대나무 마디처럼 길게 생겼으며, 현미경으로 관찰하면 마디 속에 나선 모양으로 꼬여 있는 <strong>'엽록체'</strong>가 뚜렷이 보여 광합성을 합니다.</p>
                    )}
                    {selectedItem.name === '대장균' && (
                      <p>🧪 <strong>교과서 과학 상식:</strong> 사람의 대장 속에 기생하는 막대 모양 세균입니다. 세균은 핵막이 없는 아주 원시적이고 단순한 세포 구조를 가지며, 지구 곳곳 거의 모든 곳에 넓게 서식합니다.</p>
                    )}
                    {selectedItem.name === '젖산균' && (
                      <p>🥛 <strong>교과서 과학 상식:</strong> 요구르트, 치즈, 김치 등의 발효 음식에 들어있는 이로운 세균(유산균)입니다. 영양분이 흡수되면 몸이 반으로 쪼개지는 <strong>이분법 분열</strong>을 아주 빠르게 반복해 번식합니다.</p>
                    )}
                    
                    {/* 합성 변종 생물의 교과서 융합식 설명 */}
                    {selectedItem.tier > 1 && (
                      <p>🌌 <strong>우주 변종 관찰 기록:</strong> {selectedItem.description} {selectedItem.name}은(는) 1티어 미생물들의 실제 생태학적 특징들을 융합해 우주 진화 과정에서 탄생한 특별 연구 대상입니다.</p>
                    )}
                  </div>
                </div>

                <div className="w-full mt-4 border-t border-slate-800 pt-3 grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <span className="block text-slate-500 text-[10px]">수집 속도</span>
                    <span className="text-emerald-400 font-bold">x{selectedItem.miningSpeed}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <span className="block text-slate-500 text-[10px]">용량 한도</span>
                    <span className="text-cyan-400 font-bold">{selectedItem.capacity}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-pulse flex flex-col items-center">
                <span className="text-6xl text-slate-700 mb-4">🔒</span>
                <p className="text-sm text-slate-400 font-mono">아직 발견하지 못한 생물입니다.</p>
                <p className="text-xs text-slate-500 font-mono mt-2">퀴즈를 풀거나 합성하여 획득해 보세요.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-6xl text-emerald-500/20 mb-4 animate-bounce">🔬</span>
              <p className="text-sm text-slate-400 font-mono">상세 설명을 볼 미생물을</p>
              <p className="text-xs text-slate-500 font-mono">도감에서 선택하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
