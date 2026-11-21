import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { GENETICS_QUESTIONS, OptionKey } from './data/geneticsQuestions';
import { QuizStage, QuestionAttempt } from './components/QuizStage';
import { MasterySidebar, StudyMode } from './components/MasterySidebar';
import { AnswerKeyView } from './components/AnswerKeyView';
import { SectionsOverview } from './components/SectionsOverview';
import { MistakesQueueView } from './components/MistakesQueueView';
import { soundFeedback } from './utils/soundFeedback';

type ActiveTab = 'quiz' | 'mistakes' | 'sections' | 'key';

interface DeckItem {
  key: string;
  questionId: number;
  isRepeat: boolean;
}

const STORAGE_ATTEMPTS_KEY = 'mg1_attempts_v1';
const STORAGE_REPEAT_KEY = 'mg1_repeat_queue_v1';

function loadInitialAttempts(): Record<number, QuestionAttempt> {
  try {
    const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    return raw ? (JSON.parse(raw) as Record<number, QuestionAttempt>) : {};
  } catch {
    return {};
  }
}

function loadInitialRepeatQueue(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_REPEAT_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function buildDeck(
  mode: StudyMode,
  sectionFilter: number | 'all',
  repeatQueue: number[],
  focusQuestionId?: number
): DeckItem[] {
  let pool = GENETICS_QUESTIONS;

  if (mode === 'mistakes') {
    pool = GENETICS_QUESTIONS.filter((q) => repeatQueue.includes(q.id));
    if (sectionFilter !== 'all') {
      pool = pool.filter((q) => q.section === sectionFilter);
    }
    const items = pool.map((q) => ({
      key: `m-${q.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      questionId: q.id,
      isRepeat: true,
    }));
    if (focusQuestionId !== undefined) {
      const idx = items.findIndex((i) => i.questionId === focusQuestionId);
      if (idx > 0) {
        const [picked] = items.splice(idx, 1);
        items.unshift(picked);
      }
    }
    return items;
  }

  if (sectionFilter !== 'all') {
    pool = pool.filter((q) => q.section === sectionFilter);
  }

  return pool.map((q) => ({
    key: `${mode}-${q.id}`,
    questionId: q.id,
    isRepeat: false,
  }));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('quiz');
  const [studyMode, setStudyMode] = useState<StudyMode>('adaptive');
  const [sectionFilter, setSectionFilter] = useState<number | 'all'>('all');

  const [attempts, setAttempts] = useState<Record<number, QuestionAttempt>>(loadInitialAttempts);
  const [repeatQueue, setRepeatQueue] = useState<number[]>(loadInitialRepeatQueue);
  const [streak, setStreak] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [deck, setDeck] = useState<DeckItem[]>(() => buildDeck('adaptive', 'all', []));
  const [deckIndex, setDeckIndex] = useState<number>(0);
  const [stepAttempts, setStepAttempts] = useState<Record<string, QuestionAttempt>>({});
  const [deckFinished, setDeckFinished] = useState<boolean>(false);

  // Sync persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(attempts));
    } catch {
      // Ignore storage quota issues
    }
  }, [attempts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REPEAT_KEY, JSON.stringify(repeatQueue));
    } catch {
      // Ignore storage quota issues
    }
  }, [repeatQueue]);

  useEffect(() => {
    soundFeedback.enabled = soundEnabled;
  }, [soundEnabled]);

  const currentDeckItem = !deckFinished ? deck[deckIndex] : undefined;
  const currentQuestion = useMemo(() => {
    if (!currentDeckItem) return undefined;
    return GENETICS_QUESTIONS.find((q) => q.id === currentDeckItem.questionId);
  }, [currentDeckItem]);

  const rebuildAndNavigate = useCallback(
    (
      nextMode: StudyMode,
      nextSection: number | 'all',
      nextQueue: number[],
      targetQuestionId?: number
    ) => {
      const nextDeck = buildDeck(nextMode, nextSection, nextQueue, targetQuestionId);
      setDeck(nextDeck);
      setDeckFinished(false);
      setStepAttempts({});
      if (targetQuestionId !== undefined) {
        const idx = nextDeck.findIndex((item) => item.questionId === targetQuestionId);
        setDeckIndex(idx >= 0 ? idx : 0);
      } else {
        setDeckIndex(0);
      }
    },
    []
  );

  const handleModeChange = (nextMode: StudyMode) => {
    setStudyMode(nextMode);
    rebuildAndNavigate(nextMode, sectionFilter, repeatQueue);
    setActiveTab('quiz');
  };

  const handleSectionFilterChange = (nextSection: number | 'all') => {
    setSectionFilter(nextSection);
    rebuildAndNavigate(studyMode, nextSection, repeatQueue);
  };

  const handleJumpToQuestion = (questionId: number) => {
    const existingIdx = deck.findIndex(
      (item, idx) => item.questionId === questionId && idx >= deckIndex
    );
    if (existingIdx !== -1) {
      setDeckIndex(existingIdx);
      setDeckFinished(false);
      setActiveTab('quiz');
      return;
    }

    const q = GENETICS_QUESTIONS.find((item) => item.id === questionId);
    if (!q) return;

    const nextSection =
      sectionFilter !== 'all' && q.section !== sectionFilter ? 'all' : sectionFilter;
    const nextMode = studyMode === 'mistakes' ? 'adaptive' : studyMode;
    setSectionFilter(nextSection);
    setStudyMode(nextMode);
    rebuildAndNavigate(nextMode, nextSection, repeatQueue, questionId);
    setActiveTab('quiz');
  };

  const handleSelectOption = useCallback(
    (option: OptionKey) => {
      if (!currentDeckItem || !currentQuestion) return;
      if (stepAttempts[currentDeckItem.key]) return;

      const isCorrect = option === currentQuestion.correctOption;
      const prevGlobal = attempts[currentQuestion.id];

      const updatedAttempt: QuestionAttempt = {
        selectedOption: option,
        isCorrect,
        attemptsCount: (prevGlobal?.attemptsCount ?? 0) + 1,
        wrongCount: (prevGlobal?.wrongCount ?? 0) + (isCorrect ? 0 : 1),
      };

      setStepAttempts((prev) => ({
        ...prev,
        [currentDeckItem.key]: updatedAttempt,
      }));

      setAttempts((prev) => ({
        ...prev,
        [currentQuestion.id]: updatedAttempt,
      }));

      if (isCorrect) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        soundFeedback.playCorrect(nextStreak);

        // If this was a repeat presentation or mistakes drill, graduate it from repeatQueue
        if (currentDeckItem.isRepeat || studyMode === 'mistakes') {
          setRepeatQueue((prev) => prev.filter((id) => id !== currentQuestion.id));
        }
      } else {
        setStreak(0);
        soundFeedback.playWrong();

        setRepeatQueue((prev) =>
          prev.includes(currentQuestion.id) ? prev : [...prev, currentQuestion.id]
        );

        // Schedule automatic repeat card!
        if (studyMode === 'adaptive') {
          const insertPos = Math.min(deckIndex + 3, deck.length);
          const repeatCard: DeckItem = {
            key: `rep-${currentQuestion.id}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            questionId: currentQuestion.id,
            isRepeat: true,
          };
          setDeck((prev) => {
            const copy = [...prev];
            copy.splice(insertPos, 0, repeatCard);
            return copy;
          });
        } else if (studyMode === 'mistakes') {
          const repeatCard: DeckItem = {
            key: `drill-rep-${currentQuestion.id}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            questionId: currentQuestion.id,
            isRepeat: true,
          };
          setDeck((prev) => [...prev, repeatCard]);
        }
      }
    },
    [attempts, currentDeckItem, currentQuestion, deck.length, deckIndex, stepAttempts, streak, studyMode]
  );

  const handleNext = useCallback(() => {
    if (deckIndex + 1 < deck.length) {
      setDeckIndex((i) => i + 1);
    } else {
      setDeckFinished(true);
    }
  }, [deck.length, deckIndex]);

  const handlePrev = useCallback(() => {
    if (deckFinished) {
      setDeckFinished(false);
      setDeckIndex(Math.max(0, deck.length - 1));
    } else if (deckIndex > 0) {
      setDeckIndex((i) => i - 1);
    }
  }, [deck.length, deckFinished, deckIndex]);

  const handleToggleRepeatPin = (questionId: number) => {
    setRepeatQueue((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleStartMistakesDrill = () => {
    setStudyMode('mistakes');
    setSectionFilter('all');
    rebuildAndNavigate('mistakes', 'all', repeatQueue);
    setActiveTab('quiz');
  };

  const handleResetSession = () => {
    setAttempts({});
    setRepeatQueue([]);
    setStreak(0);
    setStudyMode('adaptive');
    setSectionFilter('all');
    rebuildAndNavigate('adaptive', 'all', []);
    setActiveTab('quiz');
  };

  const answeredCount = Object.keys(attempts).length;
  const correctCount = Object.values(attempts).filter((a) => a.isCorrect).length;
  const scorePct = Math.round((correctCount / GENETICS_QUESTIONS.length) * 1000) / 10;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Strictly 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Single-line Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            Medical Genetics 1
          </button>

          {/* Zone 2: 4 Single-line Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`whitespace-nowrap shrink-0 cursor-pointer pb-0.5 transition-colors ${
                activeTab === 'quiz'
                  ? 'text-sky-700 border-b-2 border-sky-700 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Quiz Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mistakes')}
              className={`whitespace-nowrap shrink-0 cursor-pointer pb-0.5 transition-colors ${
                activeTab === 'mistakes'
                  ? 'text-sky-700 border-b-2 border-sky-700 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Mistakes Queue ({repeatQueue.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sections')}
              className={`whitespace-nowrap shrink-0 cursor-pointer pb-0.5 transition-colors ${
                activeTab === 'sections'
                  ? 'text-sky-700 border-b-2 border-sky-700 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Sections
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('key')}
              className={`whitespace-nowrap shrink-0 cursor-pointer pb-0.5 transition-colors ${
                activeTab === 'key'
                  ? 'text-sky-700 border-b-2 border-sky-700 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Answer Key
            </button>
          </nav>

          {/* Zone 3: 1 Primary CTA Button */}
          <div className="shrink-0">
            {repeatQueue.length > 0 ? (
              <button
                type="button"
                onClick={handleStartMistakesDrill}
                className="rounded-lg bg-sky-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Repeat Mistakes ({repeatQueue.length})
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetSession}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                New Session
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav Row */}
        <div className="flex md:hidden items-center gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'quiz' ? 'text-sky-700 font-semibold' : ''}`}
          >
            Quiz Studio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mistakes')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'mistakes' ? 'text-sky-700 font-semibold' : ''}`}
          >
            Mistakes ({repeatQueue.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sections')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'sections' ? 'text-sky-700 font-semibold' : ''}`}
          >
            Sections
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('key')}
            className={`whitespace-nowrap shrink-0 ${activeTab === 'key' ? 'text-sky-700 font-semibold' : ''}`}
          >
            Answer Key
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-[1280px] px-4 sm:px-6 py-6 md:py-8">
        {/* Intro Strip (only on Quiz Studio) */}
        {activeTab === 'quiz' && (
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Source: GENETICS (1).pptx · 40 Comprehensive MCQs · Arabic Explanations
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
                Medical Genetics Interactive Review
              </h1>
            </div>

            <p className="font-arabic text-xs sm:text-sm text-slate-600" dir="rtl">
              شرح تفصيلي لكل إجابة خاطئة · تفاعل فوري · تكرار تلقائي للمسائل غير المتقنة
            </p>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Main Stage (8 cols ~ 66%) */}
            <div className="lg:col-span-8">
              {currentQuestion && currentDeckItem ? (
                <QuizStage
                  question={currentQuestion}
                  currentIndexInDeck={deckIndex}
                  deckLength={deck.length}
                  attempt={stepAttempts[currentDeckItem.key]}
                  isRepeatPresentation={currentDeckItem.isRepeat}
                  isInRepeatQueue={repeatQueue.includes(currentQuestion.id)}
                  streak={streak}
                  repeatDelayHint={studyMode === 'adaptive'}
                  onSelectOption={handleSelectOption}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onToggleRepeatPin={handleToggleRepeatPin}
                  canGoPrev={deckIndex > 0}
                  hasNext={true}
                />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-8 md:p-10 text-center space-y-5">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" aria-hidden="true" />

                  {studyMode === 'mistakes' && repeatQueue.length === 0 ? (
                    <>
                      <h2 className="text-2xl font-bold text-slate-900">
                        All Mistakes Mastered
                      </h2>
                      <p className="font-arabic text-sm text-slate-600 max-w-md mx-auto" dir="rtl">
                        ممتاز! لم تعد هناك أي أسئلة خاطئة في قائمة التكرار. يمكنك الآن مراجعة جميع الأسئلة الـ 40 أو استعراض مفتاح الإجابات.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleModeChange('adaptive')}
                          className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 transition-colors cursor-pointer"
                        >
                          <span>Return to Full Quiz</span>
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Session Complete — {correctCount}/40 ({scorePct.toFixed(1)}%)
                      </h2>
                      <p className="font-arabic text-sm text-slate-700 max-w-lg mx-auto leading-relaxed" dir="rtl">
                        {correctCount >= 34
                          ? 'تقييم ممتاز! مستواك في محاضرة Medical Genetics (1) قوي جداً.'
                          : correctCount >= 28
                            ? 'تقييم جيد — راجع الأسئلة المتبقية في قائمة التكرار للوصول للإتقان الكامل.'
                            : 'تحتاج إلى مزيد من المراجعة — ابدأ تمرين تكرار الأخطاء لتثبيت المفاهيم.'}
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        {repeatQueue.length > 0 && (
                          <button
                            type="button"
                            onClick={handleStartMistakesDrill}
                            className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            <span>Repeat Remaining Mistakes ({repeatQueue.length})</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => rebuildAndNavigate(studyMode, sectionFilter, repeatQueue)}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <span>Restart Current Deck</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Control & Mastery Deck (4 cols ~ 34%) */}
            <div className="lg:col-span-4">
              <MasterySidebar
                studyMode={studyMode}
                onChangeMode={handleModeChange}
                sectionFilter={sectionFilter}
                onChangeSectionFilter={handleSectionFilterChange}
                attempts={attempts}
                repeatQueue={repeatQueue}
                activeQuestionId={currentQuestion?.id ?? null}
                onJumpToQuestion={handleJumpToQuestion}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled((s) => !s)}
              />
            </div>
          </div>
        )}

        {activeTab === 'mistakes' && (
          <MistakesQueueView
            repeatQueue={repeatQueue}
            attempts={attempts}
            onStartMistakesDrill={handleStartMistakesDrill}
            onPracticeSingle={(id) => {
              setStudyMode('mistakes');
              rebuildAndNavigate('mistakes', 'all', repeatQueue, id);
              setActiveTab('quiz');
            }}
            onRemoveFromQueue={(id) =>
              setRepeatQueue((prev) => prev.filter((item) => item !== id))
            }
            onResetAllProgress={handleResetSession}
          />
        )}

        {activeTab === 'sections' && (
          <SectionsOverview
            attempts={attempts}
            repeatQueue={repeatQueue}
            onStartSection={(secId) => {
              setStudyMode('adaptive');
              setSectionFilter(secId);
              rebuildAndNavigate('adaptive', secId, repeatQueue);
              setActiveTab('quiz');
            }}
          />
        )}

        {activeTab === 'key' && (
          <AnswerKeyView
            attempts={attempts}
            repeatQueue={repeatQueue}
            onPracticeQuestion={handleJumpToQuestion}
            onToggleRepeatPin={handleToggleRepeatPin}
          />
        )}
      </main>
    </div>
  );
}
