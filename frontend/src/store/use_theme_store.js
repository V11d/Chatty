import { create } from 'zustand'

export const use_theme_store = create((set) => ({
    theme: localStorage.getItem('chat-theme') || 'coffee',
    set_theme: (theme) => {
        localStorage.setItem('chat-theme', theme)
        set({ theme })
    },
}))