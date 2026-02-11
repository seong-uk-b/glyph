import { KanaSet } from './types';

export const KATAKANA: KanaSet = {
  type: 'katakana',
  rows: [
    {
      id: 'a', label: 'ア行', labelRomaji: 'a-row',
      characters: [
        { character: 'ア', romaji: 'a', rowId: 'a' },
        { character: 'イ', romaji: 'i', rowId: 'a' },
        { character: 'ウ', romaji: 'u', rowId: 'a' },
        { character: 'エ', romaji: 'e', rowId: 'a' },
        { character: 'オ', romaji: 'o', rowId: 'a' },
      ],
    },
    {
      id: 'ka', label: 'カ行', labelRomaji: 'ka-row',
      characters: [
        { character: 'カ', romaji: 'ka', rowId: 'ka' },
        { character: 'キ', romaji: 'ki', rowId: 'ka' },
        { character: 'ク', romaji: 'ku', rowId: 'ka' },
        { character: 'ケ', romaji: 'ke', rowId: 'ka' },
        { character: 'コ', romaji: 'ko', rowId: 'ka' },
      ],
    },
    {
      id: 'sa', label: 'サ行', labelRomaji: 'sa-row',
      characters: [
        { character: 'サ', romaji: 'sa', rowId: 'sa' },
        { character: 'シ', romaji: 'shi', rowId: 'sa' },
        { character: 'ス', romaji: 'su', rowId: 'sa' },
        { character: 'セ', romaji: 'se', rowId: 'sa' },
        { character: 'ソ', romaji: 'so', rowId: 'sa' },
      ],
    },
    {
      id: 'ta', label: 'タ行', labelRomaji: 'ta-row',
      characters: [
        { character: 'タ', romaji: 'ta', rowId: 'ta' },
        { character: 'チ', romaji: 'chi', rowId: 'ta' },
        { character: 'ツ', romaji: 'tsu', rowId: 'ta' },
        { character: 'テ', romaji: 'te', rowId: 'ta' },
        { character: 'ト', romaji: 'to', rowId: 'ta' },
      ],
    },
    {
      id: 'na', label: 'ナ行', labelRomaji: 'na-row',
      characters: [
        { character: 'ナ', romaji: 'na', rowId: 'na' },
        { character: 'ニ', romaji: 'ni', rowId: 'na' },
        { character: 'ヌ', romaji: 'nu', rowId: 'na' },
        { character: 'ネ', romaji: 'ne', rowId: 'na' },
        { character: 'ノ', romaji: 'no', rowId: 'na' },
      ],
    },
    {
      id: 'ha', label: 'ハ行', labelRomaji: 'ha-row',
      characters: [
        { character: 'ハ', romaji: 'ha', rowId: 'ha' },
        { character: 'ヒ', romaji: 'hi', rowId: 'ha' },
        { character: 'フ', romaji: 'fu', rowId: 'ha' },
        { character: 'ヘ', romaji: 'he', rowId: 'ha' },
        { character: 'ホ', romaji: 'ho', rowId: 'ha' },
      ],
    },
    {
      id: 'ma', label: 'マ行', labelRomaji: 'ma-row',
      characters: [
        { character: 'マ', romaji: 'ma', rowId: 'ma' },
        { character: 'ミ', romaji: 'mi', rowId: 'ma' },
        { character: 'ム', romaji: 'mu', rowId: 'ma' },
        { character: 'メ', romaji: 'me', rowId: 'ma' },
        { character: 'モ', romaji: 'mo', rowId: 'ma' },
      ],
    },
    {
      id: 'ya', label: 'ヤ行', labelRomaji: 'ya-row',
      characters: [
        { character: 'ヤ', romaji: 'ya', rowId: 'ya' },
        { character: 'ユ', romaji: 'yu', rowId: 'ya' },
        { character: 'ヨ', romaji: 'yo', rowId: 'ya' },
      ],
    },
    {
      id: 'ra', label: 'ラ行', labelRomaji: 'ra-row',
      characters: [
        { character: 'ラ', romaji: 'ra', rowId: 'ra' },
        { character: 'リ', romaji: 'ri', rowId: 'ra' },
        { character: 'ル', romaji: 'ru', rowId: 'ra' },
        { character: 'レ', romaji: 're', rowId: 'ra' },
        { character: 'ロ', romaji: 'ro', rowId: 'ra' },
      ],
    },
    {
      id: 'wa', label: 'ワ行', labelRomaji: 'wa-row',
      characters: [
        { character: 'ワ', romaji: 'wa', rowId: 'wa' },
        { character: 'ヲ', romaji: 'wo', rowId: 'wa' },
        { character: 'ン', romaji: 'n', rowId: 'wa' },
      ],
    },
    {
      id: 'ga', label: 'ガ行', labelRomaji: 'ga-row',
      characters: [
        { character: 'ガ', romaji: 'ga', rowId: 'ga' },
        { character: 'ギ', romaji: 'gi', rowId: 'ga' },
        { character: 'グ', romaji: 'gu', rowId: 'ga' },
        { character: 'ゲ', romaji: 'ge', rowId: 'ga' },
        { character: 'ゴ', romaji: 'go', rowId: 'ga' },
      ],
    },
    {
      id: 'za', label: 'ザ行', labelRomaji: 'za-row',
      characters: [
        { character: 'ザ', romaji: 'za', rowId: 'za' },
        { character: 'ジ', romaji: 'ji', rowId: 'za' },
        { character: 'ズ', romaji: 'zu', rowId: 'za' },
        { character: 'ゼ', romaji: 'ze', rowId: 'za' },
        { character: 'ゾ', romaji: 'zo', rowId: 'za' },
      ],
    },
    {
      id: 'da', label: 'ダ行', labelRomaji: 'da-row',
      characters: [
        { character: 'ダ', romaji: 'da', rowId: 'da' },
        { character: 'ヂ', romaji: 'di', rowId: 'da' },
        { character: 'ヅ', romaji: 'du', rowId: 'da' },
        { character: 'デ', romaji: 'de', rowId: 'da' },
        { character: 'ド', romaji: 'do', rowId: 'da' },
      ],
    },
    {
      id: 'ba', label: 'バ行', labelRomaji: 'ba-row',
      characters: [
        { character: 'バ', romaji: 'ba', rowId: 'ba' },
        { character: 'ビ', romaji: 'bi', rowId: 'ba' },
        { character: 'ブ', romaji: 'bu', rowId: 'ba' },
        { character: 'ベ', romaji: 'be', rowId: 'ba' },
        { character: 'ボ', romaji: 'bo', rowId: 'ba' },
      ],
    },
    {
      id: 'pa', label: 'パ行', labelRomaji: 'pa-row',
      characters: [
        { character: 'パ', romaji: 'pa', rowId: 'pa' },
        { character: 'ピ', romaji: 'pi', rowId: 'pa' },
        { character: 'プ', romaji: 'pu', rowId: 'pa' },
        { character: 'ペ', romaji: 'pe', rowId: 'pa' },
        { character: 'ポ', romaji: 'po', rowId: 'pa' },
      ],
    },
  ],
};
