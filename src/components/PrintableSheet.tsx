import React from 'react';
import { SheetOptions } from '../types';

interface PrintableSheetProps {
  options: SheetOptions;
  zoom: number;
}

export const PrintableSheet: React.FC<PrintableSheetProps> = ({ options, zoom }) => {
  const isMono = options.printMode === 'monochrome';

  // Density classes for print
  const paddingClass = options.density === 'compact' ? 'p-2' : options.density === 'dense' ? 'p-2.5' : 'p-3';
  const textScale = options.density === 'compact' 
    ? 'text-[8px] leading-[10px]' 
    : options.density === 'dense' 
    ? 'text-[8.5px] leading-[11px]' 
    : 'text-[9px] leading-[11.5px]';
  const headerText = options.density === 'compact' ? 'text-[9px]' : 'text-[9.5px]';

  return (
    <div className="flex justify-center w-full">
      {/* 
        US Letter aspect ratio container: 8.5in x 11in.
        Standard print width: 8.5in = 816px @ 96dpi. Max width 820px.
      */}
      <div
        id="cheat-sheet-content"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
        className={`printable-sheet bg-white text-slate-900 border ${
          isMono ? 'border-slate-800' : 'border-slate-300'
        } shadow-2xl print:shadow-none print:border-none w-full max-w-[830px] transition-transform duration-150 ${paddingClass}`}
      >
        {/* HEADER BAR: Required for exam with Name, ID, Course info */}
        <header className="border-b-2 border-slate-900 pb-1 mb-1.5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="font-extrabold text-xs uppercase tracking-tight text-slate-950">
                CS2325 Computer Organization
              </h1>
              <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider">
                Midterm Reference Sheet (Oct 19, 2026)
              </span>
            </div>
            <div className="text-[8px] text-slate-500 font-mono flex items-center gap-2">
              <span>8.5×11" Single-Sided Only</span>
              <span>·</span>
              <span>Calculator Allowed</span>
              <span>·</span>
              <span>Numbered Slides 002–009</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1">
              <span className="font-bold text-[9px] text-slate-700">NAME:</span>
              <span className="inline-block min-w-[130px] border-b border-slate-700 pb-0.5 font-semibold text-slate-900 text-[10px]">
                {options.studentName || '____________________________'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-[9px] text-slate-700">ID:</span>
              <span className="inline-block min-w-[85px] border-b border-slate-700 pb-0.5 font-semibold text-slate-900 text-[10px]">
                {options.studentId || '_______________'}
              </span>
            </div>
          </div>
        </header>

        {/* 3-COLUMN ULTRA-DENSE BALANCED GRID (Enforced in print) */}
        <div className={`grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 sheet-columns gap-1.5 ${textScale}`}>
          
          {/* ================= COLUMN 1: NUMBER REPRESENTATION & ASSEMBLY READING ================= */}
          <div className="space-y-1.5">
            
            {/* Box 1: Bit Counting & Combinations */}
            <section className="border border-slate-800 rounded-xs p-1 bg-slate-50/50">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5 flex justify-between`}>
                <span>1. Bit Counting & States</span>
                <span className="font-mono text-[8px] font-normal text-slate-600">2ⁿ ≥ N</span>
              </h2>
              <div className="font-mono text-[8px] space-y-0.5">
                <div>• Min bits for N states: <code className="bg-slate-200 px-1 font-bold">b = ⌈log₂(N)⌉</code></div>
                <div>• 50 states → 2⁵=32 &lt; 50 ≤ 64=2⁶ → <strong>6 bits</strong></div>
                <div>• n bits encode exactly <strong>2ⁿ</strong> distinct combinations.</div>
                <div>• k switches with s₁...sₖ states: Total = s₁ × s₂ × ... × sₖ.</div>
              </div>
            </section>

            {/* Box 2: Horner's Method & Radix Conversions */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5`}>
                2. Horner's Method & Division
              </h2>
              <div className="space-y-0.5 font-mono text-[7.8px]">
                <div>
                  <strong>Horner's (Base b → Dec):</strong> val = dₙ₋₁; then <strong>val = val × b + d</strong>
                  <div className="text-slate-800">
                    • 1101₂: (1×2+1=3) → (3×2+0=6) → (6×2+1=<strong>13₁₀</strong>)
                    <br />• 0x3B: (3×16 + 11) = 48 + 11 = <strong>59₁₀</strong>
                  </div>
                </div>

                <div className="pt-0.5 border-t border-slate-200">
                  <strong>Repeated Division (Dec → Base b):</strong> Read Bottom-to-Top:
                  <div>29 ÷ 2 = 14 r 1 (LSB) | 14 ÷ 2 = 7 r 0 | 7 ÷ 2 = 3 r 1</div>
                  <div>3 ÷ 2 = 1 r 1 | 1 ÷ 2 = 0 r 1 (MSB) → <strong>11101₂</strong></div>
                </div>

                <div className="pt-0.5 border-t border-slate-200">
                  <strong>Fractional:</strong> Mult by base, keep integer parts Top-to-Bottom.
                  <div>0.625 × 2 = <strong>1</strong>.25 → 0.25 × 2 = <strong>0</strong>.5 → 0.5 × 2 = <strong>1</strong>.0 → <strong>0.101₂</strong></div>
                </div>
              </div>
            </section>

            {/* Box 3: Signed & Two's Complement */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5`}>
                3. Signed & Two's Complement
              </h2>
              <div className="space-y-0.5">
                <table className="w-full text-[7.5px] border-collapse font-mono">
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
                      <td className="p-0.5">0 to 2³²-1 (~4.29B)</td>
                      <td className="p-0.5">-2³¹ to 2³¹-1 (±2.14B)</td>
                    </tr>
                  </tbody>
                </table>

                <div className="bg-slate-100 p-0.5 border border-slate-200 text-[7.8px] font-mono">
                  <strong>Negation (~x + 1):</strong> Invert all bits and add 1.
                  <div>+6: 0000 0110₂ → Invert: 1111 1001₂ → +1: <strong>1111 1010₂ (-6)</strong></div>
                  <div className="text-slate-600 italic">Shortcut: Keep rightmost zeros and first 1, flip left!</div>
                </div>

                <div className="text-[7.5px] font-mono">
                  • <strong>Sign Extension:</strong> Copy MSB into higher bits. (0xFA → 0xFFFA).
                  <br />• <strong>Signed Overflow:</strong> (+) + (+) = (-) OR (-) + (-) = (+). (C_in ≠ C_out at MSB).
                </div>
              </div>
            </section>

            {/* Box 4: ASCII & Digit vs Value Trap */}
            <section className="border border-slate-800 rounded-xs p-1 bg-amber-50/40">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-amber-300 pb-0.5 mb-0.5 flex justify-between`}>
                <span>4. ASCII & Digit vs Value Trap</span>
                <span className="font-mono text-[7.5px] text-red-700 font-bold">EXAM TRAP</span>
              </h2>
              <div className="font-mono text-[7.8px] space-y-0.5">
                <div>• Char '0' = <strong>0x30 (48₁₀)</strong> ... '9' = <strong>0x39 (57₁₀)</strong></div>
                <div>• Formula: <code className="bg-slate-200 px-0.5 font-bold">int_val = ascii_char - '0' (or - 0x30)</code></div>
                <div>• 'A' = <strong>0x41 (65₁₀)</strong> · 'a' = <strong>0x61 (97₁₀)</strong> · Diff = <strong>0x20 (32₁₀)</strong></div>
                <div>• Space = 0x20 · '\n' = 0x0A (10₁₀) · Null '\0' = 0x00 (0₁₀)</div>
              </div>
            </section>

            {/* Box 5: MARS & Assembly Reading (MOVED TO COLUMN 1 TO BALANCE PAGE!) */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5 flex justify-between`}>
                <span>5. MARS & Assembly Reading</span>
                <span className="font-mono text-[7.5px] font-bold text-blue-700">Oct 14 Topics</span>
              </h2>
              <div className="space-y-0.5 font-mono text-[7.8px]">
                <div className="bg-slate-100 p-0.5 border border-slate-200">
                  <strong>Address vs Contents:</strong> Address is WHERE data is stored (0x10010000). Contents is WHAT is inside (0x0000002A).
                  <br /><strong>Register Name vs Value:</strong> Reg 8 is $t0; its VALUE might be 42.
                </div>
                <div>• <code>.data</code>: Static data segment · <code>.text</code>: Machine code (0x00400000).</div>
                <div>• <code>.word</code> (4B, align 4) · <code>.byte</code> (1B) · <code>.half</code> (2B, align 2).</div>
                <div className="bg-yellow-100 p-0.5 border border-yellow-300 font-bold text-slate-950">
                  .ascii vs .asciiz String Size:
                  <div>• .ascii "Hi" → 2 bytes ('H','i') [NO null byte]</div>
                  <div>• .asciiz "Hi" → 3 bytes ('H','i','\0') [HAS 0x00 null terminator!]</div>
                </div>
                <div>• <strong>Labels:</strong> Symbolic names for addresses (NOT values!).</div>
                <div>• <code className="font-bold">la $a0, label</code>: Loads label ADDRESS.</div>
                <div>• <code className="font-bold">lw $t0, 0($s0)</code>: Loads WORD stored at ($s0).</div>
                <div>• <code className="font-bold">sw $t0, 4($s0)</code>: Stores WORD into ($s0+4).</div>
                <div>• <code>syscall</code>: Service code in $v0 (1=int, 4=str, 5=read, 10=exit).</div>
              </div>
            </section>

          </div>

          {/* ================= COLUMN 2: IEEE 754 & COMPUTER ORGANIZATION ================= */}
          <div className="space-y-1.5">
            
            {/* Box 6: IEEE 754 Single-Precision (binary32) */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5 flex justify-between`}>
                <span>6. IEEE 754 Float32</span>
                <span className="font-mono text-[8px] font-bold">Bias = 127</span>
              </h2>

              <div className="space-y-1">
                {/* 32-bit field diagram */}
                <div className="border border-slate-700 text-center font-mono text-[7.5px] grid grid-cols-12 bg-slate-100">
                  <div className="col-span-1 bg-red-100 border-r border-slate-400 p-0.5">
                    <span className="font-bold">S</span>
                    <div className="text-[6.5px]">1b</div>
                  </div>
                  <div className="col-span-4 bg-blue-100 border-r border-slate-400 p-0.5">
                    <span className="font-bold">Exp E</span> (8b)
                    <div className="text-[6.5px]">bits 30–23</div>
                  </div>
                  <div className="col-span-7 bg-emerald-100 p-0.5">
                    <span className="font-bold">Fraction F</span> (23b)
                    <div className="text-[6.5px]">bits 22–0</div>
                  </div>
                </div>

                <div className="text-[7.8px] font-mono bg-white p-0.5 border border-slate-200">
                  <div><strong>Formula:</strong> (-1)ˢ × (1.F)₂ × 2^(E - 127)</div>
                  <div>• S = 0 (pos), S = 1 (neg) · <code className="font-bold">E = e + 127</code> (e = E - 127)</div>
                  <div>• F: 23 bits <em>after</em> the implicit leading 1.</div>
                </div>

                {/* Worked Example */}
                <div className="bg-slate-50 p-1 border border-slate-300 text-[7.8px] font-mono">
                  <strong className="text-slate-900">Worked Example: Convert -12.625₁₀</strong>
                  <div className="space-y-0.5 text-slate-800 mt-0.5">
                    <div>1. Sign: Negative → <strong>S = 1</strong></div>
                    <div>2. Magnitude: 12.625 = 1100.101₂</div>
                    <div>3. Normalize: <strong>1.100101₂ × 2³</strong> → Actual e = 3</div>
                    <div>4. Biased Exp: E = 3 + 127 = <strong>130₁₀ = 1000 0010₂</strong></div>
                    <div>5. Fraction F: Drop 1 → <strong>10010100000000000000000</strong></div>
                    <div>6. Pack: [1] [10000010] [10010100000000000000000]</div>
                    <div className="font-bold text-slate-950">Result: 0xC14A0000</div>
                  </div>
                </div>

                {/* Special IEEE Values */}
                <table className="w-full text-[7.2px] border-collapse font-mono bg-white border border-slate-200">
                  <thead>
                    <tr className="bg-slate-200 border-b border-slate-300">
                      <th className="p-0.5 text-left">Special</th>
                      <th className="p-0.5 text-left">Exp (E)</th>
                      <th className="p-0.5 text-left">Frac (F)</th>
                      <th className="p-0.5 text-left">Hex Value</th>
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
                      <td className="p-0.5 font-bold">Inf (±∞)</td>
                      <td className="p-0.5">255 (0xFF)</td>
                      <td className="p-0.5">= 0</td>
                      <td className="p-0.5">0x7F800000 / 0xFF800000</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">NaN</td>
                      <td className="p-0.5">255 (0xFF)</td>
                      <td className="p-0.5">≠ 0</td>
                      <td className="p-0.5">e.g. 0x7FC00000</td>
                    </tr>
                    <tr>
                      <td className="p-0.5 font-bold">Denorm</td>
                      <td className="p-0.5">0 (0x00)</td>
                      <td className="p-0.5">≠ 0</td>
                      <td className="p-0.5">(-1)ˢ × (0.F)₂ × 2⁻¹²⁶</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Box 7: Memory Hierarchy & RISC vs CISC */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5`}>
                7. Memory Hierarchy & RISC/CISC
              </h2>
              <div className="space-y-0.5 font-mono text-[7.8px]">
                <div className="bg-slate-100 p-0.5 border border-slate-200">
                  <div className="font-bold text-slate-900">Hierarchy (Speed/Cost ↓, Capacity ↑):</div>
                  <div>• <strong>Registers:</strong> &lt;1 ns, 32 words, CPU core.</div>
                  <div>• <strong>Cache (L1/L2/L3):</strong> 1–15 ns, KB to MB, SRAM.</div>
                  <div>• <strong>Main Memory:</strong> 50–100 ns, GBs, DRAM.</div>
                  <div>• <strong>Storage (SSD/Disk):</strong> μs to ms, TBs, Flash/Magnetic.</div>
                </div>

                <div>
                  <strong>RISC (MIPS, ARM) vs CISC (x86):</strong>
                  <div>• <strong>RISC:</strong> Fixed 32-bit instrs, load-store arch. Arithmetic operands MUST be registers! Hardwired control.</div>
                  <div>• <strong>CISC:</strong> Variable 1–15 byte instrs, memory operands allowed in arithmetic (e.g. ADD [mem], reg).</div>
                  <div className="bg-slate-200 p-0.5 font-bold text-slate-950 mt-0.5">
                    Load-Operate-Store Sequence:
                    lw $t0, 0($s0) → add $t0, $t0, $t1 → sw $t0, 0($s0)
                  </div>
                </div>
              </div>
            </section>

            {/* Box 8: Addressing Modes & Displacement */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5`}>
                8. Addressing Modes & 16-Bit Offset
              </h2>
              <div className="space-y-0.5 font-mono text-[7.8px]">
                <div>1. <strong>Register:</strong> Operand in register (<code className="font-bold">add $t0, $s0, $s1</code>)</div>
                <div>2. <strong>Immediate:</strong> Constant in instr (<code className="font-bold">addi $t0, $s0, 42</code>)</div>
                <div>3. <strong>Base-Displacement:</strong> Used in <code className="font-bold">lw $rt, offset($rs)</code> / <code className="font-bold">sw</code></div>
                <div className="bg-slate-100 p-0.5 border border-slate-200">
                  <div>Effective Address = <strong>Reg[base] + SignExt(offset16)</strong></div>
                  <div className="text-red-700 font-bold">
                    Displacement Range (signed 16-bit):
                  </div>
                  <div>[-32,768 to +32,767 bytes] (-2¹⁵ to 2¹⁵ - 1)</div>
                </div>
              </div>
            </section>

          </div>

          {/* ================= COLUMN 3: MEMORY ALIGNMENT, ENDIANNESS, MIPS REGISTERS ================= */}
          <div className="space-y-1.5">
            
            {/* Box 9: Endianness & Alignment */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5 flex justify-between`}>
                <span>9. Endianness & Alignment</span>
                <span className="font-mono text-[7.5px] font-bold">Addresses Increase →</span>
              </h2>

              <div className="space-y-0.5">
                {/* Endianness Comparison */}
                <div className="text-[7.8px] font-mono">
                  <strong>Word 0x12345678 at base address 0x1000:</strong>
                  <table className="w-full text-[7.2px] border-collapse font-mono mt-0.5 text-center">
                    <thead>
                      <tr className="bg-slate-200 border-b border-slate-400">
                        <th className="p-0.5 text-left">Arch</th>
                        <th className="p-0.5">0x1000</th>
                        <th className="p-0.5">0x1001</th>
                        <th className="p-0.5">0x1002</th>
                        <th className="p-0.5">0x1003</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-0.5 text-left font-bold">Big (MSB 1st)</td>
                        <td className="p-0.5 bg-amber-100 font-bold">12</td>
                        <td className="p-0.5">34</td>
                        <td className="p-0.5">56</td>
                        <td className="p-0.5 bg-blue-100 font-bold">78</td>
                      </tr>
                      <tr>
                        <td className="p-0.5 text-left font-bold">Little (LSB 1st)</td>
                        <td className="p-0.5 bg-blue-100 font-bold">78</td>
                        <td className="p-0.5">56</td>
                        <td className="p-0.5">34</td>
                        <td className="p-0.5 bg-amber-100 font-bold">12</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="text-[7px] text-slate-600 italic">
                    *MARS MIPS default & x86 use Little-Endian. Network uses Big-Endian.
                  </div>
                </div>

                {/* Alignment Rules & Gaps */}
                <div className="text-[7.5px] font-mono bg-slate-100 p-0.5 border border-slate-200">
                  <div>• <strong>Byte (1B):</strong> Any address.</div>
                  <div>• <strong>Halfword (2B):</strong> Multiple of 2 (ends in 0,2,4,6,8,A,C,E).</div>
                  <div>• <strong>Word (4B):</strong> Multiple of 4 (ends in 0,4,8,C).</div>
                  <div className="border-t border-slate-300 pt-0.5 mt-0.5 text-slate-900">
                    <strong>Padding Gap:</strong> Byte at 0x10010000, next is <code>.word</code>:
                    <div>Word starts at <strong>0x10010004</strong>. Gap = <strong>3 bytes skipped</strong>.</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Box 10: Von Neumann vs Harvard & Segments */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5`}>
                10. Architecture & Memory Segments
              </h2>
              <div className="space-y-0.5 font-mono text-[7.5px]">
                <div>• <strong>Von Neumann:</strong> Shared code & data memory/bus (bottleneck).</div>
                <div>• <strong>Harvard:</strong> Separate code & data memories/buses (parallel).</div>
                <div className="bg-slate-100 p-0.5 border border-slate-200 mt-0.5">
                  <div className="font-bold text-slate-900">MIPS Memory Segments (Low → High):</div>
                  <div>1. <strong>Reserved:</strong> 0x00000000 – 0x003FFFFF</div>
                  <div>2. <strong>Text (.text):</strong> 0x00400000 (read-only code)</div>
                  <div>3. <strong>Static Data (.data):</strong> 0x10010000 (globals/strings)</div>
                  <div>4. <strong>Heap:</strong> Dynamic (malloc), grows <strong>UP ↑</strong></div>
                  <div>5. <strong>Stack:</strong> Local vars ($sp), starts 0x7FFFFFFF, grows <strong>DOWN ↓</strong></div>
                </div>
              </div>
            </section>

            {/* Box 11: MIPS Registers & Calling Conventions (Compact 6-row table) */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5 flex justify-between`}>
                <span>11. MIPS Registers & Calling</span>
                <span className="font-mono text-[7.5px] font-bold text-slate-700">32 General Regs</span>
              </h2>

              <div className="space-y-0.5">
                <table className="w-full text-[7.2px] border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-200 border-b border-slate-400">
                      <th className="p-0.5 text-left">Registers</th>
                      <th className="p-0.5 text-left">Numbers</th>
                      <th className="p-0.5 text-left">Purpose</th>
                      <th className="p-0.5 text-left">Preserved?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">$zero, $at</td>
                      <td className="p-0.5">$0, $1</td>
                      <td className="p-0.5">Const 0, Asm temp</td>
                      <td className="p-0.5 text-slate-400">N/A</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-emerald-50/40">
                      <td className="p-0.5 font-bold">$v0–$v1</td>
                      <td className="p-0.5">$2–$3</td>
                      <td className="p-0.5">Return & Syscall</td>
                      <td className="p-0.5 text-red-700 font-bold">Caller-saved</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-emerald-50/40">
                      <td className="p-0.5 font-bold">$a0–$a3</td>
                      <td className="p-0.5">$4–$7</td>
                      <td className="p-0.5">Arguments</td>
                      <td className="p-0.5 text-red-700 font-bold">Caller-saved</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-red-50/40">
                      <td className="p-0.5 font-bold">$t0–$t9</td>
                      <td className="p-0.5">$8–$15, $24–$25</td>
                      <td className="p-0.5">Temporaries</td>
                      <td className="p-0.5 text-red-700 font-bold">Caller-saved</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-blue-50/40">
                      <td className="p-0.5 font-bold">$s0–$s7</td>
                      <td className="p-0.5">$16–$23</td>
                      <td className="p-0.5">Saved registers</td>
                      <td className="p-0.5 text-blue-700 font-bold">Callee-saved</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">$gp, $sp, $fp</td>
                      <td className="p-0.5">$28, $29, $30</td>
                      <td className="p-0.5">Global/Stack/Frame ptr</td>
                      <td className="p-0.5 text-blue-700 font-bold">Callee-saved</td>
                    </tr>
                    <tr>
                      <td className="p-0.5 font-bold">$ra</td>
                      <td className="p-0.5">$31</td>
                      <td className="p-0.5">Return addr (jal)</td>
                      <td className="p-0.5 text-blue-700 font-bold">Callee-saved*</td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-[7.2px] font-mono bg-slate-100 p-0.5 border border-slate-200">
                  <div>• <strong>Caller-saved ($t, $a, $v):</strong> Overwritten by call. Caller saves to stack before <code>jal</code> if needed.</div>
                  <div>• <strong>Callee-saved ($s, $ra):</strong> Preserved across calls. Callee saves & restores in prologue/epilogue.</div>
                </div>

                <div className="text-[7.2px] font-mono bg-amber-50 p-0.5 border border-amber-300">
                  <span className="font-bold text-slate-900">PC vs $ra:</span>
                  <div>• <strong>PC:</strong> Address of NEXT instruction to execute (increments by 4).</div>
                  <div>• <strong>$ra:</strong> Address to return to after function completes (<code>jr $ra</code>).</div>
                </div>
              </div>
            </section>

            {/* Optional Custom Notes Box (If Enabled) */}
            {options.showCustomNotes && (
              <section className="border border-slate-800 rounded-xs p-1 bg-yellow-50/70 border-dashed">
                <h2 className="font-bold text-[8.5px] text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5">
                  Personal Class Notes
                </h2>
                <div className="text-[7.5px] font-mono whitespace-pre-wrap text-slate-900 leading-tight">
                  {options.customNotes || 'Add custom reminders here.'}
                </div>
              </section>
            )}

          </div>

        </div>

        {/* COMPACT FOOTER */}
        <footer className="mt-1 pt-0.5 border-t border-slate-400 flex justify-between items-center text-[7.5px] text-slate-500 font-mono">
          <div>CS2325 Midterm Reference Sheet · Strictly 1 Page Single-Sided · Reverse side blank</div>
          <div>Page 1 of 1</div>
        </footer>

      </div>
    </div>
  );
};
