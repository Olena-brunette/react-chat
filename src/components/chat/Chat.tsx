import { useContext } from 'react';
import { ChatContext } from '../../context';
import './chat.css';

export const Chat = () => {
  const context = useContext(ChatContext);

  return (
    <main className="chat-window">
      <section className="chat-header">
        <span className="chat-title">{context?.activeChat?.title}</span>
      </section>
      <section className="chat-messages">
        {/* TODO: replace with map */}
        <div className="message incoming">
          <span className="message-text">Hi, how are you?</span>
          <span className="message-time">8/17/2022, 7:43 AM</span>
        </div>
        <div className="message outgoing">
          <span className="message-text">Not bad. What about you?</span>
          <span className="message-time">8/17/2022, 7:45 AM</span>
        </div>
      </section>
      <section className="chat-input-container">
        <input
          type="text"
          placeholder="Type your message"
          className="chat-input"
        />
        <button className="send-btn">➤</button>
      </section>
    </main>
  );
};