import React, { useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  BookmarkPlus,
  Lightbulb,
  Flame,
} from 'lucide-react';
import { GeneticsQuestion, OptionKey } from '../data/geneticsQuestions';
import { ConceptVisualizer } from './ConceptVisualizer';

export interface QuestionAttempt {
  selectedOption: OptionKey;
  isCorrect: boolean;
  attemptsCount: number;
  wrongCount: number;
}

interface QuizStageProps {
  question: GeneticsQuestion;
  currentIndexInDeck: number;
  deckLength: number;
  attempt: QuestionAttempt | undefined;
  isRepeatPresentation: boolean;
  isInRepeatQueue: boolean;
  streak: number;
  repeatDelayHint: boolean;
  onSelectOption: (option: OptionKey) => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleRepeatPin: (questionId: number) => void;
  canGoPrev: boolean;
  hasNext: boolean;
}

const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D'];

export const QuizStage: React.FC<QuizStageProps> = ({
  question,
  currentIndexInDeck,
  deckLength,
  attempt,
  isRepeatPresentation,
  isInRepeatQueue,
  streak,
  repeatDelayHint,
  onSelectOption,
  onNext,
  onPrev,
  onToggleRepeatPin,
  canGoPrev,
  hasNext,
}) => {
  const isAnswered = Boolean(attempt);
  const isCorrect = attempt?.isCorrect ?? false;
  const selectedOption = attempt?.selectedOption;

  // Keyboard shortcuts: 1-4 or A-D to select option, Enter/ArrowRight for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      if (!isAnswered) {
        if (key === 'A' || key === '1') onSelectOption('A');
        else if (key === 'B' || key === '2') onSelectOption('B');
        else if (key === 'C' || key === '3') onSelectOption('C');
        else if (key === 'D' || key === '4') onSelectOption('D');
      } else if ((e.key === 'Enter' || e.key === 'ArrowRight') && hasNext) {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, hasNext, onNext, onSelectOption]);

  const wrongSpecificExplanation =
    selectedOption && !isCorrect
      ? question.wrongExplanationsAr[selectedOption]
      : undefined;

  return (
    <div className="space-y-6">
      {/* Main Question Card */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        {/* Clean Unboxed Metadata Header (Zero-Pill Rule) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-tabular font-semibold text-slate-800">
              Q{question.id}
            </span>
            <span aria-hidden="true">·</span>
            <span>Section {question.section}: {question.sectionTitle}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              Item {currentIndexInDeck + 1} / {deckLength}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isRepeatPresentation && (
              <span className="inline-flex items-center gap-1.5 font-arabic font-semibold text-amber-700">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                تكرار مسألة سابقة
              </span>
            )}
            {streak >= 2 && (
              <span className="inline-flex items-center gap-1 font-arabic font-semibold text-emerald-700">
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                سلسلة {streak} إجابات صحيحة
              </span>
            )}
          </div>
        </div>

        {/* Question Prompt */}
        <div className="mt-6">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug [text-wrap:balance]">
            {question.question}
          </h2>
          <p className="mt-1.5 font-arabic text-xs text-slate-500" dir="rtl">
            اختر الإجابة الأدق علمياً (أو استخدم المفاتيح A / B / C / D)
          </p>
        </div>

        {/* Options Grid */}
        <div className="mt-6 grid grid-cols-1 gap-3">
          {OPTION_KEYS.map((key, idx) => {
            const isSelected = selectedOption === key;
            const isCorrectChoice = question.correctOption === key;

            let cardStyle =
              'border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50/40 text-slate-800';
            let badgeStyle = 'border-slate-200 bg-slate-50 text-slate-600';

            if (isAnswered) {
              if (isCorrectChoice) {
                cardStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950';
                badgeStyle = 'border-emerald-600 bg-emerald-600 text-white';
              } else if (isSelected && !isCorrect) {
                cardStyle = 'border-rose-500 bg-rose-50/70 text-rose-950';
                badgeStyle = 'border-rose-600 bg-rose-600 text-white';
              } else {
                cardStyle = 'border-slate-200 bg-slate-50/50 text-slate-500 opacity-80';
                badgeStyle = 'border-slate-200 bg-slate-100 text-slate-400';
              }
            }

            return (
              <button
                key={key}
                type="button"
                disabled={isAnswered}
                onClick={() => onSelectOption(key)}
                className={`group flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${cardStyle} ${
                  !isAnswered ? 'cursor-pointer active:scale-[0.995]' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono-tabular text-sm font-semibold transition-colors ${badgeStyle}`}
                  >
                    {key}
                  </span>
                  <span className="text-[15px] md:text-base font-medium leading-snug">
                    {question.options[key]}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isAnswered && (
                    <span className="hidden sm:inline font-mono-tabular text-[11px] text-slate-400 group-hover:text-sky-600">
                      [{idx + 1}]
                    </span>
                  )}
                  {isAnswered && isCorrectChoice && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 font-arabic">
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                      <span>الصحيحة</span>
                    </span>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 font-arabic">
                      <XCircle className="h-5 w-5" aria-hidden="true" />
                      <span>اختيارك</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Feedback & Wrong-Answer Arabic Explanation */}
        {isAnswered && (
          <div className="mt-6 space-y-4 border-t border-slate-100 pt-6" dir="rtl">
            {/* Reaction Banner */}
            <div
              className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${
                isCorrect
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                  : 'border-rose-200 bg-rose-50 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600 mt-0.5" aria-hidden="true" />
                ) : (
                  <XCircle className="h-6 w-6 shrink-0 text-rose-600 mt-0.5" aria-hidden="true" />
                )}
                <div>
                  <p className="font-arabic text-base font-bold">
                    {isCorrect
                      ? getCorrectReactionMessage(streak, isRepeatPresentation)
                      : 'إجابة خاطئة — دعنا نصحح الفكرة ونثبتها!'}
                  </p>
                  <p className="font-arabic text-xs mt-1 text-slate-700">
                    {isCorrect
                      ? isRepeatPresentation
                        ? 'ممتاز! نجحت في تصحيح هذا السؤال عند تكراره.'
                        : 'استمر بنفس التركيز في السؤال التالي.'
                      : repeatDelayHint
                        ? 'تمت إضافة هذا السؤال تلقائياً إلى قائمة التكرار وسيظهر لك مجدداً بعد سؤالين للتأكد من إتقانك له.'
                        : 'تم تسجيل هذا السؤال في قائمة الأخطاء لتتمكن من تكراره ومراجعته.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleRepeatPin(question.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-arabic font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isInRepeatQueue
                    ? 'border-amber-300 bg-amber-100/80 text-amber-900 hover:bg-amber-200/70'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {isInRepeatQueue ? 'موجود في قائمة التكرار' : 'أضف لقائمة التكرار'}
                </span>
              </button>
            </div>

            {/* Specific Wrong Option Explanation (when wrong) */}
            {!isCorrect && wrongSpecificExplanation && (
              <div className="rounded-xl border border-rose-200 bg-white p-4">
                <p className="font-arabic text-xs font-bold text-rose-700 mb-1">
                  لماذا اختيارك ({selectedOption}) غير صحيح؟
                </p>
                <p className="font-arabic text-sm leading-relaxed text-slate-800">
                  {wrongSpecificExplanation}
                </p>
              </div>
            )}

            {/* Core Correct Answer Explanation */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="font-arabic text-xs font-bold text-emerald-800 mb-1">
                توضيح الإجابة الصحيحة ({question.correctOption}):
              </p>
              <p className="font-arabic text-sm leading-relaxed text-slate-900">
                {question.explanationAr}
              </p>
            </div>

            {/* Memory Tip */}
            <div className="flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50/60 p-3.5">
              <Lightbulb className="h-4 w-4 shrink-0 text-sky-700 mt-1" aria-hidden="true" />
              <div>
                <span className="font-arabic text-xs font-bold text-sky-900">
                  قاعدة سريعة للحفظ:{' '}
                </span>
                <span className="font-arabic text-xs md:text-sm text-sky-950">
                  {question.memoryTipAr}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={onPrev}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            disabled={!hasNext}
            onClick={onNext}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer ${
              isAnswered
                ? 'bg-sky-700 text-white hover:bg-sky-800'
                : 'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{isAnswered ? 'Next Question' : 'Skip for Now'}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Interactive Scientific Concept Diagram */}
      <ConceptVisualizer concept={question.visualConcept} revealed={isAnswered} />
    </div>
  );
};

function getCorrectReactionMessage(streak: number, isRepeat: boolean): string {
  if (isRepeat) return 'أحسنت! تم تصحيح الخطأ السابق بنجاح';
  if (streak >= 10) return `إبداع متواصل! ${streak} إجابات صحيحة على التوالي`;
  if (streak >= 5) return `ممتاز جداً! سلسلة ${streak} إجابات صحيحة`;
  if (streak >= 3) return 'رائع! إجابتك دقيقة ومتتالية';
  return 'إجابة صحيحة! أحسنت';
}
