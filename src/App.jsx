import React, { useState } from 'react';
import SpaceCanvas from './components/SpaceCanvas';
import QuizModal from './components/QuizModal';
import Synthesizer from './components/Synthesizer';
import Encyclopedia from './components/Encyclopedia';
import { baseMicrobes, combinedMicrobes } from './utils/recipes';

export default function App() {
  // 1. 핵심 수치 상태 관리
  const [bioEnergy, setBioEnergy] = useState(10); // 초기 자원
  const [sectors, setSectors] = useState(1); // 해금된 영토 단계 (1 ~ 3)
  const [microbes, setMicrobes] = useState([]); // 우주에 존재하는 실시간 생물체들
  const [discoveredNames, setDiscoveredNames] = useState([]); // 도감에 발견 처리된 미생물 목록

  // 2. 모달 및 팝업 상태 관리
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSynthOpen, setIsSynthOpen] = useState(false);
  const [isEncyOpen, setIsEncyOpen] = useState(false);

  // 3. 돋보기 관찰 상태 관리
  const [focusedMicrobe, setFocusedMicrobe] = useState(null);

  // 4. 영토 수용량 설계
  const getMicrobeLimit = () => {
    if (sectors === 1) return 6;
    if (sectors === 2) return 12;
    return 20; // 3단계
  };

  const getUpgradeCost = () => {
    if (sectors === 1) return 150;
    if (sectors === 2) return 400;
    return 0; // 이미 최고 단계
  };

  // 5. 퀴즈 성공 시 신규 1티어 미생물 소환
  const handleQuizSuccess = (microbeName) => {
    const limit = getMicrobeLimit();
    if (microbes.length >= limit) {
      alert(`[우주 용량 초과] 현재 구역의 수용한도(${limit}마리)가 가득 찼습니다. 바이오 에너지를 모아 우주 영토를 확장해 주세요!`);
      return;
    }

    const template = baseMicrobes[microbeName];
    if (!template) return;

    // 성운 1~3 중 현재 해금된 것 중 랜덤 타겟 지정
    const unlockedNebulas = [1];
    if (sectors >= 2) unlockedNebulas.push(2);
    if (sectors >= 3) unlockedNebulas.push(3);
    const targetNebulaId = unlockedNebulas[Math.floor(Math.random() * unlockedNebulas.length)];

    const newMicrobe = {
      id: `${Date.now()}-${Math.random()}`,
      name: template.name,
      type: template.type,
      tier: template.tier,
      glowColor: template.glowColor,
      miningSpeed: template.miningSpeed,
      capacity: template.capacity,
      avatarSvg: template.avatarSvg,
      // 우주 소환 위치 (중앙 수집기 포탈에서 뿅 하고 튀어나오게 설정)
      x: 500 + (Math.random() - 0.5) * 20,
      y: 380 + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      state: 'mining',
      energyCurrent: 0,
      energyCapacity: template.capacity,
      speed: template.name === '짚신벌레' ? 1.4 : template.name === '아메바' ? 0.7 : 1.0,
      targetNebulaId: targetNebulaId
    };

    setMicrobes(prev => [...prev, newMicrobe]);
    
    // 도감 발견 기록에 추가
    if (!discoveredNames.includes(microbeName)) {
      setDiscoveredNames(prev => [...prev, microbeName]);
    }
  };

  // 6. 합성 성공 시 두 미생물 융합 소멸 후 변종 탄생
  const handleSynthesizeSuccess = (parentIdA, parentIdB, resultName) => {
    const template = combinedMicrobes[resultName];
    if (!template) return;

    // 1~3 성운 중 랜덤 타겟 지정
    const unlockedNebulas = [1];
    if (sectors >= 2) unlockedNebulas.push(2);
    if (sectors >= 3) unlockedNebulas.push(3);
    const targetNebulaId = unlockedNebulas[Math.floor(Math.random() * unlockedNebulas.length)];

    setMicrobes(prev => {
      // 부모 생물 2개 제외 필터링
      const filtered = prev.filter(m => m.id !== parentIdA && m.id !== parentIdB);
      
      const newMicrobe = {
        id: `${Date.now()}-${Math.random()}`,
        name: template.name,
        type: template.type,
        tier: template.tier,
        glowColor: template.glowColor,
        miningSpeed: template.miningSpeed,
        capacity: template.capacity,
        avatarSvg: template.avatarSvg,
        x: 500, // 포탈 중심에서 소환
        y: 380,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        state: 'mining',
        energyCurrent: 0,
        energyCapacity: template.capacity,
        speed: template.name === '제트 짚신벌레' ? 2.5 : 1.2,
        targetNebulaId: targetNebulaId
      };

      return [...filtered, newMicrobe];
    });

    // 합성 시 돋보기 포커싱 상태가 해제되도록 안전장치 설정
    if (focusedMicrobe && (focusedMicrobe.id === parentIdA || focusedMicrobe.id === parentIdB)) {
      setFocusedMicrobe(null);
    }

    // 도감 발견 기록 추가
    if (!discoveredNames.includes(resultName)) {
      setDiscoveredNames(prev => [...prev, resultName]);
    }
  };

  // 7. 자원 수확량 누적 함수
  const addBioEnergy = (amount) => {
    setBioEnergy(prev => prev + amount);
  };

  // 8. 우주 영토 확장(업그레이드) 함수
  const handleExpandSector = () => {
    const cost = getUpgradeCost();
    if (cost === 0) return;

    if (bioEnergy < cost) {
      alert(`바이오 에너지가 부족합니다. (필요 자원: ${cost} Bio)`);
      return;
    }

    setBioEnergy(prev => prev - cost);
    setSectors(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-100 font-mono select-none">
      
      {/* 1. 상단 HUD 인터페이스 */}
      <header className="flex justify-between items-center p-4 bg-slate-950/80 border-b border-cyan-500/20 backdrop-blur-md rounded-b-2xl shadow-lg z-20">
        {/* 자원 현황 */}
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl animate-pulse">🌌</span>
            <div>
              <span className="text-[10px] text-slate-500 block">COSMIC BIO-ENERGY</span>
              <span className="text-2xl font-black text-cyan-400 glow-text-cyan">
                {bioEnergy} <span className="text-sm font-normal text-cyan-600">Bio</span>
              </span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-slate-800" />
          
          {/* 수용 한도 및 배치수 */}
          <div>
            <span className="text-[10px] text-slate-500 block">생물 수용량</span>
            <span className="text-sm font-bold">
              <span className="text-fuchsia-400">{microbes.length}</span> / {getMicrobeLimit()} <span className="text-xs text-slate-400">마리</span>
            </span>
          </div>
        </div>

        {/* 구역 단계 및 영토 확장 버튼 */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">우주 개척 등급</span>
            <span className="text-sm font-bold text-emerald-400 glow-text-emerald">SECTOR 0{sectors}</span>
          </div>

          {sectors < 3 ? (
            <button
              onClick={handleExpandSector}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all hover:scale-105 flex flex-col items-center"
            >
              <span>우주 영토 확장</span>
              <span className="text-[10px] opacity-80">(소모: {getUpgradeCost()} Bio)</span>
            </button>
          ) : (
            <div className="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-500 font-bold text-xs rounded-xl">
              최대 개척 완료
            </div>
          )}
        </div>
      </header>

      {/* 2. 메인 콘텐츠 (Canvas + 우측 컨트롤 패널) */}
      <main className="flex-1 flex gap-6 p-4 items-stretch justify-center relative overflow-hidden">
        {/* Canvas 게임 화면 */}
        <div className="relative">
          <SpaceCanvas
            microbes={microbes}
            setMicrobes={setMicrobes}
            sectors={sectors}
            addBioEnergy={addBioEnergy}
            focusedMicrobe={focusedMicrobe}
            setFocusedMicrobe={setFocusedMicrobe}
          />
        </div>

        {/* 우측 사이드 패널 (작업 및 정밀 분석 돋보기) */}
        <div className="w-[300px] flex flex-col gap-4">
          {/* 제어 버튼 패널 */}
          <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-5 flex flex-col gap-3.5 shadow-lg backdrop-blur-md">
            <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 font-mono">연구 통제실</h3>
            
            <button
              onClick={() => setIsQuizOpen(true)}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 border border-cyan-400/30 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/10 transition-all hover:scale-103 font-mono flex items-center justify-center gap-2"
            >
              🔬 생명 연구 (퀴즈)
            </button>
            
            <button
              onClick={() => setIsSynthOpen(true)}
              className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 border border-fuchsia-400/30 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-600/10 transition-all hover:scale-103 font-mono flex items-center justify-center gap-2"
            >
              🧬 생명 합성 (조합)
            </button>
            
            <button
              onClick={() => setIsEncyOpen(true)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/30 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/10 transition-all hover:scale-103 font-mono flex items-center justify-center gap-2"
            >
              📖 생물 도감 카드
            </button>
          </div>

          {/* 돋보기 관찰 정밀 모니터 (Focus Panel) */}
          <div className="flex-1 bg-slate-950/80 border border-slate-850 rounded-2xl p-5 flex flex-col shadow-lg backdrop-blur-md relative min-h-[300px]">
            <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 font-mono">성간 현미경 돋보기</h3>
            
            {focusedMicrobe ? (
              <div className="flex-1 flex flex-col justify-between animate-fade-in">
                {/* 돋보기 확대 뷰 모니터 */}
                <div className="relative w-full aspect-video bg-slate-950 border border-slate-850 rounded-xl overflow-hidden flex items-center justify-center mb-4">
                  {/* 스캐너 크로스 라인 */}
                  <div className="absolute inset-0 border-t border-b border-cyan-500/10 pointer-events-none top-1/2 -translate-y-1/2"></div>
                  <div className="absolute inset-0 border-l border-r border-cyan-500/10 pointer-events-none left-1/2 -translate-x-1/2"></div>
                  
                  {/* 정밀 홀로그램 렌더링 */}
                  <div className="text-center animate-pulse">
                    <span 
                      className="text-7xl block mb-2 filter drop-shadow-[0_0_12px_var(--glow)]"
                      style={{ '--glow': focusedMicrobe.glowColor }}
                    >
                      {focusedMicrobe.name === '버섯' && '🍄'}
                      {focusedMicrobe.name === '곰팡이' && '🦠'}
                      {focusedMicrobe.name === '짚신벌레' && '🥿'}
                      {focusedMicrobe.name === '아메바' && '🧬'}
                      {focusedMicrobe.name === '해캄' && '🌿'}
                      {focusedMicrobe.name === '대장균' && '🧪'}
                      {focusedMicrobe.name === '젖산균' && '🥛'}
                      {focusedMicrobe.name === '화산 버섯' && '🌋'}
                      {focusedMicrobe.name === '네온 곰팡이' && '💎'}
                      {focusedMicrobe.name === '포자버섯 젤리' && '🔮'}
                      {focusedMicrobe.name === '제트 짚신벌레' && '🚀'}
                      {focusedMicrobe.name === '블랙홀 아메바' && '🌀'}
                      {focusedMicrobe.name === '우주 태양 아메바' && '☀'}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
                      SCANNING DATA...
                    </span>
                  </div>
                </div>

                {/* 관찰 정보 */}
                <div className="flex-1 text-left flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1 font-mono">
                      {focusedMicrobe.name}
                    </h4>
                    <span className="inline-block px-2 py-0.5 bg-slate-900 border border-slate-800 text-[9px] font-bold text-cyan-400 rounded-full font-mono mb-3 uppercase tracking-wider">
                      {focusedMicrobe.type} (T-{focusedMicrobe.tier})
                    </span>
                    
                    {/* 교과서 구조 고증 텍스트 */}
                    <div className="text-xs text-slate-400 leading-relaxed font-sans max-h-[140px] overflow-y-auto bg-slate-900/40 p-3 rounded-lg border border-slate-900">
                      {focusedMicrobe.name === '버섯' && (
                        <p>🍄 <strong>구조 관찰:</strong> 버섯의 자루 위에는 넓게 펼쳐진 '갓'이 존재하며, 갓 아래의 미세한 주름 틈새에서 번식을 돕는 '포자(홀씨)' 가루가 생성되어 방출됩니다.</p>
                      )}
                      {focusedMicrobe.name === '곰팡이' && (
                        <p>🦠 <strong>구조 관찰:</strong> 하얗게 퍼지는 '균사(실 구조)' 끝에 아주 작은 공 모양의 '포자낭'들이 맺혀 있는 모습을 돋보기로 선명하게 볼 수 있습니다.</p>
                      )}
                      {focusedMicrobe.name === '짚신벌레' && (
                        <p>🥿 <strong>구조 관찰:</strong> 몸 바깥쪽 테두리에 수많은 실 모양의 '섬모'가 촘촘히 돋아나 있으며, 이것을 조화롭게 저어 앞으로 미끄러지듯 이동합니다.</p>
                      )}
                      {focusedMicrobe.name === '아메바' && (
                        <p>🧬 <strong>구조 관찰:</strong> 세포의 특정한 앞뒤 구분이 없고, 몸의 일부분을 길쭉하게 내민 '위족'을 사용하여 액체 속을 움직입니다.</p>
                      )}
                      {focusedMicrobe.name === '해캄' && (
                        <p>🌿 <strong>구조 관찰:</strong> 긴 기둥형 세포 마디들 내부에 아주 예쁘게 꼬여서 이어지는 실 모양의 녹색 '나선형 엽록체'가 관찰됩니다.</p>
                      )}
                      {focusedMicrobe.name === '대장균' && (
                        <p>🧪 <strong>구조 관찰:</strong> 긴 꼬리처럼 흔들리는 '편모'가 달려 있어 회전 구동을 통해 액체 배지 속에서 추력을 얻는 모습을 보여줍니다.</p>
                      )}
                      {focusedMicrobe.name === '젖산균' && (
                        <p>🥛 <strong>구조 관찰:</strong> 미세한 알갱이 구슬 여러 개가 쇠사슬 형태로 조밀하게 연결되어 뭉쳐 있는 '구균' 형태의 젖산균 사슬입니다.</p>
                      )}
                      {focusedMicrobe.tier > 1 && (
                        <p>🌌 <strong>변종 관찰:</strong> 원래 생물들의 고유 메커니즘인 포자 살포, 섬모 추진, 위족 변형 등의 특징이 우주의 성간 물질과 융합하여 한층 더 화려하게 강화되었습니다.</p>
                      )}
                    </div>
                  </div>
                  
                  {/* 채굴 속성 바 */}
                  <div className="mt-3 border-t border-slate-900 pt-3 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500">배달 에너지</span>
                    <span className="text-cyan-400 font-bold">
                      {Math.round(focusedMicrobe.energyCurrent)} / {focusedMicrobe.energyCapacity}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 font-mono">
                <span className="text-4xl block mb-2">🔭</span>
                <p className="text-xs">우주 공간을 떠다니는</p>
                <p className="text-xs">미생물을 터치하면</p>
                <p className="text-xs">상세 관찰이 작동합니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. 모달 팝업 레이어 */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onQuizSuccess={handleQuizSuccess}
      />

      <Synthesizer
        isOpen={isSynthOpen}
        onClose={() => setIsSynthOpen(false)}
        microbes={microbes}
        onSynthesizeSuccess={handleSynthesizeSuccess}
      />

      <Encyclopedia
        isOpen={isEncyOpen}
        onClose={() => setIsEncyOpen(false)}
        discoveredNames={discoveredNames}
      />
    </div>
  );
}
