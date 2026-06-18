import React, { useState } from 'react';
import SpaceCanvas from './components/SpaceCanvas';
import QuizModal from './components/QuizModal';
import Synthesizer from './components/Synthesizer';
import Encyclopedia from './components/Encyclopedia';
import ExpeditionModal from './components/ExpeditionModal';
import LaunchAnimation from './components/LaunchAnimation';
import { baseMicrobes, combinedMicrobes, microbeEmojis } from './utils/recipes';
import { foodPlanets } from './utils/expeditions';
import { MicrobeIcon } from './components/VectorIcons';

export default function App() {
  // 1. 핵심 수치 상태 관리
  const [bioEnergy, setBioEnergy] = useState(1000); // 초기 자원 (테스트용 넉넉히 제공)
  const [sectors, setSectors] = useState(3); // 해금된 영토 단계 (테스트용으로 3등급 시작)
  const [microbes, setMicrobes] = useState(() => {
    const initialList = [];
    const namesToSpawn = ['젖산균', '이스트', '네온 곰팡이', '고초균', '누룩곰팡이', '아세트산균', '화산 버섯', '메가 이스트'];
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
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
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
    '젖산균', '이스트', '네온 곰팡이', '고초균', '누룩곰팡이', '아세트산균', '화산 버섯', '메가 이스트'
  ]); // 도감에 발견 처리된 미생물 목록

  // 1.2. 발사 연출 상태
  const [launchingPlanetId, setLaunchingPlanetId] = useState(null);
  const [selectedPlanetId, setSelectedPlanetId] = useState(null);

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
      // 발사 연출(우주선 날아가는 3초) 동안에는 원정 타이머가 흘러가지 않도록 일시정지 제어
      if (launchingPlanetId) return;

      setExpeditions(prev => {
        const next = { ...prev };
        let updated = false;
        Object.keys(next).forEach(planetId => {
          const exp = next[planetId];
          if (exp.status === 'exploring') {
            const nextTimer = exp.timer - 1;
            if (nextTimer <= 0) {
              next[planetId] = { ...exp, status: 'complete', timer: 0 };
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
  }, [launchingPlanetId]);

  const startExpedition = (planetId, microbeId) => {
    const planet = foodPlanets.find(p => p.id === planetId);
    if (!planet) return;

    // 발사 연출 트리거
    setLaunchingPlanetId(planetId);

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
  };

  const completeExpedition = (planetId) => {
    setMicrobes(prev => prev.map(m => {
      if (m.state === 'expedition' && m.targetPlanetId === planetId) {
        return {
          ...m,
          state: 'mining',
          x: 4000,
          y: 3000,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          targetPlanetId: null
        };
      }
      return m;
    }));

    setExpeditions(prev => ({
      ...prev,
      [planetId]: { status: 'supplying', timer: 0 }
    }));
  };

  const handlePlanetClick = (planetId) => {
    setSelectedPlanetId(planetId);
    setActiveModal('expedition');
  };

  const handleLaunchComplete = () => {
    setLaunchingPlanetId(null);
  };

  // 2. 모달 및 팝업 상태 관리 (단일 상태 관리로 중복 열기 원천 방지)
  const [activeModal, setActiveModal] = useState(null); // 'quiz' | 'synth' | 'ency' | 'expedition' | null

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
      // 우주 소환 위치 (중앙 수집기 포탈(2000, 1500)에서 뿅 하고 튀어나오게 설정)
      x: 4000 + (Math.random() - 0.5) * 20,
      y: 3000 + (Math.random() - 0.5) * 20,
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
        x: 4000, // 포탈 중심에서 소환
        y: 3000,
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
          {/* 좌측 자원 현황 (유리모프 글래스 캡슐) */}
          <div className="flex gap-4 items-center bg-slate-950/75 border border-cyan-500/30 p-3 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.1)] pointer-events-auto text-slate-100">
            <span className="text-2xl animate-pulse text-cyan-400">🌌</span>
            <div>
              <span className="text-[9px] text-cyan-300/80 block font-semibold leading-none mb-1 font-scifi tracking-widest">COSMIC BIO-ENERGY</span>
              <span className="text-xl font-bold font-mono text-amber-400 leading-none glow-text-cyan">
                {bioEnergy} <span className="text-xs font-normal text-slate-400">Bio</span>
              </span>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div>
              <span className="text-[9px] text-cyan-300/80 block font-semibold leading-none mb-1 font-scifi tracking-widest">CAPACITY</span>
              <span className="text-sm font-bold font-mono leading-none">
                <span className="text-fuchsia-400 font-bold">{microbes.length}</span><span className="text-slate-500">/</span><span className="text-slate-300">{getMicrobeLimit()}</span>
              </span>
            </div>
          </div>

          {/* 우측 개척 레벨 및 영토 확장 버튼 */}
          <div className="flex items-center gap-4 bg-slate-950/75 border border-purple-500/30 p-2.5 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(186,104,200,0.1)] pointer-events-auto text-slate-100">
            <div className="text-right">
              <span className="text-[9px] text-purple-300/80 block font-semibold leading-none mb-0.5 font-scifi tracking-widest">SECTOR GRADE</span>
              <span className="text-xs font-bold text-emerald-400 font-scifi">SECTOR 0{sectors}</span>
            </div>
            {sectors < 3 ? (
              <button
                onClick={handleExpandSector}
                className="px-3.5 py-2 scifi-btn-emerald rounded-xl text-[10px] font-bold cursor-pointer transition-all"
              >
                EXPAND ({getUpgradeCost()} Bio)
              </button>
            ) : (
              <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 font-semibold text-[10px] rounded-xl border border-emerald-500/30 font-scifi tracking-wider">MAX GRADE</span>
            )}
          </div>
        </div>

        {/* 3. 플로팅 제어 버튼들 (모바일에서 줄바꿈이 되도록 반응형 래핑 패치) */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2.5 z-10 pointer-events-none max-w-[calc(100vw-32px)]">
          <button
            onClick={() => setActiveModal('quiz')}
            className="pointer-events-auto px-4 py-2.5 scifi-btn-amber rounded-xl text-xs font-bold cursor-pointer transition-all"
          >
            🔬 연구 (퀴즈)
          </button>
          <button
            onClick={() => setActiveModal('synth')}
            className="pointer-events-auto px-4 py-2.5 scifi-btn-emerald rounded-xl text-xs font-bold cursor-pointer transition-all"
          >
            🧬 합성 (조합)
          </button>
          <button
            onClick={() => setActiveModal('ency')}
            className="pointer-events-auto px-4 py-2.5 scifi-btn-glass rounded-xl text-xs font-bold cursor-pointer transition-all"
          >
            📖 도감 카드
          </button>
        </div>

        {/* 4. 슬라이딩 돋보기 모니터 (우측 하단 - 관찰 중일 때만 스르륵 나타남) */}
        <div 
          className={`absolute bottom-4 right-4 w-[280px] bg-slate-950/90 border border-cyan-500/40 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,240,255,0.15)] backdrop-blur-md z-10 transition-all duration-300 ${
            liveFocusedMicrobe 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-[350px] opacity-0 pointer-events-none'
          }`}
        >
          {liveFocusedMicrobe && (
            <div className="flex flex-col gap-3 text-left text-slate-100">
              {/* 돋보기 상단 타이틀 & 닫기 버튼 */}
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-cyan-400 font-scifi leading-none">
                  {liveFocusedMicrobe.name}
                </h4>
                <button 
                  onClick={() => setFocusedMicrobe(null)}
                  className="text-[9px] bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold border border-red-500/40 rounded px-1.5 py-0.5 cursor-pointer leading-none font-scifi"
                >
                  CLOSE
                </button>
              </div>
              
              {/* 스펙 라벨 */}
              <div className="flex justify-between items-center">
                <span className="inline-block px-2.5 py-0.5 bg-slate-900 border border-slate-700 text-[9px] font-semibold text-amber-400 rounded-full font-mono uppercase tracking-wider leading-none">
                  {liveFocusedMicrobe.type} (T-{liveFocusedMicrobe.tier})
                </span>
              </div>

              {/* 돋보기 홀로그램 스캐너 */}
              <div className="relative w-full aspect-video bg-[#0d0e1b]/90 border border-cyan-500/30 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,255,0.06),rgba(255,0,0,0.02),rgba(0,255,255,0.06))] bg-[size:100%_4px,6px_100%]"></div>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-cyan-500/20"></div>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-cyan-500/20"></div>
                
                <MicrobeIcon name={liveFocusedMicrobe.name} className="w-16 h-16" glowColor={liveFocusedMicrobe.glowColor} />
              </div>

              {/* 교과서 설명 (최소화) */}
              <div className="text-[10px] text-slate-300 leading-relaxed font-sans max-h-[80px] overflow-y-auto bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                {liveFocusedMicrobe.name === '버섯' && <p>갓 아래의 미세한 주름 틈새에서 번식을 돕는 포자 가루를 방출합니다.</p>}
                {liveFocusedMicrobe.name === '곰팡이' && <p>균사 끝에 아주 작은 공 모양의 포자낭들이 맺혀 있는 모습이 관찰됩니다.</p>}
                {liveFocusedMicrobe.name === '이스트' && <p>빵 반죽 속 당분을 분해하여 이산화탄소를 만들어 부풀리는 효모(균류) 세포입니다.</p>}
                {liveFocusedMicrobe.name === '고초균' && <p>볏짚에 널리 살며 콩 단백질을 분해해 청국장을 만드는 유익한 막대모양 세균입니다.</p>}
                {liveFocusedMicrobe.name === '누룩곰팡이' && <p>곡물에 번식하여 단백질을 아미노산으로 분해해 맛있는 간장/된장을 만드는 곰팡이입니다.</p>}
                {liveFocusedMicrobe.name === '아세트산균' && <p>알코올을 식초의 시큼한 초산 성분으로 바꾸는 길쭉한 모양의 발효 세균입니다.</p>}
                {liveFocusedMicrobe.name === '짚신벌레' && <p>몸 표면에 촘촘한 섬모가 돋아나 있으며, 이를 저어 움직입니다.</p>}
                {liveFocusedMicrobe.name === '아메바' && <p>세포의 특정한 앞뒤 구분이 없고, 내민 위족을 사용하여 이동합니다.</p>}
                {liveFocusedMicrobe.name === '해캄' && <p>세포 내부에 나선형으로 예쁘게 꼬여서 이어지는 녹색 엽록체가 보입니다.</p>}
                {liveFocusedMicrobe.name === '대장균' && <p>길고 가느다란 꼬리 모양의 편모를 빠르게 돌려 추진력을 얻습니다.</p>}
                {liveFocusedMicrobe.name === '젖산균' && <p>미세한 구슬 여러 개가 쇠사슬 형태로 연결되어 뭉쳐 있는 구균 형태입니다.</p>}
                {liveFocusedMicrobe.tier > 1 && <p>🌌 <strong>변종 관찰:</strong> 원래 생물들의 고유 메커니즘인 포자 살포, 섬모 추진, 위족 변형 등의 특징이 우주의 성간 물질과 융합하여 한층 더 화려하게 강화되었습니다.</p>}
              </div>

              {/* 속성 바 */}
              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400 font-semibold">배달 에너지</span>
                <span className="text-cyan-400 font-bold">
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

      <Encyclopedia
        isOpen={activeModal === 'ency'}
        onClose={() => setActiveModal(null)}
        discoveredNames={discoveredNames}
      />

      <ExpeditionModal
        isOpen={activeModal === 'expedition'}
        onClose={() => setActiveModal(null)}
        planetId={selectedPlanetId}
        microbes={microbes}
        expeditions={expeditions}
        startExpedition={startExpedition}
        completeExpedition={completeExpedition}
      />

      {/* 우주선 발사 연출 오버레이 */}
      {launchingPlanetId && (
        <LaunchAnimation 
          planetName={foodPlanets.find(p => p.id === launchingPlanetId)?.name || ''} 
          onComplete={handleLaunchComplete}
        />
      )}
    </div>
  );
}
