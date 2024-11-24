import React, { createContext, useState, useContext } from 'react';
import { CATEGORIES } from '@app/_config/constants';

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
    const [categories] = useState(CATEGORIES);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryVideos, setCategoryVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCategory = (id) => categories.find(cat => cat.id === id);

    const clearCategoryData = () => {
        setSelectedCategory(null);
        setCategoryVideos([]);
        setError(null);
    };

    return (
        <CategoryContext.Provider value={{
            categories,
            selectedCategory,
            setSelectedCategory,
            categoryVideos,
            setCategoryVideos,
            loading,
            setLoading,
            error,
            setError,
            getCategory,
            clearCategoryData,
        }}>
            {children}
        </CategoryContext.Provider>
    );
}

export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
}; 