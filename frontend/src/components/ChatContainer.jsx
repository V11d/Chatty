import { useEffect, useRef } from 'react'
import { use_chat_store } from '../store/use_chat_store'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { use_auth_store } from '../store/use_auth_store'
import { format_message_time } from '../lib/utils'

const ChatContainer = () => {
  const {
    messages, get_messages, is_messages_loading, selected_user, subscribe_to_messages, unsubscribe_from_messages} = use_chat_store()
  const { auth_user } = use_auth_store()
  const message_end_ref = useRef(null)

  useEffect(() => {
    get_messages(selected_user._id)
    subscribe_to_messages()
    return () => unsubscribe_from_messages()
  }, [selected_user._id, get_messages, subscribe_to_messages, unsubscribe_from_messages])

  useEffect(() => {
    if (message_end_ref.current && messages) {
      message_end_ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages]);

  if (is_messages_loading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.sender_id === auth_user._id ? "chat-end" : "chat-start"}`}
            ref={message_end_ref}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sender_id === auth_user._id
                      ? auth_user.profile_pic || "/gawr.jpg"
                      : selected_user.profile_pic || "/gawr.jpg"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {format_message_time(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer