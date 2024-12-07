import axios from 'axios';
import API, { baseUrl } from './api';

interface GetChatProps {
  id: string;
  search?: string;
  lastChatId?: string;
}


const transformResponse = (response: any) =>
  response.data.map(({ _id, ...rest }: any) => ({
    ...rest,
    id: _id,
  }));


  export const setAccessToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    } else {
     delete axios.defaults.headers.common["Authorization"]
    }
};

export const getChats = async ({ id, search, lastChatId }: GetChatProps) => {
  const response = await API.get(`${baseUrl}/chats/${id}`, {
    params: { search, lastChatId },
  });
  if (response.status !== 200) {
    throw new Error('An error occurred while fetching chats');
  }
  return transformResponse(response);
};

export const editChat = async ({
  userId,
  chatId,
  firstname,
  lastname,
}: {
  userId: string;
  chatId: string;
  firstname: string;
  lastname: string;
}) => {
  const response = await API.put(`${baseUrl}/chats/${chatId}`, {
    userId,
    firstname,
    lastname,
  });
  if (response.status !== 200) {
    throw new Error('An error occurred while editing chat');
  }
  const { _id, ...rest } = response.data;
  return { ...rest, id: _id };
};

export const addChat = async ({
  id,
  firstname,
  lastname,
}: {
  id: string;
  firstname: string;
  lastname: string;
}) => {
  const response = await API.post(`${baseUrl}/chats`, {
    id,
    firstname,
    lastname,
  });
  if (response.status !== 201) {
    throw new Error('An error occurred while adding chat');
  }
  const { _id, ...rest } = response.data;
  return { ...rest, id: _id };
}

export const registerUser = async ({
  login,
  password,
}: {
  login: string;
  password: string;
}) => {
  const response = await API.post(`${baseUrl}/auth/registration`, {
    login,
    password,
  });
  if (response.status !== 201) {
    throw new Error('An error occurred while registering user');
  }
  return response.data;
}

export const loginUser = async ({
  login,
  password,
}: {
  login: string;
  password: string;
}) => {
  const response = await API.post(`${baseUrl}/auth/login`, {
    login,
    password,
  });
  if (response.status !== 200) {
    throw new Error('An error occurred while logging in user');
  }
  return response.data;
}

export const getUser = async () => {
  const response = await API.get(`${baseUrl}/users/profile`);
  if (response.status !== 200) {
    throw new Error('An error occurred while fetching user');
  }
  return response.data;
}


export const sendMessage = async ({
  id,
  userId,
  message,
}: {
  id: string;
  userId: string;
  message: string;
}) => {
  const response = await API.post(`${baseUrl}/messages`, {
    id,
    userId,
    message,
  });
  if (response.status !== 200) {
    throw new Error('An error occurred while sending message');
  }
  const { _id, ...rest } = response.data;
  return { ...rest, id: _id };
};

export const getAllMessagesPerChat = async ({
  id,
  lastMessageId,
}: {
  id: string;
  lastMessageId?: string;
}) => {
  const response = await API.get(`${baseUrl}/messages/${id}`, {
    params: { lastMessageId },
  });
  if (response.status !== 200) {
    throw new Error('An error occurred while fetching messages');
  }
  return transformResponse(response);
};
