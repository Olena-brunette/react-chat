import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../context';
import './chat.css';
import { getAllMessagesPerChat, sendMessage } from '../../api/helpers';

export const Chat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const context = useContext(ChatContext);
  const chatId = context?.activeChat?.id;

  const addNewMessage = async () => {
    if (!context?.user || !chatId) return;
    setMessage('');
    setLoading(true);
    try {
      await sendMessage({
        id: chatId,
        userId: context.user.id,
        message,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (context?.activeChat) {
      getAllMessagesPerChat({
        id: context.activeChat.id,
      }).then((data) => {
        setMessages(data);
      });
    } }, [context?.activeChat]);


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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
        />
        <button className="send-btn" onClick={addNewMessage}>
          ➤
        </button>
      </section>
    </main>
  );
};
