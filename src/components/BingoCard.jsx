import React, { useState, useRef, useEffect } from 'react';

const CENTER_INDEX = 4;
const CENTER_TILE = 'משבצת חינם מבדלי';
const STORAGE_KEY = 'bingo_card_state';

// Accept `locked` and `onLockStateChange` as props
const BingoCard = ({ words, locked, onLockStateChange }) => {
  const getInitialGrid = () => {
    if (words.length === 9 && words[CENTER_INDEX] === CENTER_TILE) {
      return words;
    }
    const arr = [...words];
    arr.splice(CENTER_INDEX, 0, CENTER_TILE);
    return arr;
  };

  const [bingoGrid, setBingoGrid] = useState(getInitialGrid());
  // No longer a local state: const [locked, setLocked] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [touchDragIndex, setTouchDragIndex] = useState(null);
  const [marked, setMarked] = useState(Array(9).fill(false));
  const tileRefs = useRef([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.bingoGrid) && Array.isArray(parsed.marked)) {
          setBingoGrid(parsed.bingoGrid);
          setMarked(parsed.marked);
          // Don't set `locked` here; it's managed by the parent
        }
      } catch {}
    }
  }, []);

  // Save to localStorage when locked, marked, or bingoGrid changes
  // Note: 'locked' is now a prop, so we only need to watch the grid and marks
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ bingoGrid, marked, locked }) // Use prop 'locked'
    );
  }, [bingoGrid, marked, locked]); // Depend on prop 'locked'

  // PC drag handlers
  const handleDragStart = (index) => {
    if (index === CENTER_INDEX || locked) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    if (locked || index === CENTER_INDEX) return;
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (
      locked ||
      draggedIndex === null ||
      index === CENTER_INDEX ||
      draggedIndex === CENTER_INDEX
    )
      return;
    swapTiles(draggedIndex, index);
    setDraggedIndex(null);
  };

  // Touch handlers for mobile
  const handleTouchStart = (index) => {
    if (locked || index === CENTER_INDEX) return;
    setTouchDragIndex(index);
  };

  const handleTouchEnd = (e) => {
    if (touchDragIndex === null || locked) {
      setTouchDragIndex(null);
      return;
    }
    const touch = e.changedTouches[0];
    const targetIndex = tileRefs.current.findIndex((ref, idx) => {
      if (!ref || idx === CENTER_INDEX) return false;
      const rect = ref.getBoundingClientRect();
      return (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      );
    });
    if (
      targetIndex !== -1 &&
      targetIndex !== CENTER_INDEX &&
      touchDragIndex !== CENTER_INDEX &&
      targetIndex !== touchDragIndex
    ) {
      swapTiles(touchDragIndex, targetIndex);
    }
    setTouchDragIndex(null);
  };

  // Swap helper
  const swapTiles = (from, to) => {
    const newGrid = [...bingoGrid];
    [newGrid[from], newGrid[to]] = [newGrid[to], newGrid[from]];
    setBingoGrid(newGrid);
    // Also swap marked state to keep marks on correct words
    const newMarked = [...marked];
    [newMarked[from], newMarked[to]] = [newMarked[to], newMarked[from]];
    setMarked(newMarked);
  };

  // Marking handler
  const handleMark = (index) => {
    if (!locked || index === CENTER_INDEX) return;
    setMarked((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // Lock in handler
  const handleLockIn = () => {
    onLockStateChange(true);
    // The effect will save to localStorage
  };

return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 min-h-screen text-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {locked
          ? 'הכרטיס שלך'
          : 'עכשיו אפשר להזיז את המשבצות'}
      </h2>
      <div className="grid grid-cols-3 gap-2 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md" style={{ aspectRatio: '1 / 1' }}>
        {bingoGrid.map((word, index) => (
          <div
            key={index}
            ref={el => tileRefs.current[index] = el}
            className={`
              w-full h-full aspect-square
              rounded-lg shadow-lg flex items-center justify-center text-center
              ${
                index === CENTER_INDEX
                  ? locked
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-indigo-600 text-white font-bold'
                  : marked[index]
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-gray-800'
              }
              ${!locked && index !== CENTER_INDEX ? 'cursor-move ring-2 ring-indigo-400/0 hover:ring-2 hover:ring-indigo-400 transition' : ''}
              select-none
              ${draggedIndex === index || touchDragIndex === index ? 'opacity-50' : ''}
              ${locked && index !== CENTER_INDEX ? 'cursor-pointer' : ''}
            `}
            title={word}
            draggable={!locked && index !== CENTER_INDEX}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={() => setDraggedIndex(null)}
            onTouchStart={() => handleTouchStart(index)}
            onTouchEnd={handleTouchEnd}
            onClick={() => handleMark(index)}
          >
            <span className="block w-full break-words text-center text-xs sm:text-sm md:text-base leading-tight px-1">
              {word}
            </span>
          </div>
        ))}
      </div>
      {!locked && (
        <button
          className="mt-8 px-8 py-4 rounded-full bg-green-500 text-white font-bold shadow-lg hover:bg-green-600 transition"
          onClick={handleLockIn}
        >
          LOCK IN
        </button>
      )}
    </div>
  );
};

export default BingoCard;