import React, { useState } from 'react';
import useStoryStore from '../store/storyStore';

const InputControlsForm = () => {
  const { storyParameters, updateStoryParameter } = useStoryStore();
  
  // Local state for form values
  const [formValues, setFormValues] = useState({
    genre: storyParameters.genre || '',
    tone: storyParameters.tone || '',
    pov: storyParameters.pov || 'third',
    character: storyParameters.character || '',
    setting: storyParameters.setting || '',
    dialogueLevel: storyParameters.dialogueLevel || 50,
    pacingLevel: storyParameters.pacingLevel || 50,
    prompt: storyParameters.prompt || ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Handle slider changes
  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: parseInt(value, 10)
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Update each parameter individually
    Object.entries(formValues).forEach(([key, value]) => {
      updateStoryParameter(key, value);
    });
  };

  // Genre options
  const genreOptions = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Horror',
    'Adventure', 'Historical Fiction', 'Thriller', 'Comedy', 'Drama',
    'Dystopian', 'Fairy Tale', 'Western', 'Crime', 'Young Adult'
  ];

  // Tone options
  const toneOptions = [
    'Serious', 'Humorous', 'Dark', 'Lighthearted', 'Suspenseful',
    'Inspirational', 'Melancholic', 'Whimsical', 'Satirical', 'Romantic'
  ];

  // POV options
  const povOptions = [
    { value: 'first', label: 'First Person' },
    { value: 'second', label: 'Second Person' },
    { value: 'third', label: 'Third Person' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Story Parameters</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prompt */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Story Prompt
          </label>
          <textarea
            id="prompt"
            name="prompt"
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Enter a brief description of your story idea"
            value={formValues.prompt}
            onChange={handleInputChange}
          />
        </div>

        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Genre
          </label>
          <select
            id="genre"
            name="genre"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={formValues.genre}
            onChange={handleInputChange}
          >
            <option value="">Select a genre</option>
            {genreOptions.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Tone */}
        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tone
          </label>
          <select
            id="tone"
            name="tone"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={formValues.tone}
            onChange={handleInputChange}
          >
            <option value="">Select a tone</option>
            {toneOptions.map((tone) => (
              <option key={tone} value={tone}>{tone}</option>
            ))}
          </select>
        </div>

        {/* POV */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Point of View
          </label>
          <div className="mt-2 space-y-2">
            {povOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`pov-${option.value}`}
                  name="pov"
                  type="radio"
                  value={option.value}
                  checked={formValues.pov === option.value}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700"
                />
                <label htmlFor={`pov-${option.value}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Character */}
        <div>
          <label htmlFor="character" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Main Character
          </label>
          <input
            type="text"
            id="character"
            name="character"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Describe your main character"
            value={formValues.character}
            onChange={handleInputChange}
          />
        </div>

        {/* Setting */}
        <div>
          <label htmlFor="setting" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Setting
          </label>
          <input
            type="text"
            id="setting"
            name="setting"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Describe the story setting"
            value={formValues.setting}
            onChange={handleInputChange}
          />
        </div>

        {/* Dialogue Level Slider */}
        <div>
          <label htmlFor="dialogueLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Dialogue Level: {formValues.dialogueLevel}%
          </label>
          <input
            type="range"
            id="dialogueLevel"
            name="dialogueLevel"
            min="0"
            max="100"
            className="mt-1 block w-full accent-indigo-600"
            value={formValues.dialogueLevel}
            onChange={handleSliderChange}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Minimal</span>
            <span>Balanced</span>
            <span>Extensive</span>
          </div>
        </div>

        {/* Pacing Level Slider */}
        <div>
          <label htmlFor="pacingLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pacing Level: {formValues.pacingLevel}%
          </label>
          <input
            type="range"
            id="pacingLevel"
            name="pacingLevel"
            min="0"
            max="100"
            className="mt-1 block w-full accent-indigo-600"
            value={formValues.pacingLevel}
            onChange={handleSliderChange}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Slow</span>
            <span>Medium</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
          >
            Apply Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputControlsForm;