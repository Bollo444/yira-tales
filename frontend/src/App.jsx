import { useState, useEffect } from 'react'
import './App.css'
import Settings from './components/Settings'
import StoryModeSelection from './components/StoryModeSelection'
import InputControlsForm from './components/InputControlsForm'
import StoryDisplay from './components/StoryDisplay'
import useStoryStore from './store/storyStore'

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const { storyMode, loadStory } = useStoryStore()

  useEffect(() => {
    loadStory();
  }, [loadStory]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yira Tales</h1>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {showSettings ? 'Close Settings' : 'Settings'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {showSettings ? (
          <Settings />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Story Generator</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Welcome to Yira Tales! Select a story mode to begin creating your tale.
            </p>
            
            {/* Story mode selection component */}
            <StoryModeSelection />
            
            {/* Show Input Controls Form when a story mode is selected */}
            {storyMode && (
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <InputControlsForm />
              </div>
            )}
            
            {/* Show Story Display when a story mode is selected */}
            {storyMode && <StoryDisplay />}
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Note: For mature or unfiltered content, enable the appropriate options in Settings.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
