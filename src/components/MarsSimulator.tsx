import React, { useState } from 'react';
import { Terminal, HelpCircle, Check, Search } from 'lucide-react';

export const MarsSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'screenshot' | 'registers' | 'assembly'>('screenshot');
  const [regFilter, setRegFilter] = useState<'all' | 'caller' | 'callee'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mipsRegisters = [
    { name: '$zero', num: 0, role: 'Constant zero', saved: 'N/A', val: '0x00000000' },
    { name: '$at', num: 1, role: 'Assembler temporary', saved: 'N/A', val: '0x00000000' },
    { name: '$v0', num: 2, role: 'Function return & syscall code', saved: 'Caller', val: '0x00000004' },
    { name: '$v1', num: 3, role: 'Function return value 2', saved: 'Caller', val: '0x00000000' },
    { name: '$a0', num: 4, role: 'Function argument 1 / print arg', saved: 'Caller', val: '0x10010000' },
    { name: '$a1', num: 5, role: 'Function argument 2', saved: 'Caller', val: '0x00000005' },
    { name: '$a2', num: 6, role: 'Function argument 3', saved: 'Caller', val: '0x00000000' },
    { name: '$a3', num: 7, role: 'Function argument 4', saved: 'Caller', val: '0x00000000' },
    { name: '$t0', num: 8, role: 'Temporary register (caller-saved)', saved: 'Caller', val: '0x0000002A' },
    { name: '$t1', num: 9, role: 'Temporary register (caller-saved)', saved: 'Caller', val: '0x00000010' },
    { name: '$t2', num: 10, role: 'Temporary register (caller-saved)', saved: 'Caller', val: '0x00000000' },
    { name: '$t3', num: 11, role: 'Temporary register (caller-saved)', saved: 'Caller', val: '0x00000000' },
    { name: '$t4', num: 12, role: 'Temporary register (caller-saved)', saved: 'Caller', val: '0x00000000' },
    { name: '$t5', num: 13, role: 'Temporary register (caller-saved)', saved: 'Caller', val: '0x00000000' },
    { name: '$t6', num: 14, role: 'Temporary register (caller-saved)', saved: 'Caller', val: '0x00000000' },
    { name: '$t7', num: 15, role: 'Temporary register (caller-saved)', saved: 'Caller', val: '0x00000000' },
    { name: '$s0', num: 16, role: 'Saved register (callee-saved)', saved: 'Callee', val: '0x10010000' },
    { name: '$s1', num: 17, role: 'Saved register (callee-saved)', saved: 'Callee', val: '0x00000064' },
    { name: '$s2', num: 18, role: 'Saved register (callee-saved)', saved: 'Callee', val: '0x00000000' },
    { name: '$s3', num: 19, role: 'Saved register (callee-saved)', saved: 'Callee', val: '0x00000000' },
    { name: '$s4', num: 20, role: 'Saved register (callee-saved)', saved: 'Callee', val: '0x00000000' },
    { name: '$s5', num: 21, role: 'Saved register (callee-saved)', saved: 'Callee', val: '0x00000000' },
    { name: '$s6', num: 22, role: 'Saved register (callee-saved)', saved: 'Callee', val: '0x00000000' },
    { name: '$s7', num: 23, role: 'Saved register (callee-saved)', saved: 'Callee', val: '0x00000000' },
    { name: '$t8', num: 24, role: 'Temporary register (caller-saved)', saved: 'Caller', val: '0x00000000' },
    { name: '$t9', num: 25, role: 'Temporary register (caller-saved)', saved: 'Caller', val: '0x00000000' },
    { name: '$k0', num: 26, role: 'OS / Kernel exception reserved', saved: 'N/A', val: '0x00000000' },
    { name: '$k1', num: 27, role: 'OS / Kernel exception reserved', saved: 'N/A', val: '0x00000000' },
    { name: '$gp', num: 28, role: 'Global pointer (base of static data)', saved: 'Callee', val: '0x10008000' },
    { name: '$sp', num: 29, role: 'Stack pointer (top of stack)', saved: 'Callee', val: '0x7FFFE700' },
    { name: '$fp', num: 30, role: 'Frame pointer', saved: 'Callee', val: '0x00000000' },
    { name: '$ra', num: 31, role: 'Return address (set by jal)', saved: 'Callee', val: '0x00400018' },
  ];

  const filteredRegisters = mipsRegisters.filter((r) => {
    if (regFilter === 'caller' && r.saved !== 'Caller') return false;
    if (regFilter === 'callee' && r.saved !== 'Callee') return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        r.name.toLowerCase().includes(term) ||
        r.role.toLowerCase().includes(term) ||
        r.num.toString() === term
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 text-white rounded-md">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">MARS Simulator & MIPS Assembly Guide</h2>
            <p className="text-xs text-slate-500">
              Interactive MARS UI reading practice, caller vs callee-saved registers, PC vs $ra, and introductory assembly syntax.
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-md text-xs font-medium">
          <button
            onClick={() => setActiveTab('screenshot')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'screenshot' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MARS Simulator Breakdown
          </button>
          <button
            onClick={() => setActiveTab('registers')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'registers' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All 32 MIPS Registers
          </button>
          <button
            onClick={() => setActiveTab('assembly')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'assembly' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Intro Assembly Directives
          </button>
        </div>
      </div>

      {activeTab === 'screenshot' && (
        <div className="space-y-6">
          {/* Key Exam Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-300 space-y-2">
              <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                EXAM TRAP 1: Address vs Contents
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed font-mono">
                An <strong>address</strong> is WHERE data is stored in memory (e.g., <code className="bg-amber-100 px-1 font-bold">0x10010000</code>).
                <br />
                The <strong>content</strong> is the binary value residing inside that address (e.g., <code className="bg-amber-100 px-1 font-bold">0x0000002A</code> = 42).
                <br />
                <span className="font-bold underline">Never confuse the pointer with the data!</span>
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-300 space-y-2">
              <h4 className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-700" />
                EXAM TRAP 2: Register Name/Number vs Register Value
              </h4>
              <p className="text-xs text-blue-900 leading-relaxed font-mono">
                Register <strong>$8</strong> is named <code className="bg-blue-100 px-1 font-bold">$t0</code>.
                <br />
                Its current <strong>value</strong> might be <code className="bg-blue-100 px-1 font-bold">0x00000010</code> (16₁₀).
                <br />
                If the question asks "What is the content of register 8?", answer with its stored value, not the number 8!
              </p>
            </div>
          </div>

          {/* Authentic MARS Simulator Visual Window */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-white font-mono text-xs shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                </div>
                <span className="font-bold text-slate-300 ml-2">MARS 4.5 — Execution & Memory Simulator</span>
              </div>
              <span className="text-[11px] text-slate-400">Current PC: 0x00400008</span>
            </div>

            {/* Split layout: Text Segment on left, Registers & Data on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left: Text Segment (Code) */}
              <div className="lg:col-span-7 bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1 text-[11px]">
                  <span className="font-bold text-yellow-400">Text Segment (Instructions in Hex & Assembly)</span>
                  <span>Base: 0x00400000</span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="grid grid-cols-12 text-slate-500 border-b border-slate-800 pb-0.5 text-[10px]">
                    <span className="col-span-3">Address</span>
                    <span className="col-span-3">Machine Code</span>
                    <span className="col-span-6">Source Assembly</span>
                  </div>

                  <div className="grid grid-cols-12 py-1 px-1 bg-slate-900/60 rounded">
                    <span className="col-span-3 text-emerald-400">0x00400000</span>
                    <span className="col-span-3 text-purple-300">0x3c081001</span>
                    <span className="col-span-6 text-slate-200">lui $t0, 0x1001 (la $t0, array)</span>
                  </div>

                  <div className="grid grid-cols-12 py-1 px-1 bg-slate-900/60 rounded">
                    <span className="col-span-3 text-emerald-400">0x00400004</span>
                    <span className="col-span-3 text-purple-300">0x8d090000</span>
                    <span className="col-span-6 text-slate-200">lw $t1, 0($t0) # load word</span>
                  </div>

                  {/* Highlight current PC */}
                  <div className="grid grid-cols-12 py-1 px-1 bg-blue-900/50 border border-blue-500 rounded text-yellow-300">
                    <span className="col-span-3 font-bold">0x00400008 ◄ PC</span>
                    <span className="col-span-3 text-purple-200">0x01295020</span>
                    <span className="col-span-6 font-bold">add $t2, $t1, $t1 # double val</span>
                  </div>

                  <div className="grid grid-cols-12 py-1 px-1 bg-slate-900/60 rounded">
                    <span className="col-span-3 text-emerald-400">0x0040000C</span>
                    <span className="col-span-3 text-purple-300">0xac0a0004</span>
                    <span className="col-span-6 text-slate-200">sw $t2, 4($t0) # store word</span>
                  </div>

                  <div className="grid grid-cols-12 py-1 px-1 bg-slate-900/60 rounded">
                    <span className="col-span-3 text-emerald-400">0x00400010</span>
                    <span className="col-span-3 text-purple-300">0x03e00008</span>
                    <span className="col-span-6 text-slate-200">jr $ra # return from function</span>
                  </div>
                </div>
              </div>

              {/* Right: Data Segment & Registers */}
              <div className="lg:col-span-5 space-y-4">
                {/* Data Segment */}
                <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1 text-[11px]">
                    <span className="font-bold text-cyan-400">Data Segment (0x10010000)</span>
                    <span className="text-[10px] text-slate-500">Little-Endian Words</span>
                  </div>

                  <div className="text-[10.5px] space-y-1.5">
                    <div className="flex justify-between items-center bg-slate-900 p-1.5 rounded">
                      <span className="text-emerald-400">0x10010000:</span>
                      <span className="text-yellow-400 font-bold">0x0000002A</span>
                      <span className="text-slate-400">(42₁₀, .word)</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900 p-1.5 rounded">
                      <span className="text-emerald-400">0x10010004:</span>
                      <span className="text-yellow-400 font-bold">0x00000054</span>
                      <span className="text-slate-400">(84₁₀, .word)</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900 p-1.5 rounded">
                      <span className="text-emerald-400">0x10010008:</span>
                      <span className="text-cyan-300 font-bold">0x00694821</span>
                      <span className="text-slate-400">("Hi!", .asciiz)</span>
                    </div>
                  </div>
                </div>

                {/* Key Registers Snapshot */}
                <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1 text-[11px]">
                    <span className="font-bold text-emerald-400">Registers Snapshot</span>
                    <span className="text-[10px] text-slate-500">Name · Num · Value</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                    <div className="bg-slate-900 p-1.5 rounded flex justify-between">
                      <span className="text-slate-400">$t0 ($8):</span>
                      <span className="text-yellow-400 font-bold">0x10010000</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded flex justify-between">
                      <span className="text-slate-400">$t1 ($9):</span>
                      <span className="text-yellow-400 font-bold">0x0000002A</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded flex justify-between">
                      <span className="text-slate-400">PC:</span>
                      <span className="text-blue-400 font-bold">0x00400008</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded flex justify-between">
                      <span className="text-slate-400">$ra ($31):</span>
                      <span className="text-purple-400 font-bold">0x00400080</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {activeTab === 'registers' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">All 32 MIPS Architecture Registers</h3>
              <p className="text-xs text-slate-500">Caller-saved (saved by caller) vs Callee-saved (preserved by callee).</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name, num, role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-slate-50 w-48"
                />
              </div>

              <div className="flex bg-slate-100 p-1 rounded text-xs font-medium">
                <button
                  onClick={() => setRegFilter('all')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    regFilter === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setRegFilter('caller')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    regFilter === 'caller' ? 'bg-white text-red-700 shadow-sm font-bold' : 'text-slate-600'
                  }`}
                >
                  Caller-Saved
                </button>
                <button
                  onClick={() => setRegFilter('callee')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    regFilter === 'callee' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600'
                  }`}
                >
                  Callee-Saved
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                  <th className="p-2 text-left">Register Name</th>
                  <th className="p-2 text-left">Number</th>
                  <th className="p-2 text-left">Role / Standard Convention</th>
                  <th className="p-2 text-left">Preserved Across Calls?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRegisters.map((reg) => (
                  <tr key={reg.num} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2 font-bold text-slate-900">{reg.name}</td>
                    <td className="p-2 text-slate-600">${reg.num}</td>
                    <td className="p-2 text-slate-800">{reg.role}</td>
                    <td className="p-2">
                      {reg.saved === 'Caller' ? (
                        <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          Caller-Saved (No)
                        </span>
                      ) : reg.saved === 'Callee' ? (
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Callee-Saved (Yes)
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'assembly' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-900">Introductory Assembly Reading (Oct 14 Topics)</h3>
            <p className="text-xs text-slate-500">
              Understanding directives, memory allocation sizes, string null terminators, and address resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* Directives */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                Data & Code Directives
              </div>

              <div className="space-y-2">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="font-bold text-blue-700">.data</div>
                  <div className="text-slate-600">
                    Tells assembler subsequent statements belong in the Static Data segment (starting at 0x10010000).
                  </div>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="font-bold text-blue-700">.text</div>
                  <div className="text-slate-600">
                    Tells assembler subsequent lines are executable CPU instructions in the Text segment (starting at 0x00400000).
                  </div>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="font-bold text-blue-700">.word 10, 20, 30</div>
                  <div className="text-slate-600">
                    Allocates 4-byte (32-bit) words. Must be aligned to multiples of 4!
                  </div>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="font-bold text-blue-700">.byte 5, 'A'</div>
                  <div className="text-slate-600">
                    Allocates 1-byte integers or characters. Can sit at any address.
                  </div>
                </div>
              </div>
            </div>

            {/* String Directives & Labels */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                Strings & Label Resolution
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-yellow-50 rounded border border-yellow-300">
                  <div className="font-bold text-amber-900">.ascii vs .asciiz (CRITICAL EXAM ITEM):</div>
                  <div className="text-slate-800 mt-1 space-y-1">
                    <div>
                      • <code className="font-bold">str1: .ascii "Cat"</code>
                      <br />Takes <strong>3 bytes</strong>: ['C', 'a', 't']. <em>No null terminator.</em>
                    </div>
                    <div>
                      • <code className="font-bold">str2: .asciiz "Cat"</code>
                      <br />Takes <strong>4 bytes</strong>: ['C', 'a', 't', '\0']. <em>Appends 0x00 null byte at end!</em>
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="font-bold text-purple-700">Labels (Symbolic Addresses)</div>
                  <div className="text-slate-700">
                    A label like <code>msg:</code> is just a symbolic constant representing a <strong>memory address</strong>, NOT the value stored inside!
                  </div>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="font-bold text-emerald-700">la vs lw Instructions</div>
                  <div className="text-slate-700 space-y-0.5">
                    <div>• <code className="font-bold">la $a0, msg</code>: Loads the ADDRESS of msg into $a0.</div>
                    <div>• <code className="font-bold">lw $t0, msg</code>: Loads the 4-byte DATA VALUE stored at msg into $t0.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
