# DB Schema (Supabase PostgreSQL)

## Enums

```sql
CREATE TYPE word_language AS ENUM ('ja', 'ko');
CREATE TYPE word_level AS ENUM (
  'JLPT_N5','JLPT_N4','JLPT_N3','JLPT_N2','JLPT_N1',
  'TOPIK_1','TOPIK_2','TOPIK_3','TOPIK_4','TOPIK_5','TOPIK_6'
);
```

## Tables

```sql
CREATE TABLE words (
  id          SERIAL PRIMARY KEY,
  expression  TEXT NOT NULL,
  reading     TEXT,
  lang        word_language NOT NULL,
  level       word_level NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT reading_check CHECK (
    (lang = 'ja' AND reading IS NOT NULL) OR
    (lang = 'ko' AND reading IS NULL)
  ),
  CONSTRAINT unique_expression_per_level UNIQUE (expression, lang, level)
);

CREATE TABLE word_meanings (
  id       SERIAL PRIMARY KEY,
  word_id  INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  lang     VARCHAR(5) NOT NULL,
  meaning  TEXT NOT NULL,
  CONSTRAINT unique_meaning_per_lang UNIQUE (word_id, lang)
);
```

## Indexes

```sql
CREATE INDEX idx_words_lang_level ON words(lang, level);
CREATE INDEX idx_word_meanings_word_id ON word_meanings(word_id);
```

## TypeScript Mapping

| DB Column | TypeScript Field |
|-----------|-----------------|
| `words.expression` | `Word.expression` |
| `words.reading` | `Word.reading` |
| `words.lang` | `Word.lang` |
| `words.level` | `Word.level` |
| `word_meanings.*` | `Word.meanings` (aggregated as `{ [lang]: meaning }`) |
