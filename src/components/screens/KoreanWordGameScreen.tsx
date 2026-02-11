import { useEffect, useRef } from 'react';
import styles from './WordGameScreen.module.css';
import { KoreanWordGameConfig, KoreanWordQuestionResult, KoreanWord } from '../../data/types';
import { useKoreanWordGameState } from '../../hooks/useKoreanWordGameState';
import ProgressBar from '../game/ProgressBar';
import ScoreDisplay from '../game/ScoreDisplay';
import WordMultipleChoice from '../game/WordMultipleChoice';
import FeedbackOverlay from '../game/FeedbackOverlay';
import SpeakButton from '../game/SpeakButton';

interface KoreanWordGameScreenProps {
  config: KoreanWordGameConfig;
  onFinish: (results: KoreanWordQuestionResult[]) => void;
  onQuit: () => void;
}

function getMeaning(word: KoreanWord, language: 'en' | 'ja'): string {
  if (language === 'ja' && word.meaningJa) return word.meaningJa;
  return word.meaning;
}

export default function KoreanWordGameScreen({ config, onFinish, onQuit }: KoreanWordGameScreenProps) {
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
  } = useKoreanWordGameState(config);

  const lastAnswerRef = useRef<string>('');

  const handleSubmit = (answer: string) => {
    lastAnswerRef.current = answer;
    submitAnswer(answer);
  };

  useEffect(() => {
    if (isFinished) onFinish(results);
  }, [isFinished, results, onFinish]);

  if (!currentQuestion) return null;

  const meaning = getMeaning(currentQuestion.word, config.language);

  const displayText = config.gameMode === 'meaningToWord'
    ? meaning
    : currentQuestion.word.expression;

  const correctAnswer = config.gameMode === 'meaningToWord'
    ? currentQuestion.word.expression
    : meaning;

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
        <div className={styles.questionRow}>
          <div className={styles.question}>{displayText}</div>
          {config.gameMode === 'wordToMeaning' ? (
            <SpeakButton text={currentQuestion.word.expression} lang="ko" size="medium" />
          ) : (
            <SpeakButton
              text={meaning}
              lang={config.language === 'ja' ? 'ja' : 'en'}
              size="medium"
            />
          )}
        </div>
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
