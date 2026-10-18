export interface SheetOptions {
  studentName: string;
  studentId: string;
  density: 'dense' | 'standard' | 'compact';
  printMode: 'monochrome' | 'subtle';
  showCustomNotes: boolean;
  customNotes: string;
}

export interface PracticeQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sheetReference: string;
}
