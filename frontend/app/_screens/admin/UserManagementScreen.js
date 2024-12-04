import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { adminApi } from '@app/_lib/api/admin';
import { Button } from '@app/_components/common/Button';
import { SearchInput } from '@app/_components/common/SearchInput';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export default function UserManagementScreen() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadUsers = async (reset = false) => {
        if (loading || (!hasMore && !reset)) return;

        try {
            setLoading(true);
            const newPage = reset ? 1 : page;
            const response = await adminApi.getUsers({
                page: newPage,
                limit: 20,
                search: search.trim()
            });

            setUsers(reset ? response.users : [...users, ...response.users]);
            setHasMore(response.users.length === 20);
            setPage(newPage + 1);
        } catch (error) {
            console.error('사용자 목록 로드 실패:', error);
            Alert.alert('오류', '사용자 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        
        try {
            await adminApi.updateUserRole(userId, newRole);
            setUsers(users.map(user => 
                user.id === userId ? { ...user, role: newRole } : user
            ));
            Alert.alert('성공', '사용자 권한이 업데이트되었습니다.');
        } catch (error) {
            console.error('권한 수정 실패:', error);
            Alert.alert('오류', '권한 수정에 실패했습니다.');
        }
    };

    useEffect(() => {
        loadUsers(true);
    }, [search]);

    const renderItem = ({ item }) => (
        <View style={styles.userItem}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userRole}>{item.role}</Text>
            </View>
            <Button
                title={item.role === 'admin' ? '관리자 해제' : '관리자 지정'}
                onPress={() => handleRoleUpdate(item.id, item.role)}
                variant={item.role === 'admin' ? 'secondary' : 'primary'}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <SearchInput
                value={search}
                onChangeText={setSearch}
                placeholder="사용자 검색..."
                style={styles.searchInput}
            />
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                onEndReached={() => loadUsers()}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>사용자가 없습니다.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    searchInput: {
        marginBottom: spacing.md,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: 8,
        marginBottom: spacing.sm,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...typography.subtitle,
        marginBottom: spacing.xs,
    },
    userEmail: {
        ...typography.body,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    userRole: {
        ...typography.caption,
        color: colors.primary,
    },
    emptyText: {
        ...typography.body,
        textAlign: 'center',
        marginTop: spacing.xl,
        color: colors.text.secondary,
    },
}); 