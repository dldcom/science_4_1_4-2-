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

const STORAGE_WRITE_DELAY_MS = 500;
const MIN_EXPEDITION_SECONDS = 7;
const RESEARCH_COST = 100;
const INITIAL_BIO_ENERGY = 500;

export default function App() {
  // 1. 핵심 수치 상태 관리
  const [bioEnergy, setBioEnergy] = useState(() => {
    const saved = localStorage.getItem('space_bioEnergy');
    return saved !== null ? JSON.parse(saved) : INITIAL_BIO_ENERGY;
  });
  const [bioEnergyDelta, setBioEnergyDelta] = useState(null); // 차감 애니메이션 상태
  const synthesisTimeoutRef = React.useRef(null);
  const [microbes, setMicrobes] = useState(() => {
    const saved = localStorage.getItem('space_microbes');
    return saved ? JSON.parse(saved) : [];
  });
  const [discoveredNames, setDiscoveredNames] = useState(() => {
    const saved = localStorage.getItem('space_discoveredNames');
    if (saved) return JSON.parse(saved);
    return ['짚신벌레', '버섯', '젖산균', '이스트', '네온 곰팡이', '메가 이스트', '고초균', '누룩곰팡이', '화산 버섯'];
  });

  const [discoveryResult, setDiscoveryResult] = useState(null); // 애니메이션 완료 후 보여줄 팝업 데이터

  const [selectedPlanet, setSelectedPlanet] = useState(null);

  // 1.5. 우주 원정 상태 관리
  const [expeditions, setExpeditions] = useState(() => {
    const saved = localStorage.getItem('space_expeditions');
    if (saved) return JSON.parse(saved);
    const initial = {};
    foodPlanets.forEach(p => {
      initial[p.id] = { status: 'locked', timer: 0 };
    });
    return initial;
  });

  // 로컬 스토리지 저장 (상태 변경 시)
  React.useEffect(() => {
    localStorage.setItem('space_bioEnergy', JSON.stringify(bioEnergy));
  }, [bioEnergy]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      localStorage.setItem('space_microbes', JSON.stringify(microbes));
    }, STORAGE_WRITE_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [microbes]);

  React.useEffect(() => {
    localStorage.setItem('space_discoveredNames', JSON.stringify(discoveredNames));
  }, [discoveredNames]);

  React.useEffect(() => {
    localStorage.setItem('space_expeditions', JSON.stringify(expeditions));
  }, [expeditions]);

  React.useEffect(() => {
    return () => {
      if (synthesisTimeoutRef.current) {
        window.clearTimeout(synthesisTimeoutRef.current);
      }
    };
  }, []);

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
          y: 3000,
          vx: 0,
          vy: 0,
          angle: 0
        };
      }
      return m;
    }));

    setExpeditions(prev => ({
      ...prev,
      [planetId]: { status: 'exploring', timer: Math.max(planet.duration, MIN_EXPEDITION_SECONDS) }
    }));
    
    setActiveModal(null);
  };

  // 3. 탐사 완료 시
  const handleExpeditionComplete = (planetId) => {
    setExpeditions(prev => ({
      ...prev,
      [planetId]: { ...prev[planetId], status: 'complete' }
    }));
  };

  const handleStoryboardClose = () => {
    if (selectedPlanet) {
      const planetId = selectedPlanet.id;
      // 1. 미생물은 소멸하지 않고 계속 행성 주위를 공전합니다!
      
      // 2. 보급선 개통 상태로 전환
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

  // 4. 영토 수용량 설계
  const getMicrobeLimit = () => 20;

  // 5. 퀴즈 성공 시 신규 1티어 생물 소환
  const handleQuizSuccess = (microbeName, targetX, targetY) => {
    const template = baseMicrobes[microbeName];
    if (!template) return;

    // 성운 1~3 중 랜덤 타겟 지정
    const targetNebulaId = [1, 2, 3][Math.floor(Math.random() * 3)];

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

  // 6. 합성 성공 시 두 미생물 융합 소멸 후 변종 탄생 (애니메이션 연출을 위한 상태 처리)
  const handleSynthesizeSuccess = (parentIdA, parentIdB, resultName) => {
    const template = combinedMicrobes[resultName];
    if (!template) return;

    const parentA = microbes.find(m => m.id === parentIdA);
    const parentB = microbes.find(m => m.id === parentIdB);
    if (!parentA || !parentB) return;

    const mergeTargetX = (parentA.x + parentB.x) / 2;
    const mergeTargetY = (parentA.y + parentB.y) / 2;

    setMicrobes(prev => {
      return prev.map(m => {
        if (m.id === parentIdA || m.id === parentIdB) {
          return {
            ...m,
            state: 'merging',
            mergeTargetX,
            mergeTargetY,
            vx: 0,
            vy: 0,
            energyCurrent: 0
          };
        }
        return m;
      });
    });

    // 합성 시 돋보기 포커싱 상태가 해제되도록 안전장치 설정
    if (focusedMicrobe && (focusedMicrobe.id === parentIdA || focusedMicrobe.id === parentIdB)) {
      setFocusedMicrobe(null);
    }

    // 도감 발견 기록 추가
    if (!discoveredNames.includes(resultName)) {
      setDiscoveredNames(prev => [...prev, resultName]);
    }

    setActiveModal(null);

    if (synthesisTimeoutRef.current) {
      window.clearTimeout(synthesisTimeoutRef.current);
    }

    synthesisTimeoutRef.current = window.setTimeout(() => {
      const newMicrobeId = `${Date.now()}-${Math.random()}`;
      setMicrobes(prev => {
        const updated = prev.filter(m => m.id !== parentIdA && m.id !== parentIdB);
        updated.push({
          id: newMicrobeId,
          name: template.name,
          type: template.type,
          tier: template.tier,
          glowColor: template.glowColor,
          miningSpeed: template.miningSpeed,
          capacity: template.capacity,
          avatarSvg: template.avatarSvg,
          x: mergeTargetX,
          y: mergeTargetY,
          vx: 0,
          vy: 0,
          angle: 0,
          state: 'mining',
          energyCurrent: 0,
          energyCapacity: template.capacity,
          speed: template.name === '제트 짚신벌레' ? 2.5 : 1.2
        });
        return updated;
      });
      synthesisTimeoutRef.current = window.setTimeout(() => {
        setDiscoveryResult(template);
        synthesisTimeoutRef.current = null;
      }, 500);
    }, 900);
  };

  // 7. 자원 수확량 누적 함수
  const addBioEnergy = (amount) => {
    setBioEnergy(prev => prev + amount);
  };

  // 연구(퀴즈) 시작 핸들러
  const handleOpenQuiz = () => {
    setActiveModal('quiz');
  };

  const handleSpendResearchCost = () => {
    if (bioEnergy < RESEARCH_COST) {
      setAlertMessage(`연구에 필요한 바이오 에너지가 부족합니다.\n(필요 자원: ${RESEARCH_COST} Bio)`);
      return false;
    }
    setBioEnergy(prev => prev - RESEARCH_COST);
    setBioEnergyDelta({ amount: `-${RESEARCH_COST}`, id: Date.now() });
    return true;
  };

  const handleResetGame = () => {
    if (window.confirm("정말로 모든 데이터를 초기화하고 처음부터 다시 시작하시겠습니까?")) {
      localStorage.removeItem('space_bioEnergy');
      localStorage.removeItem('space_microbes');
      localStorage.removeItem('space_discoveredNames');
      localStorage.removeItem('space_expeditions');
      window.location.reload();
    }
  };

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden text-slate-100 font-mono select-none bg-[#020208]">
        
        {/* 1. 배경 우주 캔버스 (카메라 스크롤을 포함한 게임 필드) */}
        <SpaceCanvas
          microbes={microbes}
          setMicrobes={setMicrobes}
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
            <div className="relative">
              <span className="text-sm text-[#adb5bd] block font-bold leading-none mb-1 font-pixel tracking-wider">BIO-ENERGY</span>
              <span className="text-3xl font-bold font-sans text-[#343a40] leading-none">
                {Math.floor(bioEnergy)} <span className="text-base font-bold text-[#6c757d]">Bio</span>
              </span>
              
              {/* Bio 차감 애니메이션 */}
              {bioEnergyDelta && (
                <div 
                  key={bioEnergyDelta.id}
                  className="absolute left-1/2 -top-4 -translate-x-1/2 text-red-500 font-bold text-2xl font-pixel drop-shadow-lg animate-fadeUp pointer-events-none whitespace-nowrap"
                  onAnimationEnd={() => setBioEnergyDelta(null)}
                >
                  {bioEnergyDelta.amount}
                </div>
              )}
            </div>
            <div className="h-10 w-[2px] bg-[#dee2e6]" />
            <div>
              <span className="text-sm text-[#adb5bd] block font-bold leading-none mb-1 font-pixel tracking-wider">CAPACITY</span>
              <span className="text-xl font-bold font-sans leading-none">
                <span className="text-[#868e96] font-bold">{microbes.length}</span><span className="text-[#adb5bd]">/</span><span className="text-[#6c757d]">{getMicrobeLimit()}</span>
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleResetGame}
            className="pointer-events-auto px-4 py-2 bg-[#f8f9fa] text-[#adb5bd] border-4 border-[#dee2e6] hover:bg-[#e9ecef] hover:text-[#868e96] active:translate-y-1 rounded-md text-sm font-bold font-pixel cursor-pointer transition-all h-full max-h-[82px] flex items-center shadow-sm"
          >
            다시하기
          </button>
        </div>

        {/* 3. 플로팅 제어 버튼들 (모바일에서 줄바꿈이 되도록 반응형 래핑 패치) */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4 z-10 pointer-events-none max-w-[calc(100vw-32px)]">
          <button
            onClick={handleOpenQuiz}
            className="pointer-events-auto px-6 py-3 pixel-btn-orange text-lg font-bold cursor-pointer"
          >
            연구 ({RESEARCH_COST} Bio)
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
            focusedMicrobe 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-[400px] opacity-0 pointer-events-none'
          }`}
        >
          {focusedMicrobe && (
            <div className="flex flex-col gap-4 text-left">
              {/* 돋보기 상단 타이틀 & 닫기 버튼 */}
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold text-[#343a40] font-sans leading-none">
                  {focusedMicrobe.name}
                </h4>
                <button 
                  onClick={() => setFocusedMicrobe(null)}
                  className="text-xs pixel-btn-gray px-2 py-1"
                >
                  닫기
                </button>
              </div>
              
              {/* 속성 배지 */}
              <div className="flex justify-between items-center">
                <span className="inline-block px-3 py-1 bg-[#e9ecef] border-2 border-[#ced4da] text-xs font-bold text-[#6c757d] rounded-md font-pixel uppercase tracking-wider leading-none">
                  {focusedMicrobe.type}
                </span>
              </div>

              {/* 돋보기 홀로그램 스캐너 (그레이 프레임) */}
              <div className="relative w-full aspect-video bg-[#f8f9fa] border-4 border-[#dee2e6] rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
                <MicrobeIcon name={focusedMicrobe.name} className="w-24 h-24" glowColor={focusedMicrobe.glowColor} />
              </div>

              {/* 생물 설명 (초4 수준 맞춤) */}
              <div className="text-sm text-[#495057] leading-relaxed font-sans max-h-[100px] overflow-y-auto bg-[#f1f3f5] p-3 rounded-lg border-2 border-[#dee2e6] custom-scrollbar">
                <p>{(baseMicrobes[focusedMicrobe.name] || combinedMicrobes[focusedMicrobe.name])?.description}</p>
              </div>

              {/* 속성 바 */}
              <div className="border-t-2 border-[#dee2e6] pt-3 flex flex-col gap-2 text-sm font-pixel">
                <div className="flex justify-between items-center">
                  <span className="text-[#6c757d] font-bold">최대 채집량</span>
                  <span className="text-[#343a40] font-bold text-base">
                    {focusedMicrobe.energyCapacity} bio
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* 3. 모달 팝업 레이어 */}
      <QuizModal
        isOpen={activeModal === 'quiz'}
        onClose={() => setActiveModal(null)}
        onQuizSuccess={handleQuizSuccess}
        onSpendResearchCost={handleSpendResearchCost}
      />

      <Synthesizer
        isOpen={activeModal === 'synth'}
        onClose={() => setActiveModal(null)}
        microbes={microbes}
        onSynthesizeSuccess={handleSynthesizeSuccess}
      />

      {activeModal === 'ency' && (
        <Encyclopedia 
          isOpen={true}
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

      {/* 합성/발견 성공 팝업 (애니메이션 완료 후 표시) */}
      {discoveryResult && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center p-4 z-[100] animate-fade-in backdrop-blur-sm">
          <div className="wood-modal max-w-lg w-full flex flex-col items-center justify-center p-10 rounded-xl shadow-2xl relative border-4 border-[#8b5a2b]">
            {/* 빵빠레 효과 */}
            <div className="w-40 h-40 rounded-full bg-[#f8f9fa] border-8 border-[#dee2e6] flex items-center justify-center shadow-lg mb-6 animate-bounce">
              <MicrobeIcon name={discoveryResult.name} className="w-24 h-24" glowColor={discoveryResult.glowColor} />
            </div>
            
            <span className="text-sm font-pixel font-bold text-[#868e96] uppercase tracking-widest mb-2 bg-[#e9ecef] px-3 py-1 rounded-md border-2 border-[#dee2e6]">
              SYNTHESIS SUCCESS!
            </span>
            <h3 className="text-3xl font-bold text-[#212529] font-sans mb-4">
              [{discoveryResult.name}] 발견!
            </h3>
            
            <p className="text-center text-[#495057] text-base mb-8 leading-relaxed font-bold bg-[#f8f9fa] p-4 rounded-lg border-2 border-[#dee2e6] w-full">
              {discoveryResult.description}
            </p>

            <button
              onClick={() => setDiscoveryResult(null)}
              className="px-8 py-3 pixel-btn-gray rounded-xl text-xl font-bold cursor-pointer transition-all shadow-lg w-full max-w-xs"
            >
              확인
            </button>
          </div>
        </div>
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
                  {alertMessage.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < alertMessage.split('\n').length - 1 && <br />}
                    </span>
                  ))}
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
