import React from 'react';
import { SheetOptions } from '../types';

interface PrintableSheetProps {
  options: SheetOptions;
  zoom: number;
}

export const PrintableSheet: React.FC<PrintableSheetProps> = ({ options, zoom }) => {
  const isMono = options.printMode === 'monochrome';

  // Density classes for print
  const paddingClass = options.density === 'compact' ? 'p-3' : options.density === 'dense' ? 'p-3.5' : 'p-4';
  const textScale = options.density === 'compact' ? 'text-[9px] leading-[11px]' : options.density === 'dense' ? 'text-[9.5px] leading-[12px]' : 'text-[10px] leading-[13px]';
  const headerText = options.density === 'compact' ? 'text-[10px]' : 'text-[11px]';

  return (
    <div className="flex justify-center w-full">
      {/* 
        US Letter aspect ratio container: 8.5in x 11in (ratio ~ 1.294).
        Standard print width: 8.5in = 816px @ 96dpi. Max width 816px.
      */}
      <div
        id="cheat-sheet-content"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
        className={`printable-sheet bg-white text-slate-900 border ${
          isMono ? 'border-slate-800' : 'border-slate-300'
        } shadow-2xl print:shadow-none print:border-none w-full max-w-[850px] transition-transform duration-150 ${paddingClass}`}
      >
        {/* HEADER BAR: Required for exam with Name, ID, Course info */}
        <header className="border-b-2 border-slate-900 pb-1.5 mb-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="font-extrabold text-sm uppercase tracking-tight text-slate-950">
                CS2325 Computer Organization
              </h1>
              <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                Midterm Reference Sheet (Oct 19, 2026)
              </span>
            </div>
            <div className="text-[9px] text-slate-500 font-mono flex items-center gap-2">
              <span>8.5×11" Single-Sided Only</span>
              <span>·</span>
              <span>Calculator Allowed</span>
              <span>·</span>
              <span>Numbered Slides 002–009</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[10px] text-slate-700">NAME:</span>
              <span className="inline-block min-w-[140px] border-b border-slate-700 pb-0.5 font-semibold text-slate-900 text-[11px]">
                {options.studentName || '____________________________'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[10px] text-slate-700">ID:</span>
              <span className="inline-block min-w-[90px] border-b border-slate-700 pb-0.5 font-semibold text-slate-900 text-[11px]">
                {options.studentId || '_______________'}
              </span>
            </div>
          </div>
        </header>

        {/* 3-COLUMN ULTRA-DENSE HIGH-YIELD CONTENT GRID */}
        <div className={`grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-2 ${textScale}`}>
          
          {/* ================= COLUMN 1: NUMBER REPRESENTATION & IEEE 754 ================= */}
          <div className="space-y-2">
            
            {/* Box 1: Bit Counting & Combinations */}
            <section className="border border-slate-800 rounded-sm p-1.5 bg-slate-50/50">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1 flex justify-between`}>
                <span>1. Bit Counting & States</span>
                <span className="font-mono text-[9px] font-normal text-slate-600">2ⁿ ≥ N</span>
              </h2>
              <p className="mb-1">
                <strong>Min bits for N states:</strong> <code className="bg-slate-200 px-1 font-mono font-bold">b = ⌈log₂(N)⌉</code>
              </p>
              <div className="text-[8.5px] space-y-0.5 font-mono bg-white p-1 border border-slate-200">
                <div>• 50 states → 2⁵=32 &lt; 50 ≤ 64=2⁶ → <strong>6 bits</strong></div>
                <div>• n bits encode exactly <strong>2ⁿ</strong> distinct combinations.</div>
                <div>• k independent switches with s₁...sₖ states: Total = s₁ × s₂ × ... × sₖ.</div>
              </div>
            </section>

            {/* Box 2: Radix Conversions & Horner's Method */}
            <section className="border border-slate-800 rounded-sm p-1.5">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1`}>
                2. Horner's Method & Division
              </h2>
              <div className="space-y-1">
                <div>
                  <span className="font-bold">Horner's Method (Base b → Dec):</span>
                  <div className="font-mono text-[8.5px] bg-slate-100 p-1 border border-slate-200 mt-0.5">
                    Start val = dₙ₋₁; For each next digit d: <strong>val = val × b + d</strong>
                    <div className="text-slate-800 mt-0.5">
                      • 1101₂: (1×2+1=3) → (3×2+0=6) → (6×2+1=<strong>13₁₀</strong>)
                    </div>
                    <div className="text-slate-800">
                      • 0x3B: (3×16 + 11) = 48 + 11 = <strong>59₁₀</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-bold">Repeated Division (Dec Int → Base b):</span>
                  <div className="text-[8.5px] font-mono bg-slate-100 p-1 border border-slate-200 mt-0.5">
                    Divide by b, keep remainder. Stop at quotient 0.
                    <div className="text-slate-800 font-semibold">
                      Read remainders Bottom-to-Top (Last = MSB):
                    </div>
                    <div>29 ÷ 2 = 14 r 1 (LSB) | 14 ÷ 2 = 7 r 0 | 7 ÷ 2 = 3 r 1</div>
                    <div>3 ÷ 2 = 1 r 1 | 1 ÷ 2 = 0 r 1 (MSB) → <strong>11101₂</strong></div>
                  </div>
                </div>

                <div>
                  <span className="font-bold">Repeated Multiplication (Dec Fraction → Base b):</span>
                  <div className="text-[8.5px] font-mono bg-slate-100 p-1 border border-slate-200 mt-0.5">
                    Multiply fraction by b; integer part becomes next digit (Top-to-Bottom).
                    <div>0.625 × 2 = <strong>1</strong>.25 → 0.25 × 2 = <strong>0</strong>.5 → 0.5 × 2 = <strong>1</strong>.0 → <strong>0.101₂</strong></div>
                  </div>
                </div>

                {/* Nibble Quick Lookup Table */}
                <div className="mt-1">
                  <span className="font-bold text-[8.5px]">Hex ↔ Binary Nibbles (4-bit chunks):</span>
                  <div className="grid grid-cols-4 gap-0.5 text-[8px] font-mono mt-0.5 text-center">
                    <span className="bg-slate-100 border p-0.5">0=0000</span>
                    <span className="bg-slate-100 border p-0.5">1=0001</span>
                    <span className="bg-slate-100 border p-0.5">2=0010</span>
                    <span className="bg-slate-100 border p-0.5">3=0011</span>
                    <span className="bg-slate-100 border p-0.5">4=0100</span>
                    <span className="bg-slate-100 border p-0.5">5=0101</span>
                    <span className="bg-slate-100 border p-0.5">6=0110</span>
                    <span className="bg-slate-100 border p-0.5">7=0111</span>
                    <span className="bg-slate-100 border p-0.5">8=1000</span>
                    <span className="bg-slate-100 border p-0.5">9=1001</span>
                    <span className="bg-slate-100 border p-0.5">A=1010</span>
                    <span className="bg-slate-100 border p-0.5">B=1011</span>
                    <span className="bg-slate-100 border p-0.5">C=1100</span>
                    <span className="bg-slate-100 border p-0.5">D=1101</span>
                    <span className="bg-slate-100 border p-0.5">E=1110</span>
                    <span className="bg-slate-100 border p-0.5">F=1111</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Box 3: Unsigned vs Two's Complement */}
            <section className="border border-slate-800 rounded-sm p-1.5">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1`}>
                3. Signed & Two's Complement
              </h2>
              <div className="space-y-1">
                <table className="w-full text-[8.5px] border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-slate-400 bg-slate-200">
                      <th className="text-left p-0.5">Bits</th>
                      <th className="text-left p-0.5">Unsigned [0, 2ⁿ-1]</th>
                      <th className="text-left p-0.5">Two's Comp [-2ⁿ⁻¹, 2ⁿ⁻¹-1]</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">4-bit</td>
                      <td className="p-0.5">0 to 15</td>
                      <td className="p-0.5">-8 to +7</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">8-bit</td>
                      <td className="p-0.5">0 to 255</td>
                      <td className="p-0.5">-128 to +127</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">16-bit</td>
                      <td className="p-0.5">0 to 65,535</td>
                      <td className="p-0.5">-32,768 to +32,767</td>
                    </tr>
                    <tr>
                      <td className="p-0.5 font-bold">32-bit</td>
                      <td className="p-0.5">0 to 4,294,967,295</td>
                      <td className="p-0.5">-2,147,483,648 to +2,147,483,647</td>
                    </tr>
                  </tbody>
                </table>

                <div className="bg-slate-100 p-1 border border-slate-200 text-[8.5px]">
                  <strong>Form Negative (Bit Inversion + 1):</strong>
                  <div className="font-mono mt-0.5">
                    Negate x: <code className="font-bold">~x + 1</code>
                    <div>+6 (8-bit) = 0000 0110₂</div>
                    <div>Invert bits: 1111 1001₂ → Add 1: <strong>1111 1010₂ (-6)</strong></div>
                    <div className="text-slate-600 italic">Shortcut: Keep rightmost zeros and first 1, flip all bits to left!</div>
                  </div>
                </div>

                <div className="text-[8.5px]">
                  <strong>Sign Extension:</strong> Copy MSB into higher bit positions.
                  <div className="font-mono text-[8px] text-slate-800">
                    8-bit 0xFA (1111 1010 = -6) → 16-bit: 0xFFFA (1111 1111 1111 1010)
                  </div>
                  <strong>Overflow Detection:</strong>
                  <div className="font-mono text-[8px] text-slate-800">
                    • Signed: (+) + (+) = (-) OR (-) + (-) = (+) → OVERFLOW! (C_in ≠ C_out at MSB).
                    • Unsigned: Carry-out of MSB = 1 → OVERFLOW.
                  </div>
                </div>
              </div>
            </section>

            {/* Box 4: ASCII Interpretation & Digit Trap */}
            <section className="border border-slate-800 rounded-sm p-1.5 bg-amber-50/50 border-amber-900/60">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-amber-300 pb-0.5 mb-1 flex justify-between`}>
                <span>4. ASCII & Digit vs Value Trap</span>
                <span className="font-mono text-[8px] text-red-700 font-bold">CRITICAL EXAM TRAP</span>
              </h2>
              <div className="space-y-1 text-[8.5px]">
                <div className="p-1 bg-white border border-amber-300 font-mono">
                  <div className="font-bold text-slate-900">Digit Char ≠ Numerical Value:</div>
                  <div>• Char '0' = <strong>0x30 (48₁₀)</strong> ... '9' = <strong>0x39 (57₁₀)</strong></div>
                  <div>• Formula: <code className="bg-slate-200 px-1 font-bold">int_val = ascii_char - '0' (or - 0x30)</code></div>
                  <div>• 'A' = <strong>0x41 (65₁₀)</strong> ... 'Z' = <strong>0x5A (90₁₀)</strong></div>
                  <div>• 'a' = <strong>0x61 (97₁₀)</strong> ... 'z' = <strong>0x7A (122₁₀)</strong></div>
                  <div>• Case difference: <code className="font-bold">'a' - 'A' = 0x20 (32₁₀)</code> (bit 5)</div>
                  <div>• Null terminator: <code className="font-bold">'\0' = 0x00 (0₁₀)</code></div>
                  <div>• Space ' ' = 0x20 (32₁₀) · Newline '\n' = 0x0A (10₁₀)</div>
                </div>
              </div>
            </section>

          </div>

          {/* ================= COLUMN 2: IEEE 754 & COMPUTER ORGANIZATION ================= */}
          <div className="space-y-2">
            
            {/* Box 5: IEEE 754 Single-Precision (binary32) */}
            <section className="border border-slate-800 rounded-sm p-1.5">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1 flex justify-between`}>
                <span>5. IEEE 754 Float32 (binary32)</span>
                <span className="font-mono text-[9px] font-bold">Bias = 127</span>
              </h2>

              <div className="space-y-1">
                {/* 32-bit field diagram */}
                <div className="border border-slate-700 text-center font-mono text-[8px] grid grid-cols-12 bg-slate-100">
                  <div className="col-span-1 bg-red-100 border-r border-slate-400 p-0.5">
                    <span className="font-bold">S</span> (1b)
                    <div className="text-[7px]">bit 31</div>
                  </div>
                  <div className="col-span-4 bg-blue-100 border-r border-slate-400 p-0.5">
                    <span className="font-bold">Exp E</span> (8b)
                    <div className="text-[7px]">bits 30–23</div>
                  </div>
                  <div className="col-span-7 bg-emerald-100 p-0.5">
                    <span className="font-bold">Fraction / Mantissa F</span> (23b)
                    <div className="text-[7px]">bits 22–0</div>
                  </div>
                </div>

                <div className="text-[8.5px] font-mono bg-white p-1 border border-slate-200">
                  <div><strong>Formula:</strong> Value = (-1)ˢ × (1.F)₂ × 2^(E - 127)</div>
                  <div>• S = 0 (positive), S = 1 (negative)</div>
                  <div>• Stored Exponent: <code className="font-bold">E = e + 127</code> (Actual e = E - 127)</div>
                  <div>• F: 23 bits <em>after</em> the implicit leading 1.</div>
                </div>

                {/* Worked Example */}
                <div className="bg-slate-50 p-1 border border-slate-300 text-[8.5px]">
                  <strong className="text-slate-900">Step-by-Step Example: Convert -12.625₁₀</strong>
                  <ol className="list-decimal list-inside space-y-0.5 font-mono text-[8px] text-slate-800 mt-0.5">
                    <li>Sign: Negative → <strong>S = 1</strong></li>
                    <li>Magnitude in Binary: 12 = 1100₂, 0.625 = 0.101₂ → 1100.101₂</li>
                    <li>Normalize: 1100.101₂ = <strong>1.100101₂ × 2³</strong> → Actual e = 3</li>
                    <li>Biased Exp: E = 3 + 127 = <strong>130₁₀ = 1000 0010₂</strong></li>
                    <li>Fraction (23b): Drop leading 1 → <strong>10010100000000000000000</strong></li>
                    <li>Assemble: [1] [10000010] [10010100000000000000000]</li>
                    <li>Hex Nibbles: 1100 0001 0100 1010 0000 0000 0000 0000</li>
                    <li className="font-bold text-slate-950">Result: 0xC14A0000</li>
                  </ol>
                </div>

                {/* Special IEEE Values */}
                <table className="w-full text-[8px] border-collapse font-mono bg-white border border-slate-200">
                  <thead>
                    <tr className="bg-slate-200 border-b border-slate-300">
                      <th className="p-0.5 text-left">Special Value</th>
                      <th className="p-0.5 text-left">Exp (E)</th>
                      <th className="p-0.5 text-left">Fraction (F)</th>
                      <th className="p-0.5 text-left">Hex (S=0 / S=1)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">Zero (±0)</td>
                      <td className="p-0.5">0 (0x00)</td>
                      <td className="p-0.5">= 0</td>
                      <td className="p-0.5">0x00000000 / 0x80000000</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">Infinity (±∞)</td>
                      <td className="p-0.5">255 (0xFF)</td>
                      <td className="p-0.5">= 0</td>
                      <td className="p-0.5">0x7F800000 / 0xFF800000</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">Not a Number (NaN)</td>
                      <td className="p-0.5">255 (0xFF)</td>
                      <td className="p-0.5">≠ 0</td>
                      <td className="p-0.5">e.g. 0x7FC00000</td>
                    </tr>
                    <tr>
                      <td className="p-0.5 font-bold">Denormalized</td>
                      <td className="p-0.5">0 (0x00)</td>
                      <td className="p-0.5">≠ 0</td>
                      <td className="p-0.5">(-1)ˢ × (0.F)₂ × 2⁻¹²⁶</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Box 6: Memory Hierarchy & RISC vs CISC */}
            <section className="border border-slate-800 rounded-sm p-1.5">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1`}>
                6. Memory Hierarchy & RISC/CISC
              </h2>
              <div className="space-y-1">
                <div className="font-mono text-[8px] bg-slate-100 p-1 border border-slate-200">
                  <div className="font-bold text-slate-900">Hierarchy (Speed/Cost ↓, Capacity ↑):</div>
                  <div>• <strong>Registers:</strong> &lt;1 ns, 32 words (128B), in CPU core.</div>
                  <div>• <strong>Cache (L1/L2/L3):</strong> 1–15 ns, KB to MB, SRAM.</div>
                  <div>• <strong>Main Memory:</strong> 50–100 ns, GBs, DRAM.</div>
                  <div>• <strong>Storage (SSD/Disk):</strong> μs to ms, TBs, Flash/Magnetic.</div>
                </div>

                <div className="text-[8.5px]">
                  <strong>RISC (MIPS, ARM) vs CISC (x86):</strong>
                  <div className="text-[8px] font-mono mt-0.5 space-y-0.5">
                    <div>• <strong>RISC:</strong> Fixed 32-bit instrs, 1 cycle/inst, load-store arch. Arithmetic operands MUST be registers! Hardwired control.</div>
                    <div>• <strong>CISC:</strong> Variable 1–15 byte instrs, memory operands allowed in arithmetic (e.g. ADD [mem], reg), microcode.</div>
                    <div className="bg-slate-200 p-0.5 font-bold text-slate-950">
                      Load-Operate-Store Sequence:
                      lw $t0, 0($s0) → add $t0, $t0, $t1 → sw $t0, 0($s0)
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Box 7: Addressing Modes & Displacement */}
            <section className="border border-slate-800 rounded-sm p-1.5">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1`}>
                7. Addressing Modes & 16-Bit Offset
              </h2>
              <div className="space-y-1 text-[8.5px]">
                <div className="font-mono text-[8px] space-y-0.5">
                  <div>1. <strong>Register:</strong> Operand in register (<code className="font-bold">add $t0, $s0, $s1</code>)</div>
                  <div>2. <strong>Immediate:</strong> Constant in instruction (<code className="font-bold">addi $t0, $s0, 42</code>)</div>
                  <div>3. <strong>Base-Displacement (Base/Offset):</strong> Used in <code className="font-bold">lw $rt, offset($rs)</code> / <code className="font-bold">sw</code></div>
                  <div className="bg-slate-100 p-1 border border-slate-200">
                    <div>Effective Address = <strong>Reg[base] + SignExt(offset16)</strong></div>
                    <div className="text-red-700 font-bold">
                      Displacement Range (signed 16-bit):
                    </div>
                    <div>[-32,768 to +32,767 bytes] (-2¹⁵ to 2¹⁵ - 1)</div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* ================= COLUMN 3: MEMORY ALIGNMENT, ENDIANNESS, MIPS & MARS ================= */}
          <div className="space-y-2">
            
            {/* Box 8: Alignment, Endianness & Gaps */}
            <section className="border border-slate-800 rounded-sm p-1.5">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1 flex justify-between`}>
                <span>8. Endianness & Alignment</span>
                <span className="font-mono text-[8.5px] font-bold">Addresses Increase →</span>
              </h2>

              <div className="space-y-1">
                {/* Endianness Comparison */}
                <div className="text-[8.5px]">
                  <strong>Value 0x12345678 at base address 0x1000:</strong>
                  <div className="text-[7.5px] text-slate-600 font-mono">(MSB=0x12, Byte1=0x34, Byte2=0x56, LSB=0x78)</div>
                  <table className="w-full text-[8px] border-collapse font-mono mt-0.5 text-center">
                    <thead>
                      <tr className="bg-slate-200 border-b border-slate-400">
                        <th className="p-0.5 text-left">Architecture</th>
                        <th className="p-0.5">0x1000</th>
                        <th className="p-0.5">0x1001</th>
                        <th className="p-0.5">0x1002</th>
                        <th className="p-0.5">0x1003</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-0.5 text-left font-bold">Big-Endian (MSB first)</td>
                        <td className="p-0.5 bg-amber-100 font-bold">12</td>
                        <td className="p-0.5">34</td>
                        <td className="p-0.5">56</td>
                        <td className="p-0.5 bg-blue-100 font-bold">78</td>
                      </tr>
                      <tr>
                        <td className="p-0.5 text-left font-bold">Little-Endian (LSB first)</td>
                        <td className="p-0.5 bg-blue-100 font-bold">78</td>
                        <td className="p-0.5">56</td>
                        <td className="p-0.5">34</td>
                        <td className="p-0.5 bg-amber-100 font-bold">12</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="text-[7.5px] font-mono text-slate-700 italic mt-0.5">
                    *MARS MIPS default & x86 use Little-Endian. Network uses Big-Endian.
                  </div>
                </div>

                {/* Alignment Rules & Gaps */}
                <div className="text-[8.5px] font-mono bg-slate-100 p-1 border border-slate-200">
                  <div className="font-bold text-slate-900">Data Sizes & Alignment:</div>
                  <div>• <strong>Byte (1B):</strong> Any address.</div>
                  <div>• <strong>Halfword (2B):</strong> Address multiple of 2 (ends in bin 0, hex 0,2,4,6,8,A,C,E).</div>
                  <div>• <strong>Word (4B):</strong> Address multiple of 4 (ends in bin 00, hex 0,4,8,C).</div>
                  <div className="mt-0.5 pt-0.5 border-t border-slate-300 text-slate-900">
                    <strong>Alignment Gap (Padding) Example:</strong>
                    <div>If at 0x10010001 (1 byte stored) and next is a <code>.word</code>:</div>
                    <div>Word CANNOT be at 0x10010001! Must advance to <strong>0x10010004</strong>.</div>
                    <div>Padding gap = <strong>3 wasted bytes</strong> (0x10010001..0x10010003).</div>
                  </div>
                </div>

                {/* Von Neumann vs Harvard & Segments */}
                <div className="text-[8.5px] font-mono bg-white p-1 border border-slate-200">
                  <div><strong>Von Neumann:</strong> Shared code & data memory/bus (bottleneck).</div>
                  <div><strong>Harvard:</strong> Separate code & data memories/buses (parallel).</div>
                  <div className="mt-0.5 font-bold">Virtual Memory Segments (Low → High):</div>
                  <div className="text-[7.5px] space-y-0.2">
                    <div>1. <strong>Reserved:</strong> 0x00000000 – 0x003FFFFF</div>
                    <div>2. <strong>Text (.text):</strong> 0x00400000 (read-only code)</div>
                    <div>3. <strong>Static Data (.data):</strong> 0x10010000 (globals/strings)</div>
                    <div>4. <strong>Heap:</strong> Dynamic data (malloc), grows <strong>UP ↑</strong></div>
                    <div>5. <strong>Stack:</strong> Local vars ($sp), starts 0x7FFFFFFF, grows <strong>DOWN ↓</strong></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Box 9: MIPS Register Table & Calling Conventions */}
            <section className="border border-slate-800 rounded-sm p-1.5">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1 flex justify-between`}>
                <span>9. MIPS Registers & Calling Convention</span>
                <span className="font-mono text-[8px] font-bold text-slate-700">32 General Regs</span>
              </h2>

              <div className="space-y-1">
                <table className="w-full text-[7.8px] border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-200 border-b border-slate-400">
                      <th className="p-0.5 text-left">Reg Name</th>
                      <th className="p-0.5 text-left">Num</th>
                      <th className="p-0.5 text-left">Role / Purpose</th>
                      <th className="p-0.5 text-left">Saved By?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">$zero</td>
                      <td className="p-0.5">$0</td>
                      <td className="p-0.5">Constant 0 (hardwired)</td>
                      <td className="p-0.5 text-slate-500">N/A</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">$at</td>
                      <td className="p-0.5">$1</td>
                      <td className="p-0.5">Assembler temporary</td>
                      <td className="p-0.5 text-slate-500">N/A</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-emerald-50/50">
                      <td className="p-0.5 font-bold">$v0–$v1</td>
                      <td className="p-0.5">$2–$3</td>
                      <td className="p-0.5">Func returns & Syscall codes</td>
                      <td className="p-0.5 text-red-700 font-bold">Caller</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-emerald-50/50">
                      <td className="p-0.5 font-bold">$a0–$a3</td>
                      <td className="p-0.5">$4–$7</td>
                      <td className="p-0.5">Func arguments / syscall args</td>
                      <td className="p-0.5 text-red-700 font-bold">Caller</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-red-50/50">
                      <td className="p-0.5 font-bold">$t0–$t7</td>
                      <td className="p-0.5">$8–$15</td>
                      <td className="p-0.5">Temporaries (overwritten by call)</td>
                      <td className="p-0.5 text-red-700 font-bold">Caller</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-blue-50/50">
                      <td className="p-0.5 font-bold">$s0–$s7</td>
                      <td className="p-0.5">$16–$23</td>
                      <td className="p-0.5">Saved regs (must be preserved!)</td>
                      <td className="p-0.5 text-blue-700 font-bold">Callee</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-red-50/50">
                      <td className="p-0.5 font-bold">$t8–$t9</td>
                      <td className="p-0.5">$24–$25</td>
                      <td className="p-0.5">More temporaries</td>
                      <td className="p-0.5 text-red-700 font-bold">Caller</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">$k0–$k1</td>
                      <td className="p-0.5">$26–$27</td>
                      <td className="p-0.5">OS / Kernel exception handlers</td>
                      <td className="p-0.5 text-slate-500">N/A</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">$gp</td>
                      <td className="p-0.5">$28</td>
                      <td className="p-0.5">Global pointer (0x10008000)</td>
                      <td className="p-0.5 text-blue-700 font-bold">Callee</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">$sp</td>
                      <td className="p-0.5">$29</td>
                      <td className="p-0.5">Stack pointer (top of stack)</td>
                      <td className="p-0.5 text-blue-700 font-bold">Callee</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">$fp</td>
                      <td className="p-0.5">$30</td>
                      <td className="p-0.5">Frame pointer</td>
                      <td className="p-0.5 text-blue-700 font-bold">Callee</td>
                    </tr>
                    <tr>
                      <td className="p-0.5 font-bold">$ra</td>
                      <td className="p-0.5">$31</td>
                      <td className="p-0.5">Return address (set by jal)</td>
                      <td className="p-0.5 text-blue-700 font-bold">Callee*</td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-[8px] font-mono bg-slate-100 p-1 border border-slate-200">
                  <div><strong>Caller vs Callee-Saved Rules:</strong></div>
                  <div>• <strong>Caller-saved ($t, $a, $v):</strong> Caller assumes callee WILL overwrite them. If caller needs values after a <code>jal</code>, CALLER must save to stack before call.</div>
                  <div>• <strong>Callee-saved ($s, $ra):</strong> Callee promises to leave them unchanged. If callee uses $s registers, CALLEE must push them in prologue and restore before <code>jr $ra</code>.</div>
                </div>

                <div className="text-[8px] font-mono bg-amber-50 p-1 border border-amber-300">
                  <span className="font-bold text-slate-900">PC vs $ra:</span>
                  <div>• <strong>PC (Program Counter):</strong> Holds address of the NEXT instruction to fetch/execute. (Increments by 4 each cycle).</div>
                  <div>• <strong>$ra (Register 31):</strong> Holds the address to RETURN to after a function call completes. (<code>jal target</code> sets $ra = PC + 4; function returns via <code>jr $ra</code>).</div>
                </div>
              </div>
            </section>

            {/* Box 10: MARS Reading & Assembly Essentials */}
            <section className="border border-slate-800 rounded-sm p-1.5">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1`}>
                10. MARS & Assembly Reading
              </h2>
              <div className="space-y-1 text-[8.5px] font-mono">
                <div className="bg-slate-100 p-1 border border-slate-200 text-[8px]">
                  <div className="font-bold text-slate-900">Reading MARS Simulator Screens:</div>
                  <div>• <strong>Address vs Contents:</strong> Address is WHERE data lives (e.g. 0x10010000); Contents is WHAT is stored there (e.g. 0x0000002A).</div>
                  <div>• <strong>Register Name/Num vs Value:</strong> Reg 8 is $t0; its VALUE might be 42. Don't confuse register number with its contents!</div>
                </div>

                <div className="text-[8px] space-y-0.5">
                  <div>• <code>.data</code>: Starts static data segment.</div>
                  <div>• <code>.text</code>: Starts code segment (0x00400000).</div>
                  <div>• <code>.word 42, 0x1A</code>: Allocates 4-byte 32-bit words.</div>
                  <div>• <code>.byte 10, 'A'</code>: Allocates 1-byte values.</div>
                  <div className="p-0.5 bg-yellow-100 font-bold text-slate-950 border border-yellow-300">
                    .ascii vs .asciiz:
                    <div>• .ascii "Hi" → 2 bytes ('H','i') [NO null terminator]</div>
                    <div>• .asciiz "Hi" → 3 bytes ('H','i','\0') [HAS 0x00 null byte!]</div>
                  </div>
                  <div>• <strong>Labels:</strong> Symbolic names for addresses (e.g. <code>val: .word 5</code> → <code>val</code> is an address, NOT 5!).</div>
                  <div>• <code>la $a0, label</code>: Loads the ADDRESS of label into $a0.</div>
                  <div>• <code>lw $t0, 0($s0)</code>: Loads WORD from memory at ($s0 + 0).</div>
                  <div>• <code>sw $t0, 4($s0)</code>: Stores WORD into memory at ($s0 + 4).</div>
                  <div>• <code>syscall</code>: Service code in $v0 (1=print int, 4=print str, 5=read int, 10=exit).</div>
                </div>
              </div>
            </section>

            {/* Optional Custom Notes Box (If Enabled) */}
            {options.showCustomNotes && (
              <section className="border border-slate-800 rounded-sm p-1.5 bg-yellow-50/70 border-dashed">
                <h2 className="font-bold text-[9px] text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5">
                  Personal Class Notes & Reminders
                </h2>
                <div className="text-[8px] font-mono whitespace-pre-wrap text-slate-900 leading-tight">
                  {options.customNotes || 'Add your own custom formulas, professor hints, or mnemonic devices here.'}
                </div>
              </section>
            )}

          </div>

        </div>

        {/* COMPACT FOOTER */}
        <footer className="mt-2 pt-1 border-t border-slate-400 flex justify-between items-center text-[8px] text-slate-500 font-mono">
          <div>Prepared for CS2325 Midterm Exam · Reference Sheet complies with 1-page single-sided constraint</div>
          <div>Page 1 of 1 (Reverse side must remain blank)</div>
        </footer>

      </div>
    </div>
  );
};
