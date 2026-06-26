import React, { useRef, useEffect, useState } from 'react';
import { foodPlanets } from '../utils/expeditions';

const SPRITE_COLUMNS = 5;
const SPRITE_ROWS = 4;
const PLANET_SPRITE_COLUMNS = 4;
const PLANET_SPRITE_ROWS = 3;
const SUPPLY_ICON_COLUMNS = 4;
const SUPPLY_ICON_SIZE = 32;
const DAFFODIL_CANAL_COLOR = '#f7d65a';
const DAFFODIL_CANAL_GLOW = 'rgba(247, 214, 90, 0.52)';
const TARGET_FPS = 60;
const NATURAL_BIO_PER_SECOND = 1;

const spriteMapping = {
  '버섯': { row: 0, col: 0 },
  '곰팡이': { row: 0, col: 1 },
  '짚신벌레': { row: 0, col: 2 },
  '아메바': { row: 0, col: 3 },
  '해캄': { row: 0, col: 4 },
  '대장균': { row: 1, col: 0 },
  '젖산균': { row: 1, col: 1 },
  '이스트': { row: 1, col: 2 },
  '고초균': { row: 1, col: 3 },
  '화산 버섯': { row: 1, col: 4 },
  '네온 곰팡이': { row: 2, col: 0 },
  '메가 이스트': { row: 2, col: 1 },
  '누룩곰팡이': { row: 2, col: 2 },
  '아세트산균': { row: 2, col: 3 },
  '슈퍼 젖산균': { row: 2, col: 4 },
  '구름 이스트': { row: 3, col: 0 },
  '매콤 젖산균': { row: 3, col: 1 },
  '달콤 이스트': { row: 3, col: 2 },
  '황금 젖산균': { row: 3, col: 3 },
  '끈적 고초균': { row: 3, col: 4 }
};

// 미생물 모양을 그리거나 이미지 스프라이트를 렌더링하는 함수
const drawMicrobe = (ctx, type, name, x, y, size, angle, state, glowColor, time, focusMode, spritesheetImg) => {
  ctx.save();
  
  // 이름 길이와 코드를 활용해 고정된 위상 오프셋 생성 (x좌표를 쓰면 이동 시 위상이 급변하여 진동 발생)
  let phase = 0;
  for (let i = 0; i < name.length; i++) {
    phase += name.charCodeAt(i);
  }

  // 아주 느린 상하 진동(호흡) 효과 추가 (균류 계열에만 적용)
  let offsetY = 0;
  if (state !== 'expedition' && (type === 'mushroom' || type === 'mold' || type === 'spore_jelly' || type === 'koji_mold' || type === 'yeast' || type === 'mega_yeast')) {
    // 진동수(0.01)로 아주 서서히 오르락내리락하도록 설정
    offsetY = Math.sin(time * 0.01 + phase) * 4; 
  }
  ctx.translate(x, y + offsetY);

  // 시각적으로 뒤집히지 않도록 각도 보정 (-PI/2 ~ PI/2 사이로 유지)
  let renderAngle = angle;
  let flipX = 1;
  
  while (renderAngle > Math.PI) renderAngle -= Math.PI * 2;
  while (renderAngle <= -Math.PI) renderAngle += Math.PI * 2;

  if (renderAngle > Math.PI / 2 || renderAngle < -Math.PI / 2) {
    flipX = -1; // 좌우 반전
    if (renderAngle > 0) renderAngle = Math.PI - renderAngle;
    else renderAngle = -Math.PI - renderAngle;
  }

  // 1. Stardew Valley 스타일 식물/균류형 흔들림 효과 (Wobble)
  if (type === 'mushroom' || type === 'mold' || type === 'spore_jelly' || type === 'spirogyra' || type === 'koji_mold' || type === 'yeast' || type === 'mega_yeast') {
    const wobbleSpeed = 0.015; // 덜덜거리지 않도록 매우 느리게
    const wobbleAmt = 0.03;
    const squash = 1.0 + Math.sin(time * wobbleSpeed + phase) * wobbleAmt;
    const stretch = 1.0 - Math.sin(time * wobbleSpeed + phase) * wobbleAmt;
    ctx.scale(squash * flipX, stretch);
  } else {
    ctx.scale(flipX, 1);
  }

  ctx.rotate(renderAngle);

  // 2. 스프라이트 시트가 있고 매핑 정보가 있는 경우 그리기
  const sprite = spriteMapping[name];
  if (spritesheetImg && sprite) {
    ctx.imageSmoothingEnabled = true;
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
    const cellW = spritesheetImg.width / SPRITE_COLUMNS;
    const cellH = spritesheetImg.height / SPRITE_ROWS;
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

const drawPlanetSprite = (ctx, sheet, planetIdx, x, y, size, locked) => {
  if (!sheet) return false;

  const cellW = sheet.width / PLANET_SPRITE_COLUMNS;
  const cellH = sheet.height / PLANET_SPRITE_ROWS;
  const col = planetIdx % PLANET_SPRITE_COLUMNS;
  const row = Math.floor(planetIdx / PLANET_SPRITE_COLUMNS);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  ctx.filter = 'none';
  if (locked) {
    ctx.globalAlpha = 0.55;
  }
  ctx.drawImage(
    sheet,
    col * cellW, row * cellH, cellW, cellH,
    x - size / 2, y - size / 2, size, size
  );
  ctx.restore();
  return true;
};

const drawSupplyIconSprite = (ctx, sheet, planetIdx, x, y, size) => {
  if (!sheet || planetIdx < 0) return false;

  const col = planetIdx % SUPPLY_ICON_COLUMNS;
  const row = Math.floor(planetIdx / SUPPLY_ICON_COLUMNS);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    sheet,
    col * SUPPLY_ICON_SIZE, row * SUPPLY_ICON_SIZE, SUPPLY_ICON_SIZE, SUPPLY_ICON_SIZE,
    x - size / 2, y - size / 2, size, size
  );
  ctx.restore();
  return true;
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
  const expStartFramesRef = useRef({});
  const spritesheetImgRef = useRef(null);
  const nutrientsRef = useRef([]); // 배양액 내부 유기 영양분
  const starsRef = useRef([]);
  const focusedMicrobeRef = useRef(focusedMicrobe);
  const onPlanetClickRef = useRef(onPlanetClick);
  const addBioEnergyRef = useRef(addBioEnergy);
  const expeditionsRef = useRef(expeditions);

  // 타일 텍스처 이미지 Refs
  const brightSpaceTileImgRef = useRef(null);
  const pondWaterTileImgRef = useRef(null);
  const planetsSpritesheetRef = useRef(null);
  const iconsSpritesheetRef = useRef(null);
  const brightSpacePatternRef = useRef(null);
  const pondWaterPatternRef = useRef(null);

  // 1. 타일 이미지 및 스프라이트시트 로딩
  useEffect(() => {
    const spaceImg = new Image();
    spaceImg.src = '/images/bright_space_tile.png';
    spaceImg.onload = () => { brightSpaceTileImgRef.current = spaceImg; };

    const waterImg = new Image();
    waterImg.src = '/images/pond_water_tile.png';
    waterImg.onload = () => { pondWaterTileImgRef.current = waterImg; };

    const pSheet = new Image();
    pSheet.src = '/images/planets_spritesheet.webp';
    pSheet.onload = () => { planetsSpritesheetRef.current = pSheet; };

    const iSheet = new Image();
    iSheet.src = '/images/icons_spritesheet.webp';
    iSheet.onload = () => { iconsSpritesheetRef.current = iSheet; };
  }, []);

  // 2. 미생물 스프라이트 시트 이미지 로딩
  useEffect(() => {
    const sheetImg = new Image();
    sheetImg.src = '/images/microbes_spritesheet_full.png';
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
  const draggedMicrobeRef = useRef(null);

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
  const tankBounds = {
    minX: 4000 - 800 / 2,
    maxX: 4000 + 800 / 2,
    minY: 3000 - 600 / 2,
    maxY: 3000 + 600 / 2
  };

  const particlesRef = useRef([]);
  const textPopupsRef = useRef([]);
  const microbesRef = useRef(microbes);

  useEffect(() => {
    focusedMicrobeRef.current = focusedMicrobe;
  }, [focusedMicrobe]);

  useEffect(() => {
    onPlanetClickRef.current = onPlanetClick;
  }, [onPlanetClick]);

  useEffect(() => {
    addBioEnergyRef.current = addBioEnergy;
  }, [addBioEnergy]);

  useEffect(() => {
    expeditionsRef.current = expeditions;
  }, [expeditions]);

  const spawnParticle = (props) => {
    const pool = particlesRef.current;
    for (let i = 0; i < pool.length; i++) {
      if (!pool[i].active) {
        Object.assign(pool[i], {
          isFoodParticle: false,
          isPixelStar: false,
          isBubble: false
        }, props, { active: true });
        return;
      }
    }
    pool.push({
      isFoodParticle: false,
      isPixelStar: false,
      isBubble: false,
      ...props,
      active: true
    });
  };

  const spawnTextPopup = (props) => {
    const pool = textPopupsRef.current;
    for (let i = 0; i < pool.length; i++) {
      if (!pool[i].active) {
        Object.assign(pool[i], props, { active: true });
        return;
      }
    }
    pool.push({ ...props, active: true });
  };

  const findOpenSpawnPosition = (preferredX, preferredY, occupiedMicrobes) => {
    const margin = 34;
    const minDistance = 58;
    const clampX = (value) => Math.max(tankBounds.minX + margin, Math.min(tankBounds.maxX - margin, value));
    const clampY = (value) => Math.max(tankBounds.minY + margin, Math.min(tankBounds.maxY - margin, value));
    const isOpen = (x, y) => occupiedMicrobes.every(m => {
      if (m.state === 'expedition') return true;
      const dx = x - m.x;
      const dy = y - m.y;
      return Math.sqrt(dx * dx + dy * dy) >= minDistance;
    });

    const baseX = clampX(preferredX ?? collector.x);
    const baseY = clampY(preferredY ?? collector.y);
    if (isOpen(baseX, baseY)) return { x: baseX, y: baseY };

    for (let ring = 1; ring <= 8; ring++) {
      const radius = ring * minDistance;
      const steps = 8 + ring * 4;
      const phase = ring * 0.73;
      for (let step = 0; step < steps; step++) {
        const angle = phase + (Math.PI * 2 * step) / steps;
        const x = clampX(baseX + Math.cos(angle) * radius);
        const y = clampY(baseY + Math.sin(angle) * radius);
        if (isOpen(x, y)) return { x, y };
      }
    }

    return {
      x: clampX(baseX + (Math.random() - 0.5) * 260),
      y: clampY(baseY + (Math.random() - 0.5) * 220)
    };
  };

  // props로 전달받은 미생물 목록과 로컬 Ref 목록 간 유연한 동기화
  useEffect(() => {
    const currentRefMap = new Map(microbesRef.current.map(m => [m.id, m]));
    const updatedList = [];
    microbes.forEach(m => {
      if (currentRefMap.has(m.id)) {
        const oldM = currentRefMap.get(m.id);
        // 상태가 변경되었을 때(예: 'mining' -> 'expedition')는 상위 컴포넌트(App.jsx)의 좌표 등 초기화 값을 그대로 수용
        if (oldM.state !== m.state) {
          updatedList.push({ ...m });
          return;
        }
        // 상태가 유지 중일 때는 로컬 물리 시뮬레이션의 위치 및 속도 값을 우선함
        updatedList.push({
          ...m,
          x: oldM.x,
          y: oldM.y,
          vx: oldM.vx,
          vy: oldM.vy,
          angle: oldM.angle,
          energyCurrent: oldM.energyCurrent
        });
        return;
      } else {
        // 새로 추가된 미생물 (스폰/조합)
        const spawnPosition = findOpenSpawnPosition(m.x, m.y, updatedList);
        updatedList.push({
          ...m,
          x: spawnPosition.x,
          y: spawnPosition.y
        });
      }
    });
    microbesRef.current = updatedList;
  }, [microbes]);

  // 새로운 미생물 소환 감지 시 소환된 위치에서 불꽃 파티클 이펙트
  const prevMicrobesRef = useRef(microbes);
  useEffect(() => {
    if (microbes.length > prevMicrobesRef.current.length) {
      const prevIds = new Set(prevMicrobesRef.current.map(m => m.id));
      const newMicrobes = microbes.filter(m => !prevIds.has(m.id));
      
      newMicrobes.forEach(newM => {
        for (let i = 0; i < 25; i++) {
          const angleVal = Math.random() * Math.PI * 2;
          const pSpeed = 1.5 + Math.random() * 4.0;
          spawnParticle({
            x: newM.x,
            y: newM.y,
            vx: Math.cos(angleVal) * pSpeed,
            vy: Math.sin(angleVal) * pSpeed,
            color: ['#ffb300', '#ffa726', '#66bb6a', '#29b6f6', '#ab47bc'][Math.floor(Math.random() * 5)],
            size: 3 + Math.floor(Math.random() * 3),
            life: 30 + Math.floor(Math.random() * 20),
            isPixelStar: true
          });
        }
      });
    }
    prevMicrobesRef.current = microbes;
  }, [microbes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // 4. 물리 시뮬레이션 계산
    const updatePhysics = () => {
      const microbesList = microbesRef.current;
      
      // 1. 개별 상태 및 물리 갱신
      for (let i = 0; i < microbesList.length; i++) {
        let m = microbesList[i];
        if (draggedMicrobeRef.current && draggedMicrobeRef.current.id === m.id) {
          // 드래그 중인 개체는 마우스 이벤트에서 위치가 갱신되므로 물리 스킵
          continue;
        }

        let { x, y, vx, vy, state, energyCurrent, energyCapacity, speed, targetPlanetId, angle } = m;
        
        const tankWidth = 800;
        const tankHeight = 600;
        const minX = 4000 - tankWidth / 2;
        const maxX = 4000 + tankWidth / 2;
        const minY = 3000 - tankHeight / 2;
        const maxY = 3000 + tankHeight / 2;

        if (state === 'merging') {
          const targetX = m.mergeTargetX ?? x;
          const targetY = m.mergeTargetY ?? y;
          const dx = targetX - x;
          const dy = targetY - y;
          const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          x += dx * 0.18;
          y += dy * 0.18;
          vx = 0;
          vy = 0;
          angle = Math.atan2(dy, dx);

          if (timeRef.current % 4 === 0) {
            spawnParticle({
              x,
              y,
              vx: (Math.random() - 0.5) * 1.6,
              vy: (Math.random() - 0.5) * 1.6,
              color: m.glowColor || '#ffca28',
              size: 2 + Math.floor(Math.random() * 2),
              life: 18,
              isPixelStar: true
            });
          }

          if (dist < 4) {
            x = targetX;
            y = targetY;
          }
        } else if (state === 'mining') {
          // 물속을 둥둥 떠다니는 부유 시뮬레이션
          let curAngle = (angle === undefined || isNaN(angle)) ? Math.random() * Math.PI * 2 : angle;
          if (m.floatPhase === undefined) m.floatPhase = Math.random() * Math.PI * 2;
          if (m.wanderTurn === undefined) m.wanderTurn = (Math.random() - 0.5) * 0.018;

          curAngle += Math.sin(timeRef.current * 0.012 + m.floatPhase) * 0.012 + m.wanderTurn;
          if (Math.random() < 0.006) {
            m.wanderTurn = (Math.random() - 0.5) * 0.018;
          }
          angle = curAngle;

          const floatForce = 0.018 * speed;
          vx += Math.cos(curAngle) * floatForce;
          vy += Math.sin(curAngle) * floatForce;

          const centerDx = x - collector.x;
          const centerDy = y - collector.y;
          const centerDist = Math.max(1, Math.sqrt(centerDx * centerDx + centerDy * centerDy));
          if (centerDist < 180) {
            const repel = (180 - centerDist) / 180 * 0.035;
            vx += (centerDx / centerDist) * repel;
            vy += (centerDy / centerDist) * repel;
          }

          const edgePadding = 90;
          if (x < minX + edgePadding) vx += 0.025;
          if (x > maxX - edgePadding) vx -= 0.025;
          if (y < minY + edgePadding) vy += 0.025;
          if (y > maxY - edgePadding) vy -= 0.025;

          // 부유 유영 중에 주변 영양분에 가까이 닿았는지(16px 이하) 검증
          let touchedNutrient = null;
          for (let j = 0; j < nutrientsRef.current.length; j++) {
            const nut = nutrientsRef.current[j];
            const d = Math.sqrt(Math.pow(nut.x - x, 2) + Math.pow(nut.y - y, 2));
            if (d <= 16) {
              touchedNutrient = nut;
              break;
            }
          }

          if (touchedNutrient) {
            nutrientsRef.current = nutrientsRef.current.filter(n => n.id !== touchedNutrient.id);
            energyCurrent += energyCapacity * 0.25;
            if (energyCurrent >= energyCapacity) {
              energyCurrent = energyCapacity;
              state = 'returning';
            }
            spawnTextPopup({
              x: x, y: y - 12, text: "+1 Bio", color: m.glowColor || '#ffca28', alpha: 1.0, life: 40
            });
            for (let k = 0; k < 5; k++) {
              const angleVal = Math.random() * Math.PI * 2;
              const pSpeed = 0.5 + Math.random() * 1.5;
              spawnParticle({
                x: x, y: y, vx: Math.cos(angleVal) * pSpeed, vy: Math.sin(angleVal) * pSpeed,
                color: '#ffca28', size: 2 + Math.floor(Math.random() * 2), life: 15 + Math.floor(Math.random() * 8), isPixelStar: true
              });
            }
          }

          // 자연 수집량 축적: 지급 Bio(capacity)와 자연 수집 시간(초)을 1:1로 맞춤
          energyCurrent += NATURAL_BIO_PER_SECOND / TARGET_FPS;
          if (energyCurrent >= energyCapacity) {
            energyCurrent = energyCapacity;
            state = 'returning';
          }
        } else if (state === 'returning') {
          // 중앙 포탈로 복귀 및 에너지 납품
          const dx = collector.x - x;
          const dy = collector.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < collector.radius + 10) {
            const harvestAmount = Math.round(energyCapacity);
            addBioEnergyRef.current(harvestAmount);
            spawnTextPopup({
              x: x, y: y - 12, text: `+${harvestAmount}`, color: m.glowColor, alpha: 1.0, life: 40
            });
            for (let k = 0; k < 10; k++) {
              const angleVal = Math.random() * Math.PI * 2;
              const pSpeed = 1.0 + Math.random() * 2.5;
              spawnParticle({
                x: collector.x, y: collector.y, vx: Math.cos(angleVal) * pSpeed, vy: Math.sin(angleVal) * pSpeed,
                color: m.glowColor || '#ffb300', size: 2 + Math.floor(Math.random() * 2), life: 20 + Math.floor(Math.random() * 12), isPixelStar: true
              });
            }
            energyCurrent = 0;
            state = 'mining';
            const scatterAngle = Math.atan2(y - collector.y, x - collector.x) + (Math.random() - 0.5) * 0.9;
            vx = Math.cos(scatterAngle) * (1.2 + Math.random() * 0.8);
            vy = Math.sin(scatterAngle) * (1.2 + Math.random() * 0.8);
            angle = scatterAngle;
          } else {
            // 포탈 방향으로 가속 (하지만 이미 충분히 빠른 관성이 있으면 더하지 않음)
            const returnVx = (dx / dist) * 0.8 * speed;
            const returnVy = (dy / dist) * 0.8 * speed;
            if (Math.sqrt(vx * vx + vy * vy) < 2.0) {
              vx += (returnVx - vx) * 0.05;
              vy += (returnVy - vy) * 0.05;
            }
          }
        } else if (state === 'expedition') {
          const targetPlanet = foodPlanets.find(p => p.id === targetPlanetId);
          if (targetPlanet) {
            const expeditionStatus = expeditionsRef.current?.[targetPlanetId]?.status;
            const hasReachedPlanet = expeditionStatus && expeditionStatus !== 'exploring';
            if (!hasReachedPlanet && !expStartFramesRef.current[targetPlanetId]) {
              expStartFramesRef.current[targetPlanetId] = timeRef.current;
            }
            const startFrame = expStartFramesRef.current[targetPlanetId] || timeRef.current;
            const elapsed = hasReachedPlanet ? 360 : timeRef.current - startFrame;
            
            // 배양조 끝부분 위치 계산
            const angleToPlanet = Math.atan2(targetPlanet.y - 3000, targetPlanet.x - 4000);
            const edgeX = 4000 + Math.cos(angleToPlanet) * 380;
            const edgeY = 3000 + Math.sin(angleToPlanet) * 280;

            if (elapsed < 60) {
              // 처음 1초(60프레임) 동안 중앙에서 배양조 끝부분으로 이동
              const t = elapsed / 60;
              const easeOut = 1 - Math.pow(1 - t, 3);
              const oldX = x;
              const oldY = y;
              x = 4000 + (edgeX - 4000) * easeOut;
              y = 3000 + (edgeY - 3000) * easeOut;
              vx = 0; vy = 0;
              if (elapsed > 0) {
                angle = Math.atan2(y - oldY, x - oldX);
              }
            } else {
              // 배양조 끝부분 도달 후 5초(300프레임) 동안 수로를 따라 이동
              const progress = Math.min(1.0, (elapsed - 60) / 300.0);
              
              if (progress < 1.0) {
                // 곡선 수로 제어점 계산
                const dx = targetPlanet.x - edgeX;
                const dy = targetPlanet.y - edgeY;
                const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
                const targetPlanetIdx = foodPlanets.findIndex(p => p.id === targetPlanet.id);
                const bendDir = (targetPlanetIdx % 2 === 0) ? 1 : -1;
                const cp1x = edgeX + dx * 0.33 - (dy / dist) * 150 * bendDir;
                const cp1y = edgeY + dy * 0.33 + (dx / dist) * 150 * bendDir;
                const cp2x = edgeX + dx * 0.66 + (dy / dist) * 150 * bendDir;
                const cp2y = edgeY + dy * 0.66 - (dx / dist) * 150 * bendDir;

                const mt = 1 - progress;
                const oldX = x;
                const oldY = y;
                x = mt*mt*mt*edgeX + 3*mt*mt*progress*cp1x + 3*mt*progress*progress*cp2x + progress*progress*progress*targetPlanet.x;
                y = mt*mt*mt*edgeY + 3*mt*mt*progress*cp1y + 3*mt*progress*progress*cp2y + progress*progress*progress*targetPlanet.y;
                vx = 0; vy = 0;
                
                if (progress > 0) {
                  angle = Math.atan2(y - oldY, x - oldX);
                }
              } else {
                // 도착 후 궤도 회전
                const dx = targetPlanet.x - x;
                const dy = targetPlanet.y - y;
                const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
                const orbitRadius = 45;
                const radialForce = (dist - orbitRadius) * 0.05;
                const tangentX = -dy / dist;
                const tangentY = dx / dist;
                const orbitSpeed = 1.5;
                
                const desiredVx = tangentX * orbitSpeed + (dx / dist) * radialForce;
                const desiredVy = tangentY * orbitSpeed + (dy / dist) * radialForce;
                
                vx += (desiredVx - vx) * 0.1;
                vy += (desiredVy - vy) * 0.1;
              }
            }
          }
        }

        // 물리 마찰 (마찰력을 줄여 던졌을 때 멀리 미끄러지도록 함)
        if (state !== 'expedition') {
          vx *= 0.98;
          vy *= 0.98;
        } else {
          vx *= 0.985;
          vy *= 0.985;
        }

        if (state === 'mining') {
          const maxFloatSpeed = 1.45;
          const currentSpeed = Math.sqrt(vx * vx + vy * vy);
          if (currentSpeed > maxFloatSpeed) {
            vx = (vx / currentSpeed) * maxFloatSpeed;
            vy = (vy / currentSpeed) * maxFloatSpeed;
          }
        }

        x += vx;
        y += vy;

        // 경계 벽 반사 (당구 쿠션) - 탄성을 크게 주어 잘 튕기게 함
        if (state === 'expedition') {
          if (x < 30) { x = 30; vx *= -0.8; }
          if (x > 8000 - 30) { x = 8000 - 30; vx *= -0.8; }
          if (y < 30) { y = 30; vy *= -0.8; }
          if (y > 6000 - 30) { y = 6000 - 30; vy *= -0.8; }
        } else {
          const margin = 24;
          if (x < minX + margin) { x = minX + margin; vx *= -0.8; }
          if (x > maxX - margin) { x = maxX - margin; vx *= -0.8; }
          if (y < minY + margin) { y = minY + margin; vy *= -0.8; }
          if (y > maxY - margin) { y = maxY - margin; vy *= -0.8; }
        }

        if (state === 'expedition' || Math.sqrt(vx * vx + vy * vy) > 0.05) {
          const targetAngle = Math.atan2(vy, vx);
          if (angle === undefined || isNaN(angle)) {
            angle = targetAngle;
          } else {
            let diff = targetAngle - angle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff <= -Math.PI) diff += Math.PI * 2;
            angle += diff * 0.08;
          }
        }

        m.x = x; m.y = y; m.vx = vx; m.vy = vy;
        m.state = state; m.energyCurrent = energyCurrent; m.angle = angle;
      }

      // 2. 쌍방향 탄성 충돌 (포켓볼 당구 물리)
      for (let i = 0; i < microbesList.length; i++) {
        for (let j = i + 1; j < microbesList.length; j++) {
          let m1 = microbesList[i];
          let m2 = microbesList[j];
          if (m1.state === 'merging' || m2.state === 'merging') continue;
          
          const dx = m1.x - m2.x;
          const dy = m1.y - m2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minColDist = 45; // 충돌 기준 반경
          
          if (dist < minColDist && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;
            
            // 상대 속도 계산
            const rvx = m1.vx - m2.vx;
            const rvy = m1.vy - m2.vy;
            const velAlongNormal = rvx * nx + rvy * ny;
            
            // 서로 다가오고 있을 때만 운동량 교환
            if (velAlongNormal < 0) {
              const restitution = 0.85; // 완전 탄성에 가까운 당구공 반발 계수
              const impulse = -(1 + restitution) * velAlongNormal * 0.5; // 질량 1 가정
              
              const m1IsDragged = draggedMicrobeRef.current && draggedMicrobeRef.current.id === m1.id;
              const m2IsDragged = draggedMicrobeRef.current && draggedMicrobeRef.current.id === m2.id;

              // 드래그 중인 미생물은 무한 질량처럼 다른 미생물을 밀어침 (속도 감소 없음)
              if (!m1IsDragged) {
                m1.vx += nx * impulse;
                m1.vy += ny * impulse;
              }
              if (!m2IsDragged) {
                m2.vx -= nx * impulse;
                m2.vy -= ny * impulse;
              }

              // 겹침 위치 즉각 보정 (단단한 충돌)
              const overlap = minColDist - dist;
              if (overlap > 0) {
                const correction = overlap / 2;
                if (!m1IsDragged) { m1.x += nx * correction; m1.y += ny * correction; }
                if (!m2IsDragged) { m2.x -= nx * correction; m2.y -= ny * correction; }
              }
            }
          }
        }
      }

      microbesRef.current = microbesList;
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
      ctx.imageSmoothingEnabled = true;
      ctx.mozImageSmoothingEnabled = true;
      ctx.webkitImageSmoothingEnabled = true;
      ctx.msImageSmoothingEnabled = true;

      // 카메라 오프셋 적용 시작
      ctx.save();
      ctx.translate(-cameraRef.current.x, -cameraRef.current.y);

      // 5.1. 우주 배경 (밝은 우주 무봉제 타일 렌더링)
      if (brightSpaceTileImgRef.current) {
        if (!brightSpacePatternRef.current) {
          brightSpacePatternRef.current = ctx.createPattern(brightSpaceTileImgRef.current, 'repeat');
        }
        ctx.fillStyle = brightSpacePatternRef.current;
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
        if (!pondWaterPatternRef.current) {
          pondWaterPatternRef.current = ctx.createPattern(pondWaterTileImgRef.current, 'repeat');
        }
        ctx.fillStyle = pondWaterPatternRef.current;
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

      // 5.2.5. 탐사 및 보급 수로 렌더링 (탱크 테두리를 자연스럽게 뚫고 나오도록 클리핑)
      ctx.save();
      ctx.beginPath();
      // 화면 전체 영역 지정 (허용 영역)
      ctx.rect(cameraRef.current.x - 200, cameraRef.current.y - 200, dimensions.width + 400, dimensions.height + 400);
      // 배양조 내부 구멍 지정 (제외 영역) - 테두리를 완전히 덮기 위해 5px 축소
      const shrink = 5;
      ctx.roundRect(minX + shrink, minY + shrink, (maxX - minX) - shrink * 2, (maxY - minY) - shrink * 2, 19);
      ctx.clip('evenodd');

      foodPlanets.forEach((planet, planetIdx) => {
        const exp = expeditionsRef.current && expeditionsRef.current[planet.id];
        if (exp && (exp.status === 'exploring' || exp.status === 'complete' || exp.status === 'supplying')) {
          
          if (exp.status === 'exploring') {
            if (!expStartFramesRef.current[planet.id]) {
              expStartFramesRef.current[planet.id] = time;
            }
          } else {
            if (expStartFramesRef.current[planet.id]) {
              delete expStartFramesRef.current[planet.id];
            }
          }

          let progress = 1.0;
          if (exp.status === 'exploring') {
            const startFrame = expStartFramesRef.current[planet.id] || time;
            const elapsedFrames = time - startFrame;
            if (elapsedFrames < 60) {
              progress = 0;
            } else {
              progress = Math.min(1.0, (elapsedFrames - 60) / 300.0);
            }
          }

          if (progress > 0) {
            const angleToPlanet = Math.atan2(planet.y - 3000, planet.x - 4000);
            const edgeX = 4000 + Math.cos(angleToPlanet) * 380;
            const edgeY = 3000 + Math.sin(angleToPlanet) * 280;

            const dx = planet.x - edgeX;
            const dy = planet.y - edgeY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const bendDir = (planetIdx % 2 === 0) ? 1 : -1;
            const cp1x = edgeX + dx * 0.33 - (dy / dist) * 150 * bendDir;
            const cp1y = edgeY + dy * 0.33 + (dx / dist) * 150 * bendDir;
            const cp2x = edgeX + dx * 0.66 + (dy / dist) * 150 * bendDir;
            const cp2y = edgeY + dy * 0.66 - (dx / dist) * 150 * bendDir;

            const drawCanalPath = (ctx) => {
              ctx.beginPath();
              ctx.moveTo(edgeX, edgeY);
              if (progress >= 1.0) {
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, planet.x, planet.y);
              } else {
                const steps = 40;
                const currentStep = Math.floor(progress * steps);
                for (let i = 1; i <= currentStep; i++) {
                  const t = i / steps;
                  const mt = 1 - t;
                  const px = mt*mt*mt*edgeX + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*planet.x;
                  const py = mt*mt*mt*edgeY + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*planet.y;
                  ctx.lineTo(px, py);
                }
                if (progress > 0 && progress < 1.0) {
                  const mt = 1 - progress;
                  const px = mt*mt*mt*edgeX + 3*mt*mt*progress*cp1x + 3*mt*progress*progress*cp2x + progress*progress*progress*planet.x;
                  const py = mt*mt*mt*edgeY + 3*mt*mt*progress*cp1y + 3*mt*progress*progress*cp2y + progress*progress*progress*planet.y;
                  ctx.lineTo(px, py);
                }
              }
            };

            ctx.save();
            
            // 1. 수로 테두리 (탱크 테두리와 동일한 색상으로 자연스럽게 이어짐)
            drawCanalPath(ctx);
            ctx.lineWidth = 28;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#455a64';
            ctx.stroke();

            // 2. 수로 내부 물길
            drawCanalPath(ctx);
            ctx.lineWidth = 20;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            if (exp.status === 'exploring' || exp.status === 'complete') {
              ctx.strokeStyle = DAFFODIL_CANAL_COLOR;
            } else if (pondWaterTileImgRef.current) {
              if (!pondWaterPatternRef.current) {
                pondWaterPatternRef.current = ctx.createPattern(pondWaterTileImgRef.current, 'repeat');
              }
              ctx.strokeStyle = pondWaterPatternRef.current;
            } else {
              ctx.strokeStyle = '#00e5ff';
            }
            ctx.stroke();

            // 3. 테두리 네온 튜브 라인
            drawCanalPath(ctx);
            ctx.lineWidth = 24;
            ctx.lineJoin = 'round';
            if (exp.status === 'exploring' || exp.status === 'complete') {
              ctx.strokeStyle = DAFFODIL_CANAL_GLOW;
              ctx.setLineDash([15, 10]);
              ctx.lineDashOffset = -time * 1.5;
              ctx.shadowBlur = 15;
              ctx.shadowColor = DAFFODIL_CANAL_COLOR;
            } else { // supplying
              ctx.strokeStyle = 'rgba(76, 175, 80, 0.4)';
              ctx.shadowBlur = 15;
              ctx.shadowColor = '#4caf50';
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // 보급 물자(재료) 흐르는 효과 (5초 주기)
            if (exp.status === 'supplying') {
              const offsetTime = time + Math.floor(planet.x);
              let dropProgress = (offsetTime % 300) / 300;
              
              // 배양조 가장자리에 도착한 순간(주기 완료) 자원 획득 처리
              if (offsetTime % 300 === 0 && time > 0) {
                addBioEnergyRef.current(planet.rewardAmount);
                spawnTextPopup({
                  x: edgeX,
                  y: edgeY - 20,
                  text: `+${planet.rewardAmount}`,
                  color: planet.color || '#4caf50',
                  alpha: 1.0,
                  life: 40
                });
                
                // 도착 파티클 효과
                for (let k = 0; k < 5; k++) {
                  const angleVal = Math.random() * Math.PI * 2;
                  spawnParticle({
                    x: edgeX, y: edgeY, 
                    vx: Math.cos(angleVal) * 2, vy: Math.sin(angleVal) * 2,
                    color: planet.color || '#4caf50', size: 3, life: 20, isPixelStar: true
                  });
                }
              }
              
              // 역방향: dropProgress가 0일 때 행성(t=1), 1일 때 배양조 가장자리(t=0)
              const t = 1 - dropProgress;
              const mt = 1 - t;
              
              const dropX = mt*mt*mt*edgeX + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*planet.x;
              const dropY = mt*mt*mt*edgeY + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*planet.y;
              
              ctx.save();
              ctx.font = '22px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              // 행성에서 방금 막 출발할 때만 살짝 페이드인
              if (dropProgress < 0.1) {
                ctx.globalAlpha = dropProgress / 0.1;
              }
              
              const iconDrawn = drawSupplyIconSprite(
                ctx,
                iconsSpritesheetRef.current,
                planetIdx,
                dropX,
                dropY,
                26
              );
              if (!iconDrawn) {
                ctx.fillText(planet.foodIcon || '📦', dropX, dropY);
              }
              ctx.restore();
            }
            ctx.restore();
          }
        }
      });
      ctx.restore();

      // 보글보글 거품 기포 발생
      if (time % 10 === 0 && Math.random() < 0.35) {
        spawnParticle({
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
      foodPlanets.forEach((planet, planetIdx) => {
        const exp = expeditionsRef.current && expeditionsRef.current[planet.id];
        const status = exp ? exp.status : 'locked';

        const hasRequiredMicrobe = microbesRef.current.some(m => m.name === planet.requiredMicrobe && m.state !== 'expedition');
        const isReadyToExplore = status === 'locked' && hasRequiredMicrobe;
        const isTrulyLocked = status === 'locked' && !hasRequiredMicrobe;

        ctx.save();
        ctx.shadowBlur = 0;

        const planetColor = isTrulyLocked ? '#b0bec5' : planet.color;

        // 행성 원체
        const planetSpriteDrawn = drawPlanetSprite(
          ctx,
          planetsSpritesheetRef.current,
          planetIdx,
          planet.x,
          planet.y,
          72,
          isTrulyLocked
        );

        if (!planetSpriteDrawn) {
          ctx.fillStyle = planetColor;
          ctx.strokeStyle = '#37474f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(planet.x, planet.y, 32, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fill();
        }

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

        if (!planetSpriteDrawn) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.font = '22px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(isTrulyLocked ? '❓' : planet.foodIcon, planet.x, planet.y);
        }

        ctx.fillStyle = isTrulyLocked ? '#78909c' : '#37474f';
        ctx.font = 'bold 12px DungGeunMo, Courier New';
        ctx.fillText(planet.name, planet.x, planet.y - 46);

        if (status === 'exploring') {
          ctx.fillStyle = '#00e5ff';
          ctx.font = 'bold 12px DungGeunMo, Courier New';
          ctx.fillText(`탐사 중... (${exp.timer}초)`, planet.x, planet.y + 55);
        }

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
      particlesRef.current.forEach(p => {
        if (!p.active) return;

        if (p.isFoodParticle) {
          p.progress += p.speed;
          const px = p.x + (p.targetX - p.x) * p.progress;
          const py = p.y + (p.targetY - p.y) * p.progress;

          const iSheet = iconsSpritesheetRef.current;
          if (iSheet && p.planetIdx !== undefined) {
            drawSupplyIconSprite(ctx, iSheet, p.planetIdx, px, py, 24);
          } else {
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
          }

          if (p.progress >= 1.0) {
            // 포탈 도착 시 자원 추가 및 팝업
            addBioEnergyRef.current(p.rewardAmount);
            
            spawnTextPopup({
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
              spawnParticle({
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
            p.active = false;
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

          if (p.life <= 0) p.active = false;
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

          if (p.life <= 0 || p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) p.active = false;
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

          if (p.progress >= 1.0) p.active = false;
        }
      });

      // 5.8. 미생물 무리 렌더링
      microbesRef.current.forEach(m => {
        const currentFocusedMicrobe = focusedMicrobeRef.current;
        const isFocused = currentFocusedMicrobe && currentFocusedMicrobe.id === m.id;
        const renderSize = m.state === 'merging'
          ? (m.size || 18) * (0.9 + Math.sin(time * 0.28) * 0.12)
          : (m.size || 18);
        
        // 미생물 아이콘 및 모양 그리기
        drawMicrobe(
          ctx, 
          m.avatarSvg, 
          m.name, 
          m.x, 
          m.y, 
          renderSize, 
          m.angle, 
          m.state, 
          m.glowColor, 
          time, 
          isFocused, 
          spritesheetImgRef.current
        );

        // 채굴 중 게이지 링 그리기 삭제됨 (사용자 요청)

        // 납품 귀환 시 하이라이트 링
        if (m.state === 'merging') {
          ctx.save();
          ctx.strokeStyle = m.glowColor || '#ffca28';
          ctx.globalAlpha = 0.35 + Math.sin(time * 0.2) * 0.18;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(m.x, m.y, 28 + Math.sin(time * 0.18) * 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

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
      textPopupsRef.current.forEach(t => {
        if (!t.active) return;

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
          t.active = false;
        }
      });

      // 5.10. 돋보기 관찰 포커스 가이드라인 그리기
      if (focusedMicrobeRef.current) {
        const fm = microbesRef.current.find(m => m.id === focusedMicrobeRef.current.id);
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

      // 화면 상태 갱신을 1초(60프레임) 단위로 줄여서 리액트 리렌더링 렉 최소화
      if (focusedMicrobeRef.current && time % 60 === 0) {
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
  }, [sectors, setMicrobes]);

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
    const canvas = canvasRef.current;
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);

    const rect = canvas.getBoundingClientRect();
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      camX: cameraRef.current.x,
      camY: cameraRef.current.y,
      rectLeft: rect.left,
      rectTop: rect.top
    };

    isDraggingRef.current = true;
    if (canvas) canvas.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);
    if (clientX === undefined || clientY === undefined) return;

    if (!isDraggingRef.current) return;

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
    draggedMicrobeRef.current = null;
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
        onPlanetClickRef.current?.(planet.id);
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
