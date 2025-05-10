import { create } from 'zustand';

const useSettingsStore = create((set) => ({
  // Content filter settings
  nsfwEnabled: false,
  unfilteredContentEnabled: false,
  
  // Actions to toggle settings
  toggleNSFW: () => set((state) => ({ nsfwEnabled: !state.nsfwEnabled })),
  toggleUnfilteredContent: () => set((state) => ({ unfilteredContentEnabled: !state.unfilteredContentEnabled })),
  
  // Reset settings to default
  resetSettings: () => set({ nsfwEnabled: false, unfilteredContentEnabled: false }),
}));

export default useSettingsStore;