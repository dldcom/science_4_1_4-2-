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
    description: '뜨거운 화산의 열기를 머금고 태어난 버섯이에요. 갓에서 엄청난 열풍과 불꽃을 뿜어냅니다!',
    miningSpeed: 2.5,
    capacity: 20,
    avatarSvg: 'volcano_mushroom'
  },
  '네온 곰팡이': {
    name: '네온 곰팡이',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#00ffcc',
    description: '우주의 신비한 에너지를 받아 반짝반짝 야광 빛을 내는 곰팡이에요. 어두운 곳에서도 아주 잘 보여요.',
    miningSpeed: 1.5,
    capacity: 30,
    avatarSvg: 'neon_mold'
  },
  '포자버섯 젤리': {
    name: '포자버섯 젤리',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#dd00ff',
    description: '버섯과 곰팡이가 합쳐져서 말랑말랑한 젤리 괴물이 되었어요! 젤리 같은 몸으로 뭐든지 찰싹 달라붙어요.',
    miningSpeed: 2.2,
    capacity: 25,
    avatarSvg: 'spore_jelly'
  },
  '제트 짚신벌레': {
    name: '제트 짚신벌레',
    type: '원생생물 (변종)',
    tier: 2,
    glowColor: '#0088ff',
    description: '몸에 난 털들을 로켓 엔진처럼 써서 우주 공간을 쌩쌩 날아다니는 엄청 빠른 짚신벌레예요!',
    miningSpeed: 3.5,
    capacity: 15,
    avatarSvg: 'jet_paramecium'
  },
  '블랙홀 아메바': {
    name: '블랙홀 아메바',
    type: '원생생물 (변종)',
    tier: 2,
    glowColor: '#3c0068',
    description: '진공청소기처럼 주변의 우주 먼지를 쭉쭉 빨아들이는 뚱뚱하고 힘이 센 아메바예요.',
    miningSpeed: 1.2,
    capacity: 60,
    avatarSvg: 'blackhole_amoeba'
  },
  '우주 태양 아메바': {
    name: '우주 태양 아메바',
    type: '초월 변종',
    tier: 3,
    glowColor: '#ffae00',
    description: '스스로 반짝반짝 빛나는 햇빛을 만들어서 주변을 환하게 비춰주는 전설의 아메바예요.',
    miningSpeed: 5.0,
    capacity: 50,
    avatarSvg: 'sun_amoeba'
  },
  '메가 이스트': {
    name: '메가 이스트',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#ffb74d',
    description: '평범한 빵을 건물 크기만큼 부풀릴 수 있는 힘을 가진 거대 이스트예요! 뽀글뽀글 거품을 아주 많이 만들어요.',
    miningSpeed: 2.2,
    capacity: 22,
    avatarSvg: 'mega_yeast'
  },
  '누룩곰팡이': {
    name: '누룩곰팡이',
    type: '균류 (변종)',
    tier: 2,
    glowColor: '#e0e0e0',
    description: '딱딱한 쌀이나 콩을 부드럽게 만들어서 맛있는 된장이나 간장으로 바꿔주는 마법의 곰팡이에요.',
    miningSpeed: 1.8,
    capacity: 35,
    avatarSvg: 'koji_mold'
  },
  '아세트산균': {
    name: '아세트산균',
    type: '세균 (변종)',
    tier: 2,
    glowColor: '#81c784',
    description: '평범한 물이나 술을 새콤달콤한 식초로 바꿔주는 신기한 세균이에요. 냄새를 맡으면 코가 찡해요!',
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
