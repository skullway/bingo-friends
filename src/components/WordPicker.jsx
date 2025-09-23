import React, { useState, useEffect } from 'react';
import { fetchTileOptions } from '../data/tileOptionsFetcher.js';

const WordPicker = ({ onWordsSelected }) => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [isMaxSelected, setIsMaxSelected] = useState(false);
  const [tileOptions, setTileOptions] = useState([]);

  useEffect(() => {
    const loadTileOptions = async () => {
      const options = await fetchTileOptions();
      if (options) {
        setTileOptions(options);
      }
    }

    loadTileOptions();
  }, []);

  useEffect(() => {
    setIsMaxSelected(selectedWords.length >= 8);
  }, [selectedWords]);

  const handleSelectWord = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else if (selectedWords.length < 8) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleSendWords = () => {
    if (isMaxSelected) {
      onWordsSelected(selectedWords);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 min-h-screen text-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center">בחר דברים שצפויים להיאמר</h2>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {tileOptions.map((word) => (
          <div
            key={word}
            onClick={() => handleSelectWord(word)}
            className={`
              p-3 px-5 rounded-full shadow-lg cursor-pointer transition-all duration-200
              ${selectedWords.includes(word) ? 'bg-indigo-600 text-white transform scale-105' : 'bg-gray-800 hover:bg-gray-700'}
              ${isMaxSelected && !selectedWords.includes(word) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {word}
          </div>
        ))}
      </div>
      <button
        onClick={handleSendWords}
        disabled={!isMaxSelected}
        className={`
          p-4 px-8 rounded-full font-bold shadow-lg transition-all duration-300
          ${isMaxSelected ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
        `}
      >
        Create Bingo Card
      </button>
    </div>
  );
};

export default WordPicker;