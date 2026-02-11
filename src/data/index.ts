import { HIRAGANA } from './hiragana';
import { KATAKANA } from './katakana';
import { CharacterType, KanaRow, KanaCharacter } from './types';

export { HIRAGANA } from './hiragana';
export { KATAKANA } from './katakana';
export * from './types';

function tagCharacters(chars: KanaCharacter[], type: 'hiragana' | 'katakana'): KanaCharacter[] {
  return chars.map(c => ({ ...c, type }));
}

export function getCharactersByRows(
  type: CharacterType,
  rowIds: string[]
): KanaCharacter[] {
  if (type === 'both') {
    const hiraChars = HIRAGANA.rows
      .filter(row => rowIds.includes(row.id))
      .flatMap(row => tagCharacters(row.characters, 'hiragana'));
    const kataChars = KATAKANA.rows
      .filter(row => rowIds.includes(row.id))
      .flatMap(row => tagCharacters(row.characters, 'katakana'));
    return [...hiraChars, ...kataChars];
  }

  const set = type === 'hiragana' ? HIRAGANA : KATAKANA;
  return set.rows
    .filter(row => rowIds.includes(row.id))
    .flatMap(row => tagCharacters(row.characters, type));
}

export function getRows(type: CharacterType): KanaRow[] {
  if (type === 'both') return HIRAGANA.rows;
  return type === 'hiragana' ? HIRAGANA.rows : KATAKANA.rows;
}
