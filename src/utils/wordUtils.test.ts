import { Word } from '../data/types';
import { getWordLabel, getMeaning, deriveMeaningLanguage } from './wordUtils';

function ja(expression: string, reading?: string): Word {
  return { expression, reading, meanings: { en: 'x' }, lang: 'ja', level: 'JLPT_N5' };
}

describe('getWordLabel', () => {
  it('한자 단어는 읽기를 괄호로 덧붙인다', () => {
    expect(getWordLabel(ja('会う', 'あう'))).toBe('会う (あう)');
  });

  it('읽기가 표기와 같으면(가나 단어) 표기만 — 같은 말 반복 방지', () => {
    expect(getWordLabel(ja('あそこ', 'あそこ'))).toBe('あそこ');
    expect(getWordLabel(ja('アパート', 'アパート'))).toBe('アパート');
  });

  it('읽기의 괄호 주석은 떼어내 괄호 중첩을 막는다', () => {
    expect(getWordLabel(ja('結婚', 'けっこん (する)'))).toBe('結婚 (けっこん)');
  });

  it('표기에 괄호가 있어도 읽기와 실질이 같으면 표기만', () => {
    expect(getWordLabel(ja('パート (タイム)', 'パート (タイム)'))).toBe('パート (タイム)');
  });

  it('표기의 괄호는 유지한 채 읽기를 덧붙인다', () => {
    expect(getWordLabel(ja('受(け)付(け)', 'うけつけ'))).toBe('受(け)付(け) (うけつけ)');
  });

  it('읽기가 없으면 표기만 (한국어 단어)', () => {
    expect(getWordLabel({ expression: '사람', meanings: { en: 'person' }, lang: 'ko', level: 'TOPIK_1' })).toBe('사람');
  });
});

describe('getMeaning', () => {
  it('요청한 언어가 없으면 영어로 폴백한다', () => {
    const w: Word = { expression: '犬', meanings: { en: 'dog' }, lang: 'ja', level: 'JLPT_N5' };
    expect(getMeaning(w, 'ko')).toBe('dog');
  });
});

describe('deriveMeaningLanguage', () => {
  it('학습 언어와 같은 언어는 뜻으로 쓰지 않는다', () => {
    expect(deriveMeaningLanguage('ja', 'ja')).toBe('en');
    expect(deriveMeaningLanguage('ko', 'ko')).toBe('en');
  });

  it('겹치지 않으면 UI 언어를 쓴다', () => {
    expect(deriveMeaningLanguage('ja', 'ko')).toBe('ko');
    expect(deriveMeaningLanguage('ko', 'ja')).toBe('ja');
  });
});
