import React, { useState } from 'react';
import { PracticeQuestion } from '../types';
import { Award, CheckCircle, XCircle, RotateCcw, BookOpen } from 'lucide-react';

export const PracticeDrill: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions: PracticeQuestion[] = [
    {
      id: 1,
      category: '1. Number Representation',
      question: 'A system needs to uniquely encode 50 independent operational states. What is the minimum number of bits required?',
      options: ['5 bits', '6 bits', '7 bits', '8 bits'],
      correctIndex: 1,
      explanation: 'Formula is ⌈log₂(N)⌉. 2⁵ = 32 (too few to hold 50 states), while 2⁶ = 64 ≥ 50. Therefore, exactly 6 bits are required.',
      sheetReference: 'Box 1: Bit Counting & States (2ⁿ ≥ N)',
    },
    {
      id: 2,
      category: '1. Number Representation',
      question: "Using Horner's method, what is the step-by-step decimal evaluation of the binary bit pattern 1101₂?",
      options: [
        '1 → (1×2+1=3) → (3×2+0=6) → (6×2+1=13₁₀)',
        '1 → (1+2=3) → (3+2=5) → (5+2=7₁₀)',
        '1×1 + 1×2 + 0×4 + 1×8 = 11₁₀',
        '(1×2+0) → (2×2+1) → 15₁₀',
      ],
      correctIndex: 0,
      explanation: "Horner's method multiplies the running accumulator by the base (2) and adds the next digit: Start with first digit 1, then (1×2+1)=3, then (3×2+0)=6, then (6×2+1)=13₁₀.",
      sheetReference: "Box 2: Horner's Method & Division",
    },
    {
      id: 3,
      category: '1. Number Representation',
      question: "What is the representable integer range for an 8-bit two's complement signed integer?",
      options: ['0 to 255', '-127 to +128', '-128 to +127', '-256 to +255'],
      correctIndex: 2,
      explanation: "For n bits, two's complement range is [-2ⁿ⁻¹, 2ⁿ⁻¹ - 1]. For n = 8: -2⁷ = -128 to 2⁷ - 1 = +127.",
      sheetReference: "Box 3: Signed & Two's Complement",
    },
    {
      id: 4,
      category: '1. Number Representation',
      question: "In MIPS, if a byte register holds the ASCII character '7' (0x37), what operation converts it to the integer value 7?",
      options: [
        "Subtract '0' (or 0x30 / 48₁₀)",
        "Add 0x20",
        "Bitwise OR with 0x0F",
        "Shift right by 4 bits",
      ],
      correctIndex: 0,
      explanation: "ASCII digit characters '0' through '9' run from 0x30 (48₁₀) to 0x39 (57₁₀). Subtracting '0' (0x30) yields the actual numeric integer: 0x37 - 0x30 = 7.",
      sheetReference: 'Box 4: ASCII & Digit vs Value Trap',
    },
    {
      id: 5,
      category: '1. Number Representation (IEEE 754)',
      question: 'In IEEE 754 single-precision (binary32), if a normalized number has an actual exponent of e = 3, what biased exponent E is stored?',
      options: ['3 (0000 0011₂)', '130 (1000 0010₂)', '124 (0111 1100₂)', '127 (0111 1111₂)'],
      correctIndex: 1,
      explanation: 'Single-precision has a bias of 127. Stored exponent E = actual e + bias = 3 + 127 = 130₁₀ (binary 1000 0010₂).',
      sheetReference: 'Box 5: IEEE 754 Float32 (binary32)',
    },
    {
      id: 6,
      category: '2. Computer Organization & Memory',
      question: 'In MIPS base-plus-displacement addressing (e.g., lw $rt, offset($rs)), what is the range of the signed 16-bit offset displacement?',
      options: [
        '0 to 65,535 bytes',
        '-32,768 to +32,767 bytes',
        '-65,536 to +65,535 bytes',
        '-16,384 to +16,383 words',
      ],
      correctIndex: 1,
      explanation: 'The offset is a signed 16-bit immediate value, giving a byte displacement range of -2¹⁵ to 2¹⁵ - 1 (-32,768 to +32,767 bytes).',
      sheetReference: 'Box 7: Addressing Modes & 16-Bit Offset',
    },
    {
      id: 7,
      category: '2. Computer Organization & Memory',
      question: 'The 32-bit word 0x12345678 is stored at base address 0x1000 on a Little-Endian machine. Which byte value is stored at address 0x1000?',
      options: ['0x12', '0x34', '0x56', '0x78'],
      correctIndex: 3,
      explanation: 'Little-Endian places the Least Significant Byte (LSB = 0x78) at the lowest memory address (0x1000). MSB (0x12) is at 0x1003.',
      sheetReference: 'Box 8: Endianness & Alignment',
    },
    {
      id: 8,
      category: '2. Computer Organization & Memory',
      question: 'A programmer allocates a single byte at 0x10010000. The next declaration is `.word 42`. At what address must the word begin, and how many bytes of padding are wasted?',
      options: [
        'Address 0x10010001 with 0 bytes padding',
        'Address 0x10010002 with 1 byte padding',
        'Address 0x10010004 with 3 bytes padding',
        'Address 0x10010008 with 7 bytes padding',
      ],
      correctIndex: 2,
      explanation: 'Words (4 bytes) must be 4-byte aligned (addresses divisible by 4). After address 0x10010000, addresses 0x10010001, 0x10010002, and 0x10010003 are skipped as padding, so the word starts at 0x10010004.',
      sheetReference: 'Box 8: Alignment Gaps (Padding)',
    },
    {
      id: 9,
      category: '3. MIPS Registers & Calling Conventions',
      question: 'Which of the following registers is callee-saved, meaning the called function must preserve its value across a function call?',
      options: ['$t0', '$a0', '$v0', '$s0'],
      correctIndex: 3,
      explanation: 'Saved registers ($s0–$s7), $sp, and $ra (in non-leaf routines) are callee-saved. $t0–$t9, $a0–$a3, and $v0–$v1 are caller-saved.',
      sheetReference: 'Box 9: MIPS Registers & Calling Convention',
    },
    {
      id: 10,
      category: '3. Basic Assembly Reading',
      question: 'How many bytes of memory are allocated by the directive `greeting: .asciiz "Exam"` in MIPS static data?',
      options: ['4 bytes', '5 bytes', '8 bytes', '16 bytes'],
      correctIndex: 1,
      explanation: '.asciiz automatically appends a null terminator byte (0x00 / \'\\0\') to the string. "Exam" has 4 characters plus 1 null byte = 5 bytes total. (.ascii would be 4 bytes).',
      sheetReference: 'Box 10: MARS & Assembly Reading (.ascii vs .asciiz)',
    },
  ];

  const handleSelect = (qId: number, optIdx: number) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const score = calculateScore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            CS2325 Midterm High-Yield Practice Drill
          </h2>
          <p className="text-xs text-slate-500">
            10 targeted questions directly testing the concepts from your study guide and slides 002–009.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {showResults && (
            <div className="text-sm font-mono font-bold bg-slate-100 px-3 py-1.5 rounded border border-slate-300">
              Score: <span className={score >= 8 ? 'text-emerald-700' : 'text-amber-700'}>{score} / 10</span>{' '}
              ({Math.round((score / 10) * 100)}%)
            </div>
          )}

          {!showResults ? (
            <button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(answers).length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded shadow-sm transition-colors"
            >
              Check All Answers
            </button>
          ) : (
            <button
              onClick={() => {
                setShowResults(false);
                setAnswers({});
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Drill
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const userAns = answers[q.id];
          const isAnswered = userAns !== undefined;
          const isCorrect = userAns === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`bg-white p-5 rounded-lg border transition-all ${
                showResults
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-red-300 bg-red-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1">
                    Question {idx + 1} · {q.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{q.question}</h3>
                </div>

                {showResults && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                        <CheckCircle className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 mt-2">
                {q.options.map((opt, optIdx) => {
                  let optStyle = 'border-slate-200 hover:bg-slate-50 text-slate-800';

                  if (showResults) {
                    if (optIdx === q.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-100/60 text-emerald-950 font-bold';
                    } else if (userAns === optIdx) {
                      optStyle = 'border-red-400 bg-red-100/60 text-red-950 font-bold';
                    } else {
                      optStyle = 'border-slate-200 opacity-60 text-slate-500';
                    }
                  } else if (userAns === optIdx) {
                    optStyle = 'border-blue-600 bg-blue-50 text-blue-900 font-semibold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded border text-xs font-mono transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>
                        <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Reference */}
              {showResults && (
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs space-y-1.5 font-mono">
                  <div className="text-slate-800">
                    <strong className="text-slate-950">Explanation:</strong> {q.explanation}
                  </div>
                  <div className="text-[11px] text-blue-700 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <strong>Reference Sheet Box:</strong> {q.sheetReference}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
