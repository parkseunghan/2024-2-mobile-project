import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function Profile() {
  return (
    <>
      <Stack.Screen options={{ title: '프로필' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>프로필 화면</Text>
      </View>
    </>
  );
} 