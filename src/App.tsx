import React, { useState } from 'react';
import { SheetOptions } from './types';
import { PrintableSheet } from './components/PrintableSheet';
import { ConverterTool } from './components/ConverterTool';
import { IEEE754Tool } from './components/IEEE754Tool';
import { EndiannessTool } from './components/EndiannessTool';
import { MarsSimulator } from './components/MarsSimulator';
import { PracticeDrill } from './components/PracticeDrill';
import {
  Printer,
  FileText,
  Sliders,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Edit3,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sheet' | 'converter' | 'ieee754' | 'memory' | 'mars' | 'practice'>('sheet');
  const [zoom, setZoom] = useState<number>(1.0);

  const [options, setOptions] = useState<SheetOptions>({
    studentName: '',
    studentId: '',
    density: 'dense',
    printMode: 'monochrome',
    printScale: 100,
    showCustomNotes: false,
    customNotes: 'Prof reminder: Review Horner method steps and little-endian word address order before starting.',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      
      {/* STRICT TOP BAR CONTRACT (Anti-slop 3-zone contract) */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('sheet')}
            className="text-base font-extrabold tracking-tight text-slate-950 whitespace-nowrap shrink-0 hover:text-blue-700 transition-colors flex items-center gap-2 text-left"
          >
            <span>CS2325 Architecture Cheat Sheet</span>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('sheet')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'sheet' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent'
              }`}
            >
              Printable Sheet (1-Page)
            </button>
            <button
              onClick={() => setActiveTab('converter')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'converter' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent'
              }`}
            >
              Radix & 2's Comp
            </button>
            <button
              onClick={() => setActiveTab('ieee754')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'ieee754' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent'
              }`}
            >
              IEEE 754 Float32
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'memory' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent'
              }`}
            >
              Endianness & Memory
            </button>
            <button
              onClick={() => setActiveTab('mars')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'mars' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent'
              }`}
            >
              MARS & Registers
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'practice' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent'
              }`}
            >
              Practice Drill
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet (1-Page Letter)</span>
            </button>
          </div>

        </div>
      </header>

      {/* SUB-TOOLBAR FOR THE PRINTABLE SHEET (Only when activeTab === 'sheet') */}
      {activeTab === 'sheet' && (
        <section className="no-print bg-white border-b border-slate-200 py-3 px-4 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
            
            {/* Left: Verification Badge & Student Name / ID Inputs */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified 8.5×11" Single-Sided Sheet</span>
              </div>

              {/* Editable Name & ID */}
              <div className="flex items-center gap-2">
                <label className="text-slate-600 font-medium">Your Name:</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={options.studentName}
                  onChange={(e) => setOptions({ ...options, studentName: e.target.value })}
                  className="px-2 py-1 border border-slate-300 rounded text-xs w-36 font-mono bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-slate-600 font-medium">Student ID:</label>
                <input
                  type="text"
                  placeholder="e.g. A04991234"
                  value={options.studentId}
                  onChange={(e) => setOptions({ ...options, studentId: e.target.value })}
                  className="px-2 py-1 border border-slate-300 rounded text-xs w-28 font-mono bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Right: Print Controls (Density, Ink Mode, Zoom) */}
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Density */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Density:</span>
                <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                  <button
                    onClick={() => setOptions({ ...options, density: 'compact' })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      options.density === 'compact' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    Ultra-Dense
                  </button>
                  <button
                    onClick={() => setOptions({ ...options, density: 'dense' })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      options.density === 'dense' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    Standard
                  </button>
                </div>
              </div>

              {/* Ink Mode */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Print Style:</span>
                <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                  <button
                    onClick={() => setOptions({ ...options, printMode: 'monochrome' })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      options.printMode === 'monochrome' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    Laser Ink-Saver
                  </button>
                  <button
                    onClick={() => setOptions({ ...options, printMode: 'subtle' })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      options.printMode === 'subtle' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    Color Accents
                  </button>
                </div>
              </div>

              {/* Print Scale / Margin Fit */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Print Scale:</span>
                <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
                  <button
                    onClick={() => setOptions({ ...options, printScale: 100 })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      options.printScale === 100 ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    100%
                  </button>
                  <button
                    onClick={() => setOptions({ ...options, printScale: 94 })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      options.printScale === 94 ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    94% (Safe Fit)
                  </button>
                </div>
              </div>

              {/* Custom Notes Toggle */}
              <button
                onClick={() => setOptions({ ...options, showCustomNotes: !options.showCustomNotes })}
                className={`px-2.5 py-1 rounded text-[11px] font-medium border flex items-center gap-1 transition-colors ${
                  options.showCustomNotes
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>{options.showCustomNotes ? 'Notes Enabled' : '+ Add Notes'}</span>
              </button>

              {/* Screen Zoom */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
                <button
                  onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.1).toFixed(1)))}
                  className="p-1 hover:bg-white rounded text-slate-600"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[10px] w-9 text-center text-slate-700">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(1)))}
                  className="p-1 hover:bg-white rounded text-slate-600"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Expanded custom notes editor */}
          {options.showCustomNotes && (
            <div className="max-w-7xl mx-auto mt-2.5 pt-2.5 border-t border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-3">
              <span className="font-semibold text-slate-700 shrink-0">Personal Note Slot:</span>
              <input
                type="text"
                value={options.customNotes}
                onChange={(e) => setOptions({ ...options, customNotes: e.target.value })}
                placeholder="Type any custom reminder, instructor tip, or formula to appear at the bottom right of the reference sheet..."
                className="w-full text-xs font-mono p-1.5 border border-amber-300 rounded bg-amber-50/50"
              />
            </div>
          )}
        </section>
      )}

      {/* MAIN VIEW AREA */}
      <main className="flex-1 py-6 px-2 sm:px-4 lg:px-8">
        
        {/* TAB 1: Printable Reference Sheet */}
        {activeTab === 'sheet' && (
          <div className="space-y-4">
            {/* Quick print helper banner */}
            <div className="no-print max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Exam Preparation Notice:</strong> CS2325 allows 1 sheet (8.5×11 inches), single-sided only. The reverse side must be blank. You may write or print on it. Use the blue button above or press <kbd className="bg-white px-1 border border-blue-300 rounded font-mono">Ctrl+P</kbd> / <kbd className="bg-white px-1 border border-blue-300 rounded font-mono">Cmd+P</kbd>.
                </span>
              </div>
              <button
                onClick={handlePrint}
                className="ml-3 shrink-0 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-xs text-[11px]"
              >
                Print Now
              </button>
            </div>

            {/* The Actual Sheet */}
            {options.printScale !== 100 && (
              <style>{`
                @media print {
                  .printable-sheet {
                    transform: scale(${options.printScale / 100}) !important;
                    transform-origin: top center !important;
                  }
                }
              `}</style>
            )}
            <PrintableSheet options={options} zoom={zoom} />
          </div>
        )}

        {/* TAB 2: Radix & 2's Comp Converter */}
        {activeTab === 'converter' && <ConverterTool />}

        {/* TAB 3: IEEE 754 Visualizer */}
        {activeTab === 'ieee754' && <IEEE754Tool />}

        { activeTab === 'memory' && <EndiannessTool />}

        {/* TAB 5: MARS Simulator & Registers */}
        {activeTab === 'mars' && <MarsSimulator />}

        {/* TAB 6: Practice Drill */}
        {activeTab === 'practice' && <PracticeDrill />}

      </main>

      {/* FOOTER */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            CS2325 Computer Organization Midterm Review Suite · Texas State University · Exam Date: October 19, 2026
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-mono text-[11px]">
            <span>1-Page Letter Compliant</span>
            <span>·</span>
            <span>Single-Sided Certified</span>
            <span>·</span>
            <span>Calculator Allowed</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
