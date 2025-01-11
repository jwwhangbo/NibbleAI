"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type BoundStore, createBoundStore } from "@/src/stores/gallery-store";

export type GalleryStoreApi = ReturnType<typeof createBoundStore>;

export const GalleryStoreContext = createContext<GalleryStoreApi | undefined>(
  undefined
);

export interface GalleryStoreProviderProps {
  children: ReactNode;
}

export const GalleryStoreProvider = ({
  children,
}: GalleryStoreProviderProps) => {
  const storeRef = useRef<GalleryStoreApi>(undefined);
  if (!storeRef.current) {
    storeRef.current = createBoundStore();
  }

  return (
    <GalleryStoreContext.Provider value={storeRef.current}>
      {children}
    </GalleryStoreContext.Provider>
  );
};

export const useGalleryStore = <T,>(selector: (store: BoundStore) => T): T => {
  const galleryStoreContext = useContext(GalleryStoreContext);

  if (!galleryStoreContext) {
    throw new Error("useGalleryStore must be used within GalleryStoreProvider");
  }

  return useStore(galleryStoreContext, selector);
};
