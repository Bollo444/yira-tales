import React, { useState, useEffect } from 'react';
import useStoryStore from '../store/storyStore';

const CoAuthorInterface = () => {
  const { generatedStory, updateGeneratedStory, storyParameters } = useStoryStore();
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storyId, setStoryId] = useState(null);
  const [turns, setTurns] = useState([]);
  const [error, setError] = useState(null);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);

  // Initialize story ID if not already set
  useEffect(() => {
    if (!storyId) {
      // Generate a simple UUID for the story
      const newStoryId = 'story-' + Math.random().toString(36).substring(2, 15);
      setStoryId(newStoryId);
    }
  }, [storyId]);

  // Update the main story content whenever turns change
  useEffect(() => {
    if (turns.length > 0) {
      const fullStory = turns.map(turn => `${turn.author === 'user' ? 'You' : 'AI'}: ${turn.content}`).join('\n\n');
      updateGeneratedStory(fullStory);
    }
  }, [turns, updateGeneratedStory]);

  const handleUserTurn = async () => {
    if (!userInput.trim()) {
      setError('Please enter your contribution before submitting');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Add user's turn to the local state first for immediate feedback
      const userTurn = { author: 'user', content: userInput.trim() };
      const updatedTurns = [...turns, userTurn];
      setTurns(updatedTurns);

      // Send user's turn to the backend
      const response = await fetch('http://localhost:3000/api/story/co-author/user-turn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId,
          userContent: userInput.trim(),
          ...storyParameters, // Include story parameters for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit your turn');
      }

      // Clear the input field
      setUserInput('');
      
      // Now get AI's turn
      setIsWaitingForAI(true);
      await getAiTurn();
    } catch (err) {
      console.error('Error submitting user turn:', err);
      setError(err.message || 'An error occurred while submitting your turn');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAiTurn = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/story/co-author/ai-turn?storyId=${storyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get AI\'s turn');
      }

      const data = await response.json();
      
      // Add AI's turn to the local state
      const aiTurn = { author: 'ai', content: data.content };
      setTurns(prevTurns => [...prevTurns, aiTurn]);
    } catch (err) {
      console.error('Error getting AI turn:', err);
      setError(err.message || 'An error occurred while getting AI\'s turn');
    } finally {
      setIsWaitingForAI(false);
    }
  };

  const startNewStory = () => {
    // Generate a new story ID
    const newStoryId = 'story-' + Math.random().toString(36).substring(2, 15);
    setStoryId(newStoryId);
    setTurns([]);
    setUserInput('');
    setError(null);
    updateGeneratedStory('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Co-Author Story</h3>
      
      {/* Display turns */}
      {turns.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg max-h-96 overflow-y-auto">
          {turns.map((turn, index) => (
            <div key={index} className={`mb-4 p-3 rounded-lg ${turn.author === 'user' ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
              <p className="font-semibold mb-1">{turn.author === 'user' ? 'You' : 'AI'}:</p>
              <p className="whitespace-pre-wrap">{turn.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* User input area */}
      <div className="mb-4">
        <label htmlFor="userTurn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Turn
        </label>
        <textarea
          id="userTurn"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          rows="4"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Continue the story..."
          disabled={isSubmitting || isWaitingForAI}
        ></textarea>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleUserTurn}
          disabled={isSubmitting || isWaitingForAI || !userInput.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : isWaitingForAI ? 'Waiting for AI...' : 'Submit Your Turn'}
        </button>
        
        <button
          onClick={startNewStory}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Start New Story
        </button>
      </div>
    </div>
  );
};

export default CoAuthorInterface;