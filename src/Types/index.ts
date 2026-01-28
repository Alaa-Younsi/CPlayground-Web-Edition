export interface User {
  username: string;
  hash: string;
  gamesPlayed: number;
  gamesWon: number;
  quizzes: number;
  lastLogin: string;
}

export interface GameState {
  targetNumber?: number;
  tries?: number;
  tttBoard?: string[];
  turn?: 'player' | 'ai';
}

export interface TerminalLine {
  text: string;
  type: 'command' | 'output' | 'error' | 'success';
}