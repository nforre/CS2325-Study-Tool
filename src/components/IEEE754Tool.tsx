import React, { useState } from 'react';
import { Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

export const IEEE754Tool: React.FC = () => {
  const [decInput, setDecInput] = useState<string>('-12.625');
  const [hexInput, setHexInput] = useState<string>('C14A0000');
  const [mode, setMode] = useState<'decToHex' | 'hexToDec'>('decToHex');

  // Conversion: Dec -> Float32
  const floatVal = parseFloat(decInput);
  const isValidFloat = !isNaN(floatVal);

  const getFloat32Parts = (val: number) => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, val, false); // big-endian view

    const uint32 = view.getUint32(0, false);
    const binStr = uint32.toString(2).padStart(32, '0');
    const hexStr = uint32.toString(16).toUpperCase().padStart(8, '0');

    const sign = parseInt(binStr[0], 10);
    const expBits = binStr.slice(1, 9);
    const fracBits = binStr.slice(9);
    const biasedExp = parseInt(expBits, 2);
    const actualExp = biasedExp - 127;

    // Check special cases
    let specialType = 'Normal';
    if (biasedExp === 255 && fracBits === '0'.repeat(23)) {
      specialType = sign === 0 ? '+Infinity' : '-Infinity';
    } else if (biasedExp === 255 && fracBits !== '0'.repeat(23)) {
      specialType = 'NaN (Not a Number)';
    } else if (biasedExp === 0 && fracBits === '0'.repeat(23)) {
      specialType = sign === 0 ? '+0.0' : '-0.0';
    } else if (biasedExp === 0 && fracBits !== '0'.repeat(23)) {
      specialType = 'Denormalized';
    }

    // Step by step breakdown
    const absVal = Math.abs(val);
    const intPart = Math.floor(absVal);
    const fracPart = absVal - intPart;

    return {
      uint32,
      binStr,
      hexStr,
      sign,
      expBits,
      fracBits,
      biasedExp,
      actualExp,
      specialType,
      intPart,
      fracPart,
      absVal,
    };
  };

  // Conversion: Hex -> Float32
  const decodeHexToFloat = (hex: string) => {
    const clean = hex.trim().replace(/^0x/i, '');
    if (clean.length !== 8) return null;
    const uint32 = parseInt(clean, 16);
    if (isNaN(uint32)) return null;

    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, uint32, false);
    const dec = view.getFloat32(0, false);

    const binStr = uint32.toString(2).padStart(32, '0');
    const sign = parseInt(binStr[0], 10);
    const expBits = binStr.slice(1, 9);
    const fracBits = binStr.slice(9);
    const biasedExp = parseInt(expBits, 2);
    const actualExp = biasedExp - 127;

    return {
      dec,
      uint32,
      binStr,
      hexStr: clean.toUpperCase(),
      sign,
      expBits,
      fracBits,
      biasedExp,
      actualExp,
    };
  };

  const floatParts = isValidFloat ? getFloat32Parts(floatVal) : null;
  const hexParts = decodeHexToFloat(hexInput);

  const presets = [
    { label: '-12.625 (Class Example)', val: '-12.625' },
    { label: '0.15625 (Fraction only)', val: '0.15625' },
    { label: '+42.5', val: '42.5' },
    { label: '+1.0', val: '1.0' },
    { label: '-0.75', val: '-0.75' },
    { label: '0.0 (Zero)', val: '0.0' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-purple-700 rounded-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">IEEE 754 Single-Precision (binary32) Visualizer</h2>
            <p className="text-xs text-slate-500">
              Interactive 32-bit floating-point breakdown: Sign (1b) + Biased Exponent (8b, Bias=127) + Fraction (23b).
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-100 p-1 rounded-md text-xs font-medium">
          <button
            onClick={() => setMode('decToHex')}
            className={`px-3 py-1.5 rounded transition-colors ${
              mode === 'decToHex' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Decimal → IEEE 754 Hex
          </button>
          <button
            onClick={() => setMode('hexToDec')}
            className={`px-3 py-1.5 rounded transition-colors ${
              mode === 'hexToDec' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            IEEE 754 Hex → Decimal
          </button>
        </div>
      </div>

      {mode === 'decToHex' ? (
        <div className="space-y-6">
          {/* Input & Presets */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter Real Decimal Number (Positive or Negative):
              </label>
              <input
                type="text"
                value={decInput}
                onChange={(e) => setDecInput(e.target.value)}
                placeholder="e.g. -12.625 or 0.15625"
                className="w-full text-sm font-mono p-2.5 border border-slate-300 rounded bg-slate-50"
              />
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-600 mr-2">Quick Presets:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDecInput(p.val)}
                    className="text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded border border-slate-300"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {floatParts && (
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-6">
              {/* Bit Field Visual Map */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-sm font-bold text-slate-900">32-Bit Memory Representation (IEEE 754)</h3>
                  <span className="text-xs font-mono text-slate-500">Total 32 bits</span>
                </div>

                <div className="border border-slate-400 rounded overflow-hidden font-mono text-center text-xs">
                  <div className="grid grid-cols-12 text-slate-900 font-bold">
                    <div className="col-span-1 bg-red-100 border-r border-slate-300 p-2">
                      <div>Sign (S)</div>
                      <div className="text-[10px] text-red-800 font-normal">1 bit (bit 31)</div>
                      <div className="text-base text-red-700 mt-1">{floatParts.sign}</div>
                    </div>
                    <div className="col-span-4 bg-blue-100 border-r border-slate-300 p-2">
                      <div>Biased Exponent (E)</div>
                      <div className="text-[10px] text-blue-800 font-normal">8 bits (bits 30–23)</div>
                      <div className="text-sm tracking-widest text-blue-800 mt-1">{floatParts.expBits}</div>
                    </div>
                    <div className="col-span-7 bg-emerald-100 p-2">
                      <div>Fraction / Mantissa (F)</div>
                      <div className="text-[10px] text-emerald-800 font-normal">23 bits (bits 22–0)</div>
                      <div className="text-xs tracking-wider text-emerald-900 mt-1 truncate">{floatParts.fracBits}</div>
                    </div>
                  </div>
                </div>

                {/* Final Hex */}
                <div className="mt-4 p-3 bg-slate-900 text-white rounded flex items-center justify-between font-mono">
                  <div className="text-xs">
                    <span className="text-slate-400">Hexadecimal Representation:</span>
                    <span className="text-lg font-bold text-yellow-400 ml-3">0x{floatParts.hexStr}</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Type: <span className="text-emerald-400 font-semibold">{floatParts.specialType}</span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Walkthrough */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Step-by-Step Conversion Walkthrough for {decInput}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Step 1 & 2 */}
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
                    <div className="font-bold text-slate-900">Step 1: Sign Bit (S)</div>
                    <div className="text-slate-700">
                      • Value is {floatVal < 0 ? 'Negative' : 'Positive'} →{' '}
                      <strong className="text-red-700">S = {floatParts.sign}</strong>
                    </div>

                    <div className="font-bold text-slate-900 pt-2 border-t border-slate-200">
                      Step 2: Convert Magnitude to Binary
                    </div>
                    <div className="text-slate-700">
                      • Absolute value: {floatParts.absVal}
                      <div>• Integer part: {floatParts.intPart} = {floatParts.intPart.toString(2)}₂</div>
                      <div>• Fractional part: {floatParts.fracPart}</div>
                    </div>
                  </div>

                  {/* Step 3 & 4 */}
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
                    <div className="font-bold text-slate-900">Step 3: Normalize to 1.F × 2ᵉ</div>
                    <div className="text-slate-700">
                      <div>
                        • Normalized scientific: <strong>1.{floatParts.fracBits.slice(0, 8)}... × 2^{floatParts.actualExp}</strong>
                      </div>
                      <div>• Unbiased exponent (e) = <strong>{floatParts.actualExp}</strong></div>
                    </div>

                    <div className="font-bold text-slate-900 pt-2 border-t border-slate-200">
                      Step 4: Biased Exponent (E = e + 127)
                    </div>
                    <div className="text-slate-700">
                      <div>
                        • E = {floatParts.actualExp} + 127 = <strong>{floatParts.biasedExp}₁₀</strong>
                      </div>
                      <div>• 8-bit binary: <strong>{floatParts.expBits}₂</strong></div>
                    </div>
                  </div>
                </div>

                {/* Final Packing */}
                <div className="bg-blue-50/50 p-3 rounded border border-blue-200 text-xs font-mono space-y-1">
                  <div className="font-bold text-blue-900">Step 5: Assemble 32-bit pattern & Hex</div>
                  <div className="text-slate-800">
                    Pattern: [{floatParts.sign}] [{floatParts.expBits}] [{floatParts.fracBits}]
                  </div>
                  <div className="text-slate-800">
                    4-bit nibbles:{' '}
                    {floatParts.binStr.match(/.{1,4}/g)?.join(' ')} → <strong>0x{floatParts.hexStr}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Hex to Dec mode */
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Enter 8-digit Hexadecimal IEEE 754 Word:
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-500">0x</span>
              <input
                type="text"
                maxLength={8}
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value.toUpperCase())}
                placeholder="e.g. C14A0000"
                className="w-full text-sm font-mono p-2.5 border border-slate-300 rounded bg-slate-50 uppercase tracking-widest font-bold"
              />
            </div>
          </div>

          {hexParts ? (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-slate-900 text-white rounded flex justify-between items-center">
                <div>
                  <span className="text-slate-400">Decoded Real Decimal Value:</span>
                  <div className="text-xl font-bold text-yellow-400 mt-0.5">{hexParts.dec}</div>
                </div>
                <div className="text-right text-xs text-slate-300">
                  <div>Sign: {hexParts.sign === 0 ? '+ (Positive)' : '- (Negative)'}</div>
                  <div>Exp: {hexParts.actualExp} (Biased: {hexParts.biasedExp})</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900">Bit Breakdown:</div>
                <div className="grid grid-cols-12 border border-slate-300 text-center text-xs">
                  <div className="col-span-1 bg-red-100 p-1.5 border-r border-slate-300">
                    <span className="font-bold text-red-700">S: {hexParts.sign}</span>
                  </div>
                  <div className="col-span-4 bg-blue-100 p-1.5 border-r border-slate-300">
                    <span className="font-bold text-blue-700">E: {hexParts.expBits}</span>
                    <div className="text-[10px]">({hexParts.biasedExp} - 127 = {hexParts.actualExp})</div>
                  </div>
                  <div className="col-span-7 bg-emerald-100 p-1.5">
                    <span className="font-bold text-emerald-800">F: {hexParts.fracBits}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-red-600 font-mono">
              Please enter a valid 8-character hex code (e.g. C14A0000 or 3F800000).
            </div>
          )}
        </div>
      )}
    </div>
  );
};
