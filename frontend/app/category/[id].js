import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Header } from '@app/_components/common/Header';
import SearchResultScreen from '@app/_screens/SearchResultScreen';

export default function CategoryDetail() {
    const { id, searchKeywords, title, hideSearchQuery } = useLocalSearchParams();

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
            <SearchResultScreen 
                initialQuery={searchKeywords}
                hideSearchQuery={true}
                skipSearchHistory={true}
            />
        </>
    );
} 