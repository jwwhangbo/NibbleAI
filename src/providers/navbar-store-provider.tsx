'use client'

import { type ReactNode, createContext, useRef, useContext } from "react"
import { useStore } from "zustand"

import {
    type NavbarStore,
    createNavbarStore,
} from "@/src/stores/navbar-store"

export type NavbarStoreApi = ReturnType<typeof createNavbarStore>

export const NavbarStoreContext = createContext<NavbarStoreApi | undefined>(
    undefined,
)

export interface NavbarStoreProviderProps {
    children: ReactNode
}

export const NavbarStoreProvider = ({
    children,
}: NavbarStoreProviderProps) => {
    const storeRef = useRef<NavbarStoreApi>()
    if (!storeRef.current) {
        storeRef.current = createNavbarStore()
    }

    return (
        <NavbarStoreContext.Provider value={storeRef.current}>
            {children}
        </NavbarStoreContext.Provider>
    )
}

export const useNavbarStore = <T,>(
    selector: (store: NavbarStore) => T,
): T => {
    const navbarStoreContext = useContext(NavbarStoreContext)

    if (!navbarStoreContext) {
        throw new Error('useNavbarStore must be used within NavbarStoreProvider');
    }

    return useStore(navbarStoreContext, selector);
}