import { KoreanWord } from './types';

// 기초 한국어 어휘 (~65단어)
// 영어/일본어 학습자를 위한 기본 단어

export const koreanWords: KoreanWord[] = [
  // 일상 (Daily)
  { expression: '사람', meaning: 'person', meaningJa: '人' },
  { expression: '집', meaning: 'house', meaningJa: '家' },
  { expression: '학교', meaning: 'school', meaningJa: '学校' },
  { expression: '물', meaning: 'water', meaningJa: '水' },
  { expression: '밥', meaning: 'rice / meal', meaningJa: 'ご飯' },
  { expression: '책', meaning: 'book', meaningJa: '本' },
  { expression: '돈', meaning: 'money', meaningJa: 'お金' },
  { expression: '시간', meaning: 'time', meaningJa: '時間' },
  { expression: '일', meaning: 'work', meaningJa: '仕事' },
  { expression: '말', meaning: 'word / speech', meaningJa: '言葉' },
  { expression: '길', meaning: 'road', meaningJa: '道' },
  { expression: '문', meaning: 'door', meaningJa: 'ドア' },
  { expression: '나라', meaning: 'country', meaningJa: '国' },
  { expression: '이름', meaning: 'name', meaningJa: '名前' },

  // 가족 (Family)
  { expression: '아버지', meaning: 'father', meaningJa: '父' },
  { expression: '어머니', meaning: 'mother', meaningJa: '母' },
  { expression: '형', meaning: 'older brother', meaningJa: '兄' },
  { expression: '누나', meaning: 'older sister', meaningJa: '姉' },
  { expression: '동생', meaning: 'younger sibling', meaningJa: '弟・妹' },
  { expression: '친구', meaning: 'friend', meaningJa: '友達' },

  // 음식 (Food)
  { expression: '사과', meaning: 'apple', meaningJa: 'りんご' },
  { expression: '고기', meaning: 'meat', meaningJa: '肉' },
  { expression: '빵', meaning: 'bread', meaningJa: 'パン' },
  { expression: '우유', meaning: 'milk', meaningJa: '牛乳' },
  { expression: '커피', meaning: 'coffee', meaningJa: 'コーヒー' },
  { expression: '과일', meaning: 'fruit', meaningJa: '果物' },
  { expression: '채소', meaning: 'vegetable', meaningJa: '野菜' },
  { expression: '계란', meaning: 'egg', meaningJa: '卵' },

  // 자연 (Nature)
  { expression: '하늘', meaning: 'sky', meaningJa: '空' },
  { expression: '바다', meaning: 'sea', meaningJa: '海' },
  { expression: '산', meaning: 'mountain', meaningJa: '山' },
  { expression: '나무', meaning: 'tree', meaningJa: '木' },
  { expression: '꽃', meaning: 'flower', meaningJa: '花' },
  { expression: '비', meaning: 'rain', meaningJa: '雨' },
  { expression: '눈', meaning: 'snow / eye', meaningJa: '雪・目' },
  { expression: '바람', meaning: 'wind', meaningJa: '風' },

  // 동물 (Animals)
  { expression: '강아지', meaning: 'puppy', meaningJa: '子犬' },
  { expression: '고양이', meaning: 'cat', meaningJa: '猫' },
  { expression: '새', meaning: 'bird', meaningJa: '鳥' },
  { expression: '물고기', meaning: 'fish', meaningJa: '魚' },
  { expression: '소', meaning: 'cow', meaningJa: '牛' },

  // 색깔 (Colors)
  { expression: '빨간색', meaning: 'red', meaningJa: '赤' },
  { expression: '파란색', meaning: 'blue', meaningJa: '青' },
  { expression: '노란색', meaning: 'yellow', meaningJa: '黄色' },
  { expression: '하얀색', meaning: 'white', meaningJa: '白' },
  { expression: '검은색', meaning: 'black', meaningJa: '黒' },

  // 시간 (Time)
  { expression: '오늘', meaning: 'today', meaningJa: '今日' },
  { expression: '내일', meaning: 'tomorrow', meaningJa: '明日' },
  { expression: '어제', meaning: 'yesterday', meaningJa: '昨日' },
  { expression: '아침', meaning: 'morning', meaningJa: '朝' },
  { expression: '저녁', meaning: 'evening', meaningJa: '夕方' },

  // 형용사 (Adjectives)
  { expression: '크다', meaning: 'big', meaningJa: '大きい' },
  { expression: '작다', meaning: 'small', meaningJa: '小さい' },
  { expression: '좋다', meaning: 'good', meaningJa: '良い' },
  { expression: '많다', meaning: 'many', meaningJa: '多い' },
  { expression: '새롭다', meaning: 'new', meaningJa: '新しい' },
  { expression: '빠르다', meaning: 'fast', meaningJa: '速い' },
  { expression: '높다', meaning: 'high / tall', meaningJa: '高い' },
  { expression: '예쁘다', meaning: 'pretty', meaningJa: 'きれい' },

  // 동사 (Verbs)
  { expression: '가다', meaning: 'to go', meaningJa: '行く' },
  { expression: '오다', meaning: 'to come', meaningJa: '来る' },
  { expression: '먹다', meaning: 'to eat', meaningJa: '食べる' },
  { expression: '마시다', meaning: 'to drink', meaningJa: '飲む' },
  { expression: '보다', meaning: 'to see', meaningJa: '見る' },
  { expression: '읽다', meaning: 'to read', meaningJa: '読む' },
  { expression: '쓰다', meaning: 'to write', meaningJa: '書く' },
  { expression: '사다', meaning: 'to buy', meaningJa: '買う' },
];

export function getKoreanWordCount(): number {
  return koreanWords.length;
}
