import { axios_instance } from '../lib/axios'
import { create } from 'zustand'
import toast from 'react-hot-toast'
import { use_auth_store } from './use_auth_store'

export const use_chat_store = create((set, get) => ({
    messages: [],
    users: [],
    selected_user: null,
    is_user_loading: false,
    is_messages_loading: false,

    get_users: async () => {
        set({ is_user_loading: true })
        try {
            const response = await axios_instance.get('/messages/users')
            set({ users: response.data })
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ is_user_loading: false })
        }
    },

    get_messages: async (user_id) => {
        set({is_messages_loading: true})
        try {
            const res = await axios_instance.get(`/messages/${user_id}`)
            set({ messages: res.data})
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ is_messages_loading: false })
        }
    },

    set_selected_user: (user) => {
        set({ selected_user: user })
    },

    send_message: async (msg_data) => {
        const {selected_user, messages} = get()
        try {
            const res = await axios_instance.post(`/messages/send/${selected_user._id}`, msg_data)
            set({messages: [...messages, res.data]})
        } catch (err) {
            toast.error(err.response.data.message)
        }
    },

    subscribe_to_messages: () => {
        const {selected_user} = get()
        if (!selected_user) return

        const socket = use_auth_store.getState().socket
        socket.on('new_message', (new_message) => {
            if (new_message.sender_id !== selected_user._id) return
            set({messages: [...get().messages, new_message]})
        })
    },

    unsubscribe_from_messages: () => {
        const socket = use_auth_store.getState().socket
        socket.off('new_message')
    }
}))