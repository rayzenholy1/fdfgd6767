import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { createTokens, decodePayload } from '../auth/tokens';

const fmt = (ms) => new Date(ms).toLocaleString('uk-UA');

export default function TokensScreen({ session, onUpdate, onLogout }) {
  const [busy, setBusy] = useState(false);
  const payload = decodePayload(session.accessToken);

  const regenerate = async () => {
    setBusy(true);
    try {
      await onUpdate(await createTokens(session.user));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>Токени створено</Text>

      <Text style={s.label}>Користувач</Text>
      <Text style={s.value}>{session.user.firstName} {session.user.lastName}</Text>
      <Text style={s.value}>{session.user.email}</Text>

      <Text style={s.label}>Access token</Text>
      <Text selectable style={s.token}>{session.accessToken}</Text>
      <Text style={s.hint}>Діє до {fmt(session.accessExpiresAt)}</Text>

      <Text style={s.label}>Refresh token</Text>
      <Text selectable style={s.token}>{session.refreshToken}</Text>
      <Text style={s.hint}>Діє до {fmt(session.refreshExpiresAt)}</Text>

      <Text style={s.label}>Payload</Text>
      <Text selectable style={s.token}>{JSON.stringify(payload, null, 2)}</Text>

      <Pressable style={[s.button, busy && s.disabled]} onPress={regenerate} disabled={busy}>
        <Text style={s.buttonText}>Створити нові токени</Text>
      </Pressable>
      <Pressable style={s.secondary} onPress={onLogout}>
        <Text style={s.secondaryText}>Вийти</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingTop: 80 },
  title: { fontSize: 26, fontWeight: '700', color: '#10222B', marginBottom: 16 },
  label: { fontWeight: '700', color: '#10222B', marginTop: 18, marginBottom: 6 },
  value: { color: '#10222B', fontSize: 16 },
  token: { backgroundColor: '#F1F4F3', borderRadius: 10, padding: 12, color: '#10222B', fontSize: 12 },
  hint: { color: '#6B7B83', marginTop: 4 },
  button: { backgroundColor: '#0F4C5C', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 28 },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondary: { alignItems: 'center', padding: 14, marginTop: 6 },
  secondaryText: { color: '#E5384A', fontWeight: '600' },
});
