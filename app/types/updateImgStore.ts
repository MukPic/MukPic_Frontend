import { create } from "zustand";

interface updateImageStore {
  updateImageUrls: string[];
  setUpdateImageUrls: (imageUrls: string[]) => void;
}

export const useUpdateImageStore = create<updateImageStore>((set) => ({
  updateImageUrls: [],
  setUpdateImageUrls: (updateImageUrls) => set({ updateImageUrls }),
}));
