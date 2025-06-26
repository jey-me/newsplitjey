import { create } from 'zustand';

export const usePopupStore = create((set) => ({
  currentPopup: null,
  openPopup: (type) => set({ currentPopup: type }),
  closePopup: () => set({ currentPopup: null }),
}));
