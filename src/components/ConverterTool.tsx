import React, { useState } from 'react';
import { ArrowRight, Calculator, Hash, Binary } from 'lucide-react';

export const ConverterTool: React.FC = () => {
  const [decInput, setDecInput] = useState<string>('29');
  const [bitWidth, setBitWidth] = useState<number>(8);
  const [hornerBase, setHornerBase] = useState<number>(2);
  const [hornerDigits, setHornerDigits] = useState<string>('1101');
  const [asciiChar, setAsciiChar] = useState<string>('7');

  // Parse decimal input
  const num = parseInt(decInput, 10);
  const isValidNum = !isNaN(num);

  // Horner's calculation steps
  const computeHorner = () => {
    const digits = hornerDigits.trim().toUpperCase();
    if (!digits) return { steps: [], finalVal: 0 };
    const steps: { digit: string; digitVal: number; prevVal: number; multVal: number; newVal: number }[] = [];
    let currentVal = 0;

    for (let i = 0; i < digits.length; i++) {
      const char = digits[i];
      let val = parseInt(char, hornerBase);
      if (isNaN(val) || val >= hornerBase) {
        return { steps: [], finalVal: NaN, error: `Invalid digit '${char}' for base ${hornerBase}` };
      }
      if (i === 0) {
        currentVal = val;
        steps.push({ digit: char, digitVal: val, prevVal: 0, multVal: 0, newVal: currentVal });
      } else {
        const prev = currentVal;
        const mult = prev * hornerBase;
        currentVal = mult + val;
        steps.push({ digit: char, digitVal: val, prevVal: prev, multVal: mult, newVal: currentVal });
      }
    }
    return { steps, finalVal: currentVal };
  };

  // Repeated division calculation steps (Dec -> Base)
  const computeDivision = (val: number, base: number) => {
    if (val < 0) val = Math.abs(val);
    if (val === 0) return [{ quotient: 0, remainder: 0, digit: '0' }];
    const steps: { quotient: number; remainder: number; digit: string }[] = [];
    let q = val;
    while (q > 0) {
      const rem = q % base;
      const nextQ = Math.floor(q / base);
      const digit = rem.toString(base).toUpperCase();
      steps.push({ quotient: nextQ, remainder: rem, digit });
      q = nextQ;
    }
    return steps;
  };

  // Two's complement calculation
  const computeTwosComp = (val: number, width: number) => {
    const minVal = -Math.pow(2, width - 1);
    const maxVal = Math.pow(2, width - 1) - 1;
    const unsignedMax = Math.pow(2, width) - 1;

    let inRange = val >= minVal && val <= maxVal;
    let unsignedVal = ((val % Math.pow(2, width)) + Math.pow(2, width)) % Math.pow(2, width);
    let binStr = unsignedVal.toString(2).padStart(width, '0');
    let hexStr = '0x' + unsignedVal.toString(16).toUpperCase().padStart(Math.ceil(width / 4), '0');

    // Negation steps (~x + 1)
    let invertedBits = '';
    for (let char of binStr) {
      invertedBits += char === '0' ? '1' : '0';
    }
    let negatedVal = -val;
    let negUnsigned = ((negatedVal % Math.pow(2, width)) + Math.pow(2, width)) % Math.pow(2, width);
    let negBinStr = negUnsigned.toString(2).padStart(width, '0');

    return {
      minVal,
      maxVal,
      unsignedMax,
      inRange,
      binStr,
      hexStr,
      invertedBits,
      negatedVal,
      negBinStr,
    };
  };

  const hornerResult = computeHorner();
  const divisionSteps = isValidNum ? computeDivision(num, 2) : [];
  const hexDivisionSteps = isValidNum ? computeDivision(num, 16) : [];
  const twosComp = isValidNum ? computeTwosComp(num, bitWidth) : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-md">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Interactive Number & Radix Converter</h2>
            <p className="text-xs text-slate-500">
              Practice Horner's polynomial evaluation, repeated division remainders, two's complement negation, and ASCII traps.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: Horner's Method Evaluator */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Binary className="w-4 h-4 text-blue-600" />
              Horner's Method (Base b → Decimal)
            </h3>
            <span className="text-xs text-slate-500 font-mono">val = val × b + d</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Base (Radix)</label>
              <select
                value={hornerBase}
                onChange={(e) => setHornerBase(parseInt(e.target.value, 10))}
                className="w-full text-xs font-mono p-2 border border-slate-300 rounded bg-slate-50"
              >
                <option value={2}>Base 2 (Binary)</option>
                <option value={8}>Base 8 (Octal)</option>
                <option value={10}>Base 10 (Decimal)</option>
                <option value={16}>Base 16 (Hexadecimal)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Digits String</label>
              <input
                type="text"
                value={hornerDigits}
                onChange={(e) => setHornerDigits(e.target.value)}
                placeholder="e.g. 1101 or 3B"
                className="w-full text-xs font-mono p-2 border border-slate-300 rounded bg-slate-50 uppercase"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800">Evaluation Trace:</div>
            {hornerResult.error ? (
              <div className="text-xs text-red-600 font-mono">{hornerResult.error}</div>
            ) : (
              <div className="space-y-1 font-mono text-xs">
                {hornerResult.steps.map((st, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-600">
                      Step {idx + 1} (digit '{st.digit}' = {st.digitVal}):
                    </span>
                    <span className="font-semibold text-slate-900">
                      {idx === 0
                        ? `Initial = ${st.newVal}`
                        : `(${st.prevVal} × ${hornerBase}) + ${st.digitVal} = ${st.newVal}`}
                    </span>
                  </div>
                ))}
                <div className="pt-1.5 flex justify-between font-bold text-blue-700 text-sm">
                  <span>Decimal Result:</span>
                  <span>{hornerResult.finalVal}₁₀</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: Repeated Division (Dec -> Base b) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-600" />
              Repeated Division (Decimal → Base)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Read Bottom-to-Top</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Decimal Integer</label>
            <input
              type="number"
              value={decInput}
              onChange={(e) => setDecInput(e.target.value)}
              className="w-full text-xs font-mono p-2 border border-slate-300 rounded bg-slate-50"
            />
          </div>

          {isValidNum && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="text-xs font-bold text-slate-800 mb-1">Division by 2 (To Binary):</div>
                <div className="max-h-36 overflow-y-auto space-y-0.5 font-mono text-xs">
                  {divisionSteps.map((st, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700">
                      <span>
                        Quotient: {st.quotient} | Remainder: <strong>{st.remainder}</strong>
                      </span>
                      <span className="text-blue-600 font-bold">Bit: {st.digit}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-200 flex justify-between text-xs font-mono font-bold text-emerald-700">
                  <span>Binary (Bottom-to-Top):</span>
                  <span>{divisionSteps.map((s) => s.digit).reverse().join('') || '0'}₂</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-slate-700">Hexadecimal:</span>
                <span className="font-bold text-purple-700">
                  0x{hexDivisionSteps.map((s) => s.digit).reverse().join('') || '0'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* CARD 3: Two's Complement & Negation Calculator */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-amber-600" />
              Two's Complement & Negation (~x + 1)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Range: [-2ⁿ⁻¹, 2ⁿ⁻¹-1]</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">Select Bit Width (n):</span>
            {[4, 8, 16, 32].map((w) => (
              <button
                key={w}
                onClick={() => setBitWidth(w)}
                className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                  bitWidth === w
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {w}-bit
              </button>
            ))}
          </div>

          {twosComp && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">{bitWidth}-bit Signed Range:</span>
                  <span className="font-bold text-slate-900">
                    [{twosComp.minVal} to {twosComp.maxVal}]
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{bitWidth}-bit Unsigned Range:</span>
                  <span className="font-bold text-slate-900">[0 to {twosComp.unsignedMax}]</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 rounded border border-blue-200 space-y-1.5">
                <div className="font-bold text-blue-900">Bit Pattern for {num}:</div>
                <div className="flex justify-between">
                  <span>Binary ({bitWidth} bits):</span>
                  <span className="font-bold text-blue-700 tracking-wider">{twosComp.binStr}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hexadecimal:</span>
                  <span className="font-bold text-purple-700">{twosComp.hexStr}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded border border-amber-200 space-y-1.5">
                <div className="font-bold text-amber-900">Forming Negative (-{num}) via (~x + 1):</div>
                <div className="flex justify-between text-slate-700">
                  <span>1. Invert all bits (~x):</span>
                  <span className="font-semibold text-slate-900 tracking-wider">{twosComp.invertedBits}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>2. Add 1 (+1):</span>
                  <span className="font-bold text-amber-800 tracking-wider">{twosComp.negBinStr}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-amber-200 font-bold text-slate-900">
                  <span>Negated Value:</span>
                  <span>{twosComp.negatedVal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CARD 4: ASCII Table Inspector & Digit Trap */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">ASCII</span>
              ASCII Character Code vs Digit Trap
            </h3>
            <span className="text-xs text-red-700 font-mono font-bold">Exam Favorite</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Enter Character or Digit</label>
            <input
              type="text"
              maxLength={1}
              value={asciiChar}
              onChange={(e) => setAsciiChar(e.target.value)}
              className="w-full text-sm font-mono p-2 border border-slate-300 rounded bg-slate-50 text-center"
            />
          </div>

          {asciiChar.length > 0 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">Character:</span>
                  <span className="font-bold text-slate-900 text-sm">'{asciiChar}'</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">ASCII Decimal Code:</span>
                  <span className="font-bold text-blue-700">{asciiChar.charCodeAt(0)}₁₀</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">ASCII Hex Code:</span>
                  <span className="font-bold text-purple-700">0x{asciiChar.charCodeAt(0).toString(16).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">ASCII Binary (8-bit):</span>
                  <span className="font-bold text-slate-800">{asciiChar.charCodeAt(0).toString(2).padStart(8, '0')}</span>
                </div>
              </div>

              {/* Trap explanation */}
              <div className="p-3 bg-amber-50 rounded border border-amber-300 space-y-1 text-slate-800">
                <div className="font-bold text-amber-950">Digit vs Numerical Value:</div>
                {asciiChar >= '0' && asciiChar <= '9' ? (
                  <div>
                    Character '{asciiChar}' has ASCII code <strong>0x{asciiChar.charCodeAt(0).toString(16).toUpperCase()} ({asciiChar.charCodeAt(0)}₁₀)</strong>,
                    but its integer numeric value is <strong>{parseInt(asciiChar, 10)}</strong>!
                    <div className="mt-1 bg-white p-1 rounded border border-amber-200 font-bold text-blue-800">
                      Conversion: '{asciiChar}' - '0' = {asciiChar.charCodeAt(0)} - 48 = {parseInt(asciiChar, 10)}
                    </div>
                  </div>
                ) : (
                  <div>
                    If converting a character digit to its integer value in MIPS, always subtract <code>'0'</code> (0x30 / 48₁₀).
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
