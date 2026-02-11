import { useEffect, useRef } from 'react';
import styles from './WordGameScreen.module.css';
import { WordGameConfig, WordQuestionResult, Word, MeaningLanguage } from '../../data/types';
import { useWordGameState } from '../../hooks/useWordGameState';
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

function getMeaning(word: Word, language: MeaningLanguage): string {
  if (language === 'ko' && word.meaningKo) {
    return word.meaningKo;
  }
  return word.meaning;
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

  const lastAnswerRef = useRef<string>('');

  const handleSubmit = (answer: string) => {
    lastAnswerRef.current = answer;
    submitAnswer(answer);
  };

  useEffect(() => {
    if (isFinished) {
      onFinish(results);
    }
  }, [isFinished, results, onFinish]);

  if (!currentQuestion) return null;

  const meaning = getMeaning(currentQuestion.word, config.language);

  const displayText = config.gameMode === 'meaningToWord'
    ? meaning
    : `${currentQuestion.word.expression}`;

  const displayReading = config.gameMode === 'wordToMeaning'
    ? currentQuestion.word.reading
    : undefined;

  const correctAnswer = config.gameMode === 'meaningToWord'
    ? `${currentQuestion.word.expression} (${currentQuestion.word.reading})`
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
            <SpeakButton
              text={currentQuestion.word.expression}
              reading={currentQuestion.word.reading}
              lang="ja"
              size="medium"
            />
          ) : (
            <SpeakButton
              text={meaning}
              lang={config.language === 'ko' ? 'ko' : 'en'}
              size="medium"
            />
          )}
        </div>
        {displayReading && (
          <div className={styles.reading}>{displayReading}</div>
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
