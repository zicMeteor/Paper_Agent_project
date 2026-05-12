import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBookmarkStore = create(
  persist(
    (set) => ({
      bookmarks: [], // paper id 배열

      toggleBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(id)
            ? state.bookmarks.filter((b) => b !== id)
            : [...state.bookmarks, id],
        })),

      clearBookmarks: () => set({ bookmarks: [] }),
    }),
    {
      name: 'ppa-bookmarks',
      partialize: (state) => ({ bookmarks: state.bookmarks }),
    },
  ),
)
