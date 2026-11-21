import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, RotateCcw, Search, ArrowUpRight } from 'lucide-react';
import { GENETICS_QUESTIONS, SECTIONS } from '../data/geneticsQuestions';
import { QuestionAttempt } from './QuizStage';

interface AnswerKeyViewProps {
  attempts: Record<number, QuestionAttempt>;
  repeatQueue: number[];
  onPracticeQuestion: (questionId: number) => void;
  onToggleRepeatPin: (questionId: number) => void;
}

export const AnswerKeyView: React.FC<AnswerKeyViewProps> = ({
  attempts,
  repeatQueue,
  onPracticeQuestion,
  onToggleRepeatPin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<number | 'all'>('all');
  const [onlyMistakes, setOnlyMistakes] = useState(false);
  const [revealAnswers, setRevealAnswers] = useState(true);

  const filteredQuestions = useMemo(() => {
    return GENETICS_QUESTIONS.filter((q) => {
      if (sectionFilter !== 'all' && q.section !== sectionFilter) return false;
      if (onlyMistakes) {
        const att = attempts[q.id];
        const isWrongOrQueued = (att && !att.isCorrect) || repeatQueue.includes(q.id);
        if (!isWrongOrQueued) return false;
      }
      if (searchQuery.trim()) {
        const term = searchQuery.toLowerCase();
        const matchesQuestion = q.question.toLowerCase().includes(term);
        const matchesExplanation = q.explanationAr.toLowerCase().includes(term);
        const matchesOptions = Object.values(q.options).some((opt) =>
          opt.toLowerCase().includes(term)
        );
        return matchesQuestion || matchesExplanation || matchesOptions;
      }
      return true;
    });
  }, [attempts, onlyMistakes, repeatQueue, searchQuery, sectionFilter]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Complete Answer Key &amp; Arabic Explanations
            </h2>
            <p className="mt-1 font-arabic text-sm text-slate-600" dir="rtl">
              لا تنظر إلى الإجابات إلا بعد أن تنتهي من حل الأسئلة — يمكنك إخفاء الإجابات مؤقتاً لاختبار نفسك.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRevealAnswers((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {revealAnswers ? (
              <>
                <EyeOff className="h-4 w-4 text-slate-600" aria-hidden="true" />
                <span>Hide Answers</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 text-sky-700" aria-hidden="true" />
                <span>Reveal Answers</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions, terms, or Arabic notes..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setSectionFilter('all')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                sectionFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All 40
            </button>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSectionFilter(s.id)}
                className={`rounded-md px-2.5 py-1.5 font-mono-tabular text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  sectionFilter === s.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                S{s.id}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOnlyMistakes((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              onlyMistakes
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Mistakes &amp; Queued Only</span>
          </button>
        </div>
      </div>

      {/* Results List */}
      {filteredQuestions.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            No questions match your current filter.
          </p>
          <p className="mt-1 font-arabic text-xs text-slate-500" dir="rtl">
            جرّب إلغاء التصفية أو مسح نص البحث لعرض جميع الأسئلة.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const att = attempts[q.id];
            const isQueued = repeatQueue.includes(q.id);

            return (
              <article
                key={q.id}
                className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-[260px]">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono-tabular font-semibold text-slate-900">
                        Q{q.id}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Section {q.section}: {q.sectionTitle}</span>
                      {att && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span
                            className={`font-semibold ${
                              att.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {att.isCorrect ? 'Answered Correctly' : `Missed (${att.wrongCount}×)`}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-slate-900">
                      {q.question}
                    </h3>

                    {revealAnswers ? (
                      <div className="mt-2 space-y-2 pt-2 border-t border-slate-100">
                        <p className="text-sm font-medium text-emerald-800">
                          <span className="font-mono-tabular font-bold">
                            {q.correctOption}.
                          </span>{' '}
                          {q.options[q.correctOption]}
                        </p>
                        <p className="font-arabic text-sm text-slate-700 leading-relaxed" dir="rtl">
                          {q.explanationAr}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-slate-400 italic">
                        Answer hidden — click &ldquo;Reveal Answers&rdquo; above or practice this question.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleRepeatPin(q.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isQueued
                          ? 'border-amber-300 bg-amber-50 text-amber-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{isQueued ? 'Queued' : 'Queue Repeat'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onPracticeQuestion(q.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Practice</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
