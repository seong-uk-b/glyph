import { useEffect, useRef } from 'react';
import styles from './GameScreen.module.css';
import { GameConfig, QuestionResult } from '../../data/types';
import { useGameState } from '../../hooks/useGameState';
import CharacterDisplay from '../game/CharacterDisplay';
import ProgressBar from '../game/ProgressBar';
import ScoreDisplay from '../game/ScoreDisplay';
import TypingMode from '../game/TypingMode';
import MultipleChoiceMode from '../game/MultipleChoiceMode';
import FeedbackOverlay from '../game/FeedbackOverlay';

interface GameScreenProps {
  config: GameConfig;
  onFinish: (results: QuestionResult[]) => void;
  onQuit: () => void;
}

export default function GameScreen({ config, onFinish, onQuit }: GameScreenProps) {
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
  } = useGameState(config);

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

      <CharacterDisplay
        character={currentQuestion.character.character}
        type={config.characterType}
        charType={currentQuestion.character.type}
      />

      <div className={styles.inputArea}>
        {config.gameMode === 'typing' ? (
          <TypingMode
            onSubmit={handleSubmit}
            feedbackState={feedbackState}
          />
        ) : (
          <MultipleChoiceMode
            options={currentQuestion.options || []}
            correctIndex={currentQuestion.correctIndex || 0}
            onSubmit={handleSubmit}
            feedbackState={feedbackState}
            selectedAnswer={lastAnswerRef.current}
          />
        )}
      </div>

      <FeedbackOverlay
        state={feedbackState}
        correctAnswer={currentQuestion.character.romaji}
        onComplete={nextQuestion}
      />
    </div>
  );
}
