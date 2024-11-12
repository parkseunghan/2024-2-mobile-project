import { Stack } from 'expo-router';
import { colors } from '@app/_styles/colors';
import { Header } from '@app/_components/common/Header';
export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ route }) => (
            <Header 
              title='프로필'
              showBackButton={true}
            />
          ),
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
} 