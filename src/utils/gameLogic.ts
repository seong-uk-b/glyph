import { KanaCharacter } from '../data/types';

const ROMAJI_ALTERNATIVES: Record<string, string[]> = {
  'shi': ['si'],
  'chi': ['ti'],
  'tsu': ['tu'],
  'fu': ['hu'],
  'ji': ['zi'],
  'di': ['dzi'],
  'du': ['dzu'],
  'wo': ['o'],
  'n': ['nn'],
};

export function isCorrectAnswer(userInput: string, correctRomaji: string): boolean {
  const normalized = userInput.toLowerCase().trim();
  if (normalized === correctRomaji) return true;
  const alts = ROMAJI_ALTERNATIVES[correctRomaji];
  return alts ? alts.includes(normalized) : false;
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getVowel(romaji: string): string {
  return romaji[romaji.length - 1];
}

function getConsonant(romaji: string): string {
  if (romaji.length === 1) return '';
  return romaji.slice(0, -1);
}

export function generateOptions(
  correctChar: KanaCharacter,
  allCharacters: KanaCharacter[],
  numOptions: number = 4
): string[] {
  const correctRomaji = correctChar.romaji;

  const confusable = allCharacters.filter(c => {
    if (c.romaji === correctRomaji) return false;
    return getVowel(c.romaji) === getVowel(correctRomaji) ||
           getConsonant(c.romaji) === getConsonant(correctRomaji);
  });

  const others = allCharacters.filter(c =>
    c.romaji !== correctRomaji && !confusable.some(cf => cf.romaji === c.romaji)
  );

  const wrongPool = shuffle(confusable);
  const remaining = shuffle(others);
  const wrongAnswers: string[] = [];
  const usedRomaji = new Set([correctRomaji]);

  for (const candidate of [...wrongPool, ...remaining]) {
    if (wrongAnswers.length >= numOptions - 1) break;
    if (!usedRomaji.has(candidate.romaji)) {
      wrongAnswers.push(candidate.romaji);
      usedRomaji.add(candidate.romaji);
    }
  }

  const options = [...wrongAnswers];
  const insertIndex = Math.floor(Math.random() * numOptions);
  options.splice(insertIndex, 0, correctRomaji);

  return options;
}
