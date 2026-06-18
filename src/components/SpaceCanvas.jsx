import React, { useRef, useEffect, useState } from 'react';

// 미생물 SVG를 Canvas에 직접 그리거나 벡터 패스로 구현하는 함수들
const drawMicrobe = (ctx, type, name, x, y, size, angle, state, glowColor, time, focusMode) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 네온 글로우 효과 설정
  ctx.shadowBlur = focusMode ? 20 : 8;
  ctx.shadowColor = glowColor;
  ctx.strokeStyle = glowColor;
  ctx.fillStyle = glowColor + '22'; // 반투명 내부 채우기
  ctx.lineWidth = focusMode ? 3 : 2;

  switch (type) {
    case 'paramecium': // 짚신벌레
    case 'jet_paramecium': // 제트 짚신벌레
      // 짚신 모양 타원
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 1.5, size * 0.7, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      // 세포구(입) 홈 그리기
      ctx.beginPath();
      ctx.arc(size * 0.2, size * 0.3, size * 0.2, Math.PI, Math.PI * 2);
      ctx.stroke();

      // 섬모 그리기 (꼬물거리는 애니메이션)
      const ciliaCount = 28;
      for (let i = 0; i < ciliaCount; i++) {
        const theta = (i / ciliaCount) * Math.PI * 2;
        const rx = size * 1.5;
        const ry = size * 0.7;
        const cx = rx * Math.cos(theta);
        const cy = ry * Math.sin(theta);
        
        // 섬모 꼬물거림 각도 오프셋
        const wave = Math.sin(time * 0.15 + i) * 3;
        const nx = Math.cos(theta) * (5 + wave);
        const ny = Math.sin(theta) * (5 + wave);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + nx, cy + ny);
        ctx.strokeStyle = glowColor + 'aa';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 제트 버스터 연출 (제트 짚신벌레만)
      if (name === '제트 짚신벌레') {
        ctx.shadowColor = '#00ffff';
        ctx.fillStyle = '#00ffffaa';
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
    case 'blackhole_amoeba': // 블랙홀 아메바
      // 위족(거짓발) 모양을 위한 노이즈 다각형 렌더링
      ctx.beginPath();
      const points = 10;
      for (let i = 0; i <= points; i++) {
        const theta = (i / points) * Math.PI * 2;
        // 시간차 펄스로 위족이 뻗어 나가는 애니메이션 구현
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

      // 위족 내부 핵(Nucleus) 그리기
      ctx.beginPath();
      ctx.arc(-size * 0.2, -size * 0.1, size * 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = glowColor + 'bb';
      ctx.fillStyle = glowColor + '44';
      ctx.stroke();
      ctx.fill();

      // 블랙홀 아메바 중앙 소용돌이 연출
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
      // 대나무 같은 직사각형 마디
      const width = size * 3;
      const height = size * 0.8;
      ctx.beginPath();
      ctx.rect(-width / 2, -height / 2, width, height);
      ctx.stroke();
      ctx.fill();

      // 마디 구분선
      ctx.beginPath();
      ctx.moveTo(-width / 6, -height / 2);
      ctx.lineTo(-width / 6, height / 2);
      ctx.moveTo(width / 6, -height / 2);
      ctx.lineTo(width / 6, height / 2);
      ctx.stroke();

      // 나선형 엽록체 그리기
      ctx.strokeStyle = '#adff2f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let tx = -width / 2; tx <= width / 2; tx += 2) {
        const ty = Math.sin((tx / width) * Math.PI * 5 + time * 0.08) * (height * 0.35);
        if (tx === -width / 2) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();
      break;

    case 'mushroom': // 버섯
    case 'volcano_mushroom': // 화산 버섯
      // 버섯 갓
      ctx.beginPath();
      ctx.arc(0, -size * 0.3, size * 0.9, Math.PI, 0, false);
      ctx.lineTo(0, -size * 0.3);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // 버섯 자루(기둥)
      ctx.beginPath();
      ctx.rect(-size * 0.25, -size * 0.3, size * 0.5, size * 1.1);
      ctx.stroke();
      ctx.fill();

      // 갓 아래 주름살 디테일
      ctx.strokeStyle = glowColor + 'aa';
      ctx.lineWidth = 1;
      for (let offset = -0.7; offset <= 0.7; offset += 0.35) {
        ctx.beginPath();
        ctx.moveTo(size * offset, -size * 0.3);
        ctx.lineTo(size * offset * 0.5, size * 0.2);
        ctx.stroke();
      }

      // 화산 버섯의 마그마 흐름 이펙트
      if (name === '화산 버섯') {
        ctx.fillStyle = '#ff3700';
        ctx.beginPath();
        ctx.arc(-size * 0.3, -size * 0.6, size * 0.15, 0, Math.PI * 2);
        ctx.arc(size * 0.4, -size * 0.5, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'mold': // 곰팡이
    case 'neon_mold': // 네온 곰팡이
      // 균사 기둥
      ctx.beginPath();
      ctx.moveTo(0, size);
      ctx.quadraticCurveTo(-size * 0.4, 0, -size * 0.5, -size * 0.4);
      ctx.moveTo(0, size);
      ctx.quadraticCurveTo(size * 0.2, size * 0.2, size * 0.6, -size * 0.2);
      ctx.moveTo(0, size);
      ctx.lineTo(0, -size * 0.6);
      ctx.stroke();

      // 포자낭 머리방울들
      ctx.fillStyle = glowColor;
      ctx.beginPath();
      ctx.arc(-size * 0.5, -size * 0.4, size * 0.25, 0, Math.PI * 2);
      ctx.arc(size * 0.6, -size * 0.2, size * 0.2, 0, Math.PI * 2);
      ctx.arc(0, -size * 0.6, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // 주변 미세 균사 포자망 (네온 곰팡이만)
      if (name === '네온 곰팡이') {
        ctx.strokeStyle = '#00ffcc44';
        ctx.beginPath();
        ctx.arc(0, 0, size * 1.8, 0, Math.PI * 2);
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      break;

    case 'spore_jelly': // 포자버섯 젤리 (균사+갓 융합)
      // 하단 곰팡이 균사
      ctx.beginPath();
      ctx.moveTo(-size * 0.5, size * 0.5);
      ctx.lineTo(0, size);
      ctx.lineTo(size * 0.5, size * 0.5);
      ctx.stroke();

      // 상단 버섯 갓
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.2, size * 1.1, size * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      // 흘러내리는 젤리 점막 연출
      ctx.fillStyle = glowColor + '55';
      ctx.beginPath();
      ctx.moveTo(-size * 0.8, -size * 0.2);
      ctx.quadraticCurveTo(-size * 0.4, size * 0.4 + Math.sin(time * 0.1) * 3, 0, -size * 0.1);
      ctx.quadraticCurveTo(size * 0.4, size * 0.4 + Math.cos(time * 0.1) * 3, size * 0.8, -size * 0.2);
      ctx.closePath();
      ctx.fill();
      break;

    case 'e_coli': // 대장균
      // 막대모향 캡슐
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 1.2, size * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      // 뒤쪽 편모(꼬리) 렌더링
      ctx.strokeStyle = glowColor + 'aa';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let tx = -size * 1.2; tx >= -size * 3.0; tx -= 2) {
        // 꼬리가 뱅글뱅글 꼬이는 애니메이션
        const ty = Math.sin((tx / size) * 4 + time * 0.2) * (size * 0.3);
        if (tx === -size * 1.2) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();
      break;

    case 'lactobacillus': // 젖산균
      // 사슬모양 동그라미 3개 연결
      ctx.beginPath();
      ctx.arc(-size * 0.8, 0, size * 0.45, 0, Math.PI * 2);
      ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
      ctx.arc(size * 0.8, 0, size * 0.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
      break;

    case 'sun_amoeba': // 우주 태양 아메바 (최상위 초월체)
      // 구체 몸체
      ctx.beginPath();
      ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      // 태양 코로나 같은 이글거리는 위족
      ctx.lineWidth = 2;
      const rays = 12;
      for (let j = 0; j < rays; j++) {
        const angleRay = (j / rays) * Math.PI * 2;
        const waveRay = Math.sin(time * 0.12 + j * 3) * (size * 0.4);
        const rx1 = size * 1.1;
        const rx2 = size * 1.7 + waveRay;
        ctx.beginPath();
        ctx.moveTo(rx1 * Math.cos(angleRay), rx1 * Math.sin(angleRay));
        ctx.lineTo(rx2 * Math.cos(angleRay), rx2 * Math.sin(angleRay));
        ctx.stroke();
      }
      break;

    default:
      // 기본 원형
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
  }

  // 자원 보유 상태바 (Focus 모드가 아닐 때 궤도 위에 그림)
  ctx.restore();
};

export default function SpaceCanvas({
  microbes,
  setMicrobes,
  sectors,
  addBioEnergy,
  focusedMicrobe,
  setFocusedMicrobe
}) {
  const canvasRef = useRef(null);
  const [time, setTime] = useState(0);

  // 성운(Nebula) 정보 정의 (각 섹터당 한 개씩 존재)
  const nebulas = [
    { id: 1, name: '오리온 성운 줄기', x: 250, y: 200, color: '#dd00ff', pulseColor: '#7a0099', unlocked: true },
    { id: 2, name: '보라매 게자리 행성', x: 750, y: 180, color: '#00ffaa', pulseColor: '#008855', unlocked: sectors >= 2 },
    { id: 3, name: '아메바성 블랙홀 외곽', x: 500, y: 550, color: '#ffff00', pulseColor: '#888800', unlocked: sectors >= 3 }
  ];

  // 포탈(중앙 에너지 수집기)
  const collector = { x: 500, y: 380, radius: 45, color: '#00ffff' };

  // 둥둥 떠다니는 파티클 배열 관리
  const particlesRef = useRef([]);
  // 수집 배달 시 텍스트 팝업 배열 관리
  const textPopupsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // 미생물들의 상태 업데이트 및 물리 작용
    const updatePhysics = () => {
      setMicrobes(prevMicrobes =>
        prevMicrobes.map(m => {
          let { x, y, vx, vy, state, targetX, targetY, energyCurrent, energyCapacity, speed, targetNebulaId, type, name } = m;
          
          // 1. 목표 성운 찾기
          const assignedNebula = nebulas.find(n => n.id === targetNebulaId && n.unlocked) || nebulas[0];
          
          // 2. 상태에 따른 목표지(Target) 및 이동 로직
          if (state === 'mining') {
            // 성운 주변을 공전하거나 배회
            // 성운 중심 기준 궤도 거리 계산
            const dx = assignedNebula.x - x;
            const dy = assignedNebula.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // 공전 궤도 반경
            const orbitRadius = type === 'mold' || type === 'mushroom' || type === 'spore_jelly' ? 50 : 80;

            if (dist > orbitRadius + 10) {
              // 성운 근처로 다가가기
              vx += (dx / dist) * 0.15 * speed;
              vy += (dy / dist) * 0.15 * speed;
            } else {
              // 성운 주변 궤도 운동 (공전 물리)
              // 수직 벡터 추가
              const perpX = -dy / dist;
              const perpY = dx / dist;
              vx += perpX * 0.08 * speed;
              vy += perpY * 0.08 * speed;
              
              // 살짝 궤도 반사
              vx += (dx / dist) * 0.02;
              vy += (dy / dist) * 0.02;
            }

            // 고정형 균류(버섯, 곰팡이)는 아주 조금만 흔들리도록 제한
            if (type === 'mold' || type === 'mushroom' || type === 'spore_jelly') {
              vx *= 0.1;
              vy *= 0.1;
            }

            // 자원 채굴량 축적
            energyCurrent += m.miningSpeed * 0.05;
            if (energyCurrent >= energyCapacity) {
              energyCurrent = energyCapacity;
              state = 'returning'; // 자원이 가득 차면 귀환 시작!
            }

            // 성운에서 에너지가 채굴되는 파티클 생성
            if (Math.random() < 0.05) {
              particlesRef.current.push({
                x: assignedNebula.x + (Math.random() - 0.5) * 40,
                y: assignedNebula.y + (Math.random() - 0.5) * 40,
                targetX: x,
                targetY: y,
                color: m.glowColor,
                progress: 0,
                speed: 0.02 + Math.random() * 0.03
              });
            }
          } else if (state === 'returning') {
            // 중앙 에너지 수집기(Portal)로 귀환
            const dx = collector.x - x;
            const dy = collector.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < collector.radius + 15) {
              // 수집기 도달 완료! 자원 반납
              const harvestAmount = Math.round(energyCapacity);
              addBioEnergy(harvestAmount);
              
              // 머리 위 텍스트 팝업 추가
              textPopupsRef.current.push({
                x: x,
                y: y - 20,
                text: `+${harvestAmount}`,
                color: m.glowColor,
                alpha: 1.0,
                life: 40
              });

              energyCurrent = 0;
              state = 'mining'; // 다시 채굴 상태로 복귀
            } else {
              // 수집기 방향으로 고속 비행
              vx = (dx / dist) * 3.5 * speed;
              vy = (dy / dist) * 3.5 * speed;
            }
          }

          // 마찰력 및 속도 한계 설정
          vx *= 0.95;
          vy *= 0.95;
          x += vx;
          y += vy;

          // 맵 밖으로 나가지 않도록 벽 바운스
          if (x < 30) { x = 30; vx *= -0.5; }
          if (x > canvas.width - 30) { x = canvas.width - 30; vx *= -0.5; }
          if (y < 30) { y = 30; vy *= -0.5; }
          if (y > canvas.height - 30) { y = canvas.height - 30; vy *= -0.5; }

          // 이동 방향 각도 계산
          let angle = Math.atan2(vy, vx);
          if (type === 'mold' || type === 'mushroom' || type === 'spore_jelly') {
            angle = -Math.PI / 2; // 식물/균류형은 고정형이므로 윗방향 고정
          }

          return { ...m, x, y, vx, vy, state, energyCurrent, angle };
        })
      );
    };

    // 프레임 렌더링 함수
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. 우주 배경 그리드 및 은하 연출
      ctx.fillStyle = '#060613';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 격자 무늬 배경
      ctx.strokeStyle = '#11112b';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. 성운(Nebula) 렌더링
      nebulas.forEach(nebula => {
        if (!nebula.unlocked) return;

        ctx.save();
        // 글로우 효과
        ctx.shadowBlur = 40 + Math.sin(time * 0.05) * 15;
        ctx.shadowColor = nebula.color;
        
        // 성운 코어 원 그리기
        const radGrd = ctx.createRadialGradient(
          nebula.x, nebula.y, 10,
          nebula.x, nebula.y, 60 + Math.sin(time * 0.02) * 10
        );
        radGrd.addColorStop(0, nebula.color + 'aa');
        radGrd.addColorStop(0.5, nebula.color + '44');
        radGrd.addColorStop(1, 'transparent');

        ctx.fillStyle = radGrd;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, 70 + Math.sin(time * 0.02) * 10, 0, Math.PI * 2);
        ctx.fill();
        
        // 성운 라벨 텍스트
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#ffffffbb';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(nebula.name, nebula.x, nebula.y - 80);
        
        ctx.restore();
      });

      // 3. 중앙 차원 에너지 수집기(Portal) 렌더링
      ctx.save();
      ctx.shadowBlur = 30 + Math.sin(time * 0.08) * 10;
      ctx.shadowColor = collector.color;

      // 수집기 외부 톱니바퀴형 회전 테두리
      ctx.translate(collector.x, collector.y);
      ctx.rotate(time * 0.01);
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, collector.radius, 0, Math.PI * 2);
      ctx.stroke();

      // 포탈 중심 홀로그램
      ctx.rotate(-time * 0.02 * 2);
      const collectorGrd = ctx.createRadialGradient(0, 0, 5, 0, 0, collector.radius);
      collectorGrd.addColorStop(0, '#00ffff');
      collectorGrd.addColorStop(0.6, '#0055aa88');
      collectorGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = collectorGrd;
      ctx.beginPath();
      ctx.arc(0, 0, collector.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 수집기 라벨
      ctx.fillStyle = '#00ffffcc';
      ctx.font = 'bold 11px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText("차원 에너지 수집기", collector.x, collector.y + 70);

      // 4. 채굴 파티클 그리기
      particlesRef.current.forEach((p, idx) => {
        p.progress += p.speed;
        // 베지어 곡선 비슷하게 성운에서 미생물로 날아가는 효과
        const px = p.x + (p.targetX - p.x) * p.progress;
        const py = p.y + (p.targetY - p.y) * p.progress;

        ctx.fillStyle = p.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();

        // 수명 다한 파티클 필터
        if (p.progress >= 1.0) {
          particlesRef.current.splice(idx, 1);
        }
      });

      // 5. 미생물들 그리기
      microbes.forEach(m => {
        const isFocused = focusedMicrobe && focusedMicrobe.id === m.id;
        drawMicrobe(ctx, m.avatarSvg, m.name, m.x, m.y, m.size || 18, m.angle, m.state, m.glowColor, time, isFocused);

        // 자원 충전량 프로그레스 링 그리기
        if (m.state === 'mining') {
          ctx.save();
          ctx.strokeStyle = '#ffffff22';
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

        // 수집기로 배달하러 갈 때 에너지 풀 상태 이펙트
        if (m.state === 'returning') {
          ctx.save();
          ctx.strokeStyle = '#ffffffaa';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(m.x, m.y, 24 + Math.sin(time * 0.2) * 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      });

      // 6. 자원 획득 텍스트 팝업 렌더링
      textPopupsRef.current.forEach((t, idx) => {
        ctx.save();
        ctx.fillStyle = t.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = t.color;
        ctx.font = 'bold 16px Courier New';
        ctx.textAlign = 'center';
        ctx.globalAlpha = t.alpha;
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();

        // 팝업 물리 작용 (위로 둥실 떠오름)
        t.y -= 0.6;
        t.life--;
        t.alpha = t.life / 40;

        if (t.life <= 0) {
          textPopupsRef.current.splice(idx, 1);
        }
      });

      // 7. 돋보기 관찰 포커스 링 (Focus Mode)
      if (focusedMicrobe) {
        const fm = microbes.find(m => m.id === focusedMicrobe.id);
        if (fm) {
          ctx.save();
          ctx.strokeStyle = '#ffffff88';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.arc(fm.x, fm.y, 45, 0, Math.PI * 2);
          ctx.stroke();
          
          // 포커스 안내 라벨
          ctx.fillStyle = '#ffffffcc';
          ctx.font = '11px Courier New';
          ctx.textAlign = 'center';
          ctx.setLineDash([]);
          ctx.fillText("관찰 중: " + fm.name, fm.x, fm.y - 52);
          ctx.restore();
        }
      }

      setTime(prev => prev + 1);
      updatePhysics();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [microbes, sectors, focusedMicrobe]);

  // 마우스/터치 클릭 시 미생물 포커스 처리
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 수집기 포털 클릭 시 해제
    const distToCollector = Math.sqrt(Math.pow(clickX - collector.x, 2) + Math.pow(clickY - collector.y, 2));
    if (distToCollector < collector.radius) {
      setFocusedMicrobe(null);
      return;
    }

    // 미생물 클릭 감지
    let clickedAny = false;
    for (let m of microbes) {
      const dist = Math.sqrt(Math.pow(clickX - m.x, 2) + Math.pow(clickY - m.y, 2));
      if (dist < 35) { // 터치 편의성을 위해 클릭 반경 넓게 잡음
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
    <div className="relative border-4 border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20">
      <canvas
        ref={canvasRef}
        width={1000}
        height={720}
        onClick={handleCanvasClick}
        className="block cursor-crosshair"
      />
    </div>
  );
}
