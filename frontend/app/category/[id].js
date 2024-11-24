import React from 'react';
import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '@app/_components/common/Header';
import CategoryDetailScreen from '@app/_screens/CategoryDetailScreen';
import { CATEGORIES } from '@app/_config/constants';

export default function CategoryDetail() {
    const { id } = useLocalSearchParams();
    const category = CATEGORIES.find(cat => cat.id === id);

    return (
        <>
            <Stack.Screen
                options={{
                    header: () => (
                        <Header
                            title={category?.title}
                            showBackButton={true}
                        />
                    ),
                }}
            />
            <CategoryDetailScreen categoryId={id} />
        </>
    );
} 