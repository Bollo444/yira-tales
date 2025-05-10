import React from 'react';
import useStoryStore from '../store/storyStore';
import useSettingsStore from '../store/settingsStore';

const StoryModeSelection = () => {
  const { setStoryMode, storyMode } = useStoryStore();
  const { nsfwEnabled, unfilteredContentEnabled } = useSettingsStore();

  const handleModeSelection = (mode) => {
    setStoryMode(mode);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Story Mode</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleModeSelection('quick')}
          className={`p-4 border-2 ${storyMode === 'quick' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-indigo-200 hover:border-indigo-600'} rounded-lg text-center transition-colors`}
          aria-label="Select Quick Story Mode"
        >
          <h3 className="font-bold text-lg mb-2">Quick Story</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Generate a story with minimal inputs</p>
        </button>

        <button
          onClick={() => handleModeSelection('custom')}
          className={`p-4 border-2 ${storyMode === 'custom' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-indigo-200 hover:border-indigo-600'} rounded-lg text-center transition-colors`}
          aria-label="Select Custom Story Mode"
        >
          <h3 className="font-bold text-lg mb-2">Custom Story</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Full control over story parameters</p>
        </button>

        <button
          onClick={() => handleModeSelection('co-author')}
          className={`p-4 border-2 ${storyMode === 'co-author' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-indigo-200 hover:border-indigo-600'} rounded-lg text-center transition-colors`}
          aria-label="Select Co-Author Story Mode"
        >
          <h3 className="font-bold text-lg mb-2">Co-Author</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Write a story together with AI</p>
        </button>
      </div>

      {/* Content filter status indicator */}
      {(nsfwEnabled || unfilteredContentEnabled) && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>
              <strong>Content filters modified:</strong> {nsfwEnabled && 'NSFW content enabled'} {nsfwEnabled && unfilteredContentEnabled && ' • '} {unfilteredContentEnabled && 'Unfiltered content enabled'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default StoryModeSelection;
