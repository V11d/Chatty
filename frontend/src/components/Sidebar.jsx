import { useEffect, useState } from 'react'
import { use_chat_store } from '../store/use_chat_store'
import { use_auth_store } from '../store/use_auth_store'
import { Users } from 'lucide-react'
import SidebarSkeleton from './skeletons/SidebarSkeleton'

// Sidebar component to display user contacts and their online status
const Sidebar = () => {
  const { get_users, users, selected_user, set_selected_user, is_user_loading } = use_chat_store()

  const { online_users } = use_auth_store()
  const [show_online_only, set_show_online_only] = useState(false)

  useEffect(() => {
    get_users()
  }, [get_users])

  const filtered_users = show_online_only
    ? users.filter((user) => online_users.includes(user._id))
    : users

  if (is_user_loading) return <SidebarSkeleton />

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={show_online_only}
              onChange={(e) => set_show_online_only(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({online_users.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filtered_users.map((user) => (
          <button
            key={user._id}
            onClick={() => set_selected_user(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selected_user?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profile_pic || "/gawr.jpg"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {online_users.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.user_name}</div>
              <div className="text-sm text-zinc-400">
                {online_users.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filtered_users.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar