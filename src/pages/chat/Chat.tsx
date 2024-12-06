import { useContext, useEffect, useState } from 'react';
import { Chat } from '../../components/chat/Chat';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { getUser } from '../../api/helpers';
import { ChatContext } from '../../context';
import { Toast } from '../../components/toast/Toast';

export const ChatPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const context = useContext(ChatContext);

  useEffect(() => {
    setLoading(true);
    const getCurrentUser = () =>
      getUser()
        .then((user) => {
          if (user) {
            context?.setUser(user);
          }
        })
        .catch((err) => {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    getCurrentUser();
  }, []);

  return loading ? (
    <div className={'loader'}></div>
  ) : (
    <div className="chat-app">
      <Sidebar />
      <Chat />
      {error && (
        <Toast message={error} type="error" onClose={() => setError('')} />
      )}
    </div>
  );
};
