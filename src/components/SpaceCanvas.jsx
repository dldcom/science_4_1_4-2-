import React, { useRef, useEffect, useState } from 'react';
import { foodPlanets } from '../utils/expeditions';

const spriteMapping = {
  '버섯': { row: 0, col: 0 },
  '곰팡이': { row: 0, col: 1 },
  '이스트': { row: 0, col: 2 },
  '누룩곰팡이': { row: 0, col: 3 },
  '짚신벌레': { row: 1, col: 0 },
  '아메바': { row: 1, col: 1 },
  '해캄': { row: 1, col: 2 },
  '대장균': { row: 2, col: 0 },
  '젖산균': { row: 2, col: 1 },
  '고초균': { row: 2, col: 2 },
  '아세트산균': { row: 2, col: 3 },
  '화산 버섯': { row: 3, col: 0 },
  '네온 곰팡이': { row: 3, col: 1 },
  '포자버섯 젤리': { row: 3, col: 2 },
  '제트 짚신벌레': { row: 3, col: 3 },
  '블랙홀 아메바': { row: 3, col: 4 },
  '우주 태양 아메바': { row: 4, col: 0 },
  '메가 이스트': { row: 4, col: 1 }
};

// 미생물 모양을 그리거나 이미지 스프라이트를 렌더링하는 함수
const drawMicrobe = (ctx, type, name, x, y, size, angle, state, glowColor, time, focusMode, spritesheetImg) => {
  ctx.save();
  ctx.translate(x, y);

  // 1. Stardew Valley 스타일 식물/균류형 흔들림 효과 (Wobble)
  if (type === 'mushroom' || type === 'mold' || type === 'spore_jelly' || type === 'spirogyra' || type === 'koji_mold') {
    const wobbleSpeed = 0.15;
    const wobbleAmt = 0.06;
    const squash = 1.0 + Math.sin(time * wobbleSpeed) * wobbleAmt;
    const stretch = 1.0 - Math.sin(time * wobbleSpeed) * wobbleAmt;
    ctx.scale(squash, stretch);
  }

  ctx.rotate(angle);

  // 2. 스프라이트 시트가 있고 매핑 정보가 있는 경우 그리기
  const sprite = spriteMapping[name];
  if (spritesheetImg && sprite) {
    ctx.imageSmoothingEnabled = false;
    if (focusMode) {
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffb300';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, size * 2.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    const col = sprite.col;
    const row = sprite.row;
    const cellW = spritesheetImg.width / 5;
    const cellH = spritesheetImg.height / 5;
    const sx = col * cellW;
    const sy = row * cellH;

    ctx.drawImage(
      spritesheetImg, 
      sx, sy, cellW, cellH, 
      -size * 1.5, -size * 1.5, 
      size * 3, size * 3
    );
    ctx.restore();
    return;
  }

  // 3. 대체 벡터 드로잉 (원래 네온 스타일)
  ctx.shadowBlur = focusMode ? 15 : 6;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = glowColor;
  ctx.fillStyle = glowColor + '22';
  ctx.lineWidth = focusMode ? 3 : 2;

  switch (type) {
    case 'paramecium': // 짚신벌레
    case 'jet_paramecium':
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 1.5, size * 0.7, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      // 세포구(입) 홈
      ctx.beginPath();
      ctx.arc(size * 0.2, size * 0.3, size * 0.2, Math.PI, Math.PI * 2);
      ctx.stroke();

      // 섬모 그리기 (애니메이션)
      const ciliaCount = 28;
      for (let i = 0; i < ciliaCount; i++) {
        const theta = (i / ciliaCount) * Math.PI * 2;
        const rx = size * 1.5;
        const ry = size * 0.7;
        const cx = rx * Math.cos(theta);
        const cy = ry * Math.sin(theta);
        const wave = Math.sin(time * 0.15 + i) * 3;
        const nx = Math.cos(theta) * (4 + wave);
        const ny = Math.sin(theta) * (4 + wave);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + nx, cy + ny);
        ctx.strokeStyle = glowColor + '88';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      if (name === '제트 짚신벌레') {
        ctx.shadowColor = '#00ffff';
        ctx.fillStyle = '#00ffff88';
        ctx.beginPath();
        ctx.moveTo(-size * 1.5, -size * 0.3);
        ctx.lineTo(-size * 2.2 - Math.sin(time * 0.3) * 5, 0);
        ctx.lineTo(-size * 1.5, size * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      break;

    case 'amoeba': // 아메바
    case 'blackhole_amoeba':
      ctx.beginPath();
      const points = 10;
      for (let i = 0; i <= points; i++) {
        const theta = (i / points) * Math.PI * 2;
        const pulse = Math.sin(time * 0.05 + i * 1.5) * (size * 0.3);
        const r = size * 1.1 + pulse;
        const px = r * Math.cos(theta);
        const py = r * Math.sin(theta);

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // 핵
      ctx.beginPath();
      ctx.arc(-size * 0.2, -size * 0.1, size * 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = glowColor + 'bb';
      ctx.fillStyle = glowColor + '44';
      ctx.stroke();
      ctx.fill();

      if (name === '블랙홀 아메바') {
        ctx.save();
        ctx.rotate(time * 0.05);
        ctx.strokeStyle = '#dd00ff';
        ctx.lineWidth = 1.5;
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.arc(0, 0, size * 0.4 * (j + 1), 0, Math.PI, false);
          ctx.stroke();
        }
        ctx.restore();
      }
      break;

    case 'spirogyra': // 해캄
      const width = size * 3;
      const height = size * 0.8;
      ctx.beginPath();
      ctx.rect(-width / 2, -height / 2, width, height);
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-width / 6, -height / 2);
      ctx.lineTo(-width / 6, height / 2);
      ctx.moveTo(width / 6, -height / 2);
      ctx.lineTo(width / 6, height / 2);
      ctx.stroke();

      // 나선 엽록체
      ctx.strokeStyle = '#adff2f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let tx = -width / 2; tx <= width / 2; tx += 2) {
        const ty = Math.sin((tx / width) * Math.PI * 5 + time * 0.08) * (height * 0.3);
        if (tx === -width / 2) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();
      break;

    case 'mushroom': // 버섯
    case 'volcano_mushroom':
      ctx.beginPath();
      ctx.arc(0, -size * 0.3, size * 0.9, Math.PI, 0, false);
      ctx.lineTo(0, -size * 0.3);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.rect(-size * 0.2, -size * 0.3, size * 0.4, size * 1.0);
      ctx.stroke();
      ctx.fill();

      ctx.strokeStyle = glowColor + 'aa';
      ctx.lineWidth = 1;
      for (let offset = -0.7; offset <= 0.7; offset += 0.35) {
        ctx.beginPath();
        ctx.moveTo(size * offset, -size * 0.3);
        ctx.lineTo(size * offset * 0.5, size * 0.2);
        ctx.stroke();
      }

      if (name === '화산 버섯') {
        ctx.fillStyle = '#ff3700';
        ctx.beginPath();
        ctx.arc(-size * 0.3, -size * 0.5, size * 0.15, 0, Math.PI * 2);
        ctx.arc(size * 0.4, -size * 0.4, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'mold': // 곰팡이
    case 'neon_mold':
      ctx.beginPath();
      ctx.moveTo(0, size);
      ctx.quadraticCurveTo(-size * 0.4, 0, -size * 0.5, -size * 0.4);
      ctx.moveTo(0, size);
      ctx.quadraticCurveTo(size * 0.2, size * 0.2, size * 0.6, -size * 0.2);
      ctx.moveTo(0, size);
      ctx.lineTo(0, -size * 0.6);
      ctx.stroke();

      ctx.fillStyle = glowColor;
      ctx.beginPath();
      ctx.arc(-size * 0.5, -size * 0.4, size * 0.22, 0, Math.PI * 2);
      ctx.arc(size * 0.6, -size * 0.2, size * 0.18, 0, Math.PI * 2);
      ctx.arc(0, -size * 0.6, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      if (name === '네온 곰팡이') {
        ctx.strokeStyle = '#00ffcc33';
        ctx.beginPath();
        ctx.arc(0, 0, size * 1.6, 0, Math.PI * 2);
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      break;

    case 'spore_jelly': // 포자버섯 젤리
      ctx.beginPath();
      ctx.moveTo(-size * 0.5, size * 0.5);
      ctx.lineTo(0, size);
      ctx.lineTo(size * 0.5, size * 0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, -size * 0.2, size * 1.1, size * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      ctx.fillStyle = glowColor + '44';
      ctx.beginPath();
      ctx.moveTo(-size * 0.8, -size * 0.2);
      ctx.quadraticCurveTo(-size * 0.4, size * 0.4 + Math.sin(time * 0.1) * 2, 0, -size * 0.1);
      ctx.quadraticCurveTo(size * 0.4, size * 0.4 + Math.cos(time * 0.1) * 2, size * 0.8, -size * 0.2);
      ctx.closePath();
      ctx.fill();
      break;

    case 'e_coli': // 대장균
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 1.2, size * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      ctx.strokeStyle = glowColor + 'aa';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let tx = -size * 1.2; tx >= -size * 2.8; tx -= 2) {
        const ty = Math.sin((tx / size) * 4 + time * 0.2) * (size * 0.25);
        if (tx === -size * 1.2) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();
      break;

    case 'lactobacillus': // 젖산균
      ctx.beginPath();
      ctx.arc(-size * 0.8, 0, size * 0.42, 0, Math.PI * 2);
      ctx.arc(0, 0, size * 0.42, 0, Math.PI * 2);
      ctx.arc(size * 0.8, 0, size * 0.42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
      break;

    case 'sun_amoeba': // 우주 태양 아메바
      ctx.beginPath();
      ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      ctx.lineWidth = 1.8;
      const rays = 12;
      for (let j = 0; j < rays; j++) {
        const angleRay = (j / rays) * Math.PI * 2;
        const waveRay = Math.sin(time * 0.12 + j * 3) * (size * 0.35);
        const rx1 = size * 1.1;
        const rx2 = size * 1.6 + waveRay;
        ctx.beginPath();
        ctx.moveTo(rx1 * Math.cos(angleRay), rx1 * Math.sin(angleRay));
        ctx.lineTo(rx2 * Math.cos(angleRay), rx2 * Math.sin(angleRay));
        ctx.stroke();
      }
      break;

    default:
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
  }

  ctx.restore();
};

export default function SpaceCanvas({
  microbes,
  setMicrobes,
  sectors,
  addBioEnergy,
  focusedMicrobe,
  setFocusedMicrobe,
  expeditions,
  onPlanetClick
}) {
  const canvasRef = useRef(null);
  const timeRef = useRef(0);
  const spritesheetImgRef = useRef(null);
  const nutrientsRef = useRef([]); // 배양액 내부 유기 영양분
  const starsRef = useRef([]);

  // 타일 텍스처 이미지 Refs
  const brightSpaceTileImgRef = useRef(null);
  const pondWaterTileImgRef = useRef(null);

  // 1. 타일 이미지 텍스처 로딩
  useEffect(() => {
    const spaceImg = new Image();
    spaceImg.src = '/images/bright_space_tile.png';
    spaceImg.onload = () => {
      brightSpaceTileImgRef.current = spaceImg;
    };

    const waterImg = new Image();
    waterImg.src = '/images/pond_water_tile.png';
    waterImg.onload = () => {
      pondWaterTileImgRef.current = waterImg;
    };
  }, []);

  // 2. 미생물 스프라이트 시트 이미지 로딩
  useEffect(() => {
    const sheetImg = new Image();
    sheetImg.src = '/images/microbes_spritesheet.png';
    sheetImg.onload = () => {
      spritesheetImgRef.current = sheetImg;
    };
  }, []);

  // 3. 8000x6000 월드에 반짝이는 별 500개 분포 초기화
  useEffect(() => {
    const tempStars = [];
    for (let i = 0; i < 500; i++) {
      tempStars.push({
        x: Math.random() * 8000,
        y: Math.random() * 6000,
        size: 0.8 + Math.random() * 1.5,
        brightness: 0.3 + Math.random() * 0.7,
        blinkSpeed: 0.015 + Math.random() * 0.03
      });
    }
    starsRef.current = tempStars;
  }, []);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // 카메라는 중앙 (4000, 3000) 기준으로 초기 세팅
  const cameraRef = useRef({ 
    x: 4000 - window.innerWidth / 2, 
    y: 3000 - window.innerHeight / 2 
  });
  
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ 
    x: 0, 
    y: 0, 
    camX: 4000 - window.innerWidth / 2, 
    camY: 3000 - window.innerHeight / 2 
  });

  // 윈도우 크기 조정 시 dimensions 상태 동기화
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 뷰포트 크기가 조절될 때 카메라 한계 범위 재조정 및 속성 갱신
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const maxX = Math.max(0, 8000 - dimensions.width);
      const maxY = Math.max(0, 6000 - dimensions.height);
      cameraRef.current.x = Math.max(0, Math.min(maxX, cameraRef.current.x));
      cameraRef.current.y = Math.max(0, Math.min(maxY, cameraRef.current.y));
      canvas.setAttribute('data-camera-x', cameraRef.current.x);
      canvas.setAttribute('data-camera-y', cameraRef.current.y);
    }
  }, [dimensions]);

  // 성운 정보 정의 (중앙에서 멀리 분산)
  const nebulas = [
    { id: 1, name: '아우터 오리온 성운', x: 1200, y: 1000, color: '#dd00ff', pulseColor: '#7a0099', unlocked: true },
    { id: 2, name: '카시오페아 은하 줄기', x: 6800, y: 1200, color: '#00ffaa', pulseColor: '#008855', unlocked: sectors >= 2 },
    { id: 3, name: '아메바성 블랙홀 외곽', x: 4000, y: 5000, color: '#ffff00', pulseColor: '#888800', unlocked: sectors >= 3 }
  ];

  // 포탈 (중앙 에너지 수집기) - 연못 정중앙
  const collector = { x: 4000, y: 3000, radius: 25, color: '#00ffff' };

  const particlesRef = useRef([]);
  const textPopupsRef = useRef([]);
  const microbesRef = useRef(microbes);

  // props로 전달받은 미생물 목록과 로컬 Ref 목록 간 유연한 동기화
  useEffect(() => {
    const currentRefMap = new Map(microbesRef.current.map(m => [m.id, m]));
    const updatedList = microbes.map(m => {
      if (currentRefMap.has(m.id)) {
        // 기존 미생물은 좌표 유지
        return currentRefMap.get(m.id);
      } else {
        // 새로 추가된 미생물 (스폰/조합)
        return m;
      }
    });
    microbesRef.current = updatedList;
  }, [microbes]);

  // 새로운 미생물 소환 감지 시 포탈 소환 불꽃 파티클 이펙트
  const prevCountRef = useRef(microbes.length);
  useEffect(() => {
    if (microbes.length > prevCountRef.current) {
      for (let i = 0; i < 25; i++) {
        const angleVal = Math.random() * Math.PI * 2;
        const pSpeed = 1.5 + Math.random() * 4.0;
        particlesRef.current.push({
          x: collector.x,
          y: collector.y,
          vx: Math.cos(angleVal) * pSpeed,
          vy: Math.sin(angleVal) * pSpeed,
          color: ['#ffb300', '#ffa726', '#66bb6a', '#29b6f6', '#ab47bc'][Math.floor(Math.random() * 5)],
          size: 3 + Math.floor(Math.random() * 3),
          life: 30 + Math.floor(Math.random() * 20),
          isPixelStar: true
        });
      }
    }
    prevCountRef.current = microbes.length;
  }, [microbes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // 4. 물리 시뮬레이션 계산
    const updatePhysics = () => {
      microbesRef.current = microbesRef.current.map(m => {
        let { x, y, vx, vy, state, targetX, targetY, energyCurrent, energyCapacity, speed, targetNebulaId, type, name, targetPlanetId, angle } = m;
        
        // 중앙 배양조 물리 영역 설정
        const tankWidth = 800;
        const tankHeight = 600;
        const minX = 4000 - tankWidth / 2;
        const maxX = 4000 + tankWidth / 2;
        const minY = 3000 - tankHeight / 2;
        const maxY = 3000 + tankHeight / 2;

        if (state === 'mining') {
          // 물속을 부드럽게 유영하며 둥둥 떠다니는 Smooth Steering Wander 물리 작용
          // 매 프레임 무작위 가속도를 더하는 대신, 고유 각도(angle)를 미세하게 조향하여 떨림 현상 완전 차단
          let curAngle = (angle === undefined || isNaN(angle)) ? Math.random() * Math.PI * 2 : angle;
          curAngle += (Math.random() - 0.5) * 0.08; // 프레임당 약 ±2.3도씩 미세 각도 조향
          
          // 각도 방향으로 부드럽게 활주 (너무 미친듯이 돌거나 떨리는 가속 방지)
          const targetVx = Math.cos(curAngle) * 0.6 * speed;
          const targetVy = Math.sin(curAngle) * 0.6 * speed;
          
          // 현재 속도에서 타겟 부유 속도로 부드럽게 완충(Lerp)
          vx = vx * 0.92 + targetVx * 0.08;
          vy = vy * 0.92 + targetVy * 0.08;
          angle = curAngle;

          // 부유 유영 중에 주변 영양분에 가까이 닿았는지(16px 이하) 검증
          let touchedNutrient = null;
          for (let i = 0; i < nutrientsRef.current.length; i++) {
            const nut = nutrientsRef.current[i];
            const d = Math.sqrt(Math.pow(nut.x - x, 2) + Math.pow(nut.y - y, 2));
            if (d <= 16) {
              touchedNutrient = nut;
              break;
            }
          }

          if (touchedNutrient) {
            // 영양분 먹기 성공
            nutrientsRef.current = nutrientsRef.current.filter(n => n.id !== touchedNutrient.id);
            
            energyCurrent += energyCapacity * 0.25; // 25% 충전
            if (energyCurrent >= energyCapacity) {
              energyCurrent = energyCapacity;
              state = 'returning';
            }

            textPopupsRef.current.push({
              x: x,
              y: y - 12,
              text: "+1 Bio",
              color: m.glowColor || '#ffca28',
              alpha: 1.0,
              life: 40
            });

            // 먹기 이펙트 먼지 불꽃 추가
            for (let i = 0; i < 5; i++) {
              const angleVal = Math.random() * Math.PI * 2;
              const pSpeed = 0.5 + Math.random() * 1.5;
              particlesRef.current.push({
                x: x,
                y: y,
                vx: Math.cos(angleVal) * pSpeed,
                vy: Math.sin(angleVal) * pSpeed,
                color: '#ffca28',
                size: 2 + Math.floor(Math.random() * 2),
                life: 15 + Math.floor(Math.random() * 8),
                isPixelStar: true
              });
            }
          }

          // 자연 채굴량 축적
          energyCurrent += m.miningSpeed * 0.04;
          if (energyCurrent >= energyCapacity) {
            energyCurrent = energyCapacity;
            state = 'returning';
          }
        } else if (state === 'returning') {
          // 중앙 포탈로 복귀 및 에너지 납품 (복귀 시에는 일정한 속도로 복귀하도록 깡총거림 제거)
          const dx = collector.x - x;
          const dy = collector.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < collector.radius + 10) {
            const harvestAmount = Math.round(energyCapacity);
            addBioEnergy(harvestAmount);
            
            textPopupsRef.current.push({
              x: x,
              y: y - 12,
              text: `+${harvestAmount}`,
              color: m.glowColor,
              alpha: 1.0,
              life: 40
            });

            // 포탈 에너지 충돌 파티클
            for (let i = 0; i < 10; i++) {
              const angleVal = Math.random() * Math.PI * 2;
              const pSpeed = 1.0 + Math.random() * 2.5;
              particlesRef.current.push({
                x: collector.x,
                y: collector.y,
                vx: Math.cos(angleVal) * pSpeed,
                vy: Math.sin(angleVal) * pSpeed,
                color: m.glowColor || '#ffb300',
                size: 2 + Math.floor(Math.random() * 2),
                life: 20 + Math.floor(Math.random() * 12),
                isPixelStar: true
              });
            }

            energyCurrent = 0;
            state = 'mining';
          } else {
            vx = (dx / dist) * 1.8 * speed;
            vy = (dy / dist) * 1.8 * speed;
          }
        } else if (state === 'expedition') {
          // 원정 파견: 해당 식품 행성으로 비행
          const targetPlanet = foodPlanets.find(p => p.id === targetPlanetId);
          if (targetPlanet) {
            const dx = targetPlanet.x - x;
            const dy = targetPlanet.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 35) {
              vx = (dx / dist) * 3.8 * speed;
              vy = (dy / dist) * 3.8 * speed;
            } else {
              // 행성 도착 및 주변 공전 대기
              vx = (Math.random() - 0.5) * 0.3;
            }
          }
        }

        // 1. Separation (미생물 간 척력): 겹침 방지 및 자연스러운 무리 퍼짐 유도
        let repX = 0;
        let repY = 0;
        microbesRef.current.forEach(other => {
          if (other.id === m.id) return;
          const dx = x - other.x;
          const dy = y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minSep = 35; // 서로 유지할 최소 격리 거리 (픽셀 단위)
          if (dist < minSep && dist > 0) {
            const force = (minSep - dist) / minSep; // 거리가 가까울수록 더 강한 반발력
            repX += (dx / dist) * force * 0.25;
            repY += (dy / dist) * force * 0.25;
          }
        });
        vx += repX;
        vy += repY;

        // 물리 마찰
        if (state === 'expedition') {
          vx *= 0.98;
          vy *= 0.98;
        } else {
          vx *= 0.95;
          vy *= 0.95;
        }

        // 식물/균류형(버섯, 곰팡이 등)은 기어가는 속도 대폭 조절
        if (state !== 'expedition' && (type === 'mold' || type === 'mushroom' || type === 'spore_jelly' || type === 'koji_mold')) {
          vx *= 0.1;
          vy *= 0.1;
        }

        x += vx;
        y += vy;

        // 경계 벽 설정
        if (state === 'expedition') {
          if (x < 30) { x = 30; vx *= -0.5; }
          if (x > 8000 - 30) { x = 8000 - 30; vx *= -0.5; }
          if (y < 30) { y = 30; vy *= -0.5; }
          if (y > 6000 - 30) { y = 6000 - 30; vy *= -0.5; }
        } else {
          // 일반 미생물은 배양 연못 안에서만 활보
          const margin = 24;
          if (x < minX + margin) { x = minX + margin; vx *= -0.5; }
          if (x > maxX - margin) { x = maxX - margin; vx *= -0.5; }
          if (y < minY + margin) { y = minY + margin; vy *= -0.5; }
          if (y > maxY - margin) { y = maxY - margin; vy *= -0.5; }
        }

        if (state === 'expedition' || Math.sqrt(vx * vx + vy * vy) > 0.05) {
          angle = Math.atan2(vy, vx);
        }
        if (state !== 'expedition' && (type === 'mold' || type === 'mushroom' || type === 'spore_jelly' || type === 'koji_mold')) {
          angle = -Math.PI / 2;
        }

        return { ...m, x, y, vx, vy, state, energyCurrent, angle };
      });
    };

    // 5. 프레임 렌더링 루프
    const render = () => {
      const time = timeRef.current;
      const tankWidth = 800;
      const tankHeight = 600;
      const minX = 4000 - tankWidth / 2;
      const maxX = 4000 + tankWidth / 2;
      const minY = 3000 - tankHeight / 2;
      const maxY = 3000 + tankHeight / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 카메라 오프셋 적용 시작
      ctx.save();
      ctx.translate(-cameraRef.current.x, -cameraRef.current.y);

      // 5.1. 우주 배경 (밝은 우주 무봉제 타일 렌더링)
      if (brightSpaceTileImgRef.current) {
        const spacePattern = ctx.createPattern(brightSpaceTileImgRef.current, 'repeat');
        ctx.fillStyle = spacePattern;
        ctx.fillRect(cameraRef.current.x, cameraRef.current.y, dimensions.width, dimensions.height);
      } else {
        ctx.fillStyle = '#f0f4ff';
        ctx.fillRect(cameraRef.current.x, cameraRef.current.y, dimensions.width, dimensions.height);
      }

      // 우주 미세 격자선 추가 (Stardew Valley 격자 보조선)
      ctx.save();
      ctx.strokeStyle = 'rgba(210, 222, 240, 0.4)';
      ctx.lineWidth = 1;
      const tileSize = 120;
      const startCol = Math.max(0, Math.floor(cameraRef.current.x / tileSize));
      const endCol = Math.min(67, Math.ceil((cameraRef.current.x + dimensions.width) / tileSize));
      const startRow = Math.max(0, Math.floor(cameraRef.current.y / tileSize));
      const endRow = Math.min(50, Math.ceil((cameraRef.current.y + dimensions.height) / tileSize));
      
      for (let col = startCol; col <= endCol; col++) {
        ctx.beginPath();
        ctx.moveTo(col * tileSize, cameraRef.current.y);
        ctx.lineTo(col * tileSize, cameraRef.current.y + dimensions.height);
        ctx.stroke();
      }
      for (let row = startRow; row <= endRow; row++) {
        ctx.beginPath();
        ctx.moveTo(cameraRef.current.x, row * tileSize);
        ctx.lineTo(cameraRef.current.x + dimensions.width, row * tileSize);
        ctx.stroke();
      }
      ctx.restore();

      // 별 그리기
      starsRef.current.forEach(star => {
        if (
          star.x < cameraRef.current.x - 20 ||
          star.x > cameraRef.current.x + dimensions.width + 20 ||
          star.y < cameraRef.current.y - 20 ||
          star.y > cameraRef.current.y + dimensions.height + 20
        ) return;

        ctx.save();
        const alpha = star.brightness + Math.sin(time * star.blinkSpeed) * 0.25;
        // 밝은 테마에 어울리도록 영롱한 노란색/푸른색 별
        ctx.fillStyle = `rgba(255, 230, 150, ${Math.max(0.1, Math.min(1.0, alpha))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5.2. 중앙 바이오 배양 연못 (Pond) 렌더링
      ctx.save();
      if (pondWaterTileImgRef.current) {
        const waterPattern = ctx.createPattern(pondWaterTileImgRef.current, 'repeat');
        ctx.fillStyle = waterPattern;
      } else {
        // Fallback 그라데이션
        const waterGrd = ctx.createLinearGradient(minX, minY, minX, maxY);
        waterGrd.addColorStop(0, '#e0f7fa');
        waterGrd.addColorStop(1, '#80deea');
        ctx.fillStyle = waterGrd;
      }
      
      ctx.beginPath();
      ctx.roundRect(minX, minY, maxX - minX, maxY - minY, 24);
      ctx.fill();

      // 수표면 햇살 sheen 반사광 효과
      const sheenGrd = ctx.createLinearGradient(minX, minY, maxX, maxY);
      sheenGrd.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
      sheenGrd.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
      sheenGrd.addColorStop(0.4, 'rgba(255, 255, 255, 0.0)');
      sheenGrd.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = sheenGrd;
      ctx.beginPath();
      ctx.roundRect(minX, minY, maxX - minX, maxY - minY, 24);
      ctx.fill();

      // 연못 물 내부 보조 격자
      ctx.strokeStyle = 'rgba(0, 188, 212, 0.1)';
      ctx.lineWidth = 1;
      for (let gx = minX + 40; gx < maxX; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, minY + 6);
        ctx.lineTo(gx, maxY - 6);
        ctx.stroke();
      }
      for (let gy = minY + 40; gy < maxY; gy += 40) {
        ctx.beginPath();
        ctx.moveTo(minX + 6, gy);
        ctx.lineTo(maxX - 6, gy);
        ctx.stroke();
      }

      // 철제 연못 외곽선 테두리
      ctx.strokeStyle = '#455a64'; 
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.roundRect(minX, minY, maxX - minX, maxY - minY, 24);
      ctx.stroke();

      // 네온 가이드 라인
      ctx.strokeStyle = '#00e5ff'; 
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(minX + 2, minY + 2, (maxX - minX) - 4, (maxY - minY) - 4, 22);
      ctx.stroke();

      // 연못 네임 태그 프레임
      ctx.fillStyle = '#37474f';
      ctx.fillRect(minX + 30, minY - 22, 220, 22);
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(minX + 30, minY - 22, 220, 22);

      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 10px DungGeunMo, Courier New';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText("BIO-REACTOR TANK : LIVE", minX + 42, minY - 11);
      ctx.restore();

      // 보글보글 거품 기포 발생
      if (time % 10 === 0 && Math.random() < 0.35) {
        particlesRef.current.push({
          x: minX + 30 + Math.random() * (maxX - minX - 60),
          y: maxY - 10,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.5 - Math.random() * 1.2,
          size: 1.5 + Math.random() * 2.0,
          life: 180,
          isBubble: true
        });
      }

      // 3초 단위로 유기 영양분 생성 (최대 6개)
      if (time % 180 === 0 && nutrientsRef.current.length < 6) {
        nutrientsRef.current.push({
          id: Math.random(),
          x: minX + 60 + Math.random() * (maxX - minX - 120),
          y: minY + 60 + Math.random() * (maxY - minY - 120),
          size: 6 + Math.floor(Math.random() * 3)
        });
      }

      // 영양분 그리기 (녹색 도트)
      nutrientsRef.current.forEach(nut => {
        ctx.save();
        ctx.shadowBlur = 8 + Math.sin(time * 0.08 + nut.id) * 3;
        ctx.shadowColor = '#4caf50';
        ctx.fillStyle = '#4caf50';
        const sizeOffset = Math.sin(time * 0.05 + nut.id) * 1.5;
        ctx.fillRect(
          nut.x - (nut.size + sizeOffset)/2,
          nut.y - (nut.size + sizeOffset)/2,
          nut.size + sizeOffset,
          nut.size + sizeOffset
        );
        ctx.restore();
      });

      // 5.3. 성운(Nebulas) 렌더링
      nebulas.forEach(nebula => {
        if (!nebula.unlocked) return;

        ctx.save();
        ctx.shadowBlur = 25 + Math.sin(time * 0.05) * 8;
        ctx.shadowColor = nebula.color;
        
        const radGrd = ctx.createRadialGradient(
          nebula.x, nebula.y, 5,
          nebula.x, nebula.y, 35 + Math.sin(time * 0.02) * 5
        );
        radGrd.addColorStop(0, nebula.color + 'aa');
        radGrd.addColorStop(0.5, nebula.color + '33');
        radGrd.addColorStop(1, 'transparent');

        ctx.fillStyle = radGrd;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, 40 + Math.sin(time * 0.02) * 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#455a64'; 
        ctx.font = 'bold 11px DungGeunMo, Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(nebula.name, nebula.x, nebula.y - 50);
        ctx.restore();
      });

      // 5.4. 개척 식품 행성들 렌더링
      foodPlanets.forEach(planet => {
        const exp = expeditions && expeditions[planet.id];
        const status = exp ? exp.status : 'locked';

        const hasRequiredMicrobe = microbesRef.current.some(m => m.name === planet.requiredMicrobe && m.state !== 'expedition');
        const isReadyToExplore = status === 'locked' && hasRequiredMicrobe;
        const isTrulyLocked = status === 'locked' && !hasRequiredMicrobe;

        ctx.save();
        ctx.shadowBlur = 15 + Math.sin(time * 0.04) * 5;
        ctx.shadowColor = planet.color;

        const planetColor = isTrulyLocked ? '#b0bec5' : planet.color;

        // 행성 원체
        ctx.fillStyle = planetColor;
        ctx.strokeStyle = '#37474f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, 32, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        // 외곽 분위 효과
        ctx.strokeStyle = planetColor + '33';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, 35, 0, Math.PI * 2);
        ctx.stroke();

        if (isReadyToExplore) {
          ctx.save();
          ctx.shadowBlur = 12 + Math.sin(time * 0.08) * 5;
          ctx.shadowColor = '#00ffcc';
          ctx.strokeStyle = '#00ffcc';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(planet.x, planet.y, 39 + Math.sin(time * 0.06) * 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(isTrulyLocked ? '❓' : planet.foodIcon, planet.x, planet.y);

        ctx.fillStyle = isTrulyLocked ? '#78909c' : '#37474f';
        ctx.font = 'bold 12px DungGeunMo, Courier New';
        ctx.fillText(planet.name, planet.x, planet.y - 46);

        ctx.font = 'bold 11px DungGeunMo, Courier New';
        if (status === 'locked') {
          if (hasRequiredMicrobe) {
            ctx.fillStyle = '#00bfa5';
            ctx.fillText('[원정 준비완료]', planet.x, planet.y + 46);
          } else {
            ctx.fillStyle = '#d32f2f';
            ctx.fillText(`[${planet.requiredMicrobe} 필요]`, planet.x, planet.y + 46);
          }
        } else if (status === 'exploring') {
          ctx.fillStyle = '#f57c00';
          ctx.fillText(`원정 중.. ${exp.timer}초`, planet.x, planet.y + 46);
        } else if (status === 'complete') {
          ctx.fillStyle = '#388e3c';
          ctx.fillText('개척 완료! 확인', planet.x, planet.y + 46);
        } else if (status === 'supplying') {
          ctx.fillStyle = '#2e7d32';
          ctx.fillText('에너지 송신 중', planet.x, planet.y + 46);
        }

        ctx.restore();
      });

      // 5.5. 개척이 끝난 행성에서 포탈로 날아가는 에너지 수송선 파티클 예약 생성
      if (time % 150 === 0) {
        foodPlanets.forEach(planet => {
          const status = expeditions && expeditions[planet.id]?.status;
          if (status === 'supplying') {
            particlesRef.current.push({
              x: planet.x,
              y: planet.y,
              targetX: collector.x,
              targetY: collector.y,
              progress: 0,
              speed: 0.006 + Math.random() * 0.004,
              isFoodParticle: true,
              foodIcon: planet.foodIcon,
              rewardAmount: planet.rewardAmount,
              color: planet.color
            });
          }
        });
      }

      // 5.6. 중앙 포탈 (차원 에너지 수집기) 그리기
      ctx.save();
      ctx.shadowBlur = 15 + Math.sin(time * 0.08) * 5;
      ctx.shadowColor = '#00e5ff';
      
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(collector.x, collector.y, 22 + Math.sin(time * 0.05) * 2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 8;
      ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(collector.x, collector.y, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 8px DungGeunMo, Courier New';
      ctx.textAlign = 'center';
      ctx.fillText("PORTAL", collector.x, collector.y - 30);
      ctx.restore();

      // 5.7. 다양한 파티클 갱신 및 그리기
      const activeParticles = [];
      particlesRef.current.forEach(p => {
        if (p.isFoodParticle) {
          p.progress += p.speed;
          const px = p.x + (p.targetX - p.x) * p.progress;
          const py = p.y + (p.targetY - p.y) * p.progress;

          ctx.save();
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.foodIcon, px, py);

          ctx.fillStyle = p.color + '33';
          ctx.beginPath();
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (p.progress >= 1.0) {
            // 포탈 도착 시 자원 추가 및 팝업
            addBioEnergy(p.rewardAmount);
            
            textPopupsRef.current.push({
              x: collector.x,
              y: collector.y - 12 - Math.random() * 20,
              text: `+${p.rewardAmount}`,
              color: p.color,
              alpha: 1.0,
              life: 40
            });

            // 도착 불꽃
            for (let i = 0; i < 6; i++) {
              const angleVal = Math.random() * Math.PI * 2;
              const pSpeed = 0.8 + Math.random() * 1.5;
              activeParticles.push({
                x: collector.x,
                y: collector.y,
                vx: Math.cos(angleVal) * pSpeed,
                vy: Math.sin(angleVal) * pSpeed,
                color: p.color,
                size: 2 + Math.floor(Math.random() * 2),
                life: 15 + Math.floor(Math.random() * 8),
                isPixelStar: true
              });
            }
          } else {
            activeParticles.push(p);
          }
        } else if (p.isPixelStar) {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;

          ctx.save();
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
          ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
          ctx.restore();

          if (p.life > 0) {
            activeParticles.push(p);
          }
        } else if (p.isBubble) {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;

          ctx.save();
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          if (p.life > 0 && p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) {
            activeParticles.push(p);
          }
        } else {
          // 광원 채굴 파티클
          p.progress += p.speed;
          const px = p.x + (p.targetX - p.x) * p.progress;
          const py = p.y + (p.targetY - p.y) * p.progress;

          ctx.save();
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (p.progress < 1.0) {
            activeParticles.push(p);
          }
        }
      });
      particlesRef.current = activeParticles;

      // 5.8. 미생물 무리 렌더링
      microbesRef.current.forEach(m => {
        const isFocused = focusedMicrobe && focusedMicrobe.id === m.id;
        
        // 미생물 아이콘 및 모양 그리기
        drawMicrobe(
          ctx, 
          m.avatarSvg, 
          m.name, 
          m.x, 
          m.y, 
          m.size || 18, 
          m.angle, 
          m.state, 
          m.glowColor, 
          time, 
          isFocused, 
          spritesheetImgRef.current
        );

        // 채굴 중 게이지 링 그리기
        if (m.state === 'mining') {
          ctx.save();
          ctx.strokeStyle = '#ffffff15';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(m.x, m.y, 25, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = m.glowColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          const percent = m.energyCurrent / m.energyCapacity;
          ctx.arc(m.x, m.y, 25, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * percent);
          ctx.stroke();
          ctx.restore();
        }

        // 납품 귀환 시 하이라이트 링
        if (m.state === 'returning') {
          ctx.save();
          ctx.strokeStyle = '#ffffff88';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(m.x, m.y, 24 + Math.sin(time * 0.2) * 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      });

      // 5.9. 자원 획득 텍스트 팝업 렌더링
      textPopupsRef.current.forEach((t, idx) => {
        ctx.save();
        ctx.fillStyle = t.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = t.color;
        ctx.font = 'bold 11px DungGeunMo, Courier New';
        ctx.textAlign = 'center';
        ctx.globalAlpha = t.alpha;
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();

        t.y -= 0.55;
        t.life--;
        t.alpha = t.life / 40;

        if (t.life <= 0) {
          textPopupsRef.current.splice(idx, 1);
        }
      });

      // 5.10. 돋보기 관찰 포커스 가이드라인 그리기
      if (focusedMicrobe) {
        const fm = microbesRef.current.find(m => m.id === focusedMicrobe.id);
        if (fm) {
          ctx.save();
          ctx.strokeStyle = '#ffffff66';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.arc(fm.x, fm.y, 30, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.fillStyle = '#ffffffbb';
          ctx.font = '9px DungGeunMo, Courier New';
          ctx.textAlign = 'center';
          ctx.setLineDash([]);
          ctx.fillText("관찰 중: " + fm.name, fm.x, fm.y - 36);
          ctx.restore();
        }
      }

      ctx.restore(); // 카메라 오프셋 적용 끝

      // 6. 스캔라인 브라운관 필터 오버레이 효과
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 1);
      }
      ctx.restore();

      // 돋보기 모니터 갱신을 위해 10프레임마다 상위 컴포넌트에 미생물 상태 동기화
      if (focusedMicrobe && time % 10 === 0) {
        setMicrobes([...microbesRef.current]);
      }

      timeRef.current += 1;
      updatePhysics();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [sectors, focusedMicrobe, onPlanetClick]);

  // 마우스 및 터치 드래그 스크롤 핸들링
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        camX: cameraRef.current.x,
        camY: cameraRef.current.y
      };
    }
    isDraggingRef.current = true;
  };

  const handleMouseDown = (e) => {
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      camX: cameraRef.current.x,
      camY: cameraRef.current.y
    };
    isDraggingRef.current = true;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);
    if (clientX === undefined || clientY === undefined) return;

    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;

    // 카메라 범위 제한 클램핑 (8000x6000 월드 기준)
    const maxX = Math.max(0, 8000 - dimensions.width);
    const maxY = Math.max(0, 6000 - dimensions.height);
    const nextX = Math.max(0, Math.min(maxX, dragStartRef.current.camX - dx));
    const nextY = Math.max(0, Math.min(maxY, dragStartRef.current.camY - dy));

    cameraRef.current = { x: nextX, y: nextY };
    
    // DOM 속성 기록
    canvas.setAttribute('data-camera-x', nextX);
    canvas.setAttribute('data-camera-y', nextY);
  };

  const handleMouseUpOrLeave = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'grab';
    }
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 드래그 중 의도치 않은 클릭 방지
    const dragDist = Math.sqrt(
      Math.pow(e.clientX - dragStartRef.current.x, 2) +
      Math.pow(e.clientY - dragStartRef.current.y, 2)
    );
    if (dragDist > 8) return;

    // 월드 좌표계 환산
    const worldClickX = clickX + cameraRef.current.x;
    const worldClickY = clickY + cameraRef.current.y;

    // 1. 행성 클릭 체크
    for (let planet of foodPlanets) {
      const dist = Math.sqrt(Math.pow(worldClickX - planet.x, 2) + Math.pow(worldClickY - planet.y, 2));
      if (dist < 42) {
        onPlanetClick(planet.id);
        return;
      }
    }

    // 2. 수집기 포털 클릭 체크
    const distToCollector = Math.sqrt(Math.pow(worldClickX - collector.x, 2) + Math.pow(worldClickY - collector.y, 2));
    if (distToCollector < collector.radius + 15) {
      setFocusedMicrobe(null);
      return;
    }

    // 3. 미생물 클릭 체크
    let clickedAny = false;
    for (let m of microbesRef.current) {
      const dist = Math.sqrt(Math.pow(worldClickX - m.x, 2) + Math.pow(worldClickY - m.y, 2));
      if (dist < 28) {
        setFocusedMicrobe(m);
        clickedAny = true;
        break;
      }
    }

    if (!clickedAny) {
      setFocusedMicrobe(null);
    }
  };

  return (
    <canvas
      id="space-canvas"
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUpOrLeave}
      onClick={handleCanvasClick}
      className="block w-full h-full cursor-grab bg-[#f0f4ff]"
      data-camera-x={cameraRef.current.x}
      data-camera-y={cameraRef.current.y}
    />
  );
}
