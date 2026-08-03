import { useEffect, useRef, useState } from 'react';
import styles from './WordGameScreen.module.css';
import { WordGameConfig, WordQuestionResult } from '../../data/types';
import { useWordGameState } from '../../hooks/useWordGameState';
import { getMeaning, getWordLabel } from '../../utils/wordUtils';
import { stopSpeaking } from '../../utils/speech';
import { playWord } from '../../utils/wordAudio';
import { useLanguage } from '../../i18n';
import ProgressBar from '../game/ProgressBar';
import ScoreDisplay from '../game/ScoreDisplay';
import WordMultipleChoice from '../game/WordMultipleChoice';
import FeedbackOverlay from '../game/FeedbackOverlay';
import SpeakButton from '../game/SpeakButton';

interface WordGameScreenProps {
  config: WordGameConfig;
  onFinish: (results: WordQuestionResult[]) => void;
  onQuit: () => void;
}

export default function WordGameScreen({ config, onFinish, onQuit }: WordGameScreenProps) {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    results,
    correctCount,
    accuracy,
    currentStreak,
    feedbackState,
    isFinished,
    submitAnswer,
    nextQuestion,
  } = useWordGameState(config);

  const { t } = useLanguage();
  const lastAnswerRef = useRef<string>('');
  const [showReading, setShowReading] = useState(false);

  useEffect(() => {
    setShowReading(false);
  }, [currentIndex]);

  const handleSubmit = (answer: string) => {
    lastAnswerRef.current = answer;
    submitAnswer(answer);
  };

  useEffect(() => {
    if (isFinished) {
      onFinish(results);
    }
  }, [isFinished, results, onFinish]);

  const isListening = config.gameMode === 'listening';
  // meaningToWord는 발음이 곧 정답이므로 자동 재생 대상에서 제외
  const shouldAutoPlay = isListening || (config.autoPlay && config.gameMode === 'wordToMeaning');

  useEffect(() => {
    if (!shouldAutoPlay || !currentQuestion) return;

    const { expression, reading } = currentQuestion.word;
    let cancelled = false;
    let playing: HTMLAudioElement | null = null;
    let usedTts = false;

    playWord(expression, reading, config.lang).then(audio => {
      usedTts = !audio;
      if (cancelled) {
        audio?.pause();
        if (usedTts) stopSpeaking();
        return;
      }
      playing = audio;
    });

    return () => {
      cancelled = true;
      if (playing) playing.pause();
      if (usedTts) stopSpeaking();
    };
  }, [currentQuestion, shouldAutoPlay, config.lang]);

  if (!currentQuestion) return null;

  const word = currentQuestion.word;
  const meaning = getMeaning(word, config.meaningLanguage);

  const displayText = config.gameMode === 'meaningToWord'
    ? meaning
    : word.expression;

  const displayReading = config.gameMode === 'wordToMeaning'
    ? word.reading
    : undefined;

  const correctAnswer = config.gameMode === 'meaningToWord'
    ? getWordLabel(word)
    : meaning;

  // TTS 언어 결정
  const speakLang = config.lang; // 'ja' | 'ko'
  const meaningLang = config.meaningLanguage === 'ko' ? 'ko'
    : config.meaningLanguage === 'ja' ? 'ja'
    : 'en';

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />
      </div>

      <div className={styles.scoreArea}>
        <ScoreDisplay
          correct={correctCount}
          total={results.length}
          streak={currentStreak}
          accuracy={accuracy}
        />
      </div>

      <div className={styles.questionArea}>
        {isListening ? (
          <div className={styles.questionBlock}>
            <div className={styles.listenPrompt}>{t.listenPrompt}</div>
            <SpeakButton
              text={word.expression}
              reading={word.reading}
              lang={speakLang}
              size="xlarge"
            />
            <div className={styles.replayLabel}>{t.replay}</div>
            {/* 답한 뒤에만 표기를 공개해 문자 형태까지 학습하도록 함 */}
            {feedbackState !== 'idle' && (
              <div className={styles.revealBlock}>
                <div className={styles.question}>{word.expression}</div>
                {word.reading && <div className={styles.reading}>{word.reading}</div>}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.questionBlock}>
            <div className={styles.questionLine}>
              <div className={styles.question}>{displayText}</div>
              <div className={styles.speakWrap}>
                {config.gameMode === 'wordToMeaning' ? (
                  <SpeakButton
                    text={word.expression}
                    reading={word.reading}
                    lang={speakLang}
                    size="medium"
                  />
                ) : (
                  <SpeakButton
                    text={meaning}
                    lang={meaningLang}
                    size="medium"
                  />
                )}
              </div>
            </div>
            {displayReading && (
              showReading ? (
                <div className={styles.reading}>{displayReading}</div>
              ) : (
                <button
                  className={styles.readingToggle}
                  onClick={() => setShowReading(true)}
                >
                  {t.showFurigana}
                </button>
              )
            )}
          </div>
        )}
      </div>

      <div className={styles.inputArea}>
        <WordMultipleChoice
          options={currentQuestion.options}
          correctIndex={currentQuestion.correctIndex}
          onSubmit={handleSubmit}
          feedbackState={feedbackState}
          selectedAnswer={lastAnswerRef.current}
        />
      </div>

      <FeedbackOverlay
        state={feedbackState}
        correctAnswer={correctAnswer}
        onComplete={nextQuestion}
      />
    </div>
  );
}
