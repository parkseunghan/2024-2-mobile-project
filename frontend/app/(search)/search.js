import { Stack } from 'expo-router';
import { Header } from '@app/_components/common/Header';
import SearchScreen from '@app/_screens/SearchScreen';

export default function Search() {
  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <Header 
              title="검색" 
              hideSearchBar={true}
              showBackButton={true}
            />
          ),
        }}
      />
      <SearchScreen />
    </>
  );
} 