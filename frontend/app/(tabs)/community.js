import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function Community() {
  return (
    <>
      <Stack.Screen options={{ title: '커뮤니티' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>커뮤니티 화면</Text>
      </View>
    </>
  );
} 