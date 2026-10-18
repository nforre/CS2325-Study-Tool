import React from 'react';
import { SheetOptions } from '../types';

interface PrintableSheetProps {
  options: SheetOptions;
  zoom: number;
}

export const PrintableSheet: React.FC<PrintableSheetProps> = ({ options, zoom }) => {
  const isMono = options.printMode === 'monochrome';

  // Density classes for print
  const paddingClass = options.density === 'compact' ? 'p-1.5' : options.density === 'dense' ? 'p-2' : 'p-2.5';
  const textScale = options.density === 'compact' 
    ? 'text-[7.5px] leading-[9.5px]' 
    : options.density === 'dense' 
    ? 'text-[8px] leading-[10.2px]' 
    : 'text-[8.5px] leading-[11px]';
  const headerText = options.density === 'compact' ? 'text-[8.5px]' : 'text-[9px]';

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
              <span className="text-[8.5px] font-semibold text-slate-600 uppercase tracking-wider">
                Midterm Reference Sheet (Oct 19, 2026)
              </span>
            </div>
            <div className="text-[7.5px] text-slate-500 font-mono flex items-center gap-1.5">
              <span>8.5×11" Single-Sided Only</span>
              <span>·</span>
              <span>Calculator Allowed</span>
              <span>·</span>
              <span>Slides 002–009</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1">
              <span className="font-bold text-[8.5px] text-slate-700">NAME:</span>
              <span className="inline-block min-w-[130px] border-b border-slate-700 pb-0.5 font-semibold text-slate-900 text-[9.5px]">
                {options.studentName || '____________________________'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-[8.5px] text-slate-700">ID:</span>
              <span className="inline-block min-w-[80px] border-b border-slate-700 pb-0.5 font-semibold text-slate-900 text-[9.5px]">
                {options.studentId || '_______________'}
              </span>
            </div>
          </div>
        </header>

        {/* 3-COLUMN STRUCTURED HYBRID GRID */}
        <div className={`grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 sheet-columns gap-1.5 ${textScale}`}>
          
          {/* ================= COLUMN 1: NUMBER REPRESENTATION & ASSEMBLY ================= */}
          <div className="space-y-1.5">
            
            {/* Box 1: Bit Counting & States */}
            <section className="border border-slate-800 rounded-xs p-1 bg-slate-50/50">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5 flex justify-between`}>
                <span>1. Bit Counting & States</span>
                <span className="font-mono text-[7.5px] font-normal text-slate-600">2ⁿ ≥ N</span>
              </h2>
              <div className="space-y-0.5 font-mono">
                <div>• <strong>n bits = 2ⁿ patterns.</strong> States multiply: 3 lights × 4 modes = 12 combos.</div>
                <div>• <strong>Min bits = ⌈log₂ N⌉:</strong> Grades A-F (5) = 3b; 52 cards = 6b; 26 letters = 5b.</div>
                <div className="text-[7.2px] text-slate-700">
                  2ⁿ: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 (2¹⁰); 2¹²=4096; 2¹⁶=65,536; 2³¹=2,147,483,648; 2³²=4,294,967,296.
                </div>
              </div>
            </section>

            {/* Box 2: Horner's & Repeated Division */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5`}>
                2. Horner's Method & Division
              </h2>
              <div className="space-y-0.5 font-mono">
                <div>
                  <strong>Horner's (Base b → Dec):</strong> sum = leftmost bit; then <strong>sum = b×sum + digit</strong>.
                  <div className="text-slate-800 bg-slate-100 p-0.5 rounded-xs mt-0.5 text-[7.5px]">
                    • 1011010b = 90₁₀ · 1101₂ = (1×2+1=3) → (3×2+0=6) → (6×2+1=13₁₀)
                    <br />• 0x1AB9: 1; 1×16+10=26; 26×16+11=427; 427×16+9 = <strong>6841₁₀</strong>
                  </div>
                </div>

                <div>
                  <strong>Repeated Division (Dec → Base b):</strong> Read remainders <strong>Bottom-to-Top</strong>:
                  <div className="text-[7.5px] text-slate-800">
                    90 ÷ 2 → 45r0, 22r1, 11r0, 5r1, 2r1, 1r0, 0r1 → <strong>1011010b (0x5A)</strong>
                    <br />6841/16 → 427r9, 26r11(B), 1r10(A), 0r1 → <strong>0x1AB9</strong>
                  </div>
                </div>

                <div className="pt-0.5 border-t border-slate-200">
                  • <strong>Fractional:</strong> Mult by base, keep integer parts Top-to-Bottom. (0.625 × 2 = 1.25 → 0.25 × 2 = 0.5 → 0.5 × 2 = 1.0 → <strong>0.101₂</strong>).
                  <br />• <strong>Addition & Shifts:</strong> 1+1=0 c1, 1+1+1=1 c1. Hex: if ≥16 sub 16, c1. <strong>Shift left x bits = mult by 2ˣ</strong>. LSB 0 = even.
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

                <div className="bg-slate-100 p-0.5 border border-slate-200 text-[7.5px] font-mono">
                  <strong>Negation (~x + 1):</strong> Invert bits, +1. Shortcut: from right, keep up to 1st '1', flip left.
                  <br />• Hex shortcut: sub each digit from F, then +1: <strong>0x3DA6 → C259+1 = 0xC25A</strong>.
                  <br />• Value: MSB has weight <strong>-2ⁿ⁻¹</strong> (11001101₂ = -128+64+8+4+1 = -51₁₀).
                  <br />• <strong>Only 1 zero.</strong> Most negative (-128) has no positive twin (negates to self).
                </div>

                <div className="text-[7.5px] font-mono">
                  • <strong>Sign-extend:</strong> copy sign bit left (pad 0s if 0-7, Fs if 8-F).
                  <br />• <strong>Signed overflow:</strong> adding same-sign yields opposite sign (+ and - never overflow). 01010111(87) + 00101010(42) = 10000001 (overflow).
                </div>
              </div>
            </section>

            {/* Box 4: ASCII & Digit Trap */}
            <section className="border border-slate-800 rounded-xs p-1 bg-amber-50/50">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-amber-300 pb-0.5 mb-0.5 flex justify-between`}>
                <span>4. ASCII & Digit vs Value Trap</span>
                <span className="font-mono text-[7.5px] text-red-700 font-bold">EXAM TRAP</span>
              </h2>
              <div className="font-mono text-[7.5px] space-y-0.5">
                <div>• Char '0'=<strong>0x30 (48₁₀)</strong> ... '9'=<strong>0x39 (57₁₀)</strong> · <strong>'7'=0x37=55₁₀, value 7=0x07</strong>.</div>
                <div>• <strong>Formula:</strong> <code className="bg-slate-200 px-0.5 font-bold">value = char - '0' (or - 0x30)</code></div>
                <div>• 'A'=<strong>0x41 (65₁₀)</strong> · 'a'=<strong>0x61 (97₁₀)</strong> · Diff: <code className="font-bold">lower = upper + 0x20</code> (bit 5).</div>
                <div>• Space=0x20 · '\n'=0x0A (10₁₀) · Null '\0'=0x00. String "987" = <strong>39 38 37</strong> (+00 if asciiz).</div>
              </div>
            </section>

            {/* Box 5: MARS & Assembly Reading */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5 flex justify-between`}>
                <span>5. MARS & Assembly Directives</span>
                <span className="font-mono text-[7.5px] font-bold text-blue-700">Oct 14 Topics</span>
              </h2>
              <div className="space-y-0.5 font-mono text-[7.5px]">
                <div className="bg-slate-100 p-0.5 border border-slate-200">
                  <strong>Address vs Contents:</strong> Address is WHERE data is stored (0x10010000). Contents is WHAT is inside (0x0000002A).
                  <br /><strong>Register Name vs Value:</strong> $t0 is the NAME, 8 is NUMBER, 0x0A is VALUE.
                </div>
                <div>• <code>.data</code> (static data) · <code>.text</code> (code, 0x00400000) · <code>buf: .space 8</code>.</div>
                <div>• <code>.word</code> (4B, align 4) · <code>.half</code> (2B, align 2) · <code>.byte</code> (1B).</div>
                <div className="bg-yellow-100 p-0.5 border border-yellow-300 font-bold text-slate-950">
                  .ascii vs .asciiz String Size:
                  <div>• .ascii "Hi" → 2 bytes ('H','i' = 48 69) [NO null byte]</div>
                  <div>• .asciiz "Hi" → 3 bytes ('H','i','\0' = 48 69 00) [HAS 0x00 null byte!]</div>
                </div>
                <div>• <strong>Label = address:</strong> la gets address; lw gets contents.</div>
                <div>• <code>la $a0, msg</code> (loads addr) · <code>lw $t0, 0($s0)</code> (loads word from mem).</div>
                <div>• <code>sw $t0, 4($s0)</code> (stores word) · <code>syscall</code> ($v0=1 int, 4 str, 5 read, 10 exit).</div>
              </div>
            </section>

          </div>

          {/* ================= COLUMN 2: IEEE 754 & COMPUTER ORGANIZATION ================= */}
          <div className="space-y-1.5">
            
            {/* Box 6: IEEE 754 Single-Precision (binary32) */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5 flex justify-between`}>
                <span>6. IEEE 754 Float32</span>
                <span className="font-mono text-[7.5px] font-bold">Bias = 127</span>
              </h2>

              <div className="space-y-1 font-mono">
                {/* 32-bit field diagram */}
                <div className="border border-slate-700 text-center text-[7.2px] grid grid-cols-12 bg-slate-100">
                  <div className="col-span-1 bg-red-100 border-r border-slate-400 p-0.5">
                    <span className="font-bold text-red-700">S</span>
                    <div className="text-[6.5px]">1b</div>
                  </div>
                  <div className="col-span-4 bg-blue-100 border-r border-slate-400 p-0.5">
                    <span className="font-bold text-blue-700">Exp E</span> (8b)
                    <div className="text-[6.5px]">bits 30–23</div>
                  </div>
                  <div className="col-span-7 bg-emerald-100 p-0.5">
                    <span className="font-bold text-emerald-800">Fraction F</span> (23b)
                    <div className="text-[6.5px]">bits 22–0</div>
                  </div>
                </div>

                <div className="text-[7.5px] bg-white p-0.5 border border-slate-200">
                  <div><strong>Formula:</strong> (-1)ˢ × (1.F)₂ × 2^(E - 127)</div>
                  <div>• S=0 (pos), S=1 (neg) · <code className="font-bold">E = true_exp + 127</code> (true = E - 127).</div>
                  <div>• <strong>Float → Dec:</strong> 1.F, shift by exp, sum place values (.1=1/2, .01=1/4, .001=1/8).</div>
                </div>

                {/* Class Worked Examples */}
                <div className="bg-slate-50 p-0.5 border border-slate-300 text-[7.5px]">
                  <strong>Class Examples:</strong>
                  <div>• <strong>6.5</strong> = 110.1b = 1.101×2²; E=129=10000001; 0 10000001 1010..0 = <strong>0x40D00000</strong></div>
                  <div>• <strong>-0.75</strong> = -0.11b = -1.1×2⁻¹; E=126=01111110; 1 01111110 1000..0 = <strong>0xBF400000</strong></div>
                  <div>• <strong>-12.625</strong> = -1100.101b = -1.100101×2³; E=130; 1 10000010 100101..0 = <strong>0xC14A0000</strong></div>
                  <div>• 1.0 = 0x3F800000 · 0.0 = 0x00000000 · Normal: E=1..254 (-126..+127).</div>
                </div>

                {/* Special IEEE Values */}
                <table className="w-full text-[7px] border-collapse bg-white border border-slate-200">
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
              <div className="space-y-0.5 font-mono text-[7.5px]">
                <div className="bg-slate-100 p-0.5 border border-slate-200">
                  <strong>Pentium 4 Hierarchy (Speed/Cost ↓, Capacity ↑):</strong>
                  <div>• <strong>Registers:</strong> on chip, scratchpad, ~1 cycle (0.3 ns), 32 words.</div>
                  <div>• <strong>Cache:</strong> L1: 3 cycles (1 ns) 16K I + 16K D; L2: 20 cycles 256K; L3: 40 cycles 4M. (Hit=found, Miss=RAM).</div>
                  <div>• <strong>Main Memory (RAM):</strong> ~300 cycles (100 ns). <strong>Disk:</strong> ~30M cycles (10 ms).</div>
                </div>

                <div>
                  • <strong>CPU Parts:</strong> Datapath (regs+ALU+interconnect) & Control unit. Buses: address (1-way), data (2-way), control. Memory read: addr on bus → assert read → wait → read data → drop read.
                  <br />• <strong>Instruction Cycle:</strong> fetch (PC) → decode → fetch operands → execute → write back/store. Pipelining overlaps instrs.
                </div>

                <div className="pt-0.5 border-t border-slate-200">
                  • <strong>RISC (MIPS):</strong> few simple instrs, 1 cycle, fixed 4B size, operands in regs, only load/store touch mem, 1 mode (MIPS R4000: 94 instrs), 32 regs, hardwired.
                  <br />• <strong>CISC (x86):</strong> many complex instrs (VAX 303, x86 235), variable 1-15B, mem operands allowed in math, 11-22 modes, 8-16 regs, microcode.
                  <br />• <strong>Load-Operate-Store:</strong> <code>lw $t0, 0($s0) → add $t0, $t0, $t1 → sw $t0, 0($s0)</code>.
                  <br />• <strong>Operands:</strong> 3-addr (MIPS), 2-addr, 1-addr (accum), 0-addr (stack).
                </div>
              </div>
            </section>

            {/* Box 8: Addressing Modes & Displacement */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5`}>
                8. Addressing Modes & 16-Bit Offset
              </h2>
              <div className="space-y-0.5 font-mono text-[7.5px]">
                <div>1. <strong>Register:</strong> operand in register (<code>add $t2, $t1, $t0</code>).</div>
                <div>2. <strong>Immediate:</strong> constant in instr (<code>addi $t0, $t1, 5</code>).</div>
                <div>3. <strong>Base + displacement:</strong> EA = (base reg) + SignExt(offset16 in bytes). <code>lw $t1, 8($t0)</code>. If $t0=0x10010000, EA=0x10010008.</div>
                <div className="bg-slate-100 p-0.5 border border-slate-200">
                  <div className="text-red-700 font-bold">
                    Displacement Range (signed 16-bit): [-32,768 to +32,767 bytes]
                  </div>
                  <div>Negative offset OK: <code>-4($sp)</code>.</div>
                </div>
                <div>4. <strong>PC-relative:</strong> branches (PC + const). <strong>Pseudodirect:</strong> jumps (26b + upper PC).</div>
              </div>
            </section>

          </div>

          {/* ================= COLUMN 3: MEMORY ALIGNMENT, ENDIANNESS, REGISTERS ================= */}
          <div className="space-y-1.5">
            
            {/* Box 9: Endianness & Alignment */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5 flex justify-between`}>
                <span>9. Endianness & Alignment</span>
                <span className="font-mono text-[7.5px] font-bold">Addresses Increase →</span>
              </h2>

              <div className="space-y-0.5 font-mono text-[7.5px]">
                {/* Endianness Comparison */}
                <div>
                  <strong>0x12345678 at base address 100:</strong>
                  <table className="w-full text-[7px] border-collapse font-mono mt-0.5 text-center">
                    <thead>
                      <tr className="bg-slate-200 border-b border-slate-400">
                        <th className="p-0.5 text-left">Architecture</th>
                        <th className="p-0.5">100</th>
                        <th className="p-0.5">101</th>
                        <th className="p-0.5">102</th>
                        <th className="p-0.5">103</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-0.5 text-left font-bold">Big (MSB lowest addr)</td>
                        <td className="p-0.5 bg-amber-100 font-bold">12</td>
                        <td className="p-0.5">34</td>
                        <td className="p-0.5">56</td>
                        <td className="p-0.5 bg-blue-100 font-bold">78</td>
                      </tr>
                      <tr>
                        <td className="p-0.5 text-left font-bold">Little (LSB lowest addr)</td>
                        <td className="p-0.5 bg-blue-100 font-bold">78</td>
                        <td className="p-0.5">56</td>
                        <td className="p-0.5">34</td>
                        <td className="p-0.5 bg-amber-100 font-bold">12</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="text-[6.8px] text-slate-600 italic">
                    *Pentium: little. MIPS: big by default. Strings always stored in order.
                  </div>
                </div>

                {/* Alignment Rules & Gaps */}
                <div className="bg-slate-100 p-0.5 border border-slate-200">
                  <div>• Byte=8b (1B); half=16b (2B); word=32b (4B); dword=64b (8B).</div>
                  <div>• <strong>Aligned:</strong> half: addr%2=0; word: addr%4=0 (ends in 0,4,8,C; last 2 bits 00); dword: addr%8=0 (ends in 0 or 8).</div>
                  <div>• <strong>Padding Gap:</strong> 1B at 0x10010000, next is word → starts <strong>0x10010004 (gap 3B)</strong>. String of 5B at ...00 then word → ...08 (gap 3B).</div>
                  <div>• Misaligned lw/sw on MIPS → bus error/exception; lwl/lwr handle unaligned.</div>
                </div>
              </div>
            </section>

            {/* Box 10: Von Neumann vs Harvard & Segments */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5`}>
                10. Architecture & Virtual Memory Map
              </h2>
              <div className="space-y-0.5 font-mono text-[7.5px]">
                <div>• <strong>Von Neumann:</strong> ONE memory/bus for code & data (stored program, bottleneck). <strong>Harvard:</strong> separate memories/buses (fetch both at once). Modern CPUs: von Neumann to programmer; Harvard split L1 I/D-cache inside.</div>
                <div>• Same bits (e.g. 0x39383700) can be int, string, float, or instr depending on instruction used.</div>
                <div className="bg-slate-100 p-0.5 border border-slate-200">
                  <div className="font-bold text-slate-900">Virtual Memory Segments (Low → High):</div>
                  <div>1. <strong>Reserved:</strong> 0x00000000 – 0x003FFFFF</div>
                  <div>2. <strong>Text (.text):</strong> 0x00400000 (read-only machine code)</div>
                  <div>3. <strong>Static Data (.data):</strong> 0x10010000 (globals/strings)</div>
                  <div>4. <strong>Heap:</strong> Dynamic data (malloc), grows <strong>UP ↑</strong></div>
                  <div>5. <strong>Stack:</strong> Local vars, return addrs; grows <strong>DOWN ↓</strong> from $sp=0x7FFFEFFC</div>
                  <div>6. <strong>Kernel:</strong> 0x80000000+</div>
                </div>
              </div>
            </section>

            {/* Box 11: MIPS Registers & Calling Conventions */}
            <section className="border border-slate-800 rounded-xs p-1">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5 flex justify-between`}>
                <span>11. MIPS Registers & Calling Convention</span>
                <span className="font-mono text-[7.5px] font-bold text-slate-700">32 General Regs</span>
              </h2>

              <div className="space-y-0.5 font-mono">
                <table className="w-full text-[7px] border-collapse">
                  <thead>
                    <tr className="bg-slate-200 border-b border-slate-400">
                      <th className="p-0.5 text-left">Reg Name</th>
                      <th className="p-0.5 text-left">Num</th>
                      <th className="p-0.5 text-left">Role / Purpose</th>
                      <th className="p-0.5 text-left">Preserved?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">$zero, $at</td>
                      <td className="p-0.5">$0, $1</td>
                      <td className="p-0.5">Const 0, Assembler temp</td>
                      <td className="p-0.5 text-slate-400">N/A</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-emerald-50/40">
                      <td className="p-0.5 font-bold">$v0–$v1</td>
                      <td className="p-0.5">$2–$3</td>
                      <td className="p-0.5">Return values & Syscall code</td>
                      <td className="p-0.5 text-red-700 font-bold">Caller-saved</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-emerald-50/40">
                      <td className="p-0.5 font-bold">$a0–$a3</td>
                      <td className="p-0.5">$4–$7</td>
                      <td className="p-0.5">Function & syscall arguments</td>
                      <td className="p-0.5 text-red-700 font-bold">Caller-saved</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-red-50/40">
                      <td className="p-0.5 font-bold">$t0–$t9</td>
                      <td className="p-0.5">$8–15, $24–25</td>
                      <td className="p-0.5">Temporaries (clobbered by call)</td>
                      <td className="p-0.5 text-red-700 font-bold">Caller-saved</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-blue-50/40">
                      <td className="p-0.5 font-bold">$s0–$s7</td>
                      <td className="p-0.5">$16–$23</td>
                      <td className="p-0.5">Saved regs (must be preserved!)</td>
                      <td className="p-0.5 text-blue-700 font-bold">Callee-saved</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-0.5 font-bold">$gp, $sp, $fp</td>
                      <td className="p-0.5">$28, $29, $30</td>
                      <td className="p-0.5">Global, Stack, Frame ptr</td>
                      <td className="p-0.5 text-blue-700 font-bold">Callee-saved</td>
                    </tr>
                    <tr>
                      <td className="p-0.5 font-bold">$ra</td>
                      <td className="p-0.5">$31</td>
                      <td className="p-0.5">Return address (set by jal)</td>
                      <td className="p-0.5 text-blue-700 font-bold">Callee-saved*</td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-[7.2px] bg-slate-100 p-0.5 border border-slate-200">
                  • <strong>Caller-saved ($t, $a, $v):</strong> Caller saves on stack before <code>jal</code> if needed after.
                  <br />• <strong>Callee-saved ($s, $ra):</strong> Callee saves on stack at entry and restores before <code>jr $ra</code>.
                </div>

                <div className="text-[7.2px] bg-amber-50 p-0.5 border border-amber-300">
                  <span className="font-bold text-slate-900">PC vs $ra:</span>
                  <div>• <strong>PC:</strong> Address of NEXT instruction to execute (+4 each step).</div>
                  <div>• <strong>$ra:</strong> Address to return to after call (<code>jal</code> sets $ra=PC+4; <code>jr $ra</code> returns).</div>
                </div>
              </div>
            </section>

            {/* Box 12: Quick Checks & Exam Math */}
            <section className="border border-slate-800 rounded-xs p-1 bg-slate-50/50">
              <h2 className={`font-bold ${headerText} text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-0.5`}>
                12. Quick Checks & Exam Math
              </h2>
              <div className="space-y-0.5 font-mono text-[7.2px]">
                <div>• <strong>Instrs/words = 4B:</strong> Next instr = PC+4; array of N words = 4N bytes; element i at base + 4i.</div>
                <div>• <strong>Hex Addr Math:</strong> 0x10010000 + 12 = <strong>0x1001000C</strong>; + 16 = <strong>0x10010010</strong>.</div>
                <div>• <strong>Memory size from bits:</strong> n address bits → <strong>2ⁿ bytes</strong> (byte addressable). 16 bits = 64 KB; 20 bits = 1 MB; 32 bits = 4 GB.</div>
                <div>• <strong>Prefixes:</strong> KB = 2¹⁰, MB = 2²⁰, GB = 2³⁰ bytes.</div>
                <div>• <strong>MARS Chars in Data:</strong> word 0x6C6C6548 in little-endian = bytes 48 65 6C 6C = <strong>"Hell"</strong>.</div>
                <div>• <strong>Hex as Signed:</strong> 8-F = negative (2's comp). 0xFFFFFFFF = -1; 0x80000000 = -2,147,483,648.</div>
              </div>
            </section>

            {/* Optional Personal Notes Box */}
            {options.showCustomNotes && (
              <div className="border border-slate-800 rounded-xs p-1 bg-yellow-50/70 border-dashed">
                <div className="font-bold text-[7.5px] text-slate-900 uppercase border-b border-slate-300 pb-0.5">Personal Notes</div>
                <div className="text-[7px] font-mono whitespace-pre-wrap text-slate-900 leading-tight">
                  {options.customNotes || 'Add custom reminders here.'}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* COMPACT FOOTER */}
        <footer className="mt-1 pt-0.5 border-t border-slate-400 flex justify-between items-center text-[7px] text-slate-500 font-mono">
          <div>CS2325 Midterm Reference Sheet · Slides 002–009 Coverage · 1-Page Single-Sided Certified</div>
          <div>Page 1 of 1</div>
        </footer>

      </div>
    </div>
  );
};
