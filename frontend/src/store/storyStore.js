import { create } from 'zustand';
import { openDB } from 'idb';
import useSettingsStore from './settingsStore';

const useStoryStore = create((set, get) => ({
  // Story parameters
  storyMode: null, // 'quick', 'custom', 'co-author'
  storyParameters: {
    prompt: '',
    genre: '',
    tone: '',
    pov: '',
    character: '',
    setting: '',
    dialogueLevel: 50, // 0-100 slider value
    pacingLevel: 50,   // 0-100 slider value
  },
  generatedStory: '',
  isGenerating: false,
  isPaused: false,
  selectedParagraphIndex: null,
  paragraphHistory: [], // Store history of paragraph edits for undo/redo functionality

  saveStory: async (story) => {
    try {
      const db = await openDB('yira-tales-db', 1, {
        upgrade(db) {
          db.createObjectStore('stories', { keyPath: 'id', autoIncrement: true });
        },
      });
      await db.put('stories', { content: story, timestamp: Date.now() });
      console.log('Story saved to IndexedDB');
    } catch (error) {
      console.error('Error saving story to IndexedDB:', error);
    }
  },
  loadStory: async () => {
    try {
      const db = await openDB('yira-tales-db', 1);
      const stories = await db.getAll('stories');
      if (stories && stories.length > 0) {
        // Load the most recent story
        const mostRecentStory = stories[stories.length - 1];
        set({ generatedStory: mostRecentStory.content });
        console.log('Story loaded from IndexedDB');
      } else {
        console.log('No story found in IndexedDB');
      }
    } catch (error) {
      console.error('Error loading story from IndexedDB:', error);
    }
  },

  // Set story mode
  setStoryMode: (mode) => set({ storyMode: mode }),
  
  // Update story parameters
  updateStoryParameter: (key, value) => set(state => ({
    storyParameters: {
      ...state.storyParameters,
      [key]: value
    }
  })),
  
  // Reset story parameters
  resetStoryParameters: () => set({
    storyParameters: {
      prompt: '',
      genre: '',
      tone: '',
      pov: '',
      character: '',
      setting: '',
      dialogueLevel: 50,
      pacingLevel: 50,
    }
  }),
  
  // Generate story function (placeholder for API call)
  generateStory: async () => {
    set({ isGenerating: true });
    
    try {
      // Get current settings for content filters
      const { nsfwEnabled, unfilteredContentEnabled } = useSettingsStore.getState();
      
      // Prepare parameters including content filter settings
      const params = {
        ...get().storyParameters,
        nsfwEnabled,
        unfilteredContentEnabled
      };
      
      // This would be replaced with actual API call
      console.log('Generating story with parameters:', params);
      
      const startTime = Date.now();
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const endTime = Date.now();
      console.log(`API call took ${endTime - startTime}ms`);
      
      // Set generated story (placeholder)
      const newStory = `This is a placeholder for a generated story. Content filters: NSFW ${nsfwEnabled ? 'enabled' : 'disabled'}, Unfiltered ${unfilteredContentEnabled ? 'enabled' : 'disabled'}.`;
      set({ 
        generatedStory: newStory,
        isGenerating: false
      });
      get().saveStory(newStory);
    } catch (error) {
      console.error('Error generating story:', error);
      set({ isGenerating: false });
    }
  },
  
  // Update generated story (for editing)
  updateGeneratedStory: (newStory) => set({ generatedStory: newStory }),
  
  // Clear generated story
  clearGeneratedStory: () => set({ generatedStory: '' }),
  
  // Pause/resume generation
  setPaused: (paused) => set({ isPaused: paused }),
  
  // Set selected paragraph for editing
  setSelectedParagraphIndex: (index) => set({ selectedParagraphIndex: index }),
  
  // Update a specific paragraph
  updateParagraph: (index, newContent) => {
    const { generatedStory } = get();
    
    // Split the story into paragraphs
    const paragraphs = generatedStory.split(/\n\n|\n/).filter(p => p.trim().length > 0);
    
    // Update the specified paragraph
    if (index >= 0 && index < paragraphs.length) {
      paragraphs[index] = newContent;
      
      // Join paragraphs back into a single string
      const newStory = paragraphs.join('\n\n');
      
      // Save to paragraph history for potential undo/redo
      const { paragraphHistory } = get();
      const newHistory = [...paragraphHistory, { index, oldContent: paragraphs[index], newContent }];
      
      // Update state
      set({ 
        generatedStory: newStory,
        paragraphHistory: newHistory
      });
    }
  },
}));

export default useStoryStore;
