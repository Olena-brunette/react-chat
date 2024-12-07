import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../context';
import './chatList.css';
import { findById, formatTimestamp, getColor } from '../helpers';
import Dialog from '../dialog/Dialog';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from '../form/Form';
import { editChat } from '../../api/helpers';

interface ChatListProps {
  loading: boolean;
}

interface FormValues {
  firstname: string;
  lastname: string;
}

export interface Field {
  name: string;
  type: string;
  placeholder?: string;
  required: boolean;
  errorText?: string;
  errorRegex?: RegExp;
}

export const ChatList: React.FC<ChatListProps> = ({ loading }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [editElementId, setEditElementId] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteElementId, setDeleteElementId] = useState('');
  const [error, setError] = useState('');
  const [chatLoadingStatus, setChatLoadingStatus] = useState(false);

  const context = useContext(ChatContext);

  const userId = context?.user?.id;
  const activeChatId = context?.activeChatId;

  const [firstname, lastname] = findById(
    context?.chats || [],
    editElementId,
  )?.title.split(' ') || ['', ''];

  const deleteChatName = findById(context?.chats || [], deleteElementId)?.title;

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

  const handleChangeActiveChat = (chatId: string) => {
    context?.setActiveChatId(chatId);
  };

  const handleEditDialogOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
  ) => {
    event.stopPropagation();
    setEditElementId(id);
    setEditOpen(true);
  };

  const handleEditDialogClose = () => {
    methods.reset(defaultValues);
    setEditElementId('');
    setEditOpen(false);
  };

  const handleDeleteDialogOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
  ) => {
    event.stopPropagation();
    setDeleteElementId(id);
    setDeleteOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteElementId('');
    setDeleteOpen(false);
  };

  const handleEditChat = async ({ firstname, lastname }: FormValues) => {
    if (!userId || !activeChatId) return;
    setChatLoadingStatus(true);
    await editChat({
      userId,
      chatId: editElementId || '',
      firstname,
      lastname,
    })
      .then(() => {
        context?.setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === editElementId
              ? {
                  ...chat,
                  title: `${firstname} ${lastname}`,
                }
              : chat,
          ),
        );
        handleEditDialogClose();
      })
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      })
      .finally(() => {
        setChatLoadingStatus(false);
      });
  };

  useEffect(() => {
    if (firstname) {
      methods.setValue('firstname', firstname);
    }
    if (lastname) {
      methods.setValue('lastname', lastname);
    }
  }, [firstname, lastname, editElementId]);

  return (
    <>
      <div className="chat-list">
        {loading && <div className="loader"></div>}
        {!loading &&
          context?.chats.map((chat, index) => {
            return (
              <div
                key={chat.id}
                className={`chat-item ${context?.activeChatId === chat.id ? 'active' : ''}`}
                onClick={() => handleChangeActiveChat(chat.id)}
              >
                <div className="chat-info">
                  <div className="chat-head">
                    <div className="chat-title">
                      <div
                        className="circle"
                        style={{ backgroundColor: getColor(index) }}
                      ></div>
                      <span className="chat-name">{chat.title}</span>
                    </div>
                    <div className="chat-actions">
                      <button
                        className="chat-edit"
                        onClick={(e) => handleEditDialogOpen(e, chat.id)}
                      >
                        ✎
                      </button>
                      <button
                        className="chat-delete"
                        onClick={(e) => handleDeleteDialogOpen(e, chat.id)}
                      >
                        ✖
                      </button>
                    </div>
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
      {editOpen && (
        <Dialog
          onActionSubmit={methods.handleSubmit(handleEditChat)}
          onActionCancel={handleEditDialogClose}
          submitText="Edit"
          cancelText="Cancel"
          type="form"
          error={error}
          loading={chatLoadingStatus}
          setError={setError}
        >
          <FormProvider {...methods}>
            <Form
              fields={fields}
              title={`Edit ${firstname} ${lastname || ''} chat`}
            />
          </FormProvider>
        </Dialog>
      )}

      {deleteOpen && (
        <Dialog
          onActionSubmit={() => setDeleteOpen(false)}
          onActionCancel={handleDeleteDialogClose}
          submitText="Delete"
          cancelText="Cancel"
          type="warning"
          error={error}
          loading={chatLoadingStatus}
          setError={setError}
        >
          <h3 className="delete-header">{`Are you sure you want to delete ${deleteChatName} chat?`}</h3>
        </Dialog>
      )}
    </>
  );
};
