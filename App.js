import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RegisterScreen from './src/screens/RegisterScreen';
import TokensScreen from './src/screens/TokensScreen';
import { saveSession, loadSession, clearSession } from './src/auth/storage';

export default function App() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSession()
      .then(setSession)
      .finally(() => setReady(true));
  }, []);

  const handleAuth = useCallback(async (next) => {
    await saveSession(next);
    setSession(next);
  }, []);

  const handleLogout = useCallback(async () => {
    await clearSession();
    setSession(null);
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {session ? (
        <TokensScreen session={session} onUpdate={handleAuth} onLogout={handleLogout} />
      ) : (
        <RegisterScreen onAuthenticated={handleAuth} />
      )}
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
