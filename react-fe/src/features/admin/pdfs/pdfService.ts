import axios from 'axios';

const instance = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_API_URL}/files`,
  responseType: 'blob',
});

async function getByInvitationId(id: string) {
  return instance.get<ArrayBuffer>(id, { responseType: 'arraybuffer' });
}

export const pdfService = {
  getByInvitationId,
};
