// 미생물 도감 정보 및 조합법 데이터
export const baseMicrobes = {
  '버섯': {
    name: '버섯',
    type: '균류',
    tier: 1,
    glowColor: '#ff7b00',
    description: '식물처럼 보이지만 스스로 양분을 못 만들어서 죽은 나무 등에서 양분을 얻고 살아요. 머리(갓)와 몸통(자루)으로 이루어져 있어요.',
    miningSpeed: 1.0,
    capacity: 10,
    avatarSvg: 'mushroom'
  },
  '곰팡이': {
    name: '곰팡이',
    type: '균류',
    tier: 1,
    glowColor: '#00ff66',
    description: '빵이나 과일이 썩을 때 생기는 솜털 같은 생물이에요. 눈에 보이지 않는 아주 작은 씨앗(포자)을 날려 번식해요.',
    miningSpeed: 0.8,
    capacity: 12,
    avatarSvg: 'mold'
  },
  '짚신벌레': {
    name: '짚신벌레',
    type: '원생생물',
    tier: 1,
    glowColor: '#00ffff',
    description: '몸이 짚신 모양처럼 생겨서 짚신벌레라고 불려요! 몸에 아주 작은 털(섬모)들이 나 있어서 물속을 슉슉 헤엄칠 수 있어요.',
    miningSpeed: 1.2,
    capacity: 8,
    avatarSvg: 'paramecium'
  },
  '아메바': {
    name: '아메바',
    type: '원생생물',
    tier: 1,
    glowColor: '#ff00ff',
    description: '몸의 모양이 정해져 있지 않고 젤리처럼 쭈욱쭈욱 변해요. 가짜 발(위족)을 뻗어서 먹이를 쏙 감싸서 먹는답니다.',
    miningSpeed: 0.6,
    capacity: 20,
    avatarSvg: 'amoeba'
  },
  '해캄': {
    name: '해캄',
    type: '원생생물',
    tier: 1,
    glowColor: '#adff2f',
    description: '물속에 사는 초록색 실 모양의 생물이에요. 돋보기로 보면 대나무처럼 마디가 있고, 식물처럼 햇빛을 받아 스스로 양분을 만들어요.',
    miningSpeed: 1.5,
    capacity: 5,
    avatarSvg: 'spirogyra'
  },
  '대장균': {
    name: '대장균',
    type: '세균',
    tier: 1,
    glowColor: '#ff0055',
    description: '우리 몸속(대장)이나 자연에 널리 퍼져 사는 막대기 모양의 작은 세균이에요. 크기가 너무 작아서 현미경으로만 볼 수 있어요.',
    miningSpeed: 1.1,
    capacity: 6,
    avatarSvg: 'e_coli'
  },
  '젖산균': {
    name: '젖산균',
    type: '세균',
    tier: 1,
    glowColor: '#ffff00',
    description: '우리가 좋아하는 요구르트나 김치를 맛있게 발효시켜 주는 아주 착하고 고마운 세균이에요.',
    miningSpeed: 0.9,
    capacity: 8,
    avatarSvg: 'lactobacillus'
  },
  '이스트': {
    name: '이스트',
    type: '균류',
    tier: 1,
    glowColor: '#ffb74d',
    description: '빵을 부풀게 해주는 아주 작은 둥근 생물(효모)이에요. 설탕을 먹고 가스(이산화탄소)를 뿜어내서 빵을 푹신하게 만들어요.',
    miningSpeed: 1.0,
    capacity: 9,
    avatarSvg: 'yeast'
  },
  '고초균': {
    name: '고초균',
    type: '세균',
    tier: 1,
    glowColor: '#a1887f',
    description: '볏짚이나 흙 속에 살아요. 콩을 발효시켜서 끈적끈적하고 구수한 냄새가 나는 맛있는 청국장으로 만들어 주는 고마운 세균이랍니다!',
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
    description: '뜨거운 화산의 열기를 듬뿍 받고 태어난 버섯이에요! 머리(갓)에서 화산 폭발처럼 엄청난 열풍과 불꽃을 뿜어낸답니다.',
    miningSpeed: 2.5,
    capacity: 20,
    avatarSvg: 'volcano_mushroom'
  },
  '네온 곰팡이': {
    name: '네온 곰팡이',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#00ffcc',
    description: '어두운 우주에서도 반짝반짝 빛을 내는 야광 곰팡이에요! 신비한 포자를 뿜어내어 밤하늘의 별처럼 예쁘게 빛나요.',
    miningSpeed: 1.5,
    capacity: 30,
    avatarSvg: 'neon_mold'
  },
  '메가 이스트': {
    name: '메가 이스트',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#ffb74d',
    description: '우리가 먹는 평범한 빵을 거대한 건물 크기만큼 부풀릴 수 있는 힘 센 이스트예요! 뽀글뽀글 가스(이산화탄소)를 아주 많이 만들어요.',
    miningSpeed: 2.2,
    capacity: 22,
    avatarSvg: 'mega_yeast'
  },
  '누룩곰팡이': {
    name: '누룩곰팡이',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#e0e0e0',
    description: '딱딱한 콩이나 쌀을 부드럽게 분해해서, 짭짤하고 맛있는 간장이나 된장으로 바꿔주는 마법 같은 곰팡이랍니다!',
    miningSpeed: 1.8,
    capacity: 35,
    avatarSvg: 'koji_mold'
  },
  '아세트산균': {
    name: '아세트산균',
    type: '세균 (변종)',
    tier: 2,
    glowColor: '#81c784',
    description: '물을 새콤달콤한 식초로 바꿔주는 신기한 세균이에요. 가까이서 냄새를 맡으면 코가 찡할 정도로 새콤한 냄새가 나요!',
    miningSpeed: 2.0,
    capacity: 25,
    avatarSvg: 'acetobacter'
  },
  '슈퍼 젖산균': {
    name: '슈퍼 젖산균',
    type: '세균 (변종)',
    tier: 2,
    glowColor: '#a1c4fd',
    description: '우유 속을 마치 수영 선수처럼 빠르게 헤엄쳐 다니는 젖산균이에요! 순식간에 우유를 새콤달콤한 요구르트로 만들어버려요.',
    miningSpeed: 2.0,
    capacity: 25,
    avatarSvg: 'lactobacillus'
  },
  '구름 이스트': {
    name: '구름 이스트',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#c2e9fb',
    description: '따뜻한 햇빛을 받으면 빵 반죽을 하늘의 뭉게구름처럼 폭신폭신하고 엄청나게 크게 부풀려주는 신기한 이스트예요.',
    miningSpeed: 2.1,
    capacity: 24,
    avatarSvg: 'yeast'
  },
  '매콤 젖산균': {
    name: '매콤 젖산균',
    type: '세균 (변종)',
    tier: 2,
    glowColor: '#ff9a9e',
    description: '입에서 불이 날 것 같은 매운 고춧가루 속에서도 끄떡없이 살아남는 붉은색 젖산균이에요. 맛있는 김치를 익혀준답니다!',
    miningSpeed: 1.9,
    capacity: 28,
    avatarSvg: 'lactobacillus'
  },
  '달콤 이스트': {
    name: '달콤 이스트',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#ffc3a0',
    description: '초콜릿의 재료가 되는 쓴 카카오 열매를 달콤하고 부드럽게 발효시켜 주는 고마운 이스트예요. 달달한 냄새가 나요!',
    miningSpeed: 1.8,
    capacity: 32,
    avatarSvg: 'yeast'
  },
  '황금 젖산균': {
    name: '황금 젖산균',
    type: '세균 (변종)',
    tier: 2,
    glowColor: '#f6d365',
    description: '우유 단백질을 뭉쳐서 반짝반짝 빛나는 황금빛 치즈로 만들어 주는 젖산균이에요. 이 치즈는 쫄깃쫄깃하고 영양도 만점이랍니다!',
    miningSpeed: 2.3,
    capacity: 20,
    avatarSvg: 'lactobacillus'
  },
  '끈적 고초균': {
    name: '끈적 고초균',
    type: '세균 (변종)',
    tier: 2,
    glowColor: '#d4fc79',
    description: '청국장을 만들 때 나오는 끈적끈적한 실(아미노산)을 엄청나게 많이 만들어 내는 진화된 고초균이에요. 죽 늘어나는 실이 재미있어요!',
    miningSpeed: 2.5,
    capacity: 30,
    avatarSvg: 'bacillus'
  }
};

// 조합 레시피 매핑
// 재료들의 이름을 알파벳 순서대로 정렬하여 매핑 키로 사용합니다.
export const recipes = {
  '버섯+버섯': '화산 버섯',
  '곰팡이+곰팡이': '네온 곰팡이',
  '이스트+이스트': '메가 이스트',
  '곰팡이+이스트': '누룩곰팡이',
  '대장균+젖산균': '아세트산균',
  '젖산균+짚신벌레': '슈퍼 젖산균',
  '이스트+해캄': '구름 이스트',
  '고초균+젖산균': '매콤 젖산균',
  '아메바+이스트': '달콤 이스트',
  '버섯+젖산균': '황금 젖산균',
  '고초균+고초균': '끈적 고초균'
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
