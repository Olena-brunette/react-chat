import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './chatList.css';
import { getChats } from '../../api/helpers';

export const ChatList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const context = useContext(ChatContext);

  const handleChangeActiveChat = (chatId: string) => {
    context?.setActiveChatId(chatId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getChats();
        context?.setChats(response);
        context?.setActiveChatId(response[0].id);
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

    fetchData();
  }, []);

  return (
    <div className="chat-list">
      {!loading &&
        !error &&
        context?.chats.map((chat) => {
          const messageList = [...chat.messages, ...chat.replies].sort(
            (a, b) => b.timestamp - a.timestamp,
          );
          const lastMessage = messageList.length
            ? messageList[messageList.length - 1]
            : null;
          return (
            <div
              key={chat.id}
              className={`chat-item ${context?.activeChatId === chat.id ? 'active' : ''}`}
              onClick={() => handleChangeActiveChat(chat.id)}
            >
              <div className="chat-avatar">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="chat-info">
                <span className="chat-name">{chat.title}</span>
                <span className="chat-preview">
                  {lastMessage?.content || ''}
                </span>
                <span className="chat-date">
                  {messageList.length
                    ? new Date(lastMessage!.timestamp).toLocaleString()
                    : ''}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};