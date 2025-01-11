import { createStore, StateCreator } from 'zustand/vanilla';

type QuerySlice = {
  query: string;
  setQuery: (newQuery: string) => void;
}

type SearchSlice = {
  search: string;
  setSearch: (newSearch: string) => void;
}

export type BoundStore = QuerySlice & SearchSlice;

const createQuerySlice: StateCreator<QuerySlice> = (set) => ({
  query: '',
  setQuery: (newQuery: string) => set(() => ({query: newQuery}))
})

const createSearchSlice: StateCreator<SearchSlice> = (set) => ({
  search: '',
  setSearch: (newSearch: string) => set(() => ({search: newSearch}))
})

export const createBoundStore = () => {
  return createStore<BoundStore>()((...a) => ({
    ...createQuerySlice(...a),
    ...createSearchSlice(...a),
  }))
}