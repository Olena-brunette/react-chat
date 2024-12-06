import './header.css';
import { useContext, useState } from 'react';
import { ChatContext } from '../../context';
import { addChat } from '../../api/helpers';
import Dialog from '../dialog/Dialog';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from '../form/Form';
import AuthService from '../../api/authService';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  search: string;
  onSearch: React.Dispatch<React.SetStateAction<string>>;
  onClear: () => void;
  onSubmit: (search: string) => Promise<void>;
}

interface FormValues {
  firstname: string;
  lastname: string;
}

export const Header: React.FC<HeaderProps> = ({
  search,
  onSearch,
  onClear,
  onSubmit,
}) => {
  const [openAddChat, setOpenAddChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const context = useContext(ChatContext);
  const userId = context?.user?.id;

  const defaultValues = {
    firstname: '',
    lastname: '',
  };

  const fields = [
    {
      name: 'firstname',
      type: 'text',
      placeholder: 'First Name',
      required: true,
      errorText: 'First name is required',
    },
    {
      name: 'lastname',
      type: 'text',
      placeholder: 'Last Name',
      required: true,
      errorText: 'Last name is required',
    },
  ];

  const methods = useForm<FormValues>({
    defaultValues,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onSearch(e.target.value);
  };

  const handleOpenAddChat = () => setOpenAddChat(true);
  const handleCloseAddChat = () => {
    methods.reset(defaultValues);
    setOpenAddChat(false);
  };

  const addNewChat = async ({ firstname, lastname }: FormValues) => {
    if (!userId) return;
    setLoading(true);
    try {
      const chat = await addChat({
        id: userId,
        firstname,
        lastname,
      });

      context?.setChats((prevChats) => [chat, ...prevChats]);
      handleCloseAddChat();
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

  const logout = () => {
    context?.setUser(null);
    AuthService.clearTokens();
    navigate('/login');
  };

  return (
    <header>
      <div className="login-section">
        <div className="login-user">
          <h3 className="login-user-name">{context?.user?.login || ''}</h3>
        </div>
        <div className="user-btn">
          <button className="login-btn" onClick={handleOpenAddChat}>
            Add Chat
          </button>
          <button className="login-btn" onClick={logout}>Log out</button>
        </div>
      </div>
      <div className="search-input-container">
        <button
          className="search-icon"
          onClick={() => onSubmit(search)}
        ></button>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search"
          className="search-input"
        />
        {search && (
          <button className="clear-button" onClick={onClear}>
            ✖
          </button>
        )}
      </div>
      {openAddChat && (
        <Dialog
          onActionSubmit={methods.handleSubmit(addNewChat)}
          onActionCancel={handleCloseAddChat}
          submitText="Add"
          cancelText="Cancel"
          type="form"
          loading={loading}
          error={error}
          setError={setError}
        >
          <FormProvider {...methods}>
            <Form fields={fields} title="Add new chat" />
          </FormProvider>
        </Dialog>
      )}
    </header>
  );
};
