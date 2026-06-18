// 미생물 도감 정보 및 조합법 데이터
export const baseMicrobes = {
  '버섯': {
    name: '버섯',
    type: '균류',
    tier: 1,
    glowColor: '#ff7b00',
    description: '실 모양의 균사로 유기물을 분해하여 흡수합니다. 영양이 차면 갓을 피웁니다.',
    miningSpeed: 1.0,
    capacity: 10,
    avatarSvg: 'mushroom'
  },
  '곰팡이': {
    name: '곰팡이',
    type: '균류',
    tier: 1,
    glowColor: '#00ff66',
    description: '음식물이나 습한 곳에 균사를 뻗고 자라며 포자낭을 터뜨려 번식합니다.',
    miningSpeed: 0.8,
    capacity: 12,
    avatarSvg: 'mold'
  },
  '짚신벌레': {
    name: '짚신벌레',
    type: '원생생물',
    tier: 1,
    glowColor: '#00ffff',
    description: '짚신 모양의 단세포 생물로, 온몸에 돋아난 섬모를 움직여 빠르게 헤엄칩니다.',
    miningSpeed: 1.2,
    capacity: 8,
    avatarSvg: 'paramecium'
  },
  '아메바': {
    name: '아메바',
    type: '원생생물',
    tier: 1,
    glowColor: '#ff00ff',
    description: '일정한 모양이 없고 위족(거짓발)을 늘려 느릿하게 움직이며 먹이를 포식합니다.',
    miningSpeed: 0.6,
    capacity: 20,
    avatarSvg: 'amoeba'
  },
  '해캄': {
    name: '해캄',
    type: '원생생물',
    tier: 1,
    glowColor: '#adff2f',
    description: '대나무처럼 마디가 있는 녹조류로, 마디 속 나선 모양의 엽록체에서 광합성을 합니다.',
    miningSpeed: 1.5,
    capacity: 5,
    avatarSvg: 'spirogyra'
  },
  '대장균': {
    name: '대장균',
    type: '세균',
    tier: 1,
    glowColor: '#ff0055',
    description: '인간의 대장에 살며 구조가 매우 단순한 막대 모양(간균) 세균입니다.',
    miningSpeed: 1.1,
    capacity: 6,
    avatarSvg: 'e_coli'
  },
  '젖산균': {
    name: '젖산균',
    type: '세균',
    tier: 1,
    glowColor: '#ffff00',
    description: '요구르트나 김치 등 발효 식품에 이로운 도움을 주는 동그란 구균 세균입니다.',
    miningSpeed: 0.9,
    capacity: 8,
    avatarSvg: 'lactobacillus'
  },
  '이스트': {
    name: '이스트',
    type: '균류',
    tier: 1,
    glowColor: '#ffb74d',
    description: '단세포로 이루어진 균류(효모)로, 당분을 분해하여 이산화탄소를 만들어 빵 등을 부풀립니다.',
    miningSpeed: 1.0,
    capacity: 9,
    avatarSvg: 'yeast'
  },
  '고초균': {
    name: '고초균',
    type: '세균',
    tier: 1,
    glowColor: '#a1887f',
    description: '짚이나 흙 속에 살며 열과 건조함에 매우 강한 막대 모양의 세균. 콩 단백질을 발효시켜 몸에 좋은 영양소와 끈적한 실을 만들어 냅니다.',
    miningSpeed: 0.9,
    capacity: 10,
    avatarSvg: 'bacillus'
  }
};

export const microbeEmojis = {
  '버섯': '🍄',
  '곰팡이': '🦠',
  '아메바': '🧬',
  '해캄': '🌿',
  '대장균': '🧪',
  '젖산균': '🥛',
  '이스트': '🥯',
  '고초균': '🌾',
  '화산 버섯': '🌋',
  '네온 곰팡이': '💎',
  '포자버섯 젤리': '🔮',
  '제트 짚신벌레': '🚀',
  '블랙홀 아메바': '🌀',
  '우주 태양 아메바': '☀',
  '메가 이스트': '🥖',
  '누룩곰팡이': '🍚',
  '아세트산균': '🏺'
};


export const combinedMicrobes = {
  '화산 버섯': {
    name: '화산 버섯',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#ff3700',
    description: '버섯 두 개를 우주의 뜨거운 열기로 단련해 융합한 버섯. 자원 채굴 속도가 월등히 높습니다.',
    miningSpeed: 2.5,
    capacity: 20,
    avatarSvg: 'volcano_mushroom'
  },
  '네온 곰팡이': {
    name: '네온 곰팡이',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#00ffcc',
    description: '우주 광선에 노출되어 영롱한 네온빛을 뿜는 곰팡이. 은은한 오라로 주변 미생물들에게 버프를 줍니다.',
    miningSpeed: 1.5,
    capacity: 30,
    avatarSvg: 'neon_mold'
  },
  '포자버섯 젤리': {
    name: '포자버섯 젤리',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#dd00ff',
    description: '버섯과 곰팡이가 한 몸으로 융합된 우주 생물. 성운의 자원을 광역 흡수하는 신비한 균사를 가집니다.',
    miningSpeed: 2.2,
    capacity: 25,
    avatarSvg: 'spore_jelly'
  },
  '제트 짚신벌레': {
    name: '제트 짚신벌레',
    type: '원생생물 (변종)',
    tier: 2,
    glowColor: '#0088ff',
    description: '섬모를 로켓 분사기처럼 진화시켜 우주 성운을 초고속으로 활보하며 자원을 회수합니다.',
    miningSpeed: 3.5,
    capacity: 15,
    avatarSvg: 'jet_paramecium'
  },
  '블랙홀 아메바': {
    name: '블랙홀 아메바',
    type: '원생생물 (변종)',
    tier: 2,
    glowColor: '#3c0068',
    description: '중력을 다스릴 수 있게 진화한 아메바. 우주 먼지를 한순간에 빨아들여 대용량을 운반합니다.',
    miningSpeed: 1.2,
    capacity: 60,
    avatarSvg: 'blackhole_amoeba'
  },
  '우주 태양 아메바': {
    name: '우주 태양 아메바',
    type: '초월 변종',
    tier: 3,
    glowColor: '#ffae00',
    description: '유글레나(해캄과 동급의 자가양분 생물)와 아메바가 합쳐져 태양처럼 빛나는 궁극의 생물. 스스로 자원을 다량 충전합니다.',
    miningSpeed: 5.0,
    capacity: 50,
    avatarSvg: 'sun_amoeba'
  },
  '메가 이스트': {
    name: '메가 이스트',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#ffb74d',
    description: '이스트 두 개를 합쳐 발효 능력을 극대화한 거대 효모. 주변에 엄청난 이산화탄소 기포를 발생시킵니다.',
    miningSpeed: 2.2,
    capacity: 22,
    avatarSvg: 'mega_yeast'
  },
  '누룩곰팡이': {
    name: '누룩곰팡이',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#e0e0e0',
    description: '쌀이나 콩 등에 번식하여 전통 발효의 핵심이 되는 누룩곰팡이. 각종 소화 효소를 다량 분비하여 복잡한 유기물을 잘게 분해합니다.',
    miningSpeed: 1.8,
    capacity: 35,
    avatarSvg: 'koji_mold'
  },
  '아세트산균': {
    name: '아세트산균',
    type: '세균 (변종)',
    tier: 2,
    glowColor: '#81c784',
    description: '알코올을 아세트산(초산)으로 바꾸는 능력을 가진 세균. 새콤한 식초를 생산하는 데 기여합니다.',
    miningSpeed: 2.0,
    capacity: 25,
    avatarSvg: 'acetobacter'
  }
};

// 조합 레시피 매핑
// 재료들의 이름을 알파벳 순서대로 정렬하여 매핑 키로 사용합니다.
export const recipes = {
  '버섯+버섯': '화산 버섯',
  '곰팡이+곰팡이': '네온 곰팡이',
  '버섯+곰팡이': '포자버섯 젤리',
  '짚신벌레+짚신벌레': '제트 짚신벌레',
  '아메바+아메바': '블랙홀 아메바',
  '아메바+해캄': '우주 태양 아메바', // 해캄(초록 자가영양) + 아메바 = 우주 태양 아메바
  '이스트+이스트': '메가 이스트',
  '곰팡이+이스트': '누룩곰팡이',
  '대장균+젖산균': '아세트산균'
};

// 조합 함수
export function combine(microbeNameA, microbeNameB) {
  const key = [microbeNameA, microbeNameB].sort().join('+');
  const resultName = recipes[key];
  if (resultName) {
    return { ...combinedMicrobes[resultName] };
  }
  return null; // 조합 실패
}
