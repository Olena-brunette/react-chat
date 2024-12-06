import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../context';
import './chatList.css';
import { getChats } from '../../api/helpers';
import { formatTimestamp, getColor } from '../helpers';
import { Toast } from '../toast/Toast';

export const ChatList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const context = useContext(ChatContext);
  const userId = context?.user?.id;

  const handleChangeActiveChat = (chatId: string) => {
    context?.setActiveChatId(chatId);
  };

  const closeError = () => {
    setError('');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        return;
      }
      try {
        setLoading(true);
        const response = await getChats(userId);
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
  }, [userId]);

  return (
    <div className="chat-list">
      {loading && <div className="loader"></div>}
      {error && <Toast message={error} type="error" onClose={closeError} />}
      {!loading &&
        context?.chats.map((chat, index) => {
          return (
            <div
              key={chat.id}
              className={`chat-item ${context?.activeChatId === chat.id ? 'active' : ''}`}
              onClick={() => handleChangeActiveChat(chat.id)}
            >
              <div className="chat-info">
                <div className="chat-title">
                  <div
                    className="circle"
                    style={{ backgroundColor: getColor(index) }}
                  ></div>
                  <span className="chat-name">{chat.title}</span>
                </div>
                <span className="chat-preview">
                  {chat.lastMessage?.content}
                </span>
                <span className="chat-date">
                  {formatTimestamp(chat.updatedAt)}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};
