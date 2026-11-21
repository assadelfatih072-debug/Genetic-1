import React from 'react';
import { Volume2, VolumeX, RotateCcw, Check, X } from 'lucide-react';
import { GENETICS_QUESTIONS, SECTIONS } from '../data/geneticsQuestions';
import { QuestionAttempt } from './QuizStage';

export type StudyMode = 'adaptive' | 'mistakes' | 'standard';

interface MasterySidebarProps {
  studyMode: StudyMode;
  onChangeMode: (mode: StudyMode) => void;
  sectionFilter: number | 'all';
  onChangeSectionFilter: (section: number | 'all') => void;
  attempts: Record<number, QuestionAttempt>;
  repeatQueue: number[];
  activeQuestionId: number | null;
  onJumpToQuestion: (questionId: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MasterySidebar: React.FC<MasterySidebarProps> = ({
  studyMode,
  onChangeMode,
  sectionFilter,
  onChangeSectionFilter,
  attempts,
  repeatQueue,
  activeQuestionId,
  onJumpToQuestion,
  soundEnabled,
  onToggleSound,
}) => {
  const totalQuestions = GENETICS_QUESTIONS.length;
  const answeredIds = Object.keys(attempts).map(Number);
  const correctCount = answeredIds.filter((id) => attempts[id]?.isCorrect).length;
  const wrongCount = answeredIds.filter((id) => attempts[id] && !attempts[id].isCorrect).length;
  const accuracyPct =
    answeredIds.length > 0 ? Math.round((correctCount / totalQuestions) * 1000) / 10 : 0;

  const evaluation = getEvaluationLabel(correctCount, answeredIds.length);

  return (
    <aside className="space-y-5">
      {/* Study Mode & Audio Control */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Study Mode</h3>
          <button
            type="button"
            onClick={onToggleSound}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            aria-label={soundEnabled ? 'Mute feedback sounds' : 'Enable feedback sounds'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-sky-700" aria-hidden="true" />
                <span>Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                <span>Muted</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => onChangeMode('adaptive')}
            className={`rounded-md px-2 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              studyMode === 'adaptive'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Adaptive
          </button>
          <button
            type="button"
            onClick={() => onChangeMode('mistakes')}
            className={`rounded-md px-2 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              studyMode === 'mistakes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Repeat ({repeatQueue.length})
          </button>
          <button
            type="button"
            onClick={() => onChangeMode('standard')}
            className={`rounded-md px-2 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              studyMode === 'standard'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All 40
          </button>
        </div>

        <p className="mt-2.5 font-arabic text-xs text-slate-600 leading-relaxed" dir="rtl">
          {studyMode === 'adaptive' &&
            'الوضع التكيّفي: يعيد إدراج الأسئلة الخاطئة تلقائياً بعد سؤالين لتثبيتها.'}
          {studyMode === 'mistakes' &&
            'وضع تكرار الأخطاء: يركّز حصراً على الأسئلة التي أخطأت فيها حتى تتقنها.'}
          {studyMode === 'standard' &&
            'الوضع القياسي: مراجعة متسلسلة للأسئلة الـ 40 حسب ترتيب المحاضرة.'}
        </p>

        {/* Section Filter */}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Filter Section</span>
            <span className="font-arabic text-xs text-slate-500">تصفية الأقسام</span>
          </div>
          <div className="grid grid-cols-5 gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => onChangeSectionFilter('all')}
              className={`rounded-md py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                sectionFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => onChangeSectionFilter(sec.id)}
                className={`rounded-md py-1.5 font-mono-tabular text-xs font-medium transition-colors cursor-pointer ${
                  sectionFilter === sec.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={sec.title}
              >
                S{sec.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Score & Mastery Evaluation */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">Mastery Evaluation</h3>
          <span className="font-mono-tabular text-xs text-slate-500">
            {answeredIds.length}/40 answered
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-mono-tabular text-3xl font-bold text-slate-900">
            {correctCount}/40
          </span>
          <span className="font-mono-tabular text-sm font-semibold text-sky-700">
            {accuracyPct.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-sky-600 transition-all duration-300"
            style={{ width: `${(correctCount / totalQuestions) * 100}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
          <span>Correct: <strong className="font-mono-tabular text-emerald-700">{correctCount}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Wrong: <strong className="font-mono-tabular text-rose-700">{wrongCount}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Repeat Queue: <strong className="font-mono-tabular text-amber-700">{repeatQueue.length}</strong></span>
        </div>

        <div className="mt-3 border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-700">{evaluation.en}</span>
          <span className="font-arabic text-xs font-semibold text-slate-800" dir="rtl">
            {evaluation.ar}
          </span>
        </div>
      </div>

      {/* 40-Question Map */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Question Map</h3>
          <span className="font-arabic text-xs text-slate-500">خريطة الأسئلة</span>
        </div>

        <div className="grid grid-cols-8 gap-1.5">
          {GENETICS_QUESTIONS.map((q) => {
            const att = attempts[q.id];
            const isActive = activeQuestionId === q.id;
            const inRepeat = repeatQueue.includes(q.id);

            let cellClass =
              'border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-400 hover:text-sky-800';

            if (att?.isCorrect && !inRepeat) {
              cellClass = 'border-emerald-300 bg-emerald-50 text-emerald-800';
            } else if (att && !att.isCorrect) {
              cellClass = 'border-rose-300 bg-rose-50 text-rose-800';
            } else if (inRepeat) {
              cellClass = 'border-amber-300 bg-amber-50 text-amber-900';
            }

            if (isActive) {
              cellClass += ' ring-2 ring-sky-600 ring-offset-1';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onJumpToQuestion(q.id)}
                className={`relative flex h-8 items-center justify-center rounded-md border font-mono-tabular text-xs font-semibold transition-all cursor-pointer ${cellClass}`}
                title={`Q${q.id}: ${q.sectionTitle}${inRepeat ? ' (In Repeat Queue)' : ''}`}
              >
                <span>{q.id}</span>
                {inRepeat && (
                  <RotateCcw
                    className="absolute -top-1 -right-1 h-2.5 w-2.5 text-amber-700 bg-white rounded-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Check className="h-3 w-3 text-emerald-700" aria-hidden="true" />
            Correct
          </span>
          <span className="inline-flex items-center gap-1">
            <X className="h-3 w-3 text-rose-700" aria-hidden="true" />
            Wrong
          </span>
          <span className="inline-flex items-center gap-1">
            <RotateCcw className="h-3 w-3 text-amber-700" aria-hidden="true" />
            Queued Repeat
          </span>
        </div>
      </div>
    </aside>
  );
};

function getEvaluationLabel(correctCount: number, answeredCount: number): { en: string; ar: string } {
  if (answeredCount === 0) {
    return { en: 'Not Started Yet', ar: 'لم تبدأ الإجابة بعد' };
  }
  const pct = (correctCount / 40) * 100;
  if (pct >= 85) return { en: 'Excellent — Lecture Mastered', ar: 'ممتاز — إتقان شامل للمحاضرة' };
  if (pct >= 70) return { en: 'Good – Needs Review', ar: 'جيد — يحتاج مراجعة الأخطاء' };
  if (pct >= 50) return { en: 'Fair – Repeat Mistakes', ar: 'مقبول — كرر الأسئلة الخاطئة' };
  return { en: 'In Progress — Keep Practicing', ar: 'قيد التقدم — واصل التدريب' };
}
