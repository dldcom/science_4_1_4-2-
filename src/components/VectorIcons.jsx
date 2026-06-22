import React from 'react';

// 1. 실생활 식품/행성 원정용 고품격 벡터 SVG 아이콘 모음
export function FoodIcon({ name, className = "w-12 h-12", glow = true }) {
  const normalized = (name || '').toLowerCase();
  
  const glowStyle = glow ? { filter: 'drop-shadow(0 0 8px currentColor)' } : {};

  if (normalized.includes('yogurt') || normalized.includes('요구르트')) {
    return (
      <svg className={`${className} text-blue-200`} style={glowStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 10h20v4H22zM25 14h14v6H25z" fill="currentColor" opacity="0.8" />
        <path d="M18 20h28c2 0 4 2 4 4v32c0 2-2 4-4 4H18c-2 0-4-2-4-4V24c0-2 2-4 4-4z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="3.5" />
        <rect x="20" y="32" width="24" height="12" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
        <line x1="28" y1="38" x2="36" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 6l-6 14" stroke="#e0f2fe" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (normalized.includes('bread') || normalized.includes('식빵')) {
    return (
      <svg className={`${className} text-amber-200`} style={glowStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 26c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v26H16V26z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="3.5" />
        <path d="M14 26c0-7.7 6.3-14 14-14h8c7.7 0 14 6.3 14 14v6H14v-6z" fill="currentColor" opacity="0.3" />
        <path d="M22 38h20M24 44h16" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (normalized.includes('penicillin') || normalized.includes('곰팡이') || normalized.includes('페니실린') || normalized.includes('약')) {
    return (
      <svg className={`${className} text-teal-300`} style={glowStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(45 32 32)">
          <rect x="22" y="10" width="20" height="22" rx="10" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="3.5" />
          <rect x="22" y="32" width="20" height="22" rx="10" fill="currentColor" stroke="currentColor" strokeWidth="3.5" />
          <line x1="22" y1="32" x2="42" y2="32" stroke="#060613" strokeWidth="3.5" />
        </g>
      </svg>
    );
  }
  if (normalized.includes('kimchi') || normalized.includes('김치') || normalized.includes('고추')) {
    return (
      <svg className={`${className} text-red-400`} style={glowStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 18h24v38c0 3-3 6-6 6H26c-3 0-6-3-6-6V18z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="3.5" />
        <path d="M26 10h12v8H26z" fill="currentColor" opacity="0.6" stroke="currentColor" strokeWidth="3.5" />
        <path d="M26 28c3 4 5 10 3 16M38 28c-3 4-5 10-3 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="14" r="3" fill="#ef4444" />
      </svg>
    );
  }
  if (normalized.includes('chocolate') || normalized.includes('초콜릿')) {
    return (
      <svg className={`${className} text-amber-900`} style={glowStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="12" width="28" height="44" rx="2" fill="currentColor" stroke="currentColor" strokeWidth="3.5" />
        <path d="M18 36l4-4 6 5 4-5 6 4 4-4 4 4v20H18V36z" fill="#94a3b8" stroke="currentColor" strokeWidth="3.5" />
        <line x1="32" y1="12" x2="32" y2="32" stroke="#2d1b10" strokeWidth="2.5" />
        <line x1="18" y1="22" x2="46" y2="22" stroke="#2d1b10" strokeWidth="2.5" />
      </svg>
    );
  }
  if (normalized.includes('cheese') || normalized.includes('치즈')) {
    return (
      <svg className={`${className} text-yellow-300`} style={glowStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 48l40-34v34H12z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
        <circle cx="28" cy="40" r="4" fill="currentColor" />
        <circle cx="40" cy="30" r="3" fill="currentColor" />
        <circle cx="44" cy="42" r="5" fill="currentColor" />
        <circle cx="24" cy="46" r="2.5" fill="currentColor" />
      </svg>
    );
  }
  if (normalized.includes('coffee') || normalized.includes('커피')) {
    return (
      <svg className={`${className} text-amber-700`} style={glowStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 24h32v24c0 6-6 10-12 10H26c-6 0-12-4-12-10V24z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="3.5" />
        <path d="M46 28h6c3 0 5 2 5 5v2c0 3-2 5-5 5h-6" stroke="currentColor" strokeWidth="3.5" />
        <path d="M22 14c1-3-1-6 0-9M30 14c1-3-1-6 0-9M38 14c1-3-1-6 0-9" stroke="#fed7aa" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (normalized.includes('cheonggukjang') || normalized.includes('청국장') || normalized.includes('균')) {
    return (
      <svg className={`${className} text-amber-600`} style={glowStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 28c0 10 8 18 18 18s18-8 18-18H12z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="3.5" />
        <path d="M8 28h48v3H8v-3z" fill="currentColor" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="34" r="3" fill="currentColor" />
        <circle cx="28" cy="38" r="4" fill="currentColor" />
        <circle cx="36" cy="34" r="3.5" fill="currentColor" />
        <path d="M16 31c6-3 12 2 18 0s10-4 16-1" stroke="#fbe9e7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      </svg>
    );
  }
  if (normalized.includes('doenjang') || normalized.includes('된장') || normalized.includes('간장')) {
    return (
      <svg className={`${className} text-orange-800`} style={glowStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 22c0-2 4-6 16-6s16 4 16 6v24c0 6-6 10-16 10S16 46 16 40V22z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="3.5" />
        <ellipse cx="32" cy="22" rx="16" ry="5" fill="currentColor" stroke="currentColor" strokeWidth="3" />
        <path d="M20 34c4 2 8 2 12 0s8-2 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (normalized.includes('vinegar') || normalized.includes('식초')) {
    return (
      <svg className={`${className} text-lime-400`} style={glowStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 8h16v6H24z" fill="currentColor" opacity="0.6" />
        <path d="M20 14h24v8c0 4-4 8-8 10v18c0 3-3 6-6 6s-6-3-6-6V32c-4-2-8-6-8-10v-8z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="3.5" />
        <rect x="25" y="36" width="14" height="8" rx="1" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  if (normalized.includes('mushroomsoup') || normalized.includes('수프') || normalized.includes('버섯')) {
    return (
      <svg className={`${className} text-orange-300`} style={glowStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 30c0 12 10 22 22 22s22-10 22-22H10z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="3.5" />
        <path d="M6 30h52v4H6v-4z" fill="currentColor" stroke="currentColor" strokeWidth="2" />
        {/* 버섯 건더기 디테일 */}
        <path d="M22 38c0-3 3-5 5-3M38 36c0-3 3-5 5-3" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M20 20c2-5 5-5 8-2M36 20c2-5 5-5 8-2" stroke="#ffd1a9" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 기본 우주 탐사 기지/우주선
  return (
    <svg className={`${className} text-cyan-400`} style={glowStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="20" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="3.5" />
      <path d="M20 32h24M32 20v24" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="6" fill="currentColor" />
    </svg>
  );
}

const spriteMapping = {
  '버섯': 0,
  '곰팡이': 1,
  '짚신벌레': 2,
  '아메바': 3,
  '해캄': 4,
  '대장균': 5,
  '젖산균': 6,
  '이스트': 7,
  '고초균': 8,
  '화산 버섯': 9,
  '네온 곰팡이': 10,
  '메가 이스트': 11,
  '누룩곰팡이': 12,
  '아세트산균': 13,
  '슈퍼 젖산균': 14,
  '구름 이스트': 15,
  '매콤 젖산균': 16,
  '달콤 이스트': 17,
  '황금 젖산균': 18,
  '끈적 고초균': 19
};

// 2. 미생물 종류별 픽셀 일러스트 아이콘 모음 (도감 및 조합소 화면 연동용)
export function MicrobeIcon({ name, className = "w-16 h-16", glowColor = "#00ffff" }) {
  const normName = name || '';

  const spriteIndex = spriteMapping[normName];
  if (spriteIndex !== undefined) {
    return (
      <div 
        className={`${className} inline-block bg-no-repeat flex-shrink-0`}
        style={{
          backgroundImage: `url('/images/stardew_sprites/sprite_${spriteIndex}.webp')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
          filter: `drop-shadow(0 0 6px ${glowColor}aa)`
        }}
      />
    );
  }

  const style = {
    color: glowColor,
    filter: `drop-shadow(0 0 8px ${glowColor}bb)`
  };

  if (normName.includes('짚신벌레')) {
    return (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 짚신 모양 타원 */}
        <ellipse cx="32" cy="32" rx="24" ry="12" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3.5" />
        {/* 내부 세포구 */}
        <path d="M34 38c-3 0-5-2-5-4s2-4 5-4" stroke="currentColor" strokeWidth="2.5" />
        {/* 섬모 표현 */}
        <path d="M12 22l-2-2M20 18l-1-3M32 16v-3M44 18l1-3M52 22l2-2M56 32l3 1M52 42l2 2M44 46l1 3M32 48v3M20 46l-1 3M12 42l-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {normName === '제트 짚신벌레' && (
          <path d="M4 32h10M4 28l4 4-4 4" stroke="#ff00ff" strokeWidth="3.5" strokeLinecap="round" />
        )}
      </svg>
    );
  }

  if (normName.includes('아메바')) {
    return (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 임의의 거짓발 다각형 패스 */}
        <path d="M32 10c6 0 10 4 14 2s6 8 8 14-2 12-6 16-10 12-16 10-12-6-16-12-4-8 0-14 10-6 10-6z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3.5" />
        {/* 핵 */}
        <circle cx="28" cy="28" r="5" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="2.5" />
        {normName === '블랙홀 아메바' && (
          <path d="M24 32a8 8 0 1 1 16 0 8 8 0 0 1-16 0" stroke="#a200ff" strokeWidth="3" strokeDasharray="3 3" />
        )}
        {normName === '우주 태양 아메바' && (
          <circle cx="32" cy="32" r="16" stroke="#ffb300" strokeWidth="2" strokeDasharray="6 3" />
        )}
      </svg>
    );
  }

  if (normName.includes('해캄')) {
    return (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 대나무 같은 마디 */}
        <rect x="8" y="24" width="48" height="16" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="3.5" />
        <line x1="24" y1="24" x2="24" y2="40" stroke="currentColor" strokeWidth="3" />
        <line x1="40" y1="24" x2="40" y2="40" stroke="currentColor" strokeWidth="3" />
        {/* 내부 나선 엽록체 */}
        <path d="M10 32c5-5 10 5 14 0s5-5 10 0 10 5 14 0 5-5 10 0" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (normName.includes('버섯')) {
    return (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 버섯 기둥 */}
        <rect x="26" y="32" width="12" height="24" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="3.5" />
        {/* 버섯 갓 */}
        <path d="M12 32c0-11 9-20 20-20s20 9 20 20H12z" fill="currentColor" stroke="currentColor" strokeWidth="3.5" />
        {normName === '화산 버섯' && (
          <circle cx="32" cy="18" r="4" fill="#ef4444" />
        )}
      </svg>
    );
  }

  if (normName.includes('곰팡이') || normName.includes('누룩')) {
    return (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 균사 가지 */}
        <path d="M32 54V24M32 38c-6-3-12-1-14-6M32 44c6-2 12-1 14-6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        {/* 머리방울들 */}
        <circle cx="32" cy="20" r="7" fill="currentColor" stroke="currentColor" strokeWidth="3" />
        <circle cx="16" cy="30" r="5" fill="currentColor" stroke="currentColor" strokeWidth="3" />
        <circle cx="48" cy="36" r="4.5" fill="currentColor" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    );
  }

  if (normName.includes('대장균')) {
    return (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 캡슐 몸체 */}
        <rect x="18" y="24" width="28" height="16" rx="8" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3.5" />
        {/* 편모 꼬리 */}
        <path d="M18 32c-6 0-10-4-12 2s-4-6-6 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (normName.includes('젖산균')) {
    return (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 쇠사슬 구균 구조 */}
        <circle cx="18" cy="32" r="8" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3.5" />
        <circle cx="32" cy="32" r="8" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="3.5" />
        <circle cx="46" cy="32" r="8" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="3.5" />
      </svg>
    );
  }

  if (normName.includes('이스트')) {
    return (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Budding Yeast 세포 (어미세포 + 새싹세포) */}
        <circle cx="26" cy="34" r="15" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="3.5" />
        <circle cx="44" cy="22" r="9" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="3" />
        {normName === '메가 이스트' && (
          <circle cx="16" cy="18" r="6" fill="currentColor" stroke="currentColor" strokeWidth="2" />
        )}
      </svg>
    );
  }

  if (normName.includes('고초균')) {
    return (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 길쭉한 막대 세균 */}
        <rect x="14" y="24" width="36" height="16" rx="6" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3.5" />
        {/* 내포자 디테일 */}
        <circle cx="22" cy="32" r="3" fill="currentColor" />
        <circle cx="38" cy="32" r="2" fill="currentColor" />
      </svg>
    );
  }

  if (normName.includes('아세트산균')) {
    return (
      <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 2단 막대 세균 연결 */}
        <rect x="12" y="24" width="22" height="14" rx="5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3.5" transform="rotate(-10 23 31)" />
        <rect x="30" y="26" width="22" height="14" rx="5" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="3.5" transform="rotate(15 41 33)" />
      </svg>
    );
  }

  // 기본 원형 마이크로브
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="18" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="32" cy="32" r="6" fill="currentColor" opacity="0.8" />
    </svg>
  );
}
