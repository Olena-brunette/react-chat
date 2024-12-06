import { useContext, useEffect, useState } from 'react';
import { ChatList } from '../chat-list/ChatList';
import { Header } from '../header/Header';
import './sidebar.css';
import { Toast } from '../toast/Toast';
import { ChatContext } from '../../context';
import { getChats } from '../../api/helpers';

export const Sidebar = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const context = useContext(ChatContext);
  const userId = context?.user?.id;

  const closeError = () => {
    setError('');
  };

  const submitSearchChat = async (search: string) => {
    if (!userId) return;
    setLoading(true);
    await getChats({
      id: userId,
      search,
    })
      .then((response) => {
        context?.setChats(response);
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
  };

  const handleClear = async () => {
    setSearch('');
    await submitSearchChat('');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        return;
      }
      try {
        setLoading(true);
        const response = await getChats({ id: userId });
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
    <aside className="sidebar">
      <Header
        search={search}
        onSearch={setSearch}
        onClear={handleClear}
        onSubmit={submitSearchChat}
      />
      <ChatList loading={loading} />
      {error && <Toast message={error} type="error" onClose={closeError} />}
    </aside>
  );
};
