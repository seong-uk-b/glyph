import { isCorrectAnswer } from './gameLogic';

describe('isCorrectAnswer — 로마자 입력 판정', () => {
  it('정확히 일치하면 정답', () => {
    expect(isCorrectAnswer('shi', 'shi')).toBe(true);
    expect(isCorrectAnswer('a', 'a')).toBe(true);
  });

  it('대소문자·공백을 무시한다', () => {
    expect(isCorrectAnswer('  SHI ', 'shi')).toBe(true);
  });

  it('훈령식 표기를 허용한다 (헵번식이 정답일 때)', () => {
    expect(isCorrectAnswer('si', 'shi')).toBe(true);
    expect(isCorrectAnswer('ti', 'chi')).toBe(true);
    expect(isCorrectAnswer('tu', 'tsu')).toBe(true);
    expect(isCorrectAnswer('hu', 'fu')).toBe(true);
    expect(isCorrectAnswer('zi', 'ji')).toBe(true);
  });

  it('づ·ぢ 는 IME 관례와 헵번식을 모두 허용한다', () => {
    expect(isCorrectAnswer('du', 'du')).toBe(true);   // IME
    expect(isCorrectAnswer('zu', 'du')).toBe(true);   // 헵번식
    expect(isCorrectAnswer('dzu', 'du')).toBe(true);
    expect(isCorrectAnswer('di', 'di')).toBe(true);
    expect(isCorrectAnswer('ji', 'di')).toBe(true);   // 헵번식
  });

  it('역방향으로는 허용하지 않는다 (ず에 du, じ에 di 는 오답)', () => {
    expect(isCorrectAnswer('du', 'zu')).toBe(false);
    expect(isCorrectAnswer('di', 'ji')).toBe(false);
  });

  it('を는 o, ん은 nn 을 허용한다', () => {
    expect(isCorrectAnswer('o', 'wo')).toBe(true);
    expect(isCorrectAnswer('nn', 'n')).toBe(true);
  });

  it('틀린 입력은 오답', () => {
    expect(isCorrectAnswer('ka', 'shi')).toBe(false);
    expect(isCorrectAnswer('', 'a')).toBe(false);
  });
});
