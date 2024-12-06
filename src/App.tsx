import './App.css';
import { ChatList } from './components/chat-list/ChatList';
import { Chat } from './components/chat/Chat';
import { Header } from './components/header/Header';
import { ChatProvider } from './context';

function App() {
  return (
    <ChatProvider>
      <div className="chat-app">
        <aside className="sidebar">
          <Header />
          <ChatList />
        </aside>
        <Chat />
      </div>
    </ChatProvider>
  );
}

export default App;
