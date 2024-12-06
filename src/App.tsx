import './App.css';
import { Chat } from './components/chat/Chat';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatProvider } from './context';

function App() {
  return (
    <ChatProvider>
      <div className="chat-app">
        <Sidebar />
        <Chat />
      </div>
    </ChatProvider>
  );
}

export default App;
