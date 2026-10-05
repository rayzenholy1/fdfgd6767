import * as SecureStore from 'expo-secure-store';

const KEY = 'auth_session';

export const saveSession = (session) =>
  SecureStore.setItemAsync(KEY, JSON.stringify(session));

export const loadSession = async () => {
  const raw = await SecureStore.getItemAsync(KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearSession = () => SecureStore.deleteItemAsync(KEY);
