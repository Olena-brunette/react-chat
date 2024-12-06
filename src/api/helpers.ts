import axios from 'axios';

const baseUrl = `${process.env.VITE_API_URL}api`;

const transformResponse = (response: any) =>
  response.data.map(({ _id, ...rest }: any) => ({
    ...rest,
    id: _id,
  }));

export const getChats = async (id: string) => {
  const response = await axios.get(`${baseUrl}/chats/${id}`);
  if (response.status !== 200) {
    throw new Error('An error occurred while fetching chats');
  }
  return transformResponse(response);
};