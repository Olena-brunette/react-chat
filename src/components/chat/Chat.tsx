import { createRef, useContext, useEffect, useState } from 'react';
import { ChatContext, Message } from '../../context';
import './chat.css';
import { getAllMessagesPerChat, sendMessage } from '../../api/helpers';
import { formatTimestamp } from '../helpers';
import { Toast } from '../toast/Toast';

export const Chat = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const [lastId, setLastId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');

  const ref = createRef<HTMLDivElement>();
  const context = useContext(ChatContext);
  const chatId = context?.activeChat?.id;

  const addNewMessage = async () => {
    if (!message || !chatId || !context?.user) return;
    setMessage('');
    setLoading(true);
    setError('');

    try {
      const sentMessage = await sendMessage({
        id: chatId,
        userId: context.user.id,
        message,
      });
      setMessages([sentMessage, ...messages]);
      setMessage('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNewMessages = async () => {
    if (!chatId) return;

    try {
      const fetchedMessages = await getAllMessagesPerChat({ id: chatId });
    

      setMessages(fetchedMessages);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchNewMessages();
    }
  }, [chatId]);

  useEffect(() => {
    const intervalId = setInterval(fetchNewMessages, 3000);
    return () => clearInterval(intervalId);
  }, [chatId]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!messages.length) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.id !== lastId) {
      setLastId(lastMessage.id);
      setNotification('New message');
    }
  }, [messages, lastId]);

  return (
    <main className="chat-window">
      <div className={`${loading ? 'loader' : ''}`}></div>
      <section className="chat-header">
        <span className="chat-title">{context?.activeChat?.title}</span>
      </section>
      <section ref={ref} className="chat-messages">
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={`message ${!message?.sender ? 'outgoing' : 'incoming'}`}
            >
              <span className="message-text">{message?.content}</span>
              <span className="message-time">
                {formatTimestamp(message?.timestamp)}
              </span>
            </div>
          );
        })}
      </section>
      <section className="chat-input-container">
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addNewMessage();
            }
          }}
        />
        <button className="send-btn" onClick={addNewMessage}>
          ➤
        </button>
      </section>
      {notification && (
        <Toast
          duration={2000}
          message={notification}
          type="info"
          onClose={() => setNotification('')}
        />
      )}
      {error && (
        <Toast
          position="top-right"
          message={error}
          type="error"
          onClose={() => setError('')}
        />
      )}
    </main>
  );
};
