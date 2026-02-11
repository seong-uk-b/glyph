import { useState, useCallback } from 'react';
import './styles/animations.css';
import { LanguageProvider } from './i18n';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomeScreen from './components/screens/HomeScreen';
import SetupScreen from './components/screens/SetupScreen';
import GameScreen from './components/screens/GameScreen';
import ResultScreen from './components/screens/ResultScreen';
import ChartScreen from './components/screens/ChartScreen';
import HangulChartScreen from './components/screens/HangulChartScreen';
import HangulSetupScreen from './components/screens/HangulSetupScreen';
import HangulGameScreen from './components/screens/HangulGameScreen';
import HangulResultScreen from './components/screens/HangulResultScreen';
import WordSetupScreen from './components/screens/WordSetupScreen';
import WordGameScreen from './components/screens/WordGameScreen';
import WordResultScreen from './components/screens/WordResultScreen';
import KoreanWordSetupScreen from './components/screens/KoreanWordSetupScreen';
import KoreanWordGameScreen from './components/screens/KoreanWordGameScreen';
import KoreanWordResultScreen from './components/screens/KoreanWordResultScreen';
import SyllableSetupScreen from './components/screens/SyllableSetupScreen';
import SyllableGameScreen from './components/screens/SyllableGameScreen';
import SyllableResultScreen from './components/screens/SyllableResultScreen';
import {
  GameConfig, QuestionResult,
  WordGameConfig, WordQuestionResult,
  HangulGameConfig, HangulQuestionResult,
  KoreanWordGameConfig, KoreanWordQuestionResult,
  SyllableGameConfig, SyllableQuestionResult,
} from './data/types';

type Screen =
  | 'home'
  | 'setup' | 'game' | 'result' | 'chart'
  | 'hangulChart' | 'hangulSetup' | 'hangulGame' | 'hangulResult'
  | 'wordSetup' | 'wordGame' | 'wordResult'
  | 'koreanWordSetup' | 'koreanWordGame' | 'koreanWordResult'
  | 'syllableSetup' | 'syllableGame' | 'syllableResult';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [lastResults, setLastResults] = useState<QuestionResult[]>([]);
  const [wordGameConfig, setWordGameConfig] = useState<WordGameConfig | null>(null);
  const [wordLastResults, setWordLastResults] = useState<WordQuestionResult[]>([]);
  const [hangulGameConfig, setHangulGameConfig] = useState<HangulGameConfig | null>(null);
  const [hangulLastResults, setHangulLastResults] = useState<HangulQuestionResult[]>([]);
  const [koreanWordGameConfig, setKoreanWordGameConfig] = useState<KoreanWordGameConfig | null>(null);
  const [koreanWordLastResults, setKoreanWordLastResults] = useState<KoreanWordQuestionResult[]>([]);
  const [syllableGameConfig, setSyllableGameConfig] = useState<SyllableGameConfig | null>(null);
  const [syllableLastResults, setSyllableLastResults] = useState<SyllableQuestionResult[]>([]);

  const goHome = useCallback(() => setCurrentScreen('home'), []);
  const goSetup = useCallback(() => setCurrentScreen('setup'), []);
  const goChart = useCallback(() => setCurrentScreen('chart'), []);
  const goHangulChart = useCallback(() => setCurrentScreen('hangulChart'), []);
  const goHangulSetup = useCallback(() => setCurrentScreen('hangulSetup'), []);
  const goWordSetup = useCallback(() => setCurrentScreen('wordSetup'), []);
  const goKoreanWordSetup = useCallback(() => setCurrentScreen('koreanWordSetup'), []);
  const goSyllableSetup = useCallback(() => setCurrentScreen('syllableSetup'), []);

  // Kana game handlers
  const startGame = useCallback((config: GameConfig) => {
    setGameConfig(config);
    setCurrentScreen('game');
  }, []);

  const finishGame = useCallback((results: QuestionResult[]) => {
    setLastResults(results);
    setCurrentScreen('result');
  }, []);

  const playAgain = useCallback(() => {
    if (gameConfig) setCurrentScreen('game');
  }, [gameConfig]);

  // Word game handlers
  const startWordGame = useCallback((config: WordGameConfig) => {
    setWordGameConfig(config);
    setCurrentScreen('wordGame');
  }, []);

  const finishWordGame = useCallback((results: WordQuestionResult[]) => {
    setWordLastResults(results);
    setCurrentScreen('wordResult');
  }, []);

  const playWordAgain = useCallback(() => {
    if (wordGameConfig) setCurrentScreen('wordGame');
  }, [wordGameConfig]);

  // Hangul game handlers
  const startHangulGame = useCallback((config: HangulGameConfig) => {
    setHangulGameConfig(config);
    setCurrentScreen('hangulGame');
  }, []);

  const finishHangulGame = useCallback((results: HangulQuestionResult[]) => {
    setHangulLastResults(results);
    setCurrentScreen('hangulResult');
  }, []);

  const playHangulAgain = useCallback(() => {
    if (hangulGameConfig) setCurrentScreen('hangulGame');
  }, [hangulGameConfig]);

  // Korean word game handlers
  const startKoreanWordGame = useCallback((config: KoreanWordGameConfig) => {
    setKoreanWordGameConfig(config);
    setCurrentScreen('koreanWordGame');
  }, []);

  const finishKoreanWordGame = useCallback((results: KoreanWordQuestionResult[]) => {
    setKoreanWordLastResults(results);
    setCurrentScreen('koreanWordResult');
  }, []);

  const playKoreanWordAgain = useCallback(() => {
    if (koreanWordGameConfig) setCurrentScreen('koreanWordGame');
  }, [koreanWordGameConfig]);

  // Syllable game handlers
  const startSyllableGame = useCallback((config: SyllableGameConfig) => {
    setSyllableGameConfig(config);
    setCurrentScreen('syllableGame');
  }, []);

  const finishSyllableGame = useCallback((results: SyllableQuestionResult[]) => {
    setSyllableLastResults(results);
    setCurrentScreen('syllableResult');
  }, []);

  const playSyllableAgain = useCallback(() => {
    if (syllableGameConfig) setCurrentScreen('syllableGame');
  }, [syllableGameConfig]);

  const showBack = currentScreen !== 'home';
  const onBack = currentScreen === 'setup' ? goHome
    : currentScreen === 'game' ? goSetup
    : currentScreen === 'result' ? goSetup
    : currentScreen === 'chart' ? goHome
    : currentScreen === 'hangulChart' ? goHome
    : currentScreen === 'hangulSetup' ? goHome
    : currentScreen === 'hangulGame' ? goHangulSetup
    : currentScreen === 'hangulResult' ? goHangulSetup
    : currentScreen === 'wordSetup' ? goHome
    : currentScreen === 'wordGame' ? goWordSetup
    : currentScreen === 'wordResult' ? goWordSetup
    : currentScreen === 'koreanWordSetup' ? goHome
    : currentScreen === 'koreanWordGame' ? goKoreanWordSetup
    : currentScreen === 'koreanWordResult' ? goKoreanWordSetup
    : currentScreen === 'syllableSetup' ? goHome
    : currentScreen === 'syllableGame' ? goSyllableSetup
    : currentScreen === 'syllableResult' ? goSyllableSetup
    : undefined;

  const hideLanguageSwitch = currentScreen === 'game' || currentScreen === 'wordGame'
    || currentScreen === 'hangulGame' || currentScreen === 'koreanWordGame'
    || currentScreen === 'syllableGame';

  return (
    <LanguageProvider>
      <Header showBack={showBack} onBack={onBack} onHome={goHome} showLangSwitch={!hideLanguageSwitch} />
      <main style={{ flex: 1 }}>
        {currentScreen === 'home' && (
          <HomeScreen
            onStart={goSetup}
            onChart={goChart}
            onHangulChart={goHangulChart}
            onHangulStart={goHangulSetup}
            onSyllable={goSyllableSetup}
            onWords={goWordSetup}
            onKoreanWords={goKoreanWordSetup}
          />
        )}
        {currentScreen === 'chart' && <ChartScreen />}
        {currentScreen === 'hangulChart' && <HangulChartScreen />}
        {currentScreen === 'setup' && <SetupScreen onStartGame={startGame} />}
        {currentScreen === 'game' && gameConfig && (
          <GameScreen key={Date.now()} config={gameConfig} onFinish={finishGame} onQuit={goSetup} />
        )}
        {currentScreen === 'result' && (
          <ResultScreen results={lastResults} config={gameConfig} onPlayAgain={playAgain} onChangeSettings={goSetup} onHome={goHome} />
        )}
        {currentScreen === 'hangulSetup' && <HangulSetupScreen onStartGame={startHangulGame} />}
        {currentScreen === 'hangulGame' && hangulGameConfig && (
          <HangulGameScreen key={Date.now()} config={hangulGameConfig} onFinish={finishHangulGame} onQuit={goHangulSetup} />
        )}
        {currentScreen === 'hangulResult' && (
          <HangulResultScreen results={hangulLastResults} onPlayAgain={playHangulAgain} onChangeSettings={goHangulSetup} onHome={goHome} />
        )}
        {currentScreen === 'wordSetup' && <WordSetupScreen onStartGame={startWordGame} />}
        {currentScreen === 'wordGame' && wordGameConfig && (
          <WordGameScreen key={Date.now()} config={wordGameConfig} onFinish={finishWordGame} onQuit={goWordSetup} />
        )}
        {currentScreen === 'wordResult' && (
          <WordResultScreen results={wordLastResults} config={wordGameConfig} onPlayAgain={playWordAgain} onChangeSettings={goWordSetup} onHome={goHome} />
        )}
        {currentScreen === 'koreanWordSetup' && <KoreanWordSetupScreen onStartGame={startKoreanWordGame} />}
        {currentScreen === 'koreanWordGame' && koreanWordGameConfig && (
          <KoreanWordGameScreen key={Date.now()} config={koreanWordGameConfig} onFinish={finishKoreanWordGame} onQuit={goKoreanWordSetup} />
        )}
        {currentScreen === 'koreanWordResult' && (
          <KoreanWordResultScreen results={koreanWordLastResults} config={koreanWordGameConfig} onPlayAgain={playKoreanWordAgain} onChangeSettings={goKoreanWordSetup} onHome={goHome} />
        )}
        {currentScreen === 'syllableSetup' && <SyllableSetupScreen onStartGame={startSyllableGame} />}
        {currentScreen === 'syllableGame' && syllableGameConfig && (
          <SyllableGameScreen key={Date.now()} config={syllableGameConfig} onFinish={finishSyllableGame} onQuit={goSyllableSetup} />
        )}
        {currentScreen === 'syllableResult' && (
          <SyllableResultScreen results={syllableLastResults} onPlayAgain={playSyllableAgain} onChangeSettings={goSyllableSetup} onHome={goHome} />
        )}
      </main>
      <Footer />
    </LanguageProvider>
  );
}

export default App;
