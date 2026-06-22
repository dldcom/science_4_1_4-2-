// 과학 4학년 1학기 4단원 "다양한 생물과 우리 생활" 교과서 기반 퀴즈 데이터 세트
export const quizzes = [
  // --- 원생생물 (짚신벌레, 해캄, 아메바) ---
  {
    id: 'q1',
    category: 'protist',
    targetMicrobe: '짚신벌레',
    question: "[짚신벌레] 현미경으로 관찰한 짚신벌레의 생김새는 어떠한가요?",
    options: ["길쭉한 둥근 모양", "가늘고 긴 모양", "공 모양", "별 모양"],
    answerIndex: 0,
    hintText: "신발(짚신)처럼 길쭉하고 둥근 형태를 띠고 있어요.",
    explanation: "교과서 97쪽에 따르면 짚신벌레는 길쭉한 둥근 모양을 하고 있습니다."
  },
  {
    id: 'q2',
    category: 'protist',
    targetMicrobe: '짚신벌레',
    question: "[짚신벌레] 짚신벌레가 물속에서 미끄러지듯 이동할 때 사용하는 몸 테두리의 짧은 털은 무엇일까요?",
    options: ["섬모", "뿌리", "균사", "위족"],
    answerIndex: 0,
    hintText: "몸 주변에 촘촘하게 나 있는 짧은 털입니다.",
    explanation: "짚신벌레는 몸 전체에 나 있는 '섬모'를 움직여서 물속을 이동합니다."
  },
  {
    id: 'q3',
    category: 'protist',
    targetMicrobe: '해캄',
    question: "[해캄] 현미경으로 관찰한 해캄의 생김새는 어떠한가요?",
    options: ["머리카락 모양", "짚신 모양", "공 모양", "막대 모양"],
    answerIndex: 0,
    hintText: "가늘고 긴 실처럼 생겼습니다.",
    explanation: "교과서 97쪽에 따르면 해캄은 가늘고 긴 머리카락 모양입니다."
  },
  {
    id: 'q4',
    category: 'protist',
    targetMicrobe: '해캄',
    question: "[해캄] 해캄의 세포 속에 있는 초록색 나선 모양 구조로, 스스로 양분을 만드는 '광합성'을 돕는 곳은?",
    options: ["엽록체", "균사", "섬모", "포자낭"],
    answerIndex: 0,
    hintText: "식물처럼 초록색을 띠게 하는 부분입니다.",
    explanation: "해캄은 나선 모양의 초록색 '엽록체'를 가지고 있어 햇빛을 받아 스스로 양분을 만듭니다."
  },
  {
    id: 'q5',
    category: 'protist',
    targetMicrobe: '아메바',
    question: "[아메바] 짚신벌레나 해캄, 아메바 같은 원생생물은 주로 어디에서 사나요?",
    options: ["연못이나 하천", "얼음 속", "사막", "화산"],
    answerIndex: 0,
    hintText: "물이 고여있거나 천천히 흐르는 곳입니다.",
    explanation: "원생생물은 주로 물이 고인 연못이나 물이 흐르는 하천에 삽니다."
  },
  {
    id: 'q6',
    category: 'protist',
    targetMicrobe: '아메바',
    question: "[아메바] 일정한 모양이 없는 아메바가 기어 다니거나 먹이를 먹을 때 내미는 발은?",
    options: ["위족(거짓발)", "촉수", "꼬리", "섬모"],
    answerIndex: 0,
    hintText: "진짜 발은 아니지만 발처럼 쓰는 부위입니다.",
    explanation: "아메바는 일정한 형태 없이 몸을 늘려 '위족(거짓발)'을 만들어 기어 다닙니다."
  },

  // --- 균류 (버섯, 곰팡이, 이스트) ---
  {
    id: 'q7',
    category: 'fungi',
    targetMicrobe: '버섯',
    question: "[버섯] 버섯이나 곰팡이를 현미경으로 관찰하면 보이는 실처럼 가늘고 긴 구조는?",
    options: ["균사", "줄기", "섬모", "뿌리"],
    answerIndex: 0,
    hintText: "균류의 몸을 이루는 실 같은 구조입니다.",
    explanation: "교과서 93쪽: 버섯과 곰팡이는 실처럼 가늘고 긴 '균사'로 이루어져 있습니다."
  },
  {
    id: 'q8',
    category: 'fungi',
    targetMicrobe: '버섯',
    question: "[버섯] 균류는 스스로 양분을 만들지 못합니다. 버섯은 주로 어디에서 양분을 얻을까요?",
    options: ["죽은 나무나 낙엽", "맑은 물", "햇빛", "흙"],
    answerIndex: 0,
    hintText: "스스로 양분을 못 만들기 때문에 주변의 다른 생물에서 얻습니다.",
    explanation: "버섯은 죽은 생물이나 나뭇잎 등을 분해하여 양분을 얻습니다."
  },
  {
    id: 'q9',
    category: 'fungi',
    targetMicrobe: '곰팡이',
    question: "[곰팡이] 균류는 씨앗 대신 무엇을 공기 중으로 날려 번식할까요?",
    options: ["포자", "꽃가루", "열매", "위족"],
    answerIndex: 0,
    hintText: "가볍고 아주 작은 알갱이입니다.",
    explanation: "버섯과 곰팡이는 가벼운 '포자'를 날려 번식합니다."
  },
  {
    id: 'q10',
    category: 'fungi',
    targetMicrobe: '곰팡이',
    question: "[곰팡이] 곰팡이나 버섯과 같은 균류가 가장 잘 자라는 환경은 어떤 곳인가요?",
    options: ["따뜻하고 축축한 곳", "건조한 사막", "냉장고 속", "햇빛이 강한 곳"],
    answerIndex: 0,
    hintText: "여름철 장마 때 곰팡이가 잘 피는 이유를 생각해보세요.",
    explanation: "교과서 93쪽: 균류는 따뜻하고 습한(축축한) 곳에서 잘 자랍니다."
  },
  {
    id: 'q11',
    category: 'fungi',
    targetMicrobe: '이스트',
    question: "[이스트] 다양한 생물은 우리 생활에 이용됩니다. 균류를 이용하여 만드는 것은 무엇일까요?",
    options: ["간장이나 된장", "김밥", "계란말이", "과일주스"],
    answerIndex: 0,
    hintText: "전통적으로 발효시켜 만드는 양념입니다.",
    explanation: "곰팡이나 이스트 같은 균류는 간장, 된장, 치즈 등을 만드는 데 이용됩니다."
  },
  {
    id: 'q12',
    category: 'fungi',
    targetMicrobe: '이스트',
    question: "[이스트] 빵을 푹신하게 부풀리거나 술을 만들 때 주로 쓰이는 '이스트(효모)'는 다음 중 어떤 생물 무리에 속할까요?",
    options: ["균류", "세균", "원생생물", "동물"],
    answerIndex: 0,
    hintText: "버섯이나 곰팡이와 같은 가족입니다.",
    explanation: "이스트(효모)는 단세포로 이루어진 '균류'에 속하는 생물입니다."
  },

  // --- 세균 (젖산균, 고초균, 대장균) ---
  {
    id: 'q13',
    category: 'bacteria',
    targetMicrobe: '젖산균',
    question: "[젖산균] 세균의 크기는 균류, 원생생물과 비교할 때 어떠한가요?",
    options: ["훨씬 작다", "훨씬 크다", "비슷하다", "관찰하기 쉽다"],
    answerIndex: 0,
    hintText: "아주 성능이 좋은 현미경으로 보아야만 보입니다.",
    explanation: "교과서 98쪽: 세균은 균류나 원생생물보다 크기가 작아 맨눈으로 관찰하기 어렵습니다."
  },
  {
    id: 'q14',
    category: 'bacteria',
    targetMicrobe: '젖산균',
    question: "[젖산균] 젖산균은 요구르트를 만들 때 쓰입니다. 세균은 요구르트 외에 또 어떤 음식을 만드는 데 주로 이용될까요?",
    options: ["김치", "라면", "과자", "초콜릿"],
    answerIndex: 0,
    hintText: "매콤새콤하게 익혀 먹는 우리나라 전통 음식입니다.",
    explanation: "유익한 세균(젖산균)은 요구르트를 만들거나 김치를 맛있게 익히는 데 도움을 줍니다."
  },
  {
    id: 'q15',
    category: 'bacteria',
    targetMicrobe: '고초균',
    question: "[고초균] 세균의 모양은 주로 3가지가 있습니다. 공 모양, 나선 모양, 그리고 고초균처럼 길쭉한 이 모양은 무엇일까요?",
    options: ["막대 모양", "별 모양", "짚신 모양", "네모 모양"],
    answerIndex: 0,
    hintText: "아이스크림 스틱 같은 모양입니다.",
    explanation: "교과서 99쪽: 세균은 공 모양, 막대 모양, 나선 모양 등이 있습니다. 고초균과 대장균은 막대 모양입니다."
  },
  {
    id: 'q16',
    category: 'bacteria',
    targetMicrobe: '고초균',
    question: "[고초균] 고초균은 삶은 콩을 발효시켜 끈끈한 청국장이나 낫토를 만듭니다. 이때 고초균은 콩에 들어있는 어떤 영양소를 주로 분해할까요?",
    options: ["단백질", "비타민", "지방", "무기질"],
    answerIndex: 0,
    hintText: "고기나 콩에 많이 들어있고, 근육을 키우는 데 필요한 영양소입니다.",
    explanation: "고초균은 콩의 단백질을 분해하여 소화가 잘 되게 하고 끈적끈적한 유익 물질(아미노산)을 만들어냅니다."
  },
  {
    id: 'q17',
    category: 'bacteria',
    targetMicrobe: '대장균',
    question: "[대장균] 이름에서 알 수 있듯이, '대장균'은 주로 사람이나 동물의 소화 기관인 이곳에 살고 있어서 이름이 이렇게 붙여졌습니다. 이곳은 어디일까요?",
    options: ["큰창자(대장)", "뇌", "심장", "폐"],
    answerIndex: 0,
    hintText: "소화가 끝난 찌꺼기가 모이는 곳입니다.",
    explanation: "대장균은 주로 사람을 비롯한 동물의 큰창자(대장)에 서식하는 세균입니다."
  },
  {
    id: 'q18',
    category: 'bacteria',
    targetMicrobe: '대장균',
    question: "[대장균] 상한 음식을 먹었을 때 배가 아프거나 토하게 되는 등, 나쁜 대장균이 우리 몸에 일으키는 해로운 질병을 무엇이라고 할까요?",
    options: ["식중독", "감기", "충치", "두통"],
    answerIndex: 0,
    hintText: "음식(식)을 통해 중독되는 질병입니다.",
    explanation: "음식이 상할 때 번식한 세균(대장균 등)은 우리 몸에 들어가 식중독을 일으킬 수 있습니다."
  }
];
