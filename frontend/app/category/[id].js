import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Header } from '@app/_components/common/Header';
import CategoryDetailScreen from '@app/_screens/CategoryDetailScreen';

export default function CategoryDetail() {
    const { id, title } = useLocalSearchParams();

    return (
        <>
            <Stack.Screen
                options={{
                    header: () => (
                        <Header
                            title={title}
                            showBackButton={true}
                            hideSearchBar={true}
                        />
                    ),
                    headerShown: true
                }}
            />
            <CategoryDetailScreen categoryId={id} />
        </>
    );
} 