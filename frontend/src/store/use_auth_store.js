import { create } from 'zustand'
import { axios_instance } from '../lib/axios'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/'

export const use_auth_store = create((set, get) => ({
    auth_user: null,
    is_signing_up: false,
    is_logging_in: false,
    is_updating_profile: false,
    online_users: [],
    is_checking_auth: true,
    socket: null,

    check_auth: async () => {
        try {
            const res = await axios_instance.get('/auth/check')
            set({auth_user: res.data})
            // Connecting to the socket server
            get().connect_to_socket()
        } catch (err) {
            console.log(`Error in use auth store ${err.message}`)
            set({auth_user: null})
        } finally {
            set({is_checking_auth: false})
        }
    },

    signup: async (data) => {
        set({is_signing_up: true})
        try {
            const res = await axios_instance.post('/auth/signup', data)
            set({auth_user: res.data})
            toast.success('Account created successfully.')
            // Connecting to the socket server
            get().connect_socket()
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({is_signing_up: false})
        }
    },

    login: async (data) => {
        set({is_logging_in: true})
        try {
            const res = await axios_instance.post('/auth/login', data)
            set({auth_user: res.data})
            toast.success('You logged in successfully.')
            // Connecting to the socket server
            get().connect_to_socket()
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({is_logging_in: false})
        }
    },

    logout: async () => {
        try {
            await axios_instance.post('/auth/logout')
            set({auth_user: null})
            toast.success('You logged out successfully.')
            // Disconnecting from the socket server
            get().disconnect_to_socket()
        } catch (err) {
            toast.error(err.response.data.message)
        }
    },

    update_profile: async (data) => {
        set({is_updating_profile: true})
        try {
            const res = await axios_instance.put('/auth/update-profile', data)
            set({auth_user: res.data})
            toast.success('Profile updated successfully.')
        } catch (err) {
            console.log(`Error is update profile ${err}`)
            toast.error(err.response.data.message)
        } finally {
            set({is_updating_profile: false})
        }
    },

    connect_to_socket: () => {
        const {auth_user} = get()
        // If user is not authenticated or already connected, do nothing
        if (!auth_user || get().socket?.connected) return
        const socket = io(BASE_URL, {
            query: {
                user_id: auth_user._id
            }
        })
        socket.connect()
        set({socket: socket})

        socket.on('online_users', (users) => {
            set({online_users: users})
        })
    },

    disconnect_to_socket: () => {
        if (get().socket?.connected) get().socket.disconnect()
    }
}))