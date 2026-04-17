import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'todak-universe-planets';
const MAX_SELECTED_EMOTIONS = 3;
const MAX_SELECTED_STATEMENTS = 5;

const legacyEmotions = [
  {
    id: 'calm',
    label: '고요',
    prompt: '숨을 길게 내쉬고 싶은 마음',
    colorMeaning: '파랑은 안정감, 신뢰, 긴장 완화를 돕는 색으로 알려져 있어요.',
    palette: ['#78d7ff', '#9af7dc', '#17375f'],
  },
  {
    id: 'hope',
    label: '희망',
    prompt: '다시 빛이 보이는 마음',
    colorMeaning: '노랑은 낙관, 활력, 가벼운 기대감을 떠올리게 해요.',
    palette: ['#ffe27a', '#a8ff9e', '#345b28'],
  },
  {
    id: 'love',
    label: '다정',
    prompt: '따뜻하게 기대고 싶은 마음',
    colorMeaning: '분홍은 친밀감, 애착, 정서적 온기를 표현해요.',
    palette: ['#ff9ecf', '#ffc3a6', '#64324f'],
  },
  {
    id: 'focus',
    label: '몰입',
    prompt: '중심이 또렷해지는 마음',
    colorMeaning: '남색과 보라는 깊이, 직관, 자기 성찰의 이미지를 만들어요.',
    palette: ['#8ea7ff', '#c69cff', '#1d2457'],
  },
  {
    id: 'courage',
    label: '용기',
    prompt: '한 걸음 내딛고 싶은 마음',
    colorMeaning: '주황은 에너지, 행동성, 자신감을 자극하는 색이에요.',
    palette: ['#ff8b5c', '#ffc05c', '#6a251e'],
  },
  {
    id: 'anxiety',
    label: '불안',
    prompt: '마음이 얇게 흔들리는 상태',
    colorMeaning: '연보라와 차가운 청색은 예민함과 내면의 긴장을 섬세하게 보여줘요.',
    palette: ['#b7a7ff', '#8bd8ff', '#26204f'],
  },
  {
    id: 'sadness',
    label: '슬픔',
    prompt: '천천히 가라앉는 마음',
    colorMeaning: '회청색은 차분함, 거리감, 감정의 침잠을 상징해요.',
    palette: ['#8fb4d8', '#b6c7d8', '#1f344b'],
  },
  {
    id: 'anger',
    label: '분노',
    prompt: '뜨거운 에너지가 솟는 상태',
    colorMeaning: '붉은색은 각성, 강한 에너지, 즉각적인 반응을 떠올리게 해요.',
    palette: ['#ff5d5d', '#ff9b6b', '#5b171f'],
  },
  {
    id: 'tired',
    label: '피로',
    prompt: '몸과 마음이 흐려진 상태',
    colorMeaning: '부드러운 회녹색은 휴식, 회복, 낮은 자극의 안정감을 줘요.',
    palette: ['#9fbca8', '#d7d0bd', '#2d3a34'],
  },
  {
    id: 'joy',
    label: '설렘',
    prompt: '작은 가능성이 반짝이는 마음',
    colorMeaning: '코랄과 금빛은 즐거움, 사회적 온기, 생동감을 강화해요.',
    palette: ['#ffb36b', '#ffd86b', '#6a3d1f'],
  },
];

const planetNames = ['루멘', '네아', '오르빗', '아일라', '솔린', '미라', '노바', '엘로'];

const legacyEmotionStatements = [
  { id: 'calm-1', emotionId: 'calm', text: '지금은 천천히 숨을 고르고 싶다' },
  { id: 'calm-2', emotionId: 'calm', text: '조용한 곳에서 마음을 정리하고 싶다' },
  { id: 'hope-1', emotionId: 'hope', text: '작지만 다시 해볼 힘이 생긴다' },
  { id: 'hope-2', emotionId: 'hope', text: '앞으로 나아갈 단서가 보인다' },
  { id: 'love-1', emotionId: 'love', text: '누군가와 따뜻하게 연결되고 싶다' },
  { id: 'love-2', emotionId: 'love', text: '내 마음을 부드럽게 대해주고 싶다' },
  { id: 'focus-1', emotionId: 'focus', text: '지금 해야 할 일에 깊게 들어가고 싶다' },
  { id: 'focus-2', emotionId: 'focus', text: '흩어진 생각을 한곳에 모으고 싶다' },
  { id: 'courage-1', emotionId: 'courage', text: '두렵지만 한 걸음 움직이고 싶다' },
  { id: 'courage-2', emotionId: 'courage', text: '내 선택을 조금 더 믿어보고 싶다' },
  { id: 'anxiety-1', emotionId: 'anxiety', text: '마음이 계속 앞질러 걱정한다' },
  { id: 'anxiety-2', emotionId: 'anxiety', text: '확실하지 않은 일이 크게 느껴진다' },
  { id: 'sadness-1', emotionId: 'sadness', text: '마음이 가라앉아 움직이기 어렵다' },
  { id: 'sadness-2', emotionId: 'sadness', text: '오늘은 나를 조금 조심히 다루고 싶다' },
  { id: 'anger-1', emotionId: 'anger', text: '참아둔 감정이 뜨겁게 올라온다' },
  { id: 'anger-2', emotionId: 'anger', text: '내 경계가 침범당한 느낌이 든다' },
  { id: 'tired-1', emotionId: 'tired', text: '몸과 마음의 배터리가 낮다' },
  { id: 'tired-2', emotionId: 'tired', text: '아무것도 하지 않는 시간이 필요하다' },
  { id: 'joy-1', emotionId: 'joy', text: '가벼운 설렘이 몸을 움직이게 한다' },
  { id: 'joy-2', emotionId: 'joy', text: '오늘의 좋은 순간을 남기고 싶다' },
];

const legacyCareNotes = {
  calm: '지금의 안정감을 오래 붙잡으려 하기보다, 짧은 호흡 루틴으로 몸에 기억시켜보세요.',
  hope: '작은 기대는 기록해두면 다음 날 다시 켜기 쉬워요. 오늘의 가능성 한 가지를 남겨보세요.',
  love: '따뜻함이 필요한 날이에요. 나에게 다정한 문장 하나를 먼저 건네보세요.',
  focus: '몰입이 올라온 상태예요. 할 일을 아주 작게 쪼개 첫 10분만 시작해보세요.',
  courage: '용기는 긴장과 같이 오기도 해요. 무리하지 말고 가장 작은 행동 하나만 정해보세요.',
  anxiety: '불안은 미래를 빠르게 시뮬레이션할 때 커져요. 지금 통제 가능한 것 하나만 적어보세요.',
  sadness: '가라앉은 마음은 설득보다 돌봄이 먼저예요. 오늘은 회복에 필요한 속도를 허락해보세요.',
  anger: '분노는 중요한 경계 신호일 수 있어요. 바로 반응하기 전, 내가 지키고 싶은 것을 적어보세요.',
  tired: '피로는 의지 문제가 아니라 에너지 신호예요. 오늘의 목표를 과감히 줄여도 괜찮아요.',
  joy: '좋은 감정도 지나가요. 지금의 장면을 짧게 기록하면 나중에 다시 꺼내볼 수 있어요.',
};

const colorPsychologyLegacyEmotions = [
  {
    id: 'white',
    label: '흰색',
    prompt: '순수 · 청결 · 빛',
    colorMeaning: '흰색은 순수함, 깨끗함, 무균성, 빛의 이미지를 떠올리게 해요.',
    palette: ['#f7f4ea', '#dfe9ff', '#7b7f8f'],
  },
  {
    id: 'gray',
    label: '회색',
    prompt: '전문 · 진지 · 성숙',
    colorMeaning: '회색은 전문적이고 진지하며, 성숙하고 보수적인 인상을 줘요.',
    palette: ['#9b9b9b', '#c8c8c8', '#343843'],
  },
  {
    id: 'green',
    label: '초록',
    prompt: '차분 · 회복 · 자연',
    colorMeaning: '초록은 마음을 가라앉히고, 신선함과 자연, 휴식의 감각을 전해요.',
    palette: ['#8bbf6f', '#b8e087', '#254a32'],
  },
  {
    id: 'turquoise',
    label: '청록',
    prompt: '소통 · 연민 · 신선',
    colorMeaning: '청록은 소통, 연민, 맑고 신선한 감각을 떠올리게 해요.',
    palette: ['#7ec6c9', '#a8f0e4', '#174f58'],
  },
  {
    id: 'blue',
    label: '파랑',
    prompt: '평온 · 영성 · 안정',
    colorMeaning: '파랑은 평온함, 영적인 깊이, 안정감과 함께 때로는 슬픔의 정서를 담아요.',
    palette: ['#4f73ba', '#8fb4ff', '#172d5a'],
  },
  {
    id: 'purple',
    label: '보라',
    prompt: '창의 · 신비 · 풍요',
    colorMeaning: '보라는 창의성, 고귀함, 신비로움, 풍요로운 이미지를 강화해요.',
    palette: ['#6253a8', '#b497ff', '#211948'],
  },
  {
    id: 'black',
    label: '검정',
    prompt: '세련 · 신비 · 힘',
    colorMeaning: '검정은 세련됨, 신비로움, 힘과 고급스러운 분위기를 만들어줘요.',
    palette: ['#101014', '#4b4b5a', '#000000'],
  },
  {
    id: 'yellow',
    label: '노랑',
    prompt: '행복 · 명랑 · 희망',
    colorMeaning: '노랑은 행복, 명랑함, 즉흥성, 희망의 에너지를 떠올리게 해요.',
    palette: ['#f8e84a', '#fff4a3', '#6d5d12'],
  },
  {
    id: 'orange',
    label: '주황',
    prompt: '활력 · 열정 · 생기',
    colorMeaning: '주황은 생기, 열정, 우정, 에너지를 밝고 따뜻하게 자극해요.',
    palette: ['#ec9b39', '#ffc36d', '#6a3616'],
  },
  {
    id: 'red',
    label: '빨강',
    prompt: '열정 · 사랑 · 분노',
    colorMeaning: '빨강은 열정과 사랑, 분노, 위험처럼 강렬하고 즉각적인 감정을 상징해요.',
    palette: ['#de4641', '#ff887d', '#5d1418'],
  },
  {
    id: 'pink',
    label: '분홍',
    prompt: '사랑 · 다정 · 민감',
    colorMeaning: '분홍은 여성성, 로맨스, 부드러운 애정, 섬세한 민감함을 표현해요.',
    palette: ['#d98ab5', '#ffc1d7', '#5b2947'],
  },
  {
    id: 'brown',
    label: '갈색',
    prompt: '자연 · 진정 · 신뢰',
    colorMeaning: '갈색은 자연, 그리움, 진정성, 신뢰감을 차분하게 전달해요.',
    palette: ['#9a542d', '#c58a5b', '#3e2419'],
  },
];

const colorPsychologyLegacyEmotionStatements = [
  { id: 'white-1', emotionId: 'white', text: '깨끗하게 비워내고 다시 시작하고 싶다' },
  { id: 'white-2', emotionId: 'white', text: '오늘의 마음에 밝은 공간이 필요하다' },
  { id: 'gray-1', emotionId: 'gray', text: '감정을 차분히 정리하고 객관적으로 보고 싶다' },
  { id: 'gray-2', emotionId: 'gray', text: '지금은 신중하고 성숙하게 반응하고 싶다' },
  { id: 'green-1', emotionId: 'green', text: '자연 속에 있는 것처럼 마음을 쉬게 하고 싶다' },
  { id: 'green-2', emotionId: 'green', text: '긴장을 낮추고 천천히 회복하고 싶다' },
  { id: 'turquoise-1', emotionId: 'turquoise', text: '내 마음을 누군가에게 맑게 전하고 싶다' },
  { id: 'turquoise-2', emotionId: 'turquoise', text: '나와 타인에게 조금 더 연민을 보내고 싶다' },
  { id: 'blue-1', emotionId: 'blue', text: '평온함과 안전한 감각을 되찾고 싶다' },
  { id: 'blue-2', emotionId: 'blue', text: '조용한 슬픔까지 있는 그대로 바라보고 싶다' },
  { id: 'purple-1', emotionId: 'purple', text: '내 안의 창의적인 감각을 깨우고 싶다' },
  { id: 'purple-2', emotionId: 'purple', text: '설명하기 어려운 신비로운 기분이 든다' },
  { id: 'black-1', emotionId: 'black', text: '강해 보이고 싶은 마음과 조용히 숨고 싶은 마음이 함께 있다' },
  { id: 'black-2', emotionId: 'black', text: '내 안의 힘을 차분하게 붙잡고 싶다' },
  { id: 'yellow-1', emotionId: 'yellow', text: '가벼운 희망과 명랑함을 다시 켜고 싶다' },
  { id: 'yellow-2', emotionId: 'yellow', text: '예상 밖의 좋은 일이 생길 것 같은 기분이다' },
  { id: 'orange-1', emotionId: 'orange', text: '몸을 움직이게 하는 따뜻한 에너지가 필요하다' },
  { id: 'orange-2', emotionId: 'orange', text: '사람들과 활기 있게 연결되고 싶다' },
  { id: 'red-1', emotionId: 'red', text: '감정이 강하게 올라와 바로 표현하고 싶다' },
  { id: 'red-2', emotionId: 'red', text: '사랑, 분노, 위험 신호가 선명하게 느껴진다' },
  { id: 'pink-1', emotionId: 'pink', text: '부드럽고 다정한 위로가 필요하다' },
  { id: 'pink-2', emotionId: 'pink', text: '섬세한 마음을 조심스럽게 다루고 싶다' },
  { id: 'brown-1', emotionId: 'brown', text: '믿을 수 있는 안정적인 기반이 필요하다' },
  { id: 'brown-2', emotionId: 'brown', text: '진심이 담긴 관계와 자연스러운 온기가 그립다' },
];

const colorPsychologyLegacyCareNotes = {
  white: '비워내고 싶은 날에는 해야 할 일을 하나 줄여보세요. 빈칸도 회복의 일부예요.',
  gray: '감정을 바로 결론내리지 말고 사실과 느낌을 나눠 적어보면 마음이 선명해져요.',
  green: '회복이 필요한 신호예요. 물 한 잔, 짧은 산책, 깊은 호흡처럼 몸에 쉬운 일을 주세요.',
  turquoise: '소통이 필요한 날이에요. 지금 마음을 한 문장으로 정리해 누군가에게 전해보세요.',
  blue: '평온함과 슬픔은 함께 있을 수 있어요. 오늘은 안전하게 머물 공간을 먼저 찾아보세요.',
  purple: '창의적인 감각이 올라온 날이에요. 결과보다 떠오른 이미지를 짧게 남겨보세요.',
  black: '힘을 회복하려면 경계가 필요할 수 있어요. 오늘 지키고 싶은 선 하나를 정해보세요.',
  yellow: '희망은 작을수록 오래 갑니다. 오늘 기대되는 장면 하나를 구체적으로 적어보세요.',
  orange: '에너지가 필요한 날이에요. 5분만 몸을 움직이거나 누군가와 짧게 연결해보세요.',
  red: '강한 감정은 중요한 신호예요. 바로 반응하기 전, 무엇이 나를 건드렸는지 적어보세요.',
  pink: '섬세한 마음을 다정하게 다룰 때예요. 나에게 해주고 싶은 말을 먼저 남겨보세요.',
  brown: '안정감은 반복에서 생겨요. 오늘 믿고 기대도 되는 작은 루틴 하나를 만들어보세요.',
};

const colorPsychologyTableV1Emotions = [
  {
    id: 'depressed',
    label: '우울한',
    prompt: '우울한',
    colorMeaning: '네이비/딥블루는 깊은 바다나 밤하늘처럼 감정이 무겁게 가라앉은 상태를 상징합니다.',
    palette: ['#102a4c', '#1c4c7c', '#06101f'],
  },
  {
    id: 'empty',
    label: '공허한',
    prompt: '공허한',
    colorMeaning: '화이트/무채색은 아무것도 채워지지 않은 빈 공간과 감정의 부재를 의미합니다.',
    palette: ['#f2f0e8', '#cfd2d6', '#70737a'],
  },
  {
    id: 'lonely',
    label: '외로운',
    prompt: '외로운',
    colorMeaning: '연청색은 차갑고 냉정한 기운이 감돌며 타인과의 온기가 단절된 상태를 나타냅니다.',
    palette: ['#a9cce8', '#d8efff', '#3d627f'],
  },
  {
    id: 'lethargic',
    label: '무기력한',
    prompt: '무기력한',
    colorMeaning: '탁한 회색은 에너지가 소진되어 생동감이 사라진 무채색의 상태입니다.',
    palette: ['#747a7d', '#a5a8a8', '#343839'],
  },
  {
    id: 'angry',
    label: '화가 나는',
    prompt: '화가 나는',
    colorMeaning: '빨간색은 아드레날린 수치를 높이며 즉각적인 폭발성과 공격성을 상징합니다.',
    palette: ['#df3030', '#ff6f61', '#5d1014'],
  },
  {
    id: 'wronged',
    label: '억울한',
    prompt: '억울한',
    colorMeaning: '진한 주홍색은 분노가 응집되어 있으나 표출되지 못하고 달궈진 상태를 의미합니다.',
    palette: ['#c43a1e', '#ff7548', '#5c180d'],
  },
  {
    id: 'irritated',
    label: '짜증나는',
    prompt: '짜증나는',
    colorMeaning: '연두색은 신경을 자극하고 거슬리게 하는 날카로운 에너지를 투영합니다.',
    palette: ['#b9e342', '#dcff68', '#46570f'],
  },
  {
    id: 'resentful',
    label: '원망스러운',
    prompt: '원망스러운',
    colorMeaning: '짙은 올리브색은 억눌린 분노와 질투, 타인을 향한 부정적 에너지가 섞인 색입니다.',
    palette: ['#515b25', '#818c3a', '#1f2413'],
  },
  {
    id: 'guilty',
    label: '죄책감이 드는',
    prompt: '죄책감이 드는',
    colorMeaning: '짙은 갈색은 무겁고 칙칙한 느낌으로 스스로를 짓누르는 도덕적 중압감을 상징합니다.',
    palette: ['#4a2d1f', '#704832', '#1d120d'],
  },
  {
    id: 'ashamed',
    label: '부끄러운',
    prompt: '부끄러운',
    colorMeaning: '분홍색은 얼굴이 붉어지는 신체 반응과 연결되며 자신을 드러내고 싶지 않은 상태를 반영합니다.',
    palette: ['#e48aa8', '#ffc2d2', '#6c2d43'],
  },
  {
    id: 'withdrawn',
    label: '위축되는',
    prompt: '위축되는',
    colorMeaning: '베이지색은 눈에 띄고 싶지 않아 주변 환경에 숨어버리려는 보호색의 의미를 갖습니다.',
    palette: ['#c7b89a', '#eadfc7', '#5d5345'],
  },
  {
    id: 'pathetic',
    label: '한심한',
    prompt: '한심한',
    colorMeaning: '황토색은 스스로를 가치 없게 여기거나 정체된 흙과 같은 상태로 느끼는 감정입니다.',
    palette: ['#b37a24', '#d8a44b', '#50350f'],
  },
  {
    id: 'relieved',
    label: '안도하는',
    prompt: '안도하는',
    colorMeaning: '하늘색은 긴장이 풀리고 시야가 트이는 평온한 해방감을 상징합니다.',
    palette: ['#7ec9f8', '#c6eeff', '#246083'],
  },
  {
    id: 'lighthearted',
    label: '홀가분한',
    prompt: '홀가분한',
    colorMeaning: '민트색은 신선하고 가벼운 에너지로 마음의 환기가 일어난 상태입니다.',
    palette: ['#98ead0', '#d4fff1', '#267260'],
  },
  {
    id: 'peaceful',
    label: '평온한',
    prompt: '평온한',
    colorMeaning: '초록색은 정서적 균형을 회복하고 심리적 안정감을 얻은 자연의 색입니다.',
    palette: ['#5fae6d', '#a8ddb0', '#1f4c2c'],
  },
  {
    id: 'hopeful',
    label: '희망적인',
    prompt: '희망적인',
    colorMeaning: '황금색/밝은 노랑은 어둠을 뚫고 나오는 빛과 활력, 미래에 대한 기대를 상징합니다.',
    palette: ['#ffd84d', '#fff19a', '#6b4a09'],
  },
];

const colorPsychologyTableV1EmotionStatements = [
  { id: 'depressed-1', emotionId: 'depressed', text: '감정이 깊은 물 아래로 가라앉는 것 같다' },
  { id: 'depressed-2', emotionId: 'depressed', text: '밤하늘처럼 마음이 무겁고 어둡게 느껴진다' },
  { id: 'empty-1', emotionId: 'empty', text: '안쪽이 비어 있고 아무 감정도 잘 잡히지 않는다' },
  { id: 'empty-2', emotionId: 'empty', text: '무언가 채워져야 할 자리가 텅 빈 것 같다' },
  { id: 'lonely-1', emotionId: 'lonely', text: '주변에 사람이 있어도 온기가 멀게 느껴진다' },
  { id: 'lonely-2', emotionId: 'lonely', text: '누군가와 연결되고 싶지만 차가운 벽이 있는 것 같다' },
  { id: 'lethargic-1', emotionId: 'lethargic', text: '몸과 마음의 에너지가 거의 남아 있지 않다' },
  { id: 'lethargic-2', emotionId: 'lethargic', text: '무엇을 해도 생동감이 잘 올라오지 않는다' },
  { id: 'angry-1', emotionId: 'angry', text: '감정이 즉각적으로 폭발할 것처럼 뜨겁다' },
  { id: 'angry-2', emotionId: 'angry', text: '공격적으로 반응하고 싶은 충동이 올라온다' },
  { id: 'wronged-1', emotionId: 'wronged', text: '분노가 안쪽에 응집된 채 풀리지 않는다' },
  { id: 'wronged-2', emotionId: 'wronged', text: '말하지 못한 억울함이 계속 달궈지는 느낌이다' },
  { id: 'irritated-1', emotionId: 'irritated', text: '작은 자극에도 신경이 날카롭게 반응한다' },
  { id: 'irritated-2', emotionId: 'irritated', text: '거슬리는 감각이 계속 마음을 찌른다' },
  { id: 'resentful-1', emotionId: 'resentful', text: '억눌린 분노가 누군가를 향해 오래 남아 있다' },
  { id: 'resentful-2', emotionId: 'resentful', text: '질투와 원망이 섞여 마음이 탁해진다' },
  { id: 'guilty-1', emotionId: 'guilty', text: '스스로를 짓누르는 도덕적 중압감이 있다' },
  { id: 'guilty-2', emotionId: 'guilty', text: '내 잘못이라는 생각이 무겁게 달라붙어 있다' },
  { id: 'ashamed-1', emotionId: 'ashamed', text: '얼굴이 붉어질 것 같고 숨고 싶다' },
  { id: 'ashamed-2', emotionId: 'ashamed', text: '나를 드러내는 일이 부담스럽고 조심스럽다' },
  { id: 'withdrawn-1', emotionId: 'withdrawn', text: '눈에 띄지 않게 뒤로 물러나고 싶다' },
  { id: 'withdrawn-2', emotionId: 'withdrawn', text: '주변에 섞여 나를 보호하고 싶은 마음이 든다' },
  { id: 'pathetic-1', emotionId: 'pathetic', text: '스스로가 가치 없게 느껴져 마음이 정체된다' },
  { id: 'pathetic-2', emotionId: 'pathetic', text: '흙처럼 무겁고 멈춰 있는 상태로 느껴진다' },
  { id: 'relieved-1', emotionId: 'relieved', text: '긴장이 풀리며 숨 쉴 공간이 생긴다' },
  { id: 'relieved-2', emotionId: 'relieved', text: '시야가 트이고 조금은 안전해진 느낌이다' },
  { id: 'lighthearted-1', emotionId: 'lighthearted', text: '묵은 감정이 빠져나가고 마음이 가벼워진다' },
  { id: 'lighthearted-2', emotionId: 'lighthearted', text: '신선한 공기가 들어오듯 마음이 환기된다' },
  { id: 'peaceful-1', emotionId: 'peaceful', text: '정서가 균형을 되찾고 차분해진다' },
  { id: 'peaceful-2', emotionId: 'peaceful', text: '자연 속에 머무는 것처럼 안정감이 생긴다' },
  { id: 'hopeful-1', emotionId: 'hopeful', text: '어둠 뒤에서 빛이 올라오는 것 같다' },
  { id: 'hopeful-2', emotionId: 'hopeful', text: '미래에 대한 기대와 활력이 조금씩 생긴다' },
];

const colorPsychologyTableV1CareNotes = {
  depressed: '무거운 감정은 밀어내기보다 이름 붙이는 것부터 시작해도 충분해요.',
  empty: '비어 있는 느낌은 회복 전의 공간일 수 있어요. 오늘 채우고 싶은 아주 작은 것을 하나만 적어보세요.',
  lonely: '단절감이 클 때는 깊은 대화보다 짧은 안부 하나가 먼저 도움이 될 수 있어요.',
  lethargic: '에너지가 낮은 날에는 목표를 줄이는 것이 실패가 아니라 회복 전략이에요.',
  angry: '폭발성이 올라올 때는 반응을 늦추는 10초가 감정을 보호하는 완충재가 될 수 있어요.',
  wronged: '억울함은 설명받지 못한 마음의 신호예요. 내가 인정받고 싶은 지점을 적어보세요.',
  irritated: '자극이 날카롭게 느껴질 때는 소리, 빛, 알림처럼 줄일 수 있는 자극부터 덜어보세요.',
  resentful: '원망은 오래 눌린 경계의 흔적일 수 있어요. 나를 지키고 싶은 선을 확인해보세요.',
  guilty: '죄책감이 클수록 사실과 해석을 분리해보세요. 책임질 일과 내려놓을 일을 나눌 수 있어요.',
  ashamed: '부끄러움은 숨고 싶은 마음을 만들어요. 안전한 범위 안에서만 나를 드러내도 괜찮아요.',
  withdrawn: '위축될 때는 크게 나서기보다 안전한 자리 하나를 확보하는 것이 먼저예요.',
  pathetic: '스스로를 낮게 보는 생각이 올라오면 오늘 해낸 가장 작은 행동 하나를 증거로 남겨보세요.',
  relieved: '안도감이 찾아왔을 때 몸의 감각을 기억해두면 다음 긴장 속에서도 돌아올 길이 생겨요.',
  lighthearted: '홀가분함은 비워낸 뒤의 신호예요. 지금 가벼워진 이유를 짧게 기록해보세요.',
  peaceful: '평온함은 유지하려 애쓰기보다 반복 가능한 작은 루틴으로 이어가면 좋아요.',
  hopeful: '희망이 생긴 순간에는 너무 큰 계획보다 다음 한 걸음만 정해보세요.',
};

const emotions = [
  {
    id: 'wronged',
    label: '억울한',
    prompt: '억울한',
    colorMeaning: '진주황은 분노가 응집되어 있으나 표출되지 못하고 달궈진 상태를 의미합니다.',
    palette: ['#c86424', '#f08a3c', '#5b250f'],
  },
  {
    id: 'fluttering',
    label: '설레는',
    prompt: '설레는',
    colorMeaning: '코랄은 따뜻한 기대감과 부드러운 활력을 담아 설렘을 표현합니다.',
    palette: ['#ff7f6e', '#ffc2b6', '#6b2a25'],
  },
  {
    id: 'lethargic',
    label: '무기력한',
    prompt: '무기력한',
    colorMeaning: '회색은 에너지가 소진되어 생동감이 사라진 무채색의 상태입니다.',
    palette: ['#7d8084', '#b0b2b4', '#33373a'],
  },
  {
    id: 'peaceful',
    label: '평온한',
    prompt: '평온한',
    colorMeaning: '초록색은 정서적 균형을 회복하고 심리적 안정감을 얻은 자연의 색입니다.',
    palette: ['#5fae6d', '#a8ddb0', '#1f4c2c'],
  },
  {
    id: 'guilty',
    label: '죄책감',
    prompt: '죄책감',
    colorMeaning: '고둥색은 무겁고 칙칙한 느낌으로 스스로를 짓누르는 도덕적 중압감을 상징합니다.',
    palette: ['#4a2d1f', '#704832', '#1d120d'],
  },
  {
    id: 'proud',
    label: '뿌듯한',
    prompt: '뿌듯한',
    colorMeaning: '로열 블루는 성취 뒤의 확신, 자존감, 단단한 품위를 상징합니다.',
    palette: ['#4169e1', '#86a3ff', '#13275f'],
  },
  {
    id: 'anxious',
    label: '불안한',
    prompt: '불안한',
    colorMeaning: '노란색은 주의를 끌고 긴장감을 높여 예민하게 깨어 있는 불안 상태를 나타냅니다.',
    palette: ['#ffd84a', '#fff19a', '#6d5a09'],
  },
  {
    id: 'relieved',
    label: '안도하는',
    prompt: '안도하는',
    colorMeaning: '하늘색은 긴장이 풀리고 시야가 트이는 평온한 해방감을 상징합니다.',
    palette: ['#7ec9f8', '#c6eeff', '#246083'],
  },
  {
    id: 'lonely',
    label: '외로운',
    prompt: '외로운',
    colorMeaning: '연청색은 차갑고 냉정한 기운이 감돌며 타인과의 온기가 단절된 상태를 나타냅니다.',
    palette: ['#a9cce8', '#d8efff', '#3d627f'],
  },
  {
    id: 'hopeful',
    label: '희망적인',
    prompt: '희망적인',
    colorMeaning: '황금색은 어둠을 뚫고 나오는 빛과 활력, 미래에 대한 기대를 상징합니다.',
    palette: ['#d4af37', '#ffe680', '#6b4a09'],
  },
  {
    id: 'angry',
    label: '화가 나는',
    prompt: '화가 나는',
    colorMeaning: '빨간색은 아드레날린 수치를 높이며 즉각적인 폭발성과 공격성을 상징합니다.',
    palette: ['#df3030', '#ff6f61', '#5d1014'],
  },
  {
    id: 'grateful',
    label: '감사한',
    prompt: '감사한',
    colorMeaning: '살구색은 따뜻한 수용감과 부드러운 호의를 담아 감사한 마음을 표현합니다.',
    palette: ['#f6b37f', '#ffd7b5', '#6b3a1d'],
  },
  {
    id: 'depressed',
    label: '우울한',
    prompt: '우울한',
    colorMeaning: '네이비는 깊은 바다나 밤하늘처럼 감정이 무겁게 가라앉은 상태를 상징합니다.',
    palette: ['#102a4c', '#1c4c7c', '#06101f'],
  },
  {
    id: 'confident',
    label: '자신감 있는',
    prompt: '자신감 있는',
    colorMeaning: '주황색은 활력과 적극성을 높이며 자신감 있는 추진력을 상징합니다.',
    palette: ['#f28c28', '#ffc36d', '#6a3616'],
  },
  {
    id: 'confused',
    label: '혼란스러운',
    prompt: '혼란스러운',
    colorMeaning: '보라색은 서로 다른 감각이 뒤섞인 모호함과 복잡한 내면 상태를 나타냅니다.',
    palette: ['#7b4bd8', '#b497ff', '#24154f'],
  },
  {
    id: 'overwhelmed',
    label: '벅찬',
    prompt: '벅찬',
    colorMeaning: '마젠타는 감정 에너지가 강하게 차오르는 고양감과 압도감을 함께 표현합니다.',
    palette: ['#d62aa0', '#ff78d2', '#5d0f45'],
  },
  {
    id: 'blocked',
    label: '막막한',
    prompt: '막막한',
    colorMeaning: '검정색은 앞이 보이지 않는 차단감과 출구를 찾기 어려운 막막함을 상징합니다.',
    palette: ['#101014', '#4b4b5a', '#000000'],
  },
  {
    id: 'lighthearted',
    label: '홀가분한',
    prompt: '홀가분한',
    colorMeaning: '민트색은 신선하고 가벼운 에너지로 마음의 환기가 일어난 상태입니다.',
    palette: ['#98ead0', '#d4fff1', '#267260'],
  },
  {
    id: 'empty',
    label: '공허한',
    prompt: '공허한',
    colorMeaning: '흰색은 아무것도 채워지지 않은 빈 공간과 감정의 부재를 의미합니다.',
    palette: ['#f2f0e8', '#cfd2d6', '#70737a'],
  },
  {
    id: 'supported',
    label: '든든한',
    prompt: '든든한',
    colorMeaning: '진초록은 깊게 뿌리내린 안정감과 믿을 수 있는 정서적 지지를 상징합니다.',
    palette: ['#1f6b3a', '#5aa86b', '#0f2f1b'],
  },
];

const emotionStatements = [
  { id: 'wronged-1', emotionId: 'wronged', text: '내 마음이 제대로 이해받지 못한 것 같다' },
  { id: 'wronged-2', emotionId: 'wronged', text: '말하지 못한 억울함이 안쪽에 남아 있다' },
  { id: 'fluttering-1', emotionId: 'fluttering', text: '좋은 일이 일어날 것 같아 마음이 간질거린다' },
  { id: 'fluttering-2', emotionId: 'fluttering', text: '기대감이 몸을 가볍게 움직이게 한다' },
  { id: 'lethargic-1', emotionId: 'lethargic', text: '무엇을 해도 에너지가 쉽게 돌아오지 않는다' },
  { id: 'lethargic-2', emotionId: 'lethargic', text: '몸과 마음이 회색빛처럼 느리게 가라앉는다' },
  { id: 'peaceful-1', emotionId: 'peaceful', text: '호흡이 고르고 마음의 결이 잔잔하다' },
  { id: 'peaceful-2', emotionId: 'peaceful', text: '지금 이 순간에 조용히 머물 수 있다' },
  { id: 'guilty-1', emotionId: 'guilty', text: '스스로를 탓하는 생각이 무겁게 따라붙는다' },
  { id: 'guilty-2', emotionId: 'guilty', text: '내가 잘못했다는 마음이 쉽게 사라지지 않는다' },
  { id: 'proud-1', emotionId: 'proud', text: '작지만 분명히 해낸 것이 마음에 남아 있다' },
  { id: 'proud-2', emotionId: 'proud', text: '오늘의 내가 조금 단단하게 느껴진다' },
  { id: 'anxious-1', emotionId: 'anxious', text: '아직 일어나지 않은 일이 계속 신경 쓰인다' },
  { id: 'anxious-2', emotionId: 'anxious', text: '마음이 노란 경고등처럼 깜빡이는 느낌이다' },
  { id: 'relieved-1', emotionId: 'relieved', text: '긴장이 풀리며 숨이 조금 넓어진다' },
  { id: 'relieved-2', emotionId: 'relieved', text: '괜찮아졌다는 감각이 천천히 몸에 퍼진다' },
  { id: 'lonely-1', emotionId: 'lonely', text: '사람들 사이에 있어도 혼자 떨어진 느낌이다' },
  { id: 'lonely-2', emotionId: 'lonely', text: '누군가의 온기가 멀리 있는 것처럼 느껴진다' },
  { id: 'hopeful-1', emotionId: 'hopeful', text: '아직 가능성이 남아 있다는 빛이 보인다' },
  { id: 'hopeful-2', emotionId: 'hopeful', text: '다음 장면을 조금 기대해보고 싶다' },
  { id: 'angry-1', emotionId: 'angry', text: '속에서 뜨거운 반응이 바로 올라온다' },
  { id: 'angry-2', emotionId: 'angry', text: '분명한 선을 그어야 할 것 같은 마음이다' },
  { id: 'grateful-1', emotionId: 'grateful', text: '누군가의 다정함이 마음에 오래 남았다' },
  { id: 'grateful-2', emotionId: 'grateful', text: '받은 것을 따뜻하게 기억하고 싶다' },
  { id: 'depressed-1', emotionId: 'depressed', text: '감정이 깊은 밤처럼 무겁게 내려앉아 있다' },
  { id: 'depressed-2', emotionId: 'depressed', text: '마음이 깊은 물속으로 천천히 가라앉는 것 같다' },
  { id: 'confident-1', emotionId: 'confident', text: '내 선택을 믿고 앞으로 나아갈 수 있을 것 같다' },
  { id: 'confident-2', emotionId: 'confident', text: '몸 안에 추진력이 따뜻하게 차오른다' },
  { id: 'confused-1', emotionId: 'confused', text: '여러 감정이 섞여 무엇이 먼저인지 모르겠다' },
  { id: 'confused-2', emotionId: 'confused', text: '생각과 감각이 서로 다른 방향으로 움직인다' },
  { id: 'overwhelmed-1', emotionId: 'overwhelmed', text: '감정이 크게 차올라 한 번에 담기 어렵다' },
  { id: 'overwhelmed-2', emotionId: 'overwhelmed', text: '좋은 마음도 벅차서 숨을 고르고 싶다' },
  { id: 'blocked-1', emotionId: 'blocked', text: '앞이 보이지 않아 어디서 시작해야 할지 모르겠다' },
  { id: 'blocked-2', emotionId: 'blocked', text: '마음의 길이 잠시 닫힌 것처럼 느껴진다' },
  { id: 'lighthearted-1', emotionId: 'lighthearted', text: '무거운 것이 빠져나가고 마음이 가벼워진다' },
  { id: 'lighthearted-2', emotionId: 'lighthearted', text: '새 공기가 들어온 것처럼 숨이 편안하다' },
  { id: 'empty-1', emotionId: 'empty', text: '안쪽이 비어 있는 방처럼 조용하다' },
  { id: 'empty-2', emotionId: 'empty', text: '무엇을 느끼는지 잘 잡히지 않는다' },
  { id: 'supported-1', emotionId: 'supported', text: '혼자가 아니라는 감각이 마음을 받쳐준다' },
  { id: 'supported-2', emotionId: 'supported', text: '기댈 수 있는 뿌리가 생긴 것처럼 든든하다' },
];

const careNotes = {
  wronged: '억울함은 설명받지 못한 마음의 신호일 수 있어요. 지금 꼭 인정받고 싶은 지점을 한 문장으로 적어보세요.',
  fluttering: '설렘은 마음이 앞으로 기울어지는 순간이에요. 기대하는 장면을 작게 이름 붙여보면 더 선명해져요.',
  lethargic: '에너지가 다한 날에는 목표를 줄이는 것이 실패가 아니라 회복 전략이에요.',
  peaceful: '평온함은 오래 붙잡기보다 반복 가능한 작은 루틴으로 이어가면 좋아요.',
  guilty: '죄책감이 클수록 사실과 해석을 분리해보세요. 책임질 일과 내려놓을 일을 나눌 수 있어요.',
  proud: '뿌듯함은 다음 회복의 연료가 돼요. 오늘 해낸 일을 작게라도 기록해두세요.',
  anxious: '불안이 깜빡일 때는 예측보다 현재 감각으로 돌아오는 것이 도움이 돼요. 보이는 것 세 가지를 찾아보세요.',
  relieved: '안도감이 찾아왔을 때 몸의 감각을 기억해두면 다음 긴장 속에서도 돌아갈 길이 생겨요.',
  lonely: '외로움이 클 때는 깊은 대화보다 짧은 안부 하나가 먼저 도움이 될 수 있어요.',
  hopeful: '희망이 생긴 순간에는 너무 큰 계획보다 다음 한 걸음만 정해보세요.',
  angry: '뜨거운 반응이 올라올 때는 바로 행동하기보다 10초의 간격을 만들어 감정을 보호해보세요.',
  grateful: '감사는 관계의 온기를 오래 보존해요. 고마운 장면을 구체적으로 떠올려보세요.',
  depressed: '무거운 감정은 밀어내기보다 이름 붙이는 것부터 시작해도 충분해요.',
  confident: '자신감은 움직일수록 더 단단해져요. 지금 선택한 방향을 아주 작게 실행해보세요.',
  confused: '혼란스러울 때는 결론보다 분류가 먼저예요. 생각, 감정, 사실을 따로 적어보세요.',
  overwhelmed: '벅찬 감정은 좋은 마음이어도 쉬어갈 자리가 필요해요. 잠깐 숨을 고르는 시간을 주세요.',
  blocked: '막막함은 전체를 한 번에 보려 할 때 커져요. 가장 작은 시작점 하나만 남겨보세요.',
  lighthearted: '홀가분함은 비워낸 뒤의 신호예요. 지금 가벼워진 이유를 짧게 기록해보세요.',
  empty: '비어 있는 느낌은 회복 전의 공간일 수 있어요. 오늘 채우고 싶은 아주 작은 것을 하나만 적어보세요.',
  supported: '든든함은 마음의 안전기지예요. 나를 받쳐주는 사람이나 기억을 다시 확인해보세요.',
};

const createSeededRandom = (seed) => {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

const random = createSeededRandom(20260415);

const createGalaxyStars = (seed, count) => {
  const galaxyRandom = createSeededRandom(seed);

  return Array.from({ length: count }, (_, index) => {
    const armOffset = (index % 2) * Math.PI;
    const baseRadius = Math.pow(galaxyRandom(), 0.72) * 46;
    const radius = baseRadius < 7 ? 7 + galaxyRandom() * 5 : baseRadius;
    const twist = radius * 0.082;
    const angle = armOffset + twist + (galaxyRandom() - 0.5) * 0.92;
    const scatter = galaxyRandom() * 5.8;
    const x = 50 + Math.cos(angle) * radius + (galaxyRandom() - 0.5) * scatter;
    const y = 50 + Math.sin(angle) * radius * 0.42 + (galaxyRandom() - 0.5) * scatter * 0.8;
    const isCoreStar = radius < 13;

    return {
      id: `galaxy-star-${seed}-${index}`,
      x: Math.min(96, Math.max(4, x)).toFixed(2),
      y: Math.min(96, Math.max(4, y)).toFixed(2),
      size: (isCoreStar ? 0.84 + galaxyRandom() * 1.1 : 0.65 + galaxyRandom() * 1.55).toFixed(2),
      opacity: (isCoreStar ? 0.42 + galaxyRandom() * 0.38 : 0.26 + galaxyRandom() * 0.54).toFixed(2),
      softOpacity: (isCoreStar ? 0.22 + galaxyRandom() * 0.22 : 0.18 + galaxyRandom() * 0.24).toFixed(2),
      dimOpacity: (isCoreStar ? 0.12 + galaxyRandom() * 0.18 : 0.1 + galaxyRandom() * 0.16).toFixed(2),
      delay: (-galaxyRandom() * 10).toFixed(2),
    };
  });
};

const ambientStars = Array.from({ length: 170 }, (_, index) => {
  const x = random();
  const y = random();
  const isTinyStar = random() < 0.36;
  const shouldRender = !isTinyStar || random() > 0.72;
  const opacity = isTinyStar ? 0.2 + random() * 0.22 : 0.34 + random() * 0.42;

  return {
    id: `ambient-star-${index}`,
    x: (x * 100).toFixed(2),
    y: (y * 100).toFixed(2),
    size: (isTinyStar ? 0.38 + random() * 0.34 : 0.72 + random() * 1.08).toFixed(2),
    opacity: opacity.toFixed(2),
    softOpacity: (opacity * 0.34).toFixed(2),
    midOpacity: (opacity * 0.58).toFixed(2),
    delay: (-random() * 18).toFixed(2),
    duration: (7.5 + random() * 12).toFixed(2),
    shouldRender,
  };
});

const shimmerStars = Array.from({ length: 38 }, (_, index) => ({
  id: `shimmer-star-${index}`,
  x: (random() * 100).toFixed(2),
  y: (random() * 100).toFixed(2),
  size: random() > 0.82 ? 2 : 1,
  delay: (-random() * 16).toFixed(2),
  duration: (6.5 + random() * 9.5).toFixed(2),
}));

const shootingStars = [
  { id: 'shooting-star-1', top: 18, left: 8, delay: 1.2, duration: 7.6 },
  { id: 'shooting-star-2', top: 36, left: 64, delay: 5.8, duration: 9.4 },
  { id: 'shooting-star-3', top: 68, left: 18, delay: 10.6, duration: 8.2 },
];

const distantGalaxies = [
  { id: 'galaxy-a', x: 18, y: 22, size: 150, rotation: -18, tone: '#78d7ff', delay: 0.1, stars: createGalaxyStars(7151, 92) },
  { id: 'galaxy-b', x: 82, y: 26, size: 118, rotation: 22, tone: '#ff9ecf', delay: 0.24, stars: createGalaxyStars(8226, 74) },
  { id: 'galaxy-c', x: 16, y: 78, size: 110, rotation: 38, tone: '#ffe27a', delay: 0.38, stars: createGalaxyStars(1678, 68) },
  { id: 'galaxy-d', x: 78, y: 76, size: 172, rotation: -32, tone: '#c69cff', delay: 0.52, stars: createGalaxyStars(7876, 106) },
  { id: 'galaxy-e', x: 50, y: 18, size: 86, rotation: 12, tone: '#9af7dc', delay: 0.66, stars: createGalaxyStars(5018, 56) },
];

const homeGalaxyStars = createGalaxyStars(20260416, 138);

const hexToRgb = (hex) => {
  const normalizedHex = hex.replace('#', '');
  return {
    r: parseInt(normalizedHex.slice(0, 2), 16),
    g: parseInt(normalizedHex.slice(2, 4), 16),
    b: parseInt(normalizedHex.slice(4, 6), 16),
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, '0'))
    .join('')}`;

const mixColors = (colors) => {
  const mixed = colors
    .map(hexToRgb)
    .reduce(
      (total, color) => ({
        r: total.r + color.r,
        g: total.g + color.g,
        b: total.b + color.b,
      }),
      { r: 0, g: 0, b: 0 },
    );

  return rgbToHex({
    r: mixed.r / colors.length,
    g: mixed.g / colors.length,
    b: mixed.b / colors.length,
  });
};

const createPaletteFromEmotions = (selectedEmotions) => {
  if (selectedEmotions.length === 1) {
    return selectedEmotions[0].palette;
  }

  return [
    selectedEmotions[0].palette[0],
    selectedEmotions[1].palette[0],
    selectedEmotions[2]?.palette[0] ?? mixColors(selectedEmotions.map((emotion) => emotion.palette[1])),
  ];
};

const createEmotionProfile = (selectedEmotions, selectedStatements) => {
  const scores = selectedEmotions.reduce(
    (profile, emotion) => ({
      ...profile,
      [emotion.id]: 1,
    }),
    {},
  );

  selectedStatements.forEach((statement) => {
    scores[statement.emotionId] = (scores[statement.emotionId] ?? 0) + 1.35;
  });

  const totalScore = Object.values(scores).reduce((total, score) => total + score, 0);

  return selectedEmotions
    .map((emotion) => ({
      id: emotion.id,
      label: emotion.label,
      color: emotion.palette[0],
      ratio: Math.round(((scores[emotion.id] ?? 0) / totalScore) * 100),
    }))
    .sort((firstEmotion, secondEmotion) => secondEmotion.ratio - firstEmotion.ratio);
};

const createPaletteFromProfile = (emotionProfile) => {
  const rankedEmotions = emotionProfile
    .map((profile) => emotions.find((emotion) => emotion.id === profile.id))
    .filter(Boolean);

  return createPaletteFromEmotions(rankedEmotions);
};

const createAuraFromProfile = (emotionProfile) => {
  const weightedColors = emotionProfile.flatMap((profile) => {
    const emotion = emotions.find((emotionItem) => emotionItem.id === profile.id);
    const weight = Math.max(1, Math.round(profile.ratio / 18));

    return Array.from({ length: weight }, () => emotion?.palette[0]).filter(Boolean);
  });

  return mixColors(weightedColors);
};

const getCareNote = (emotionId) => careNotes[emotionId] ?? '지금의 마음을 판단하지 말고, 관찰한 단어 하나만 남겨보세요.';

const getPlanetInfoPlacement = (planet) => {
  const { x, y } = planet.position;

  if (x > 66 && y < 42) {
    return 'is-bottom-left';
  }

  if (x > 72) {
    return 'is-top-left';
  }

  if (y < 30) {
    return 'is-bottom-right';
  }

  return 'is-top-right';
};

const getDisplayPosition = (planet, isBirdView) => {
  if (!isBirdView) {
    return planet.position;
  }

  return {
    x: 50 + (planet.position.x - 50) * 0.2,
    y: 50 + (planet.position.y - 50) * 0.2,
  };
};

const getTouchDistance = (touches) => {
  const [firstTouch, secondTouch] = touches;
  return Math.hypot(firstTouch.clientX - secondTouch.clientX, firstTouch.clientY - secondTouch.clientY);
};

const createPlanet = (selectedEmotions, selectedStatements) => {
  const createdAt = new Date();
  const labels = selectedEmotions.map((emotion) => emotion.label);
  const emotionProfile = createEmotionProfile(selectedEmotions, selectedStatements);
  const palette = createPaletteFromProfile(emotionProfile);
  const aura = createAuraFromProfile(emotionProfile);
  const dominantEmotionId = emotionProfile[0]?.id ?? selectedEmotions[0].id;
  const size = 58 + Math.floor(Math.random() * 64);
  const position = {
    x: 12 + Math.floor(Math.random() * 76),
    y: 14 + Math.floor(Math.random() * 70),
  };

  return {
    id: crypto.randomUUID(),
    name: `${planetNames[Math.floor(Math.random() * planetNames.length)]}-${String(
      Math.floor(Math.random() * 90) + 10,
    )}`,
    emotionIds: selectedEmotions.map((emotion) => emotion.id),
    emotion: labels.join(' · '),
    emotionProfile,
    emotionStatements: selectedStatements.map((statement) => statement.text),
    dominantEmotionId,
    psychology: selectedEmotions.map((emotion) => emotion.colorMeaning).join(' '),
    prompt: `${labels.join(', ')}이(가) 섞여 만들어진 오늘의 마음 행성이에요.`,
    careNote: getCareNote(dominantEmotionId),
    logs: [],
    palette,
    aura,
    size,
    position,
    createdAt: createdAt.toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

function App() {
  const [selectedEmotionIds, setSelectedEmotionIds] = useState([]);
  const [selectedStatementIds, setSelectedStatementIds] = useState([]);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isPlanetCreating, setIsPlanetCreating] = useState(false);
  const [isCreatorClosing, setIsCreatorClosing] = useState(false);
  const [isBirdView, setIsBirdView] = useState(false);
  const [isHomeGalaxyLabelOpen, setIsHomeGalaxyLabelOpen] = useState(false);
  const [activePlanetNote, setActivePlanetNote] = useState('');
  const pinchStartDistanceRef = useRef(null);
  const creationTimersRef = useRef([]);
  const [planets, setPlanets] = useState(() => {
    const savedPlanets = localStorage.getItem(STORAGE_KEY);
    return savedPlanets ? JSON.parse(savedPlanets) : [];
  });
  const [activePlanetId, setActivePlanetId] = useState(null);

  const selectedEmotions = selectedEmotionIds
    .map((emotionId) => emotions.find((emotion) => emotion.id === emotionId))
    .filter(Boolean);
  const selectedStatements = selectedStatementIds
    .map((statementId) => emotionStatements.find((statement) => statement.id === statementId))
    .filter(Boolean);
  const availableStatements = emotionStatements.filter((statement) => selectedEmotionIds.includes(statement.emotionId));
  const isPlanetPreviewReady = selectedEmotions.length > 0 && selectedStatements.length > 0;
  const previewEmotionProfile =
    isPlanetPreviewReady ? createEmotionProfile(selectedEmotions, selectedStatements) : [];
  const previewPalette =
    previewEmotionProfile.length > 0 ? createPaletteFromProfile(previewEmotionProfile) : ['#dfe9ff', '#9af7dc', '#1f2946'];
  const previewAura =
    previewEmotionProfile.length > 0 ? createAuraFromProfile(previewEmotionProfile) : '#9af7dc';
  const activePlanet = planets.find((planet) => planet.id === activePlanetId);
  const homeGalaxyTone =
    planets.length > 0
      ? mixColors(planets.slice(0, Math.min(3, planets.length)).map((planet) => planet.aura ?? planet.palette[0]))
      : '#9af7dc';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planets));
  }, [planets]);

  useEffect(
    () => () => {
      creationTimersRef.current.forEach((timerId) => clearTimeout(timerId));
    },
    [],
  );

  useEffect(() => {
    if (!isBirdView) {
      setIsHomeGalaxyLabelOpen(false);
    }
  }, [isBirdView]);

  useEffect(() => {
    setActivePlanetNote('');
  }, [activePlanetId]);

  useEffect(() => {
    const closeWithEscape = (event) => {
      if (event.key === 'Escape') {
        if (isPlanetCreating) {
          return;
        }

        setIsCreatorOpen(false);
        setActivePlanetId(null);
      }

      if ((event.ctrlKey || event.metaKey) && ['+', '-', '=', '0'].includes(event.key)) {
        event.preventDefault();
        setIsBirdView(event.key === '-');
      }
    };

    window.addEventListener('keydown', closeWithEscape);
    return () => window.removeEventListener('keydown', closeWithEscape);
  }, [isPlanetCreating]);

  useEffect(() => {
    const preventBrowserZoom = (event) => {
      if (!event.ctrlKey) {
        return;
      }

      event.preventDefault();
      setIsBirdView(event.deltaY > 0);
    };

    const preventGestureZoom = (event) => {
      event.preventDefault();
    };

    window.addEventListener('wheel', preventBrowserZoom, { passive: false, capture: true });
    window.addEventListener('gesturestart', preventGestureZoom, { passive: false });
    window.addEventListener('gesturechange', preventGestureZoom, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventBrowserZoom, { capture: true });
      window.removeEventListener('gesturestart', preventGestureZoom);
      window.removeEventListener('gesturechange', preventGestureZoom);
    };
  }, []);

  const handleToggleEmotion = (emotionId) => {
    setSelectedEmotionIds((currentEmotionIds) => {
      if (currentEmotionIds.includes(emotionId)) {
        setSelectedStatementIds((currentStatementIds) =>
          currentStatementIds.filter((statementId) => {
            const statement = emotionStatements.find((emotionStatement) => emotionStatement.id === statementId);

            return statement?.emotionId !== emotionId;
          }),
        );
        return currentEmotionIds.filter((currentEmotionId) => currentEmotionId !== emotionId);
      }

      if (currentEmotionIds.length >= MAX_SELECTED_EMOTIONS) {
        return currentEmotionIds;
      }

      return [...currentEmotionIds, emotionId];
    });
  };

  const handleToggleStatement = (statementId) => {
    setSelectedStatementIds((currentStatementIds) => {
      if (currentStatementIds.includes(statementId)) {
        return currentStatementIds.filter((currentStatementId) => currentStatementId !== statementId);
      }

      if (currentStatementIds.length >= MAX_SELECTED_STATEMENTS) {
        return currentStatementIds;
      }

      return [...currentStatementIds, statementId];
    });
  };

  const handleCreatePlanet = () => {
    if (!isPlanetPreviewReady || isPlanetCreating) {
      return;
    }

    const nextPlanet = createPlanet(selectedEmotions, selectedStatements);
    creationTimersRef.current.forEach((timerId) => clearTimeout(timerId));
    setIsPlanetCreating(true);
    setIsCreatorClosing(false);

    const descendTimer = setTimeout(() => {
      setIsCreatorClosing(true);
    }, 1600);

    const finishTimer = setTimeout(() => {
      setPlanets((currentPlanets) => [nextPlanet, ...currentPlanets]);
      setActivePlanetId(nextPlanet.id);
      setSelectedEmotionIds([]);
      setSelectedStatementIds([]);
      setIsCreatorOpen(false);
      setIsPlanetCreating(false);
      setIsCreatorClosing(false);
      setIsBirdView(false);
    }, 2000);

    creationTimersRef.current = [descendTimer, finishTimer];
  };

  const handleAddPlanetLog = (event) => {
    event.preventDefault();

    if (!activePlanet || activePlanetNote.trim().length === 0) {
      return;
    }

    const createdAt = new Date().toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const nextLog = {
      id: crypto.randomUUID(),
      text: activePlanetNote.trim(),
      createdAt,
    };

    setPlanets((currentPlanets) =>
      currentPlanets.map((planet) =>
        planet.id === activePlanet.id ? { ...planet, logs: [nextLog, ...(planet.logs ?? [])].slice(0, 6) } : planet,
      ),
    );
    setActivePlanetNote('');
  };

  const handleClearPlanets = () => {
    setPlanets([]);
    setActivePlanetId(null);
    setActivePlanetNote('');
    setIsBirdView(false);
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      pinchStartDistanceRef.current = getTouchDistance(event.touches);
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length !== 2 || !pinchStartDistanceRef.current) {
      return;
    }

    const currentDistance = getTouchDistance(event.touches);

    if (currentDistance < pinchStartDistanceRef.current * 0.84) {
      setIsBirdView(true);
    }

    if (currentDistance > pinchStartDistanceRef.current * 1.14) {
      setIsBirdView(false);
    }
  };

  const handleTouchEnd = (event) => {
    if (event.touches.length < 2) {
      pinchStartDistanceRef.current = null;
    }
  };

  const handleWheel = (event) => {
    if (!event.ctrlKey) {
      return;
    }

    event.preventDefault();
    setIsBirdView(event.deltaY > 0);
  };

  return (
    <main className="app-shell">
      <div
        className={`universe-backdrop ${isBirdView ? 'is-bird-view' : ''}`}
        aria-hidden={planets.length === 0}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div className="star-field star-field-a" />
        <div className="star-field star-field-b" />
        <div className="star-dust" />
        {ambientStars
          .filter(({ shouldRender }) => shouldRender)
          .map(({ id, x, y, size, opacity, softOpacity, midOpacity, delay, duration }) => (
            <span
              className="ambient-star"
              key={id}
              style={{
                '--x': `${x}%`,
                '--y': `${y}%`,
                '--star-size': `${size}px`,
                '--star-opacity': opacity,
                '--star-soft-opacity': softOpacity,
                '--star-mid-opacity': midOpacity,
                '--delay': `${delay}s`,
                '--duration': `${duration}s`,
              }}
            />
          ))}
        {shimmerStars.map(({ id, x, y, size, delay, duration }) => (
          <span
            className="twinkle-star"
            key={id}
            style={{
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--star-size': `${size}px`,
              '--delay': `${delay}s`,
              '--duration': `${duration}s`,
            }}
          />
        ))}
        {shootingStars.map(({ id, top, left, delay, duration }) => (
          <span
            className="shooting-star"
            key={id}
            style={{
              '--top': `${top}%`,
              '--left': `${left}%`,
              '--delay': `${delay}s`,
              '--duration': `${duration}s`,
            }}
          />
        ))}
        {distantGalaxies.map(({ id, x, y, size, rotation, tone, delay, stars }) => (
          <span
            className="distant-galaxy"
            key={id}
            style={{
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--galaxy-size': `${size}px`,
              '--rotation': `${rotation}deg`,
              '--galaxy-tone': tone,
              '--delay': `${delay}s`,
            }}
          >
            <span className="galaxy-core" />
            <span className="galaxy-star-cluster">
              {stars.map(
                ({
                  id: starId,
                  x: starX,
                  y: starY,
                  size: starSize,
                  opacity,
                  softOpacity,
                  dimOpacity,
                  delay: starDelay,
                }) => (
                <span
                  className="galaxy-star"
                  key={starId}
                  style={{
                    '--star-x': `${starX}%`,
                    '--star-y': `${starY}%`,
                    '--star-size': `${starSize}px`,
                    '--star-opacity': opacity,
                    '--star-soft-opacity': softOpacity,
                    '--star-dim-opacity': dimOpacity,
                    '--star-delay': `${starDelay}s`,
                  }}
                />
              ))}
            </span>
          </span>
        ))}
        {planets.length > 0 && (
          <button
            className={`home-galaxy ${isHomeGalaxyLabelOpen ? 'is-label-open' : ''}`}
            type="button"
            aria-label="내 은하"
            aria-pressed={isHomeGalaxyLabelOpen}
            onMouseEnter={() => setIsHomeGalaxyLabelOpen(true)}
            onMouseLeave={() => setIsHomeGalaxyLabelOpen(false)}
            onFocus={() => setIsHomeGalaxyLabelOpen(true)}
            onBlur={() => setIsHomeGalaxyLabelOpen(false)}
            onClick={() => setIsHomeGalaxyLabelOpen((isOpen) => !isOpen)}
            style={{
              '--home-galaxy-tone': homeGalaxyTone,
              '--galaxy-tone': homeGalaxyTone,
            }}
          >
            <span className="galaxy-core" />
            <span className="galaxy-star-cluster">
              {homeGalaxyStars.map(
                ({
                  id: starId,
                  x: starX,
                  y: starY,
                  size: starSize,
                  opacity,
                  softOpacity,
                  dimOpacity,
                  delay: starDelay,
                }) => (
                <span
                  className="galaxy-star"
                  key={starId}
                  style={{
                    '--star-x': `${starX}%`,
                    '--star-y': `${starY}%`,
                    '--star-size': `${starSize}px`,
                    '--star-opacity': opacity,
                    '--star-soft-opacity': softOpacity,
                    '--star-dim-opacity': dimOpacity,
                    '--star-delay': `${starDelay}s`,
                  }}
                />
              ))}
            </span>
          </button>
        )}
        {planets.length > 0 && (
          <span className={`home-galaxy-label ${isHomeGalaxyLabelOpen ? 'is-visible' : ''}`}>내 은하</span>
        )}
        <div className="nebula nebula-one" />
        <div className="nebula nebula-two" />
        <div className="nebula nebula-three" />
        <div className="cosmic-ring ring-one" />
        <div className="cosmic-ring ring-two" />

        {planets.length > 0 &&
          planets.map((planet, index) => {
            const displayPosition = getDisplayPosition(planet, isBirdView);

            return (
              <button
                className={`map-planet ${activePlanet?.id === planet.id ? 'is-active' : ''}`}
                key={planet.id}
                type="button"
                onClick={() => setActivePlanetId(planet.id)}
                style={{
                  '--tone-one': planet.palette[0],
                  '--tone-two': planet.palette[1],
                  '--tone-three': planet.palette[2],
                  '--aura': planet.aura,
                  '--size': `${planet.size}px`,
                  '--planet-radius': `${(isBirdView ? planet.size * 0.2 : planet.size) / 2}px`,
                  '--x': `${displayPosition.x}%`,
                  '--y': `${displayPosition.y}%`,
                  '--delay': `${index * -0.9}s`,
                }}
                aria-label={`${planet.name} 행성 보기`}
              >
                <span />
              </button>
            );
          })}
        {activePlanet && (
          <aside
            className={`planet-popover ${getPlanetInfoPlacement(activePlanet)}`}
            style={{
              '--x': `${getDisplayPosition(activePlanet, isBirdView).x}%`,
              '--y': `${getDisplayPosition(activePlanet, isBirdView).y}%`,
              '--planet-offset': `${(isBirdView ? activePlanet.size * 0.55 : activePlanet.size) / 2 + 18}px`,
              '--aura': activePlanet.aura,
            }}
            role="dialog"
            aria-label={`${activePlanet.name} 행성 정보`}
          >
            <button className="popover-close" type="button" onClick={() => setActivePlanetId(null)}>
              닫기
            </button>
            <div className="planet-popover-header">
              <p className="eyebrow">Planet Note</p>
              <h2>{activePlanet.name}</h2>
              <div className="planet-meta">
                <span>{activePlanet.emotion}</span>
                <span>{activePlanet.createdAt}</span>
              </div>
            </div>
            <div className="planet-popover-body">
              {activePlanet.emotionProfile?.length > 0 && (
                <div className="ratio-stack" aria-label="감정군 비율">
                  {activePlanet.emotionProfile.map((profile) => (
                    <div className="ratio-item" key={profile.id}>
                      <span>{profile.label}</span>
                      <strong>{profile.ratio}%</strong>
                      <div className="ratio-track">
                        <i style={{ '--ratio': `${profile.ratio}%`, '--ratio-color': profile.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p>{activePlanet.prompt}</p>
              {activePlanet.emotionStatements?.length > 0 && (
                <div className="statement-summary">
                  <strong>선택한 마음 문장</strong>
                  {activePlanet.emotionStatements.map((statement) => (
                    <span key={statement}>{statement}</span>
                  ))}
                </div>
              )}
              <p>{activePlanet.psychology}</p>
              <div className="care-note">
                <strong>오늘의 쪽지</strong>
                <span>{activePlanet.careNote ?? getCareNote(activePlanet.dominantEmotionId)}</span>
              </div>
              <form className="mind-map-form" onSubmit={handleAddPlanetLog}>
                <label htmlFor="planet-log">마음 지도 기록</label>
                <textarea
                  id="planet-log"
                  value={activePlanetNote}
                  onChange={(event) => setActivePlanetNote(event.target.value)}
                  placeholder="오늘 이 행성에 남기고 싶은 장면이나 감정을 적어보세요."
                  rows="3"
                />
                <button className="ghost-button" type="submit" disabled={activePlanetNote.trim().length === 0}>
                  기록 남기기
                </button>
              </form>
              {activePlanet.logs?.length > 0 && (
                <div className="mind-log-list" aria-label="마음 지도 기록 목록">
                  {activePlanet.logs.map((log) => (
                    <article key={log.id}>
                      <time>{log.createdAt}</time>
                      <p>{log.text}</p>
                    </article>
                  ))}
                </div>
              )}
              <div className="palette-row" aria-label="행성 색상 팔레트">
                {activePlanet.palette.map((color) => (
                  <span key={color} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      <div className="space-controls" aria-label="우주 조작">
        <button className="primary-button" type="button" onClick={() => setIsCreatorOpen(true)}>
          행성 만들기
        </button>
        <button
          className="ghost-button"
          type="button"
          onClick={handleClearPlanets}
          disabled={planets.length === 0}
        >
          우주 비우기
        </button>
      </div>

      {isCreatorOpen && (
        <div
          className={`modal-backdrop ${isPlanetCreating ? 'is-creating' : ''}`}
          role="presentation"
          onMouseDown={() => {
            if (!isPlanetCreating) {
              setIsCreatorOpen(false);
            }
          }}
        >
          <section
            className={`creator-modal ${isPlanetCreating ? 'is-creating' : ''} ${isCreatorClosing ? 'is-descending' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="creator-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="close-button"
              type="button"
              onClick={() => setIsCreatorOpen(false)}
              disabled={isPlanetCreating}
            >
              닫기
            </button>
            <div className="modal-heading">
              <p className="eyebrow">Create Planet</p>
              <h2 id="creator-title">지금의 감정 키워드를 골라주세요</h2>
              <p>
                최대 3개까지 선택할 수 있어요. 선택한 감정의 심리 색채가 섞여 행성의 표면,
                후광, 빛의 온도를 결정해요.
              </p>
            </div>

            <div className="creator-grid">
              <div className="creator-choice-panel">
                <div className="emotion-list" aria-label="감정 키워드 선택">
                  {emotions.map((emotion) => {
                    const isSelected = selectedEmotionIds.includes(emotion.id);
                    const isDisabled = !isSelected && selectedEmotionIds.length >= MAX_SELECTED_EMOTIONS;

                    return (
                      <button
                        className={`emotion-card ${isSelected ? 'is-selected' : ''}`}
                        key={emotion.id}
                        type="button"
                        onClick={() => handleToggleEmotion(emotion.id)}
                        disabled={isDisabled || isPlanetCreating}
                        aria-pressed={isSelected}
                      >
                        <strong>{emotion.prompt}</strong>
                      </button>
                    );
                  })}
                </div>

                <div className="statement-panel">
                  <div>
                    <p className="eyebrow">Mind Sentence</p>
                    <strong>마음 문장 선택 {selectedStatementIds.length}/{MAX_SELECTED_STATEMENTS}</strong>
                    <span>선택한 문장은 감정군 비율과 행성 색상에 더 강하게 반영돼요.</span>
                  </div>
                  <div className="statement-list" aria-label="마음 문장 선택">
                    {availableStatements.length > 0 ? (
                      availableStatements.map((statement) => {
                        const isSelected = selectedStatementIds.includes(statement.id);
                        const isDisabled = !isSelected && selectedStatementIds.length >= MAX_SELECTED_STATEMENTS;
                        return (
                          <button
                            className={`statement-chip ${isSelected ? 'is-selected' : ''}`}
                            key={statement.id}
                            type="button"
                            onClick={() => handleToggleStatement(statement.id)}
                            disabled={isDisabled || isPlanetCreating}
                          >
                            {statement.text}
                          </button>
                        );
                      })
                    ) : (
                      <p>먼저 감정 키워드를 선택하면 관련 마음 문장이 나타나요.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-preview" aria-label="생성될 행성 미리보기">
                {isPlanetCreating ? (
                  <>
                    <div
                      className="planet-preview is-forming"
                      style={{
                        '--tone-one': previewPalette[0],
                        '--tone-two': previewPalette[1],
                        '--tone-three': previewPalette[2],
                        '--aura': previewAura,
                      }}
                    >
                      <span />
                    </div>
                    <p className="preview-label">Creating Planet</p>
                    <h3>행성을 빚는 중이에요</h3>
                  </>
                ) : (
                  <div className="preview-locked">
                    <p className="eyebrow">Hidden Planet</p>
                    <h3>
                      {isPlanetPreviewReady
                        ? '생성 버튼을 누르면 행성이 나타나요'
                        : selectedEmotions.length > 0
                          ? '마음 문장을 선택해주세요'
                          : '감정 키워드를 먼저 골라주세요'}
                    </h3>
                    <p>
                      {isPlanetPreviewReady
                        ? '아직 모습이 숨겨져 있어요.'
                        : selectedEmotions.length > 0
                          ? '마음 문장을 고른 뒤에도 색은 숨겨지고, 생성 버튼을 눌러야 공개돼요.'
                          : '처음에는 색을 보여주지 않고, 감정 키워드만으로 마음 문장을 고르게 돼요.'}
                    </p>
                  </div>
                )}
                <p>
                  {isPlanetCreating
                    ? '선택한 조합이 빛과 표면으로 천천히 응결되고 있어요.'
                    : '생성 버튼을 누르기 전까지 행성의 색과 모습은 숨겨져 있어요.'}
                </p>
                <button
                  className="primary-button"
                  type="button"
                  onClick={handleCreatePlanet}
                  disabled={!isPlanetPreviewReady || isPlanetCreating}
                >
                  {isPlanetCreating
                    ? '행성 생성 중...'
                    : isPlanetPreviewReady
                      ? '이 조합으로 행성 생성'
                      : '마음 문장 선택 후 생성'}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
