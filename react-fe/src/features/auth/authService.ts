import axios from 'axios';
import { Invitation, LoginData } from './authTypes';

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
  withCredentials: true,
});

async function login(loginData: LoginData) {
  return await instance.post<Invitation>('login', loginData);
}

async function logout() {
  return await instance.post('/logout');
}

async function validateInvitationToken(token: string) {
  return await instance.post<{ message: string }>('validate-token', { token });
}

export const authService = {
  login,
  logout,
  validateInvitationToken,
};
