import React, { useState } from 'react';
import SpaceCanvas from './components/SpaceCanvas';
import QuizModal from './components/QuizModal';
import Synthesizer from './components/Synthesizer';
import Encyclopedia from './components/Encyclopedia';
import StoryboardModal from './components/StoryboardModal';
import ExpeditionStartModal from './components/ExpeditionStartModal';
import { baseMicrobes, combinedMicrobes, microbeEmojis } from './utils/recipes';
import { foodPlanets } from './utils/expeditions';
import { MicrobeIcon } from './components/VectorIcons';

export default function App() {
  // 1. 핵심 수치 상태 관리
  const [bioEnergy, setBioEnergy] = useState(0); // 초기 자원
  const [sectors, setSectors] = useState(1); // 해금된 영토 단계 (기본 1등급 시작)
  const [microbes, setMicrobes] = useState(() => {
    const initialList = [];
    const namesToSpawn = ['짚신벌레', '버섯', '젖산균']; // 초기 지급 미생물
    namesToSpawn.forEach((name, idx) => {
      const template = baseMicrobes[name] || combinedMicrobes[name];
      if (template) {
        initialList.push({
          id: `init-${idx}-${Math.random()}`,
          name: template.name,
          type: template.type,
          tier: template.tier,
          glowColor: template.glowColor,
          miningSpeed: template.miningSpeed,
          capacity: template.capacity,
          avatarSvg: template.avatarSvg,
          x: 4000 + (Math.random() - 0.5) * 100,
          y: 3000 + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          state: 'mining',
          energyCurrent: 0,
          energyCapacity: template.capacity,
          speed: template.name === '제트 짚신벌레' ? 2.5 : template.name === '짚신벌레' ? 1.4 : template.name === '아메바' ? 0.7 : 1.0,
          targetNebulaId: 1 + (idx % 3)
        });
      }
    });
    return initialList;
  });
  const [discoveredNames, setDiscoveredNames] = useState([
    '짚신벌레', '버섯', '젖산균'
  ]); // 도감에 발견 처리된 미생물 목록

  const [selectedPlanet, setSelectedPlanet] = useState(null);

  // 1.5. 우주 원정 상태 관리
  const [expeditions, setExpeditions] = useState(() => {
    const initial = {};
    foodPlanets.forEach(p => {
      initial[p.id] = { status: 'locked', timer: 0 };
    });
    return initial;
  });

  // 1초 단위 타이머 tick으로 원정 시간 단축 처리
  React.useEffect(() => {
    const interval = setInterval(() => {
      setExpeditions(prev => {
        const next = { ...prev };
        let updated = false;
        Object.keys(next).forEach(planetId => {
          const exp = next[planetId];
          if (exp.status === 'exploring') {
            const nextTimer = exp.timer - 1;
            if (nextTimer <= 0) {
              next[planetId] = { ...exp, status: 'complete', timer: 0 };
              handleExpeditionComplete(planetId);
            } else {
              next[planetId] = { ...exp, timer: nextTimer };
            }
            updated = true;
          }
        });
        return updated ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePlanetClick = (planetId) => {
    const planet = foodPlanets.find(p => p.id === planetId);
    if (!planet) return;
    
    const exp = expeditions[planetId];
    if (exp) {
      if (exp.status === 'exploring') {
        // 탐사 진행 중 클릭 시 아무 작업 안함 (또는 알림)
      } else if (exp.status === 'complete') {
        setSelectedPlanet(planet);
        setActiveModal('storyboard');
      } else if (exp.status === 'supplying') {
        setAlertMessage(`${planet.name}에서 물자가 안정적으로 공급되고 있습니다!`);
      } else if (exp.status === 'locked') {
        // 탐사 전 (locked)
        setSelectedPlanet(planet);
        setActiveModal('expeditionStart');
      }
    }
  };

  // 2. 탐사 시작 처리
  const handleStartExpedition = (planetId, microbeId) => {
    const planet = foodPlanets.find(p => p.id === planetId);

    setMicrobes(prev => prev.map(m => {
      if (m.id === microbeId) {
        return { 
          ...m, 
          state: 'expedition', 
          targetPlanetId: planetId,
          x: 4000,
          y: 3000
        };
      }
      return m;
    }));

    setExpeditions(prev => ({
      ...prev,
      [planetId]: { status: 'exploring', timer: planet.duration }
    }));
    
    setActiveModal(null);
  };

  // 3. 탐사 완료 시
  const handleExpeditionComplete = (planetId) => {
    setExpeditions(prev => ({
      ...prev,
      [planetId]: { ...prev[planetId], status: 'complete' }
    }));
    
    // 탐사를 완료하자마자 바로 스토리보드 모달 띄우기
    const planet = foodPlanets.find(p => p.id === planetId);
    if (planet) {
      setSelectedPlanet(planet);
      setActiveModal('storyboard');
    }
  };

  const handleStoryboardClose = () => {
    if (selectedPlanet) {
      const planetId = selectedPlanet.id;
      // 1. 미생물을 배양조로 복귀
      setMicrobes(prev => prev.map(m => {
        if (m.state === 'expedition' && m.targetPlanetId === planetId) {
          return {
            ...m,
            state: 'returning',
            targetPlanetId: null,
            targetX: 4000,
            targetY: 3000
          };
        }
        return m;
      }));
      // 2. 행성을 보급 상태로 전환
      setExpeditions(prev => ({
        ...prev,
        [planetId]: { ...prev[planetId], status: 'supplying' }
      }));
      
      setTimeout(() => {
        setAlertMessage(`'${selectedPlanet.name.split('(')[0].trim()}' 탐사완료!`);
      }, 100);
    }
    setActiveModal(null);
    setSelectedPlanet(null);
  };

  // 2. 모달 및 팝업 상태 관리 (단일 상태 관리로 중복 열기 원천 방지)
  const [activeModal, setActiveModal] = useState(null); // 'quiz' | 'synth' | 'ency' | 'storyboard' | 'expeditionStart' | null
  const [alertMessage, setAlertMessage] = useState(''); // 커스텀 알림창 상태

  // 3. 돋보기 관찰 상태 관리
  const [focusedMicrobe, setFocusedMicrobe] = useState(null);

  // 실시간으로 변하는 물리/자원 값을 반영하기 위해 전체 리스트에서 찾아서 매핑
  const liveFocusedMicrobe = focusedMicrobe 
    ? (microbes.find(m => m.id === focusedMicrobe.id) || focusedMicrobe)
    : null;

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
  const handleQuizSuccess = (microbeName, targetX, targetY) => {
    const limit = getMicrobeLimit();
    if (microbes.length >= limit) {
      setAlertMessage(`[배양 용량 초과] 최대 한도(${limit}마리)에 도달했습니다. 영토 확장이나 합성을 통해 공간을 확보해 주세요!`);
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
      // 퀴즈 모달에서 지정한 타겟 좌표가 있으면 사용하고, 아니면 랜덤 좌표 생성
      x: targetX !== undefined ? targetX : 4000 + (Math.random() - 0.5) * 240,
      y: targetY !== undefined ? targetY : 3000 + (Math.random() - 0.5) * 240,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
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
        x: 4000 + (Math.random() - 0.5) * 240, // ±120px 범위로 골고루 분산 소환
        y: 3000 + (Math.random() - 0.5) * 240,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
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
      setAlertMessage(`바이오 에너지가 부족합니다. (필요 자원: ${cost} Bio)`);
      return;
    }

    setBioEnergy(prev => prev - cost);
    setSectors(prev => prev + 1);
  };

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden text-slate-100 font-mono select-none bg-[#020208]">
        
        {/* 1. 배경 우주 캔버스 (카메라 스크롤을 포함한 게임 필드) */}
        <SpaceCanvas
          microbes={microbes}
          setMicrobes={setMicrobes}
          sectors={sectors}
          addBioEnergy={addBioEnergy}
          focusedMicrobe={focusedMicrobe}
          setFocusedMicrobe={setFocusedMicrobe}
          expeditions={expeditions}
          onPlanetClick={handlePlanetClick}
        />

        {/* 2. 맵 위에 플로팅되는 최소형 HUD (모바일 스택 대응) */}
        <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row gap-2.5 justify-between items-center sm:items-start pointer-events-none z-10 select-none">
          {/* 좌측 자원 현황 (그레이 패널) */}
          <div className="flex gap-4 items-center wood-panel p-4 backdrop-blur-md pointer-events-auto">
            <div>
              <span className="text-sm text-[#adb5bd] block font-bold leading-none mb-1 font-pixel tracking-wider">BIO-ENERGY</span>
              <span className="text-3xl font-bold font-sans text-[#343a40] leading-none">
                {bioEnergy} <span className="text-base font-bold text-[#6c757d]">Bio</span>
              </span>
            </div>
            <div className="h-10 w-[2px] bg-[#dee2e6]" />
            <div>
              <span className="text-sm text-[#adb5bd] block font-bold leading-none mb-1 font-pixel tracking-wider">CAPACITY</span>
              <span className="text-xl font-bold font-sans leading-none">
                <span className="text-[#868e96] font-bold">{microbes.length}</span><span className="text-[#adb5bd]">/</span><span className="text-[#6c757d]">{getMicrobeLimit()}</span>
              </span>
            </div>
          </div>

          {/* 우측 개척 레벨 및 영토 확장 버튼 */}
          <div className="flex items-center gap-4 wood-panel p-3 backdrop-blur-md pointer-events-auto">
            <div className="text-right">
              <span className="text-sm text-[#adb5bd] block font-bold leading-none mb-1 font-pixel tracking-wider">SECTOR GRADE</span>
              <span className="text-base font-bold text-[#868e96] font-sans">SECTOR 0{sectors}</span>
            </div>
            {sectors < 3 ? (
              <button
                onClick={handleExpandSector}
                className="px-4 py-2 pixel-btn-green text-sm font-bold cursor-pointer"
              >
                EXPAND ({getUpgradeCost()} Bio)
              </button>
            ) : (
              <span className="px-4 py-2 bg-[#e9ecef] text-[#495057] font-bold text-sm rounded-md border-2 border-[#ced4da] font-pixel tracking-wider">MAX GRADE</span>
            )}
          </div>
        </div>

        {/* 3. 플로팅 제어 버튼들 (모바일에서 줄바꿈이 되도록 반응형 래핑 패치) */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4 z-10 pointer-events-none max-w-[calc(100vw-32px)]">
          <button
            onClick={() => setActiveModal('quiz')}
            className="pointer-events-auto px-6 py-3 pixel-btn-orange text-lg font-bold cursor-pointer"
          >
            연구 (퀴즈)
          </button>
          <button
            onClick={() => setActiveModal('synth')}
            className="pointer-events-auto px-6 py-3 pixel-btn-green text-lg font-bold cursor-pointer"
          >
            합성 (조합)
          </button>
          <button
            onClick={() => setActiveModal('ency')}
            className="pointer-events-auto px-6 py-3 pixel-btn-gray text-lg font-bold cursor-pointer"
          >
            도감 카드
          </button>
        </div>

        {/* 4. 슬라이딩 돋보기 모니터 (우측 하단 - 관찰 중일 때만 스르륵 나타남) */}
        <div 
          className={`absolute bottom-24 right-6 w-[340px] wood-panel p-5 z-10 transition-all duration-300 ${
            liveFocusedMicrobe 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-[400px] opacity-0 pointer-events-none'
          }`}
        >
          {liveFocusedMicrobe && (
            <div className="flex flex-col gap-4 text-left">
              {/* 돋보기 상단 타이틀 & 닫기 버튼 */}
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold text-[#343a40] font-sans leading-none">
                  {liveFocusedMicrobe.name}
                </h4>
                <button 
                  onClick={() => setFocusedMicrobe(null)}
                  className="text-xs pixel-btn-gray px-2 py-1"
                >
                  닫기
                </button>
              </div>
              
              {/* 스펙 라벨 */}
              <div className="flex justify-between items-center">
                <span className="inline-block px-3 py-1 bg-[#e9ecef] border-2 border-[#ced4da] text-xs font-bold text-[#6c757d] rounded-md font-pixel uppercase tracking-wider leading-none">
                  {liveFocusedMicrobe.type} (T-{liveFocusedMicrobe.tier})
                </span>
              </div>

              {/* 돋보기 홀로그램 스캐너 (그레이 프레임) */}
              <div className="relative w-full aspect-video bg-[#f8f9fa] border-4 border-[#dee2e6] rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
                <MicrobeIcon name={liveFocusedMicrobe.name} className="w-24 h-24" glowColor={liveFocusedMicrobe.glowColor} />
              </div>

              {/* 생물 설명 (초4 수준 맞춤) */}
              <div className="text-sm text-[#495057] leading-relaxed font-sans max-h-[100px] overflow-y-auto bg-[#f1f3f5] p-3 rounded-lg border-2 border-[#dee2e6] custom-scrollbar">
                <p>{(baseMicrobes[liveFocusedMicrobe.name] || combinedMicrobes[liveFocusedMicrobe.name])?.description}</p>
              </div>

              {/* 속성 바 */}
              <div className="border-t-2 border-[#dee2e6] pt-3 flex justify-between items-center text-sm font-pixel">
                <span className="text-[#6c757d] font-bold">채집 에너지</span>
                <span className="text-[#343a40] font-bold text-base">
                  {Math.round(liveFocusedMicrobe.energyCurrent)} / {liveFocusedMicrobe.energyCapacity}
                </span>
              </div>
            </div>
          )}
        </div>

      {/* 3. 모달 팝업 레이어 */}
      <QuizModal
        isOpen={activeModal === 'quiz'}
        onClose={() => setActiveModal(null)}
        onQuizSuccess={handleQuizSuccess}
      />

      <Synthesizer
        isOpen={activeModal === 'synth'}
        onClose={() => setActiveModal(null)}
        microbes={microbes}
        onSynthesizeSuccess={handleSynthesizeSuccess}
      />

      {activeModal === 'ency' && (
        <Encyclopedia 
          microbes={microbes} 
          discoveredNames={discoveredNames}
          onClose={() => setActiveModal(null)} 
        />
      )}

      {activeModal === 'storyboard' && selectedPlanet && (
        <StoryboardModal 
          planet={selectedPlanet} 
          onClose={handleStoryboardClose}
        />
      )}

      {activeModal === 'expeditionStart' && selectedPlanet && (
        <ExpeditionStartModal
          planet={selectedPlanet}
          microbes={microbes}
          onClose={() => setActiveModal(null)}
          onStart={handleStartExpedition}
        />
      )}

      {/* 커스텀 알림창 (alert 대체) */}
      {alertMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="wood-modal max-w-sm w-full animate-in fade-in zoom-in duration-200 overflow-hidden shadow-2xl">
            {/* Body */}
            <div className="p-6 sm:p-8 bg-[#f8f9fa] flex flex-col items-center">
              <div className="bg-white border-4 border-[#dee2e6] rounded-xl p-5 sm:p-6 w-full shadow-inner mb-6 relative">
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#e9ecef]"></div>
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e9ecef]"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#e9ecef]"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#e9ecef]"></div>
                <p className="text-[#495057] text-lg sm:text-xl font-bold font-sans text-center whitespace-pre-wrap leading-relaxed break-keep">
                  {alertMessage}
                </p>
              </div>
              
              <button
                onClick={() => setAlertMessage('')}
                className="px-10 py-3 pixel-btn-gray rounded-xl text-xl font-bold cursor-pointer transition-all shadow-lg active:scale-95"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
