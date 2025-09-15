// App.jsx
import React, { useState, useEffect } from 'react';
import WordPicker from './components/WordPicker';
import BingoCard from './components/BingoCard';

const STORAGE_KEY = 'bingo_card_state';

function App() {
  const [bingoWords, setBingoWords] = useState(null);
  const [locked, setLocked] = useState(false); // <--- Locked state is here

  // On mount, check localStorage for saved bingo card and lock state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.bingoGrid)) {
          setBingoWords(parsed.bingoGrid);
          setLocked(parsed.locked); // Set locked state from localStorage
        }
      } catch {}
    }
  }, []);

  const handleWordsSelected = (words) => {
    setBingoWords(words);
    setLocked(false);
  };
  
  // New function to update locked state from BingoCard
  const handleLockStateChange = (newLockedState) => {
    setLocked(newLockedState);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {bingoWords ? (
        <BingoCard 
          words={bingoWords} 
          locked={locked} // <--- Pass locked state as a prop
          onLockStateChange={handleLockStateChange} // <--- Pass the state updater function
        />
      ) : (
        <WordPicker onWordsSelected={handleWordsSelected} />
      )}
    </div>
  );
}

export default App;