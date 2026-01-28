import React, { useState } from 'react';
import { ArrowLeft, Target, Grid3x3, RefreshCw } from 'lucide-react';
import type { User as UserType } from '../Types';

interface GamePanelProps {
  username: string;
  onBack: () => void;
}

export const GamePanel: React.FC<GamePanelProps> = ({ username, onBack }) => {
  const [selectedGame, setSelectedGame] = useState<'number' | 'tic-tac-toe' | null>(null);
  const [numberGame, setNumberGame] = useState(() => ({
    target: Math.floor(Math.random() * 100) + 1,
    guess: '',
    tries: 0,
    feedback: '',
    won: false
  }));
  const [tttGame, setTttGame] = useState({
    board: Array(9).fill(''),
    turn: 'player',
    gameOver: false,
    winner: '',
    playerScore: 0,
    aiScore: 0,
    gamesPlayed: 0
  });

  const handleNumberGuess = () => {
    const guess = parseInt(numberGame.guess);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      setNumberGame(prev => ({ ...prev, feedback: 'Enter a number between 1-100' }));
      return;
    }

    const newTries = numberGame.tries + 1;
    if (guess === numberGame.target) {
      setNumberGame(prev => ({ 
        ...prev, 
        tries: newTries,
        feedback: `🎉 Correct! It took you ${newTries} tries!`,
        won: true 
      }));
      // Update user stats in localStorage
      const users = JSON.parse(localStorage.getItem('cplayground_users') || '[]');
      const userIndex = users.findIndex((u: UserType) => u.username === username);
      if (userIndex !== -1) {
        users[userIndex].gamesPlayed++;
        users[userIndex].gamesWon++;
        localStorage.setItem('cplayground_users', JSON.stringify(users));
      }
    } else {
      const hint = guess < numberGame.target ? 'Higher!' : 'Lower!';
      setNumberGame(prev => ({ 
        ...prev, 
        tries: newTries,
        feedback: `${hint} Try again...` 
      }));
    }
  };

  const resetNumberGame = () => {
    setNumberGame({
      target: Math.floor(Math.random() * 100) + 1,
      guess: '',
      tries: 0,
      feedback: '',
      won: false
    });
  };

  const handleTttClick = (index: number) => {
    if (tttGame.gameOver || tttGame.board[index] !== '' || tttGame.turn !== 'player') return;

    const newBoard = [...tttGame.board];
    newBoard[index] = 'X';
    
    // Check for player win
    const win = checkWin(newBoard, 'X');
    if (win) {
      const newPlayerScore = tttGame.playerScore + 1;
      setTttGame(prev => ({
        ...prev,
        board: newBoard,
        gameOver: true,
        winner: 'player',
        playerScore: newPlayerScore
      }));
      updateUserStats(true);
      return;
    }

    // Check for draw
    if (!newBoard.includes('')) {
      setTttGame(prev => ({ ...prev, board: newBoard, gameOver: true, winner: 'draw' }));
      updateUserStats(false);
      return;
    }

    setTttGame(prev => ({ ...prev, board: newBoard, turn: 'ai' }));
    
    // AI move
    setTimeout(() => {
      aiMove(newBoard);
    }, 500);
  };

  const aiMove = (currentBoard: string[]) => {
    const emptyIndices = currentBoard.map((cell, idx) => cell === '' ? idx : -1).filter(idx => idx !== -1);
    if (emptyIndices.length === 0) return;

    // Simple AI: try to win, then block, then random
    const boardCopy = [...currentBoard];
    
    // Try to win
    for (const idx of emptyIndices) {
      boardCopy[idx] = 'O';
      if (checkWin(boardCopy, 'O')) {
        finishAIMove(boardCopy);
        return;
      }
      boardCopy[idx] = '';
    }

    // Try to block
    for (const idx of emptyIndices) {
      boardCopy[idx] = 'X';
      if (checkWin(boardCopy, 'X')) {
        boardCopy[idx] = 'O';
        finishAIMove(boardCopy);
        return;
      }
      boardCopy[idx] = '';
    }

    // Take center if available
    if (emptyIndices.includes(4)) {
      boardCopy[4] = 'O';
      finishAIMove(boardCopy);
      return;
    }

    // Random move (called only in event handler, not during render)
    const getRandomIndex = () => Math.floor(Math.random() * emptyIndices.length);
    const randomIndex = emptyIndices[getRandomIndex()];
    boardCopy[randomIndex] = 'O';
    finishAIMove(boardCopy);
  };

  const finishAIMove = (board: string[]) => {
    const win = checkWin(board, 'O');
    if (win) {
      const newAiScore = tttGame.aiScore + 1;
      setTttGame(prev => ({
        ...prev,
        board,
        gameOver: true,
        winner: 'ai',
        turn: 'ai',
        aiScore: newAiScore
      }));
      updateUserStats(false);
    } else if (!board.includes('')) {
      setTttGame(prev => ({ ...prev, board, gameOver: true, winner: 'draw', turn: 'player' }));
      updateUserStats(false);
    } else {
      setTttGame(prev => ({ ...prev, board, turn: 'player' }));
    }
  };

  const checkWin = (board: string[], player: string): boolean => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    return lines.some(([a, b, c]) => 
      board[a] === player && board[b] === player && board[c] === player
    );
  };

  const resetTttGame = () => {
    setTttGame({
      board: Array(9).fill(''),
      turn: 'player',
      gameOver: false,
      winner: '',
      playerScore: tttGame.playerScore,
      aiScore: tttGame.aiScore,
      gamesPlayed: tttGame.gamesPlayed
    });
  };

  const updateUserStats = (won: boolean) => {
    const users = JSON.parse(localStorage.getItem('cplayground_users') || '[]');
    const userIndex = users.findIndex((u: UserType) => u.username === username);
    if (userIndex !== -1) {
      users[userIndex].gamesPlayed++;
      if (won) users[userIndex].gamesWon++;
      localStorage.setItem('cplayground_users', JSON.stringify(users));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Editor
          </button>
          <h1 className="text-3xl font-bold font-mono">🎮 Games</h1>
          <div className="w-32"></div> {/* Spacer */}
        </div>

        {/* Game Selection */}
        {!selectedGame && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div 
              className="bg-blue-900/30 border border-blue-700 rounded-xl p-8 cursor-pointer hover:scale-105 transition-all hover:bg-blue-900/40"
              onClick={() => setSelectedGame('number')}
            >
              <div className="flex flex-col items-center">
                <Target className="w-16 h-16 mb-4 text-blue-400" />
                <h2 className="text-2xl font-bold mb-2">Number Guess</h2>
                <p className="text-gray-300 text-center mb-4">Guess the number between 1-100</p>
                <span className="px-4 py-1 bg-blue-600 rounded-full">Play</span>
              </div>
            </div>

            <div 
              className="bg-green-900/30 border border-green-700 rounded-xl p-8 cursor-pointer hover:scale-105 transition-all hover:bg-green-900/40"
              onClick={() => setSelectedGame('tic-tac-toe')}
            >
              <div className="flex flex-col items-center">
                <Grid3x3 className="w-16 h-16 mb-4 text-green-400" />
                <h2 className="text-2xl font-bold mb-2">Tic-Tac-Toe</h2>
                <p className="text-gray-300 text-center mb-4">Play against AI</p>
                <span className="px-4 py-1 bg-green-600 rounded-full">Play</span>
              </div>
            </div>
          </div>
        )}

        {/* Number Guessing Game */}
        {selectedGame === 'number' && (
          <div className="max-w-2xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">🔢 Number Guessing Game</h2>
              <button
                onClick={() => setSelectedGame(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                ← Back to Games
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-300 mb-2">I'm thinking of a number between 1 and 100</p>
                <p className="text-xl font-bold text-blue-400">Tries: {numberGame.tries}</p>
              </div>

              <div className="flex gap-4">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={numberGame.guess}
                  onChange={(e) => setNumberGame(prev => ({ ...prev, guess: e.target.value }))}
                  className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white"
                  placeholder="Enter your guess (1-100)"
                  disabled={numberGame.won}
                />
                <button
                  onClick={handleNumberGuess}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold disabled:opacity-50"
                  disabled={numberGame.won}
                >
                  Guess
                </button>
                <button
                  onClick={resetNumberGame}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </button>
              </div>

              {numberGame.feedback && (
                <div className={`p-4 rounded ${numberGame.won ? 'bg-green-900/50 border border-green-700' : 'bg-blue-900/50 border border-blue-700'}`}>
                  <p className="text-center font-semibold">{numberGame.feedback}</p>
                  {numberGame.won && (
                    <p className="text-center text-green-300 mt-2">
                      The number was {numberGame.target}!
                    </p>
                  )}
                </div>
              )}

              <div className="bg-gray-900/50 p-4 rounded">
                <h3 className="font-bold mb-2">🎯 Tips</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>• Start by guessing 50 (middle of range)</li>
                  <li>• Use binary search strategy</li>
                  <li>• Keep track of your previous guesses</li>
                  <li>• Try to beat your personal best!</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tic-Tac-Toe Game */}
        {selectedGame === 'tic-tac-toe' && (
          <div className="max-w-2xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">❌⭕ Tic-Tac-Toe</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  ← Back to Games
                </button>
                <button
                  onClick={resetTttGame}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Game
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Score Board */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-900/30 p-4 rounded">
                  <p className="text-gray-400">Player (X)</p>
                  <p className="text-3xl font-bold text-blue-400">{tttGame.playerScore}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="text-gray-400">Draws</p>
                  <p className="text-3xl font-bold text-gray-400">
                    {tttGame.gamesPlayed - tttGame.playerScore - tttGame.aiScore}
                  </p>
                </div>
                <div className="bg-red-900/30 p-4 rounded">
                  <p className="text-gray-400">AI (O)</p>
                  <p className="text-3xl font-bold text-red-400">{tttGame.aiScore}</p>
                </div>
              </div>

              {/* Game Status */}
              <div className="text-center">
                {tttGame.gameOver ? (
                  <div className={`p-4 rounded ${tttGame.winner === 'player' ? 'bg-green-900/50' : tttGame.winner === 'ai' ? 'bg-red-900/50' : 'bg-gray-800'}`}>
                    <p className="text-xl font-bold">
                      {tttGame.winner === 'player' ? '🎉 You Win!' : 
                       tttGame.winner === 'ai' ? '🤖 AI Wins!' : '🤝 Draw!'}
                    </p>
                  </div>
                ) : (
                  <p className="text-lg">
                    {tttGame.turn === 'player' ? 'Your turn (X)' : 'AI thinking...'}
                  </p>
                )}
              </div>

              {/* Game Board */}
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {tttGame.board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => handleTttClick(index)}
                    className={`w-24 h-24 text-4xl font-bold rounded-lg border-2 flex items-center justify-center
                      ${cell === 'X' ? 'bg-blue-900/30 border-blue-700 text-blue-400' : 
                        cell === 'O' ? 'bg-red-900/30 border-red-700 text-red-400' : 
                        'bg-gray-900 border-gray-700 hover:bg-gray-800'}
                      ${tttGame.gameOver || tttGame.turn !== 'player' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={cell !== '' || tttGame.gameOver || tttGame.turn !== 'player'}
                  >
                    {cell || ''}
                  </button>
                ))}
              </div>

              {/* Game Instructions */}
              <div className="bg-gray-900/50 p-4 rounded">
                <h3 className="font-bold mb-2">📋 How to Play</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>• Click on an empty square to place your X</li>
                  <li>• Get three X's in a row to win (horizontal, vertical, or diagonal)</li>
                  <li>• The AI will automatically play after your move</li>
                  <li>• Try different strategies to beat the AI!</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};