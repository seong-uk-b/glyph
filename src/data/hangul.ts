export interface HangulCharacter {
  character: string;
  romanization: string;
  name: string;
}

export const BASIC_CONSONANTS: HangulCharacter[] = [
  { character: 'ㄱ', romanization: 'g/k', name: '기역' },
  { character: 'ㄴ', romanization: 'n', name: '니은' },
  { character: 'ㄷ', romanization: 'd/t', name: '디귿' },
  { character: 'ㄹ', romanization: 'r/l', name: '리을' },
  { character: 'ㅁ', romanization: 'm', name: '미음' },
  { character: 'ㅂ', romanization: 'b/p', name: '비읍' },
  { character: 'ㅅ', romanization: 's', name: '시옷' },
  { character: 'ㅇ', romanization: 'ng', name: '이응' },
  { character: 'ㅈ', romanization: 'j', name: '지읒' },
  { character: 'ㅊ', romanization: 'ch', name: '치읓' },
  { character: 'ㅋ', romanization: 'k', name: '키읔' },
  { character: 'ㅌ', romanization: 't', name: '티읕' },
  { character: 'ㅍ', romanization: 'p', name: '피읖' },
  { character: 'ㅎ', romanization: 'h', name: '히읗' },
];

export const DOUBLE_CONSONANTS: HangulCharacter[] = [
  { character: 'ㄲ', romanization: 'kk', name: '쌍기역' },
  { character: 'ㄸ', romanization: 'tt', name: '쌍디귿' },
  { character: 'ㅃ', romanization: 'pp', name: '쌍비읍' },
  { character: 'ㅆ', romanization: 'ss', name: '쌍시옷' },
  { character: 'ㅉ', romanization: 'jj', name: '쌍지읒' },
];

export const BASIC_VOWELS: HangulCharacter[] = [
  { character: 'ㅏ', romanization: 'a', name: '아' },
  { character: 'ㅑ', romanization: 'ya', name: '야' },
  { character: 'ㅓ', romanization: 'eo', name: '어' },
  { character: 'ㅕ', romanization: 'yeo', name: '여' },
  { character: 'ㅗ', romanization: 'o', name: '오' },
  { character: 'ㅛ', romanization: 'yo', name: '요' },
  { character: 'ㅜ', romanization: 'u', name: '우' },
  { character: 'ㅠ', romanization: 'yu', name: '유' },
  { character: 'ㅡ', romanization: 'eu', name: '으' },
  { character: 'ㅣ', romanization: 'i', name: '이' },
];

export const COMPOUND_VOWELS: HangulCharacter[] = [
  { character: 'ㅐ', romanization: 'ae', name: '애' },
  { character: 'ㅒ', romanization: 'yae', name: '얘' },
  { character: 'ㅔ', romanization: 'e', name: '에' },
  { character: 'ㅖ', romanization: 'ye', name: '예' },
  { character: 'ㅘ', romanization: 'wa', name: '와' },
  { character: 'ㅙ', romanization: 'wae', name: '왜' },
  { character: 'ㅚ', romanization: 'oe', name: '외' },
  { character: 'ㅝ', romanization: 'wo', name: '워' },
  { character: 'ㅞ', romanization: 'we', name: '웨' },
  { character: 'ㅟ', romanization: 'wi', name: '위' },
  { character: 'ㅢ', romanization: 'ui', name: '의' },
];

// --- 한글 조합 (Syllable composition) ---

// 초성 19자 (Unicode 순서)
export const CHOSEONG = [
  'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ',
  'ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
];

// 중성 21자
export const JUNGSEONG = [
  'ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ',
  'ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ',
];

// 종성 27자 (index 0 = 없음)
export const JONGSEONG = [
  '','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ',
  'ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ',
  'ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
];

// 초성 로마자
const CHO_ROMAN = [
  'g','kk','n','d','tt','r','m','b','pp','s',
  'ss','','j','jj','ch','k','t','p','h',
];

// 중성 로마자
const JUNG_ROMAN = [
  'a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae',
  'oe','yo','u','wo','we','wi','yu','eu','ui','i',
];

// 종성 로마자 (index 0 = 없음)
const JONG_ROMAN = [
  '','k','kk','ks','n','nj','nh','t','l','lk','lm',
  'lp','ls','lt','lp','lh','m','p','ps','t','ss',
  'ng','j','ch','k','t','p','h',
];

export interface SyllableInfo {
  syllable: string;
  romanization: string;
  choIdx: number;
  jungIdx: number;
  jongIdx: number;
}

export function composeSyllable(choIdx: number, jungIdx: number, jongIdx: number = 0): string {
  return String.fromCharCode(0xAC00 + (choIdx * 21 + jungIdx) * 28 + jongIdx);
}

export function romanizeSyllable(choIdx: number, jungIdx: number, jongIdx: number = 0): string {
  return CHO_ROMAN[choIdx] + JUNG_ROMAN[jungIdx] + JONG_ROMAN[jongIdx];
}

function decomposeSyllable(char: string): { choIdx: number; jungIdx: number; jongIdx: number } {
  const code = char.charCodeAt(0) - 0xAC00;
  const jongIdx = code % 28;
  const jungIdx = ((code - jongIdx) / 28) % 21;
  const choIdx = Math.floor((code - jongIdx) / 28 / 21);
  return { choIdx, jungIdx, jongIdx };
}

// --- 자주 쓰이는 음절 (curated) ---

// 받침 없는 음절 (~190개): 기본 자음×모음 + 쌍자음 + 복합모음
const OPEN_SYLLABLES = [
  // ㄱ행
  '가','개','갸','거','게','겨','고','교','구','규','그','기',
  // ㄲ행
  '까','깨','꺼','께','꼬','꾸','끄','끼',
  // ㄴ행
  '나','내','냐','너','네','녀','노','뇨','누','뉴','느','니',
  // ㄷ행
  '다','대','더','데','도','두','드','디',
  // ㄸ행
  '따','때','떠','떼','또','뚜','뜨','띠',
  // ㄹ행
  '라','래','러','레','려','로','료','루','류','르','리',
  // ㅁ행
  '마','매','머','메','며','모','묘','무','므','미',
  // ㅂ행
  '바','배','버','베','벼','보','부','브','비',
  // ㅃ행
  '빠','빼','뻐','뼈','뽀','뿌',
  // ㅅ행
  '사','새','서','세','셔','소','쇼','수','슈','스','시',
  // ㅆ행
  '싸','써','쏘','쑤','쓰','씨',
  // ㅇ행
  '아','애','야','어','에','여','오','요','우','유','으','의','이',
  // ㅈ행
  '자','재','저','제','조','주','즈','지',
  // ㅉ행
  '짜','째','쩌','쪼','찌',
  // ㅊ행
  '차','채','처','체','초','추','츠','치',
  // ㅋ행
  '카','케','커','코','쿠','크','키',
  // ㅌ행
  '타','태','터','테','토','투','트','티',
  // ㅍ행
  '파','패','퍼','페','표','포','푸','프','피',
  // ㅎ행
  '하','해','허','헤','혀','호','효','후','휴','흐','히',
  // 복합 모음 조합
  '과','괴','귀','돼','되','뒤','봐','쇠','쉬',
  '와','왜','외','워','웨','위','화','회','휘','꽤','뭐',
];

// 받침 있는 음절 (~310개): 실제 한국어에서 자주 쓰이는 음절만
const CLOSED_SYLLABLES = [
  // ㄱ행
  '간','갈','감','강','각','갑','건','걸','검','겁','격',
  '견','결','겸','경','곤','골','곰','공','곡','관','광',
  '군','굴','굼','궁','국','권','근','글','금','급','긍',
  // ㄲ행
  '깐','깔','깡','깍','꼴','꼭','꿀','꿈','꽃','끈','끌','끔','깃',
  // ㄴ행
  '난','날','남','낭','낙','납','넌','널','넘','넝',
  '녁','년','념','녕','논','놀','농','눈','눌','는','늘','능',
  // ㄷ행
  '단','달','담','당','닥','답','던','덜','덤','덩','덕',
  '돈','돌','동','독','둔','둘','둥','든','들','듬','등',
  // ㄸ행
  '딴','딸','땀','땅','떡','뚝','뜻','똥',
  // ㄹ행
  '란','랄','람','랑','락','런','럴','럼','렁','력','련','렬','렴','령',
  '론','롤','롬','롱','룰','룸','룽','른','를','름','릉',
  '린','릴','림','링','릭','립',
  // ㅁ행
  '만','말','맘','망','막','먹','먼','멀','멈','멍',
  '면','멸','명','몬','몰','몸','몽','목','문','물','묵','민','밀','밍',
  // ㅂ행
  '반','발','밤','방','박','밥','번','벌','범','벙','벽',
  '변','별','병','본','볼','봄','봉','복','분','불','붕','북','빈','빌','빔','빙',
  // ㅃ행
  '뻔','뿔','뿐',
  // ㅅ행
  '산','살','삼','상','삭','삽','선','설','섬','성','석','섭',
  '손','솔','송','속','순','술','숨','숭','숙','신','실','심','싱','식','십',
  // ㅆ행
  '쌀','쌍','쌈','썩','쓴','쓸','씩',
  // ㅇ행
  '안','알','암','앙','악','언','얼','엄','엉','억','업',
  '온','올','옴','옹','옥','운','울','움','웅','욱',
  '은','을','음','응','인','일','임','잉','익','입',
  // ㅈ행
  '잔','잘','잠','장','작','잡','전','절','점','정','적','접',
  '존','졸','종','족','준','줄','중','죽','진','질','짐','징','직','집',
  // ㅉ행
  '짝','짠','짤','쪽',
  // ㅊ행
  '찬','찰','참','창','착','천','철','첨','청','척',
  '촌','총','축','출','충','침','칭',
  // ㅋ행
  '칸','칼','컨','컬','컵','콘','콜','큰','클','킨','킬','킹',
  // ㅌ행
  '탄','탈','탑','탕','턴','털','톤','톨','통','틈','틴','틸','팅',
  // ㅍ행
  '판','팔','팡','편','평','폰','폭','풀','품','풍','핀','필',
  // ㅎ행
  '한','할','함','항','학','합','헌','헐','험','혁','현','혈','형',
  '혼','홀','홍','훈','훌','흔','흘','흠','흥','힌','힐','힘',
];

export const OPEN_SYLLABLE_COUNT = OPEN_SYLLABLES.length;
export const CLOSED_SYLLABLE_COUNT = CLOSED_SYLLABLES.length;

function parseSyllables(chars: string[]): SyllableInfo[] {
  return chars.map(syllable => {
    const { choIdx, jungIdx, jongIdx } = decomposeSyllable(syllable);
    return {
      syllable,
      romanization: romanizeSyllable(choIdx, jungIdx, jongIdx),
      choIdx, jungIdx, jongIdx,
    };
  });
}

export function generateSyllables(includeBatchim: boolean): SyllableInfo[] {
  return parseSyllables(includeBatchim ? CLOSED_SYLLABLES : OPEN_SYLLABLES);
}
