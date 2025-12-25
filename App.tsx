import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { User } from 'firebase/auth';
import { loginAnonymously, subscribeToAuthChanges } from './src/services/authService';
import { ARScreen } from './src/screens/ARScreen';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) handleLogin();
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await loginAnonymously();
    } catch (error) {
      console.error("Auto login failed:", error);
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF9800" />
          <Text style={styles.text}>読み込み中...</Text>
        </View>
      );
    }

    if (user) {
      return <ARScreen />;
    }

    return (
      <View style={styles.centered}>
        <Text style={styles.text}>ログイン失敗</Text>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderContent()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#FFFFFF', marginTop: 10 },
});
