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
    <div className="fixed inset-0 h-[100dvh] w-screen z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl p-8 glass-modal rounded-3xl text-slate-100 flex flex-col md:flex-row gap-6 max-h-[85vh] overflow-hidden">
        
        {/* 모달 닫기 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/35 rounded-xl cursor-pointer transition-all text-lg font-bold font-scifi"
        >
          ✕
        </button>

        {/* 좌측 리스트 영역 */}
        <div className="flex-1 flex flex-col min-w-[320px] overflow-hidden">
          <div className="flex items-center gap-3 mb-5">
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-bold uppercase tracking-wider font-scifi">
              ENCYCLOPEDIA
            </span>
            <h2 className="text-lg font-bold text-slate-100 font-scifi">생물 도감 관찰 일지</h2>
          </div>

          {/* 도감 그리드 리스트 */}
          <div className="flex-1 overflow-y-auto bg-slate-950/40 border border-slate-800 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 shadow-inner">
            {allItems.map((item, idx) => {
              const isDiscovered = discoveredNames.includes(item.name);
              
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectItem(item)}
                  className={`p-3 border rounded-xl cursor-pointer text-center flex flex-col items-center justify-center gap-1 transition-all ${
                    isDiscovered 
                      ? 'bg-slate-900/60 border-slate-700 hover:border-cyan-500 hover:bg-slate-800/80' 
                      : 'bg-slate-950/30 border-slate-900 opacity-40 hover:opacity-60'
                  }`}
                >
                  {isDiscovered ? (
                    <>
                      <MicrobeIcon name={item.name} className="w-10 h-10 mb-1" glowColor={item.glowColor} />
                      <span className="text-xs font-bold text-slate-200">{item.name}</span>
                      <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: item.glowColor }}>{item.type}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 flex items-center justify-center border border-dashed border-slate-800 rounded-full text-slate-600 text-lg font-bold mb-1 font-scifi">?</div>
                      <span className="text-xs font-medium text-slate-500">미발견 생물</span>
                      <span className="text-[9px] text-slate-600 font-mono tracking-wider">Tier {item.tier}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 우측 상세 설명 영역 */}
        <div className="w-full md:w-[320px] bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner text-slate-100 min-h-[300px]">
          {selectedItem ? (
            discoveredNames.includes(selectedItem.name) ? (
              <div className="w-full flex flex-col items-center h-full justify-between animate-fade-in">
                {/* 돋보기형 원형 그래픽 프레임 */}
                <div className="w-36 h-36 border border-cyan-500/20 rounded-full bg-[#0d0e1b] flex items-center justify-center shadow-inner mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 border border-dashed border-cyan-500/10 rounded-full animate-rotate-slow"></div>
                  <MicrobeIcon name={selectedItem.name} className="w-20 h-20 z-10" glowColor={selectedItem.glowColor} />
                </div>

                <div className="w-full">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider block mb-1" style={{ color: selectedItem.glowColor }}>
                    {selectedItem.type} (T-{selectedItem.tier})
                  </span>
                  <h3 className="text-xl font-bold font-scifi text-slate-100 mb-3">
                    {selectedItem.name}
                  </h3>
                  
                  {/* 실제 교과서 지식 설명 */}
                  <div className="text-left bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 leading-relaxed font-sans max-h-[180px] overflow-y-auto">
                    {selectedItem.name === '버섯' && (
                      <p>🍄 <strong>교과서 과학 상식:</strong> 버섯은 곰팡이와 함께 '균류'에 속합니다. 엽록소가 없어 식물처럼 스스로 양분을 만들지 못하므로, 주변의 낙엽이나 죽은 나무 등을 분해하여 영양분을 흡수하며 살아갑니다. 땅속의 실 모양 '균사'가 진짜 몸통입니다.</p>
                    )}
                    {selectedItem.name === '곰팡이' && (
                      <p>🦠 <strong>교과서 과학 상식:</strong> 균류인 곰팡이는 주로 따뜻하고 축축한 음식물이나 벽면 등에 실 같은 균사체로 번식합니다. 다 자라면 머리의 포자낭에서 수많은 먼지 같은 포자를 흩뿌려 바람을 타고 번식합니다.</p>
                    )}
                    {selectedItem.name === '이스트' && (
                      <p>🥯 <strong>교과서 과학 상식:</strong> 이스트(효모)는 버섯, 곰팡이와 함께 '균류'에 속하지만, 실 모양의 균사가 없는 단세포 생물입니다. 빵 반죽 속의 당분을 먹고 이산화탄소를 만들어내어 반죽을 푹신하게 부풀리는 발효 작용을 합니다. 곰팡이와 달리 식빵 반죽을 부풀리는 등 우리에게 이로운 영향을 줍니다.</p>
                    )}
                    {selectedItem.name === '고초균' && (
                      <p>🌾 <strong>교과서 과학 상식:</strong> 볏짚이나 마른풀, 흙 등에 널리 사는 세균입니다. 열과 건조함에 매우 강하며, 삶은 콩의 단백질을 분해하고 유익한 성분을 분비하여 구수한 청국장이나 낫토를 만드는 데 핵심적인 도움을 줍니다.</p>
                    )}
                    {selectedItem.name === '누룩곰팡이' && (
                      <p>🍚 <strong>교과서 과학 상식:</strong> 쌀이나 콩 등에 번식하는 곰팡이의 일종(균류)입니다. 강력한 소화 효소들을 뿜어내어 콩과 곡물의 녹말 및 단백질을 포도당과 아미노산으로 맛있게 분해해 주며, 메주를 띄워 짭조름하고 구수한 간장과 된장을 만드는 데 쓰입니다.</p>
                    )}
                    {selectedItem.name === '아세트산균' && (
                      <p>🏺 <strong>교과서 과학 상식:</strong> 알코올(술) 성분을 아세트산(초산)이라는 시큼한 성분으로 바꾸는 특별한 능력을 지닌 세균입니다. 우리가 음식에 넣는 새콤상큼한 식초를 만드는 데 사용되며, 피로 회복과 살균 소독 작용을 돕습니다.</p>
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
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                    <span className="block text-slate-500 text-[10px] font-semibold">수집 속도</span>
                    <span className="text-emerald-400 font-bold">x{selectedItem.miningSpeed}</span>
                  </div>
                  <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                    <span className="block text-slate-500 text-[10px] font-semibold">용량 한도</span>
                    <span className="text-cyan-400 font-bold">{selectedItem.capacity}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-pulse flex flex-col items-center">
                <span className="text-5xl text-slate-600 mb-4 font-scifi">🔒</span>
                <p className="text-xs text-slate-400 font-bold">아직 발견하지 못한 생물입니다.</p>
                <p className="text-[10px] text-slate-500 mt-2">퀴즈를 풀거나 합성하여 획득해 보세요.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-5xl text-cyan-400/20 mb-4 animate-bounce">🔬</span>
              <p className="text-xs text-slate-400 font-bold">상세 설명을 볼 미생물을</p>
              <p className="text-xs text-slate-500 mt-1">도감 리스트에서 선택해 주세요.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
