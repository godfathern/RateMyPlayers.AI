import React, { useState } from 'react';
import ChatForm from '../components/Chat/Input/ChatForm';

const funFacts = [
  "A group of flamingos is called a 'flamboyance'!",
  "Bananas are berries, but strawberries aren't.",
  "Octopuses have three hearts!",
  "Honey never spoils — archaeologists have found 3000-year-old honey that's still edible.",
  "A day on Venus is longer than its year.",
];

const FunFacts = () => {
  const [fact, setFact] = useState("Click the button to learn a fun fact!");

  const showRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    setFact(funFacts[randomIndex]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-6">
      <h1 className="text-3xl font-bold mb-4">🎉 Fun Fact Generator 🎉</h1>
      <p className="text-lg text-center mb-6 max-w-xl">{fact}</p>
      <button
        onClick={showRandomFact}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg"
      >
        Show Fun Fact
      </button>
      {/* <div className="flex-grow p-4 bg-white border-t">
        <ChatForm />
      </div> */}
    </div>
  );
};

export default FunFacts;
