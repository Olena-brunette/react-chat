import axios from 'axios';

interface GetChatProps {
  id: string;
  search?: string;
  lastChatId?: string;
}

const baseUrl = `${process.env.VITE_API_URL}api`;

const transformResponse = (response: any) =>
  response.data.map(({ _id, ...rest }: any) => ({
    ...rest,
    id: _id,
  }));

export const getChats = async ({ id, search, lastChatId }: GetChatProps) => {
  const response = await axios.get(`${baseUrl}/chats/${id}`, {
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
  const response = await axios.put(`${baseUrl}/chats/${chatId}`, {
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
  const response = await axios.post(`${baseUrl}/chats`, {
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