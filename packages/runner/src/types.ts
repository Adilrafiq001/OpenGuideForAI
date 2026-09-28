export type RunnerMessage = 
  | { type: 'INIT' }
  | { type: 'EXECUTE'; code: string; id: string };

export type WorkerMessage = 
  | { type: 'READY' }
  | { type: 'RESULT'; data: any; error?: string; id: string }
  | { type: 'STDOUT'; text: string }
  | { type: 'STDERR'; text: string };
