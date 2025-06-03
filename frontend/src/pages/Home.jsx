import NoChatSelected from '../components/NoChatSelected'
import { use_chat_store } from '../store/use_chat_store'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'

const Home = () => {
    const {selected_user} = use_chat_store()
    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh - 8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar/>
                        {!selected_user ? <NoChatSelected/> : <ChatContainer/>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home