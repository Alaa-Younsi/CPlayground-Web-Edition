import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Initialize localStorage with sample users if empty
if (!localStorage.getItem('cplayground_users')) {
  localStorage.setItem('cplayground_users', JSON.stringify([
    {
      username: 'admin',
      hash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // 'admin' sha256
      gamesPlayed: 10,
      gamesWon: 7,
      quizzes: 5,
      lastLogin: new Date().toISOString()
    }
  ]));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
