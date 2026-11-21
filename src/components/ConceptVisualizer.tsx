import React from 'react';
import { VisualConcept } from '../data/geneticsQuestions';

interface ConceptVisualizerProps {
  concept: VisualConcept;
  revealed: boolean;
}

export const ConceptVisualizer: React.FC<ConceptVisualizerProps> = ({ concept, revealed }) => {
  if (!revealed) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center" dir="rtl">
        <p className="font-arabic text-xs text-slate-500">
          سيظهر الرسم التوضيحي التفاعلي للمفهوم العلمي فور اختيار إجابتك للمساعدة في تثبيت المعلومة.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-slate-500">
          Conceptual Diagram · {conceptLabel(concept)}
        </span>
        <span className="font-arabic text-xs text-sky-700 font-medium">
          مخطط تثبيت المفهوم
        </span>
      </div>

      <div className="overflow-x-auto">
        {concept === 'nucleotide' && (
          <svg viewBox="0 0 560 150" className="w-full max-w-xl mx-auto h-auto" aria-label="Nucleotide and Nucleoside diagram">
            {/* Phosphate */}
            <circle cx="85" cy="75" r="28" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
            <text x="85" y="72" textAnchor="middle" className="fill-amber-900 text-[12px] font-semibold">Phosphate</text>
            <text x="85" y="88" textAnchor="middle" className="fill-amber-700 text-[10px] font-mono">PO₄³⁻ (5&apos;)</text>

            {/* Bond to Sugar */}
            <line x1="113" y1="75" x2="178" y2="75" stroke="#64748B" strokeWidth="2" />
            <text x="145" y="65" textAnchor="middle" className="fill-slate-500 text-[9px]">Ester</text>

            {/* Pentose Sugar */}
            <polygon points="220,38 265,68 248,118 192,118 175,68" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
            <text x="220" y="77" textAnchor="middle" className="fill-sky-900 text-[12px] font-semibold">Pentose</text>
            <text x="220" y="93" textAnchor="middle" className="fill-sky-700 text-[10px]">Sugar</text>
            <text x="180" y="54" className="fill-slate-500 text-[9px] font-mono">C5&apos;</text>
            <text x="268" y="62" className="fill-slate-500 text-[9px] font-mono">C1&apos;</text>

            {/* Glycosidic bond */}
            <line x1="265" y1="75" x2="345" y2="75" stroke="#059669" strokeWidth="2.5" />
            <text x="305" y="64" textAnchor="middle" className="fill-emerald-700 text-[10px] font-semibold">Glycosidic</text>
            <text x="305" y="90" textAnchor="middle" className="fill-emerald-700 text-[9px]">bond</text>

            {/* Nitrogenous Base */}
            <rect x="345" y="45" width="135" height="60" rx="8" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
            <text x="412" y="72" textAnchor="middle" className="fill-emerald-900 text-[12px] font-semibold">Nitrogenous Base</text>
            <text x="412" y="88" textAnchor="middle" className="fill-emerald-700 text-[10px]">A, G, C, T / U</text>

            {/* Nucleoside bracket */}
            <path d="M 175 128 L 175 136 L 480 136 L 480 128" fill="none" stroke="#0284C7" strokeWidth="1.5" />
            <text x="327" y="148" textAnchor="middle" className="fill-sky-700 text-[10px] font-semibold">Nucleoside = Sugar + Base</text>

            {/* Nucleotide bracket */}
            <path d="M 55 24 L 55 16 L 480 16 L 480 24" fill="none" stroke="#0F172A" strokeWidth="1.5" />
            <text x="267" y="12" textAnchor="middle" className="fill-slate-900 text-[10px] font-semibold">Nucleotide = Phosphate + Sugar + Base</text>
          </svg>
        )}

        {concept === 'base-pairing' && (
          <svg viewBox="0 0 560 150" className="w-full max-w-xl mx-auto h-auto" aria-label="Purines and Pyrimidines pairing">
            {/* Purines box */}
            <rect x="20" y="16" width="235" height="118" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="137" y="36" textAnchor="middle" className="fill-slate-800 text-[12px] font-semibold">Purines (2 Rings)</text>
            <rect x="40" y="50" width="85" height="34" rx="6" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
            <text x="82" y="71" textAnchor="middle" className="fill-sky-900 text-[12px] font-semibold">Adenine (A)</text>
            <rect x="145" y="50" width="85" height="34" rx="6" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
            <text x="187" y="71" textAnchor="middle" className="fill-sky-900 text-[12px] font-semibold">Guanine (G)</text>
            <text x="137" y="110" textAnchor="middle" className="fill-slate-600 text-[10px]">DNA &amp; RNA both use A and G</text>

            {/* Pairing arrows */}
            <line x1="258" y1="62" x2="302" y2="62" stroke="#059669" strokeWidth="2" />
            <text x="280" y="56" textAnchor="middle" className="fill-emerald-700 text-[10px] font-mono">A=T</text>
            <line x1="258" y1="95" x2="302" y2="95" stroke="#0284C7" strokeWidth="2" />
            <text x="280" y="89" textAnchor="middle" className="fill-sky-700 text-[10px] font-mono">G≡C</text>

            {/* Pyrimidines box */}
            <rect x="305" y="16" width="235" height="118" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="422" y="36" textAnchor="middle" className="fill-slate-800 text-[12px] font-semibold">Pyrimidines (1 Ring)</text>
            <rect x="318" y="50" width="66" height="34" rx="6" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" />
            <text x="351" y="71" textAnchor="middle" className="fill-emerald-900 text-[11px] font-semibold">C (Both)</text>
            <rect x="392" y="50" width="66" height="34" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <text x="425" y="71" textAnchor="middle" className="fill-amber-900 text-[11px] font-semibold">T (DNA)</text>
            <rect x="466" y="50" width="64" height="34" rx="6" fill="#FFE4E6" stroke="#E11D48" strokeWidth="1.5" />
            <text x="498" y="71" textAnchor="middle" className="fill-rose-900 text-[11px] font-semibold">U (RNA)</text>
            <text x="422" y="110" textAnchor="middle" className="fill-slate-600 text-[10px]">Uracil replaces Thymine in RNA</text>
          </svg>
        )}

        {concept === 'rna-types' && (
          <svg viewBox="0 0 560 140" className="w-full max-w-xl mx-auto h-auto" aria-label="RNA Types distribution and roles">
            <rect x="20" y="18" width="165" height="104" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
            <text x="102" y="42" textAnchor="middle" className="fill-sky-900 text-[13px] font-bold">rRNA (85–90%)</text>
            <text x="102" y="64" textAnchor="middle" className="fill-sky-800 text-[11px]">Ribosomal RNA</text>
            <text x="102" y="84" textAnchor="middle" className="fill-slate-600 text-[10px]">Forms ribosome core</text>
            <text x="102" y="102" textAnchor="middle" className="fill-slate-600 text-[10px]">Most abundant RNA</text>

            <rect x="198" y="18" width="165" height="104" rx="8" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" />
            <text x="280" y="42" textAnchor="middle" className="fill-emerald-900 text-[13px] font-bold">mRNA</text>
            <text x="280" y="64" textAnchor="middle" className="fill-emerald-800 text-[11px]">Messenger RNA</text>
            <text x="280" y="84" textAnchor="middle" className="fill-slate-600 text-[10px]">DNA → Ribosomes</text>
            <text x="280" y="102" textAnchor="middle" className="fill-slate-600 text-[10px]">Carries codons</text>

            <rect x="376" y="18" width="165" height="104" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <text x="458" y="42" textAnchor="middle" className="fill-amber-900 text-[13px] font-bold">tRNA</text>
            <text x="458" y="64" textAnchor="middle" className="fill-amber-800 text-[11px]">Transfer RNA</text>
            <text x="458" y="84" textAnchor="middle" className="fill-slate-600 text-[10px]">Carries amino acids</text>
            <text x="458" y="102" textAnchor="middle" className="fill-slate-600 text-[10px]">Matches mRNA codons</text>
          </svg>
        )}

        {concept === 'genome-karyotype' && (
          <svg viewBox="0 0 560 140" className="w-full max-w-xl mx-auto h-auto" aria-label="Human Genome metrics">
            <rect x="16" y="20" width="124" height="100" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="78" y="52" textAnchor="middle" className="fill-sky-700 text-[15px] font-bold font-mono">3.1B bp</text>
            <text x="78" y="74" textAnchor="middle" className="fill-slate-800 text-[11px] font-medium">Human Genome</text>
            <text x="78" y="92" textAnchor="middle" className="fill-slate-500 text-[10px]">1–2% Protein-coding</text>

            <rect x="150" y="20" width="124" height="100" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="212" y="52" textAnchor="middle" className="fill-sky-700 text-[15px] font-bold font-mono">23 Pairs</text>
            <text x="212" y="74" textAnchor="middle" className="fill-slate-800 text-[11px] font-medium">46 Chromosomes</text>
            <text x="212" y="92" textAnchor="middle" className="fill-slate-500 text-[10px]">1 from each parent</text>

            <rect x="284" y="20" width="124" height="100" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="346" y="52" textAnchor="middle" className="fill-emerald-700 text-[14px] font-bold font-mono">19k–20k</text>
            <text x="346" y="74" textAnchor="middle" className="fill-slate-800 text-[11px] font-medium">Coding Genes</text>
            <text x="346" y="92" textAnchor="middle" className="fill-slate-500 text-[10px]">Variants = Alleles</text>

            <rect x="418" y="20" width="126" height="100" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <text x="481" y="48" textAnchor="middle" className="fill-amber-900 text-[12px] font-bold">Karyotyping</text>
            <text x="481" y="70" textAnchor="middle" className="fill-amber-800 text-[10px]">Down: Trisomy (+1)</text>
            <text x="481" y="88" textAnchor="middle" className="fill-amber-800 text-[10px]">Turner: Monosomy (-1)</text>
          </svg>
        )}

        {concept === 'central-dogma' && (
          <svg viewBox="0 0 560 130" className="w-full max-w-xl mx-auto h-auto" aria-label="Transcription and Translation flow">
            <rect x="28" y="34" width="110" height="58" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
            <text x="83" y="60" textAnchor="middle" className="fill-sky-900 text-[14px] font-bold">DNA</text>
            <text x="83" y="78" textAnchor="middle" className="fill-sky-700 text-[10px]">Gene Template</text>

            <line x1="138" y1="63" x2="218" y2="63" stroke="#0F172A" strokeWidth="2" />
            <polygon points="218,58 228,63 218,68" fill="#0F172A" />
            <text x="180" y="50" textAnchor="middle" className="fill-slate-800 text-[11px] font-semibold">Transcription</text>

            <rect x="230" y="34" width="115" height="58" rx="8" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
            <text x="287" y="60" textAnchor="middle" className="fill-emerald-900 text-[14px] font-bold">mRNA</text>
            <text x="287" y="78" textAnchor="middle" className="fill-emerald-700 text-[10px]">3 nt = 1 Codon</text>

            <line x1="345" y1="63" x2="420" y2="63" stroke="#0F172A" strokeWidth="2" />
            <polygon points="420,58 430,63 420,68" fill="#0F172A" />
            <text x="385" y="50" textAnchor="middle" className="fill-slate-800 text-[11px] font-semibold">Translation</text>

            <rect x="432" y="34" width="105" height="58" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
            <text x="484" y="60" textAnchor="middle" className="fill-amber-900 text-[14px] font-bold">Protein</text>
            <text x="484" y="78" textAnchor="middle" className="fill-amber-700 text-[10px]">Amino Acids</text>
          </svg>
        )}

        {concept === 'nucleosome' && (
          <svg viewBox="0 0 560 150" className="w-full max-w-xl mx-auto h-auto" aria-label="Nucleosome and Histone octamer">
            {/* Linker DNA left */}
            <path d="M 30 95 Q 90 95 140 80" fill="none" stroke="#0284C7" strokeWidth="4" />
            {/* Histone Octamer */}
            <circle cx="230" cy="75" r="44" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
            <text x="230" y="64" textAnchor="middle" className="fill-amber-900 text-[12px] font-bold">Histone Octamer</text>
            <text x="230" y="81" textAnchor="middle" className="fill-amber-800 text-[10px]">2×(H2A, H2B, H3, H4)</text>
            <text x="230" y="96" textAnchor="middle" className="fill-amber-700 text-[9px]">Rich in Lys &amp; Arg (+)</text>

            {/* DNA wrapping around */}
            <path d="M 140 80 C 165 25, 295 25, 315 75 C 335 125, 175 130, 185 85" fill="none" stroke="#0284C7" strokeWidth="4.5" strokeLinecap="round" />

            {/* Linker DNA right + H1 */}
            <path d="M 315 75 Q 395 95 520 95" fill="none" stroke="#0284C7" strokeWidth="4" />
            <rect x="372" y="65" width="70" height="36" rx="8" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
            <text x="407" y="87" textAnchor="middle" className="fill-emerald-900 text-[12px] font-bold">H1 Linker</text>

            <text x="407" y="120" textAnchor="middle" className="fill-slate-600 text-[10px]">Binds Linker DNA</text>
            <text x="230" y="140" textAnchor="middle" className="fill-slate-700 text-[11px] font-semibold">Nucleosome = Simplest Chromatin Unit</text>
          </svg>
        )}

        {concept === 'splicing' && (
          <svg viewBox="0 0 560 140" className="w-full max-w-xl mx-auto h-auto" aria-label="RNA Splicing diagram">
            <text x="24" y="34" className="fill-slate-700 text-[11px] font-semibold">pre-mRNA:</text>
            <rect x="105" y="16" width="80" height="28" rx="4" fill="#0284C7" />
            <text x="145" y="34" textAnchor="middle" className="fill-white text-[11px] font-semibold">Exon 1</text>
            <rect x="188" y="16" width="75" height="28" rx="4" fill="#FFE4E6" stroke="#E11D48" strokeDasharray="3 2" />
            <text x="225" y="34" textAnchor="middle" className="fill-rose-800 text-[11px]">Intron</text>
            <rect x="266" y="16" width="80" height="28" rx="4" fill="#0284C7" />
            <text x="306" y="34" textAnchor="middle" className="fill-white text-[11px] font-semibold">Exon 2</text>
            <rect x="349" y="16" width="75" height="28" rx="4" fill="#FFE4E6" stroke="#E11D48" strokeDasharray="3 2" />
            <text x="386" y="34" textAnchor="middle" className="fill-rose-800 text-[11px]">Intron</text>
            <rect x="427" y="16" width="80" height="28" rx="4" fill="#0284C7" />
            <text x="467" y="34" textAnchor="middle" className="fill-white text-[11px] font-semibold">Exon 3</text>

            {/* Arrow down */}
            <line x1="280" y1="50" x2="280" y2="78" stroke="#475569" strokeWidth="2" />
            <polygon points="275,78 285,78 280,86" fill="#475569" />
            <text x="360" y="72" className="fill-rose-700 text-[10px] font-medium">Introns removed (✕)</text>

            <text x="24" y="114" className="fill-emerald-800 text-[11px] font-semibold">Mature mRNA:</text>
            <rect x="145" y="96" width="90" height="28" rx="4" fill="#059669" />
            <text x="190" y="114" textAnchor="middle" className="fill-white text-[11px] font-semibold">Exon 1</text>
            <rect x="237" y="96" width="90" height="28" rx="4" fill="#059669" />
            <text x="282" y="114" textAnchor="middle" className="fill-white text-[11px] font-semibold">Exon 2</text>
            <rect x="329" y="96" width="90" height="28" rx="4" fill="#059669" />
            <text x="374" y="114" textAnchor="middle" className="fill-white text-[11px] font-semibold">Exon 3</text>
          </svg>
        )}
      </div>
    </div>
  );
};

function conceptLabel(concept: VisualConcept): string {
  switch (concept) {
    case 'nucleotide':
      return 'Nucleotide vs. Nucleoside';
    case 'base-pairing':
      return 'Purines & Pyrimidines';
    case 'rna-types':
      return 'RNA Functional Classes';
    case 'genome-karyotype':
      return 'Human Genome & Karyotyping';
    case 'central-dogma':
      return 'Gene Expression Flow';
    case 'nucleosome':
      return 'Chromatin & Nucleosome Core';
    case 'splicing':
      return 'RNA Splicing Mechanism';
  }
}
