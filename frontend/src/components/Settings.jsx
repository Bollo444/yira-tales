import React from 'react';
import { Switch } from '@headlessui/react';
import useSettingsStore from '../store/settingsStore';

const Settings = () => {
  const { 
    nsfwEnabled, 
    unfilteredContentEnabled, 
    toggleNSFW, 
    toggleUnfilteredContent 
  } = useSettingsStore();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h2>
      
      <div className="space-y-6">
        {/* Content Filter Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Content Filters</h3>
          
          <div className="space-y-4">
            {/* NSFW Content Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">NSFW Content</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable to allow mature content in generated stories
                </p>
              </div>
              <Switch
                checked={nsfwEnabled}
                onChange={toggleNSFW}
                className={`${nsfwEnabled ? 'bg-indigo-600' : 'bg-gray-200'}
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                <span className="sr-only">Enable NSFW Content</span>
                <span
                  className={`${nsfwEnabled ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>

            {/* Unfiltered Content Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Unfiltered Content</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable to remove content restrictions and filters
                </p>
              </div>
              <Switch
                checked={unfilteredContentEnabled}
                onChange={toggleUnfilteredContent}
                className={`${unfilteredContentEnabled ? 'bg-indigo-600' : 'bg-gray-200'}
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                <span className="sr-only">Enable Unfiltered Content</span>
                <span
                  className={`${unfilteredContentEnabled ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>
        </div>

        {/* Warning Message when NSFW or Unfiltered is enabled */}
        {(nsfwEnabled || unfilteredContentEnabled) && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Warning:</strong> You have enabled content that may include mature or unfiltered material. 
              This may generate stories with explicit or sensitive themes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;