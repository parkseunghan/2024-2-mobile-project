import React from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import { VideoCard } from '@app/_components/main/VideoCard';
import { Header } from '@app/_components/common/Header';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';

export default function AllVideosScreen() {
  const { width } = useWindowDimensions();
  
  const getNumColumns = () => {
    if (width >= 1200) return 3;
    if (width >= 800) return 2;
    return 1;
  };

  const numColumns = getNumColumns();
  const containerWidth = width * 0.9;
  const cardWidth = (containerWidth - (spacing.md * (numColumns + 1))) / numColumns;

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title="전체 동영상" showBackButton />,
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id.videoId}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <VideoCard
              video={item}
              style={{ 
                width: cardWidth,
                margin: spacing.sm,
              }}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  list: {
    padding: spacing.md,
    width: '100%',
  },
}); 