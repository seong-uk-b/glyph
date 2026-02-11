import { useEffect, useRef } from 'react';
import styles from './GameScreen.module.css';
import { SyllableGameConfig, SyllableQuestionResult } from '../../data/types';
import { useSyllableGameState } from '../../hooks/useSyllableGameState';
import ProgressBar from '../game/ProgressBar';
import ScoreDisplay from '../game/ScoreDisplay';
import MultipleChoiceMode from '../game/MultipleChoiceMode';
import FeedbackOverlay from '../game/FeedbackOverlay';
import SpeakButton from '../game/SpeakButton';

interface SyllableGameScreenProps {
  config: SyllableGameConfig;
  onFinish: (results: SyllableQuestionResult[]) => void;
  onQuit: () => void;
}

export default function SyllableGameScreen({ config, onFinish, onQuit }: SyllableGameScreenProps) {
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
  } = useSyllableGameState(config);

  const lastAnswerRef = useRef<string>('');

  const handleSubmit = (answer: string) => {
    lastAnswerRef.current = answer;
    submitAnswer(answer);
  };

  useEffect(() => {
    if (isFinished) onFinish(results);
  }, [isFinished, results, onFinish]);

  if (!currentQuestion) return null;

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

      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            {currentQuestion.syllable}
          </span>
          <SpeakButton text={currentQuestion.syllable} lang="ko" size="small" />
        </div>
      </div>

      <div className={styles.inputArea}>
        <MultipleChoiceMode
          options={currentQuestion.options}
          correctIndex={currentQuestion.correctIndex}
          onSubmit={handleSubmit}
          feedbackState={feedbackState}
          selectedAnswer={lastAnswerRef.current}
        />
      </div>

      <FeedbackOverlay
        state={feedbackState}
        correctAnswer={currentQuestion.romanization}
        onComplete={nextQuestion}
      />
    </div>
  );
}
