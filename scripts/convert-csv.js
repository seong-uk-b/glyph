const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  const words = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Handle quoted fields with commas
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);

    if (values.length >= 3) {
      const expression = values[0].trim();
      const reading = values[1].trim();
      const meaning = values[2].trim();

      if (expression && reading && meaning) {
        words.push({
          expression,
          reading,
          meaning
        });
      }
    }
  }

  return words;
}

function generateTS(words, level) {
  const wordStrings = words.map(w => {
    const exp = w.expression.replace(/'/g, "\\'");
    const read = w.reading.replace(/'/g, "\\'");
    const mean = w.meaning.replace(/'/g, "\\'");
    return `  { expression: '${exp}', reading: '${read}', meaning: '${mean}' }`;
  });

  return `import { Word } from '../types';

// JLPT ${level} Vocabulary
// Source: https://github.com/jamsinclair/open-anki-jlpt-decks (MIT License)
// Original data from: https://www.tanos.co.uk/jlpt/
// Total: ${words.length} words

export const ${level.toLowerCase()}Words: Word[] = [
${wordStrings.join(',\n')}
];
`;
}

const levels = ['N5', 'N4', 'N3'];

levels.forEach(level => {
  const csvPath = `/tmp/${level.toLowerCase()}.csv`;
  const content = fs.readFileSync(csvPath, 'utf-8');
  const words = parseCSV(content);
  const ts = generateTS(words, level);

  const outPath = path.join(__dirname, '..', 'src', 'data', 'words', `${level.toLowerCase()}.ts`);
  fs.writeFileSync(outPath, ts);
  console.log(`${level}: ${words.length} words -> ${outPath}`);
});
