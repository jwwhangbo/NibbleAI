import { createStore } from "zustand/vanilla"

export type NavbarState = {
    active: boolean
}

export type NavbarActions = {
    setActive: (param?:boolean) => void
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
        setActive: (param) => set((state) => ({ active: param ? param : !state.active }))
    }))
}