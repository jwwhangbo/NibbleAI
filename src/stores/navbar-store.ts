import { createStore } from "zustand/vanilla"

export type NavbarState = {
    active: boolean
}

export type NavbarActions = {
    setActive: () => void
}

export type NavbarStore = NavbarState & NavbarActions

export const defaultNavbarState: NavbarState = {
    active: false,
}

export const createNavbarStore = (
    initState : NavbarState = defaultNavbarState,
) => {
    return createStore<NavbarStore>()((set) => ({
        ...initState,
        setActive: () => set((state) => ({ active: !state.active}))
    }))
}