import { KanaSet } from './types';

export const HIRAGANA: KanaSet = {
  type: 'hiragana',
  rows: [
    {
      id: 'a', label: 'あ行', labelRomaji: 'a-row',
      characters: [
        { character: 'あ', romaji: 'a', rowId: 'a' },
        { character: 'い', romaji: 'i', rowId: 'a' },
        { character: 'う', romaji: 'u', rowId: 'a' },
        { character: 'え', romaji: 'e', rowId: 'a' },
        { character: 'お', romaji: 'o', rowId: 'a' },
      ],
    },
    {
      id: 'ka', label: 'か行', labelRomaji: 'ka-row',
      characters: [
        { character: 'か', romaji: 'ka', rowId: 'ka' },
        { character: 'き', romaji: 'ki', rowId: 'ka' },
        { character: 'く', romaji: 'ku', rowId: 'ka' },
        { character: 'け', romaji: 'ke', rowId: 'ka' },
        { character: 'こ', romaji: 'ko', rowId: 'ka' },
      ],
    },
    {
      id: 'sa', label: 'さ行', labelRomaji: 'sa-row',
      characters: [
        { character: 'さ', romaji: 'sa', rowId: 'sa' },
        { character: 'し', romaji: 'shi', rowId: 'sa' },
        { character: 'す', romaji: 'su', rowId: 'sa' },
        { character: 'せ', romaji: 'se', rowId: 'sa' },
        { character: 'そ', romaji: 'so', rowId: 'sa' },
      ],
    },
    {
      id: 'ta', label: 'た行', labelRomaji: 'ta-row',
      characters: [
        { character: 'た', romaji: 'ta', rowId: 'ta' },
        { character: 'ち', romaji: 'chi', rowId: 'ta' },
        { character: 'つ', romaji: 'tsu', rowId: 'ta' },
        { character: 'て', romaji: 'te', rowId: 'ta' },
        { character: 'と', romaji: 'to', rowId: 'ta' },
      ],
    },
    {
      id: 'na', label: 'な行', labelRomaji: 'na-row',
      characters: [
        { character: 'な', romaji: 'na', rowId: 'na' },
        { character: 'に', romaji: 'ni', rowId: 'na' },
        { character: 'ぬ', romaji: 'nu', rowId: 'na' },
        { character: 'ね', romaji: 'ne', rowId: 'na' },
        { character: 'の', romaji: 'no', rowId: 'na' },
      ],
    },
    {
      id: 'ha', label: 'は行', labelRomaji: 'ha-row',
      characters: [
        { character: 'は', romaji: 'ha', rowId: 'ha' },
        { character: 'ひ', romaji: 'hi', rowId: 'ha' },
        { character: 'ふ', romaji: 'fu', rowId: 'ha' },
        { character: 'へ', romaji: 'he', rowId: 'ha' },
        { character: 'ほ', romaji: 'ho', rowId: 'ha' },
      ],
    },
    {
      id: 'ma', label: 'ま行', labelRomaji: 'ma-row',
      characters: [
        { character: 'ま', romaji: 'ma', rowId: 'ma' },
        { character: 'み', romaji: 'mi', rowId: 'ma' },
        { character: 'む', romaji: 'mu', rowId: 'ma' },
        { character: 'め', romaji: 'me', rowId: 'ma' },
        { character: 'も', romaji: 'mo', rowId: 'ma' },
      ],
    },
    {
      id: 'ya', label: 'や行', labelRomaji: 'ya-row',
      characters: [
        { character: 'や', romaji: 'ya', rowId: 'ya' },
        { character: 'ゆ', romaji: 'yu', rowId: 'ya' },
        { character: 'よ', romaji: 'yo', rowId: 'ya' },
      ],
    },
    {
      id: 'ra', label: 'ら行', labelRomaji: 'ra-row',
      characters: [
        { character: 'ら', romaji: 'ra', rowId: 'ra' },
        { character: 'り', romaji: 'ri', rowId: 'ra' },
        { character: 'る', romaji: 'ru', rowId: 'ra' },
        { character: 'れ', romaji: 're', rowId: 'ra' },
        { character: 'ろ', romaji: 'ro', rowId: 'ra' },
      ],
    },
    {
      id: 'wa', label: 'わ行', labelRomaji: 'wa-row',
      characters: [
        { character: 'わ', romaji: 'wa', rowId: 'wa' },
        { character: 'を', romaji: 'wo', rowId: 'wa' },
        { character: 'ん', romaji: 'n', rowId: 'wa' },
      ],
    },
    {
      id: 'ga', label: 'が行', labelRomaji: 'ga-row',
      characters: [
        { character: 'が', romaji: 'ga', rowId: 'ga' },
        { character: 'ぎ', romaji: 'gi', rowId: 'ga' },
        { character: 'ぐ', romaji: 'gu', rowId: 'ga' },
        { character: 'げ', romaji: 'ge', rowId: 'ga' },
        { character: 'ご', romaji: 'go', rowId: 'ga' },
      ],
    },
    {
      id: 'za', label: 'ざ行', labelRomaji: 'za-row',
      characters: [
        { character: 'ざ', romaji: 'za', rowId: 'za' },
        { character: 'じ', romaji: 'ji', rowId: 'za' },
        { character: 'ず', romaji: 'zu', rowId: 'za' },
        { character: 'ぜ', romaji: 'ze', rowId: 'za' },
        { character: 'ぞ', romaji: 'zo', rowId: 'za' },
      ],
    },
    {
      id: 'da', label: 'だ行', labelRomaji: 'da-row',
      characters: [
        { character: 'だ', romaji: 'da', rowId: 'da' },
        { character: 'ぢ', romaji: 'di', rowId: 'da' },
        { character: 'づ', romaji: 'du', rowId: 'da' },
        { character: 'で', romaji: 'de', rowId: 'da' },
        { character: 'ど', romaji: 'do', rowId: 'da' },
      ],
    },
    {
      id: 'ba', label: 'ば行', labelRomaji: 'ba-row',
      characters: [
        { character: 'ば', romaji: 'ba', rowId: 'ba' },
        { character: 'び', romaji: 'bi', rowId: 'ba' },
        { character: 'ぶ', romaji: 'bu', rowId: 'ba' },
        { character: 'べ', romaji: 'be', rowId: 'ba' },
        { character: 'ぼ', romaji: 'bo', rowId: 'ba' },
      ],
    },
    {
      id: 'pa', label: 'ぱ行', labelRomaji: 'pa-row',
      characters: [
        { character: 'ぱ', romaji: 'pa', rowId: 'pa' },
        { character: 'ぴ', romaji: 'pi', rowId: 'pa' },
        { character: 'ぷ', romaji: 'pu', rowId: 'pa' },
        { character: 'ぺ', romaji: 'pe', rowId: 'pa' },
        { character: 'ぽ', romaji: 'po', rowId: 'pa' },
      ],
    },
  ],
};
