import React, { useState } from 'react';
import { Layers, ArrowUpDown, Database, AlertCircle } from 'lucide-react';

export const EndiannessTool: React.FC = () => {
  const [hexWord, setHexWord] = useState<string>('12345678');
  const [baseAddr, setBaseAddr] = useState<string>('10010000');

  const cleanHex = hexWord.replace(/^0x/i, '').padStart(8, '0').slice(0, 8).toUpperCase();
  const baseNum = parseInt(baseAddr.replace(/^0x/i, ''), 16) || 0x10010000;

  // Split word into 4 bytes: MSB to LSB
  const b0 = cleanHex.slice(0, 2); // MSB
  const b1 = cleanHex.slice(2, 4);
  const b2 = cleanHex.slice(4, 6);
  const b3 = cleanHex.slice(6, 8); // LSB

  // Format hex address
  const fmtAddr = (offset: number) => '0x' + (baseNum + offset).toString(16).toUpperCase();

  // Alignment test simulation items
  const [items, setItems] = useState<Array<{ type: 'byte' | 'half' | 'word'; name: string; val: string }>>([
    { type: 'byte', name: 'char1', val: "'A' (1B)" },
    { type: 'word', name: 'num1', val: '42 (4B)' },
    { type: 'half', name: 'half1', val: '100 (2B)' },
    { type: 'word', name: 'num2', val: '999 (4B)' },
  ]);

  // Compute addresses and gaps
  const computeMemoryLayout = () => {
    let currentAddr = baseNum;
    const layout: Array<{
      name: string;
      type: string;
      startAddr: number;
      size: number;
      gapBefore: number;
    }> = [];

    items.forEach((item) => {
      const size = item.type === 'byte' ? 1 : item.type === 'half' ? 2 : 4;
      const align = size;
      const rem = currentAddr % align;
      const gap = rem === 0 ? 0 : align - rem;
      const startAddr = currentAddr + gap;
      layout.push({
        name: item.name,
        type: item.type,
        startAddr,
        size,
        gapBefore: gap,
      });
      currentAddr = startAddr + size;
    });

    return { layout, totalBytes: currentAddr - baseNum };
  };

  const { layout, totalBytes } = computeMemoryLayout();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Memory Organization, Endianness & Alignment</h2>
            <p className="text-xs text-slate-500">
              Arrange bytes with increasing memory addresses, calculate alignment padding gaps, and review virtual memory maps.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: Endianness Byte Arranger */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-emerald-600" />
              Big-Endian vs Little-Endian Visualizer
            </h3>
            <span className="text-xs font-mono text-slate-500">Addresses Increase →</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">32-Bit Hex Word</label>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span>0x</span>
                <input
                  type="text"
                  maxLength={8}
                  value={hexWord}
                  onChange={(e) => setHexWord(e.target.value.toUpperCase())}
                  className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-bold uppercase tracking-widest"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Base Memory Address</label>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span>0x</span>
                <input
                  type="text"
                  maxLength={8}
                  value={baseAddr}
                  onChange={(e) => setBaseAddr(e.target.value.toUpperCase())}
                  className="w-full p-2 border border-slate-300 rounded bg-slate-50 uppercase font-mono"
                />
              </div>
            </div>
          </div>

          {/* Byte Breakdown */}
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-xs flex justify-around text-center">
            <div>
              <span className="text-[10px] text-slate-500">MSB (Byte 3)</span>
              <div className="font-bold text-amber-700 text-sm">0x{b0}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Byte 2</span>
              <div className="font-bold text-slate-700 text-sm">0x{b1}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">Byte 1</span>
              <div className="font-bold text-slate-700 text-sm">0x{b2}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500">LSB (Byte 0)</span>
              <div className="font-bold text-blue-700 text-sm">0x{b3}</div>
            </div>
          </div>

          {/* Side by side comparison table */}
          <div className="space-y-3 font-mono text-xs">
            {/* Big Endian */}
            <div className="p-3 bg-amber-50/50 rounded border border-amber-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-amber-900">Big-Endian ("Big End / MSB First"):</span>
                <span className="text-[10px] text-amber-700">Network / SPARC / IBM</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center mt-2">
                <div className="p-2 bg-white rounded border border-amber-300">
                  <div className="text-[10px] text-slate-500">{fmtAddr(0)}</div>
                  <div className="font-bold text-amber-700 text-base mt-0.5">{b0}</div>
                  <div className="text-[9px] text-slate-600">MSB</div>
                </div>
                <div className="p-2 bg-white rounded border border-amber-300">
                  <div className="text-[10px] text-slate-500">{fmtAddr(1)}</div>
                  <div className="font-bold text-slate-800 text-base mt-0.5">{b1}</div>
                </div>
                <div className="p-2 bg-white rounded border border-amber-300">
                  <div className="text-[10px] text-slate-500">{fmtAddr(2)}</div>
                  <div className="font-bold text-slate-800 text-base mt-0.5">{b2}</div>
                </div>
                <div className="p-2 bg-white rounded border border-amber-300">
                  <div className="text-[10px] text-slate-500">{fmtAddr(3)}</div>
                  <div className="font-bold text-blue-700 text-base mt-0.5">{b3}</div>
                  <div className="text-[9px] text-slate-600">LSB</div>
                </div>
              </div>
            </div>

            {/* Little Endian */}
            <div className="p-3 bg-blue-50/50 rounded border border-blue-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-blue-900">Little-Endian ("Little End / LSB First"):</span>
                <span className="text-[10px] text-blue-700 font-bold">MARS MIPS & x86 Default</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center mt-2">
                <div className="p-2 bg-white rounded border border-blue-300">
                  <div className="text-[10px] text-slate-500">{fmtAddr(0)}</div>
                  <div className="font-bold text-blue-700 text-base mt-0.5">{b3}</div>
                  <div className="text-[9px] text-slate-600">LSB</div>
                </div>
                <div className="p-2 bg-white rounded border border-blue-300">
                  <div className="text-[10px] text-slate-500">{fmtAddr(1)}</div>
                  <div className="font-bold text-slate-800 text-base mt-0.5">{b2}</div>
                </div>
                <div className="p-2 bg-white rounded border border-blue-300">
                  <div className="text-[10px] text-slate-500">{fmtAddr(2)}</div>
                  <div className="font-bold text-slate-800 text-base mt-0.5">{b1}</div>
                </div>
                <div className="p-2 bg-white rounded border border-blue-300">
                  <div className="text-[10px] text-slate-500">{fmtAddr(3)}</div>
                  <div className="font-bold text-amber-700 text-base mt-0.5">{b0}</div>
                  <div className="text-[9px] text-slate-600">MSB</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Alignment & Padding Gaps Calculator */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-600" />
              Byte Alignment & Padding Gaps Calculator
            </h3>
            <span className="text-xs font-mono text-slate-500">Multiple of 1, 2, 4</span>
          </div>

          <div className="text-xs text-slate-600">
            In MIPS, words (4 bytes) must be stored at addresses divisible by 4 (last 2 bits = 00).
            Halfwords (2 bytes) must be stored at even addresses (last bit = 0). Gaps are inserted as padding.
          </div>

          {/* Allocation Table */}
          <div className="space-y-2 font-mono text-xs">
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 mb-1">Variable Declaration Order:</div>
              {layout.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  {item.gapBefore > 0 && (
                    <div className="p-1.5 bg-red-50 text-red-700 border border-red-200 rounded flex justify-between items-center text-[11px]">
                      <span>▲ Padding Gap (Wasted Space):</span>
                      <span className="font-bold">{item.gapBefore} byte(s) skipped</span>
                    </div>
                  )}
                  <div className="p-2 bg-white border border-slate-200 rounded flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900">{item.name}</span>{' '}
                      <span className="text-slate-500">({item.type.toUpperCase()}, {item.size}B)</span>
                    </div>
                    <div className="text-blue-700 font-bold">
                      0x{item.startAddr.toString(16).toUpperCase()} – 0x
                      {(item.startAddr + item.size - 1).toString(16).toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-slate-900 text-white rounded flex justify-between items-center text-xs">
              <span>Total Memory Occupied (Including Gaps):</span>
              <span className="font-bold text-yellow-400">{totalBytes} bytes</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: Virtual Address Space vs Physical RAM & Memory Segments */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          Virtual Memory Layout & Architecture Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MIPS Memory Segments Diagram */}
          <div className="space-y-2 font-mono text-xs">
            <div className="font-bold text-slate-900">MIPS 32-Bit Virtual Memory Segments:</div>
            
            <div className="border border-slate-300 rounded overflow-hidden">
              {/* Stack */}
              <div className="p-2 bg-red-100 border-b border-slate-300 flex justify-between items-center">
                <div>
                  <span className="font-bold text-red-900">Stack (Local Variables, $sp)</span>
                  <div className="text-[10px] text-red-700">Grows DOWNWARDS ↓ towards lower addresses</div>
                </div>
                <span className="font-bold text-slate-700">0x7FFFFFFF</span>
              </div>

              {/* Dynamic / Free Space */}
              <div className="p-3 bg-slate-100 text-center text-slate-500 text-[11px] italic border-b border-slate-300">
                ↑ Dynamic growth space between Stack and Heap ↓
              </div>

              {/* Heap */}
              <div className="p-2 bg-emerald-100 border-b border-slate-300 flex justify-between items-center">
                <div>
                  <span className="font-bold text-emerald-900">Heap (Dynamic Data, malloc)</span>
                  <div className="text-[10px] text-emerald-700">Grows UPWARDS ↑ towards higher addresses</div>
                </div>
                <span className="font-bold text-slate-700">sbrk</span>
              </div>

              {/* Static Data */}
              <div className="p-2 bg-blue-100 border-b border-slate-300 flex justify-between items-center">
                <div>
                  <span className="font-bold text-blue-900">Static Data (.data, globals, strings)</span>
                  <div className="text-[10px] text-blue-700">Base addressed via $gp (0x10008000)</div>
                </div>
                <span className="font-bold text-slate-700">0x10010000</span>
              </div>

              {/* Text */}
              <div className="p-2 bg-amber-100 border-b border-slate-300 flex justify-between items-center">
                <div>
                  <span className="font-bold text-amber-900">Text Segment (.text, Machine Code)</span>
                  <div className="text-[10px] text-amber-700">Read-only instructions</div>
                </div>
                <span className="font-bold text-slate-700">0x00400000</span>
              </div>

              {/* Reserved */}
              <div className="p-2 bg-slate-200 flex justify-between items-center text-slate-600">
                <div>
                  <span className="font-bold">Reserved / OS Exception Handlers</span>
                </div>
                <span className="font-bold text-slate-700">0x00000000</span>
              </div>
            </div>
          </div>

          {/* Architecture Comparisons */}
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900">Von Neumann vs Harvard:</span>
              <p className="text-slate-700 leading-relaxed">
                • <strong>Von Neumann Architecture:</strong> Uses a single shared physical memory and bus for both instructions and data. Offers flexible memory allocation, but suffers from the <em>Von Neumann Bottleneck</em> (cannot fetch an instruction and read/write data in the same cycle).
              </p>
              <p className="text-slate-700 leading-relaxed">
                • <strong>Harvard Architecture:</strong> Uses physically separate memories and buses for instructions and data. Allows simultaneous instruction fetch and data access, but code and data spaces cannot dynamically borrow capacity from each other.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900">Virtual Address Space vs Physical RAM:</span>
              <p className="text-slate-700 leading-relaxed">
                • <strong>Virtual Memory:</strong> An abstraction provided by the OS and Memory Management Unit (MMU). Each process sees a private, continuous 4 GB address space, preventing programs from corrupting each other.
              </p>
              <p className="text-slate-700 leading-relaxed">
                • <strong>Physical RAM:</strong> The actual hardware memory chips. Virtual pages are mapped dynamically to physical frames in RAM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
