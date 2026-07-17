import { Middleware } from '@reduxjs/toolkit';
import { connectSocket, disconnectSocket } from '../../utils/socketService';
import { setAuthToken, removeAuthToken, setCommunityRole } from '../slices/authSlice';
import { REHYDRATE } from 'redux-persist';

export const socketMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  if (
    setAuthToken.match(action) ||
    setCommunityRole.match(action) ||
    removeAuthToken.match(action) ||
    action.type === 'RESET_STORE' ||
    (action.type === REHYDRATE && action.key === 'root')
  ) {
    const state = store.getState();
    const token = state.auth?.authToken;
    if (token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
  }

  return result;
};
