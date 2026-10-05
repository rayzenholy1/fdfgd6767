import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
} from 'react-native';
import { createTokens } from '../auth/tokens';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!EMAIL_RE.test(email.trim())) e.email = 'Введіть коректний email';
    if (firstName.trim().length < 2) e.firstName = 'Введіть імʼя';
    if (lastName.trim().length < 2) e.lastName = 'Введіть прізвище';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const session = await createTokens({
        email: email.trim().toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      await onAuthenticated(session);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Реєстрація</Text>

        <Text style={s.label}>Email</Text>
        <TextInput
          style={[s.input, errors.email && s.inputError]}
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.email && <Text style={s.error}>{errors.email}</Text>}

        <Text style={s.label}>Імʼя</Text>
        <TextInput
          style={[s.input, errors.firstName && s.inputError]}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Імʼя"
          autoCapitalize="words"
        />
        {errors.firstName && <Text style={s.error}>{errors.firstName}</Text>}

        <Text style={s.label}>Прізвище</Text>
        <TextInput
          style={[s.input, errors.lastName && s.inputError]}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Прізвище"
          autoCapitalize="words"
        />
        {errors.lastName && <Text style={s.error}>{errors.lastName}</Text>}

        <Pressable style={[s.button, loading && s.disabled]} onPress={submit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Створити токени</Text>}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingTop: 80 },
  title: { fontSize: 26, fontWeight: '700', color: '#10222B', marginBottom: 24 },
  label: { fontWeight: '600', color: '#10222B', marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: '#F1F4F3', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#10222B', borderWidth: 1, borderColor: 'transparent' },
  inputError: { borderColor: '#E5384A' },
  error: { color: '#E5384A', marginTop: 4 },
  button: { backgroundColor: '#0F4C5C', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 28 },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
