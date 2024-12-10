import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { postsApi } from '@app/_lib/api/posts';
import { useAuth } from '@app/_lib/hooks';
import { LoadingSpinner } from '@app/_components/common/LoadingSpinner';
import { colors } from '@app/_styles/colors';

export default function EventScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // 게시글 무한 스크롤 쿼리
    const {
        data: allPostsData,
        fetchNextPage: fetchNextAllPosts,
        hasNextPage: hasNextAllPosts,
        isLoading: isLoadingAllPosts,
        isFetchingNextPage: isFetchingNextAllPosts,
        refetch, // 🚀 refetch 추가
    } = useInfiniteQuery({
        queryKey: ['posts', searchText], // ✅ queryKey에 searchText 추가
        queryFn: ({ pageParam = 1 }) => postsApi.fetchPosts({
            page: pageParam,
            search: searchText, // ✅ searchText로 검색
            searchFields: ['title', 'content', 'author_name']
        }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    });
    
    const noticePosts = [
        {
          id: 'notice-1', // 고유한 id로 설정
          title: '🎉 커뮤니티 이용 안내 및 공지사항',
          content: '안녕하세요! 이 커뮤니티의 이용 방법과 공지사항에 대해 알려드립니다. 여기에서는 유익한 꿀팁을 서로 공유할 수 있습니다. 불건전한 게시글은 삭제될 수 있습니다.',
          author_name: '관리자',
          like_count: 999,
          comment_count: 45,
          media_url: null,
          created_at: '2024-12-08',
          category: 'notice', 
        }
    ];

    const posts = [
        {
          id: '1',
          title: '겨울 난방비 절약 꿀팁 5가지',
          content: '겨울철 난방비를 줄일 수 있는 꿀팁 5가지를 소개합니다. 첫째, 창문에 단열 필름을 붙이세요. 둘째, 바닥에 카펫을 깔아보세요. 셋째, 외출 시 보일러 온도를 낮추고 외출 모드를 활용하세요. 넷째, 사용하지 않는 방의 문은 닫아두세요. 다섯째, 스마트 플러그로 대기 전력을 차단하세요.',
          author_name: '절약왕',
          like_count: 45,
          comment_count: 12,
          media_url: 'https://via.placeholder.com/150',
          created_at: '2024-12-07',
        },
        {
          id: '2',
          title: '난방비 폭탄 피하는 법',
          content: '이번 겨울에는 난방비 폭탄을 피하기 위해 몇 가지 팁을 실천하고 있어요. 저는 보일러의 외출 모드를 적극 활용하고 있습니다. 이 기능을 사용하면 집에 아무도 없을 때 보일러가 자동으로 온도를 낮춰서 에너지 절약이 가능하더라구요!',
          author_name: '보일러박사',
          like_count: 30,
          comment_count: 8,
          media_url: 'https://via.placeholder.com/150',
          created_at: '2024-12-06',
        },
        {
          id: '3',
          title: '보일러 절약의 핵심은 문단속!',
          content: '문을 열어두면 따뜻한 공기가 쉽게 빠져나가기 때문에, 꼭 문을 닫고 생활하세요! 특히, 사용하지 않는 방의 문을 닫아두면 전체 난방비 절약에 효과적이에요. 간단하지만 효과가 큰 방법입니다.',
          author_name: '난방전문가',
          like_count: 25,
          comment_count: 6,
          media_url: 'https://via.placeholder.com/150',
          created_at: '2024-12-05',
        }
      ];
      
      
    // ✨ 이 위치에서 filteredPosts를 수정합니다 ✨
        const filteredPosts = [
            ...noticePosts, // 🔥 공지사항을 가장 위에 추가
            ...posts.filter((post) => {
                const matchesSearch = post.title.toLowerCase().includes(searchText.toLowerCase()) 
                    || post.content.toLowerCase().includes(searchText.toLowerCase()) 
                    || post.author_name.toLowerCase().includes(searchText.toLowerCase());
                return matchesSearch;
            })
        ];



        const renderTop3Post = ({ item, index }) => {
            let containerStyle;
            let rankIcon;
        
            // 🏅 순위에 따라 스타일과 아이콘 설정
            if (index === 0) {
                containerStyle = styles.firstPlace;
                rankIcon = '🥇'; // 1등 아이콘
            } else if (index === 1) {
                containerStyle = styles.secondPlace;
                rankIcon = '🥈'; // 2등 아이콘
            } else if (index === 2) {
                containerStyle = styles.thirdPlace;
                rankIcon = '🥉'; // 3등 아이콘
            }
        
            return (
                <Pressable
                    style={[styles.top3PostContainer, containerStyle]} // 🔥 순위에 따라 스타일 적용
                    onPress={() => 
                        router.push({ 
                            pathname: '/_screens/event/EventDetailScreen', 
                            params: { id: item.id } 
                        })
                    }
                >
                    <Text style={styles.rankIcon}>{rankIcon}</Text> 
                    <Text style={styles.top3PostTitle}>{item.title}</Text>
                    <Text style={styles.top3PostLikes}>{`👍 ${item.like_count}개`}</Text>
                </Pressable>
            );
        };
        
    

    const renderPost = ({ item }) => (
        <Pressable
            style={[
                styles.postContainer, 
                item.category === 'notice' ? styles.noticePostContainer : null // 🔥 공지사항 스타일 추가
            ]}
            onPress={() => 
                router.push({ 
                    pathname: '/_screens/event/EventDetailScreen', 
                    params: { id: item.id } 
                })
            }
            >
            {item.media_url && (
                <View style={styles.mediaPreviewContainer}>
                    <Image source={{ uri: item.media_url }} style={styles.postImage} />
                </View>
            )}
            <View style={styles.postContent}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postAuthor}>
                    {`${item.author_name} · ${item.created_at}`}
                </Text>
                <View style={styles.postStats}>
                    <View style={styles.statItem}>
                        <Icon name="thumb-up" size={16} color="#555" />
                        <Text style={styles.statText}>{item.like_count}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Icon name="comment" size={16} color="#555" />
                        <Text style={styles.statText}>{item.comment_count}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    return (
        <ScrollView style={styles.container}>

            {/* 🚀 이벤트 배너 추가 */}
            <View style={styles.bannerContainer}>
                <Image
                    source={require('../../../assets/banner.png')} // 배너 이미지 경로에 맞게 수정
                    style={styles.bannerImage}
                />
            </View>


            <TextInput
                style={styles.searchInput}
                placeholder="검색어를 입력하세요"
                value={searchText}
                onChangeText={(text) => {
                    setSearchText(text);
                    refetch(); // 🚀 검색어 변경 시 쿼리 리프레시
             }}
            />





            {/* 🚀 이벤트 당첨 후보 TOP3 추가 */}
            {posts.length > 0 && (
                <View style={styles.top3Section}>
                    <Text style={styles.top3Title}>이벤트 당첨 후보 TOP3</Text>
                    <FlatList
                        data={posts.slice(0, 3)} // 🔥 상위 3개의 게시글을 TOP3로 보여줌
                        renderItem={({ item, index }) => renderTop3Post({ item, index })} // 🔥 index 추가
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            )}


            {/* 🚀 게시글 리스트 */}
            <FlatList
                data={filteredPosts} // 🚀 filteredPosts로 변경
                renderItem={renderPost}
                keyExtractor={item => item.id.toString()}
                onEndReached={() => {
                    if (hasNextAllPosts && !isFetchingNextAllPosts) {
                        fetchNextAllPosts();
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isFetchingNextAllPosts ? <LoadingSpinner /> : null}
                ListEmptyComponent={
                    !isLoadingAllPosts && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>게시글이 없습니다.</Text>
                        </View>
                    )
                }
            />

            {/* 🚀 게시글 작성 버튼 */}
            <Pressable
                style={styles.floatingButton}
                onPress={() => router.push('/post/create')}
            >
                <Icon name="add" size={24} color="#fff" />
            </Pressable>
            </ScrollView>
    );
}

const styles = StyleSheet.create({

    bannerContainer: {
        width: '100%',
        height: 180, // 🚀 배너 높이 증가
        marginBottom: 16,
        overflow: 'hidden',
        borderRadius: 15, // 🚀 배너 둥글게 변경
        borderWidth: 2, // 🚀 테두리 추가
        borderColor: '#FFDE59', // 🚀 테두리 색상 추가
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 15, // 🚀 배너 둥글게 변경
    },
    
    
    top3Section: {
        padding: 16,
        backgroundColor: '#FFF9E3', // 🚀 연한 크림색 배경
        marginBottom: 16,
        borderRadius: 15, // 더 둥글게
        marginHorizontal: 16,
        shadowColor: '#FBBF24', // 🚀 그림자 추가
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    
    
    top3Title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    top3PostContainer: {
        padding: 8,
        borderWidth: 2, // 테두리를 두껍게
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center', // 아이콘과 텍스트 정렬
    },
    firstPlace: {
        backgroundColor: '#FFD700', // 🥇 골드
        borderColor: '#DAA520',
    },
    secondPlace: {
        backgroundColor: '#C0C0C0', // 🥈 실버
        borderColor: '#A9A9A9',
    },
    thirdPlace: {
        backgroundColor: '#CD7F32', // 🥉 브론즈
        borderColor: '#8B4513',
    },
    rankIcon: {
        fontSize: 24, // 1등, 2등, 3등 순위 크기
        fontWeight: 'bold',
        color: '#fff', // 아이콘 글자 색상
        marginRight: 10, // 아이콘과 텍스트 사이 여백
    },
    top3PostTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1, // 제목이 너비를 꽉 채우도록
    },
    top3PostLikes: {
        fontSize: 14,
        color: 'gray',
    },
    top3PostTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    top3PostLikes: {
        fontSize: 12,
        color: 'gray',
        marginTop: 4,
    },
    

    container: {
        flex: 1,
        backgroundColor: '#FDF6E3',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#FBBF24', // 🚀 노란색 테두리
        backgroundColor: '#FFF9E3', // 🚀 연한 크림색 배경
        borderRadius: 20, // 둥글게 만들기
        padding: 12, // 패딩 더 크게
        marginBottom: 16,
        marginHorizontal: 16,
        fontSize: 16, // 글씨 크기 키우기
        color: '#555',
    },
    
    noticePostContainer: {
        backgroundColor: '#FFEB3B', // 노란색 배경
        borderLeftWidth: 6,
        borderLeftColor: '#FF9800', // 주황색 테두리
        padding: 10, // 추가 패딩
    },
    
    postContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 10,
        backgroundColor: '#FFF9E3', // 🚀 연한 크림색 배경
        borderRadius: 12, // 🚀 둥근 모서리
        shadowColor: '#FBBF24', // 🚀 그림자 추가
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    
    
    mediaPreviewContainer: {
        marginRight: 16,
    },
    postImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    postContent: {
        flex: 1,
    },
    postTitle: {
        fontSize: 18, // 🔥 크기 확대
        fontWeight: 'bold',
        color: '#5D4037', // 🍯 꿀 느낌의 갈색 텍스트
    },
    postAuthor: {
        fontSize: 14, // 🔥 크기 확대
        color: '#6D4C41', // 🍯 꿀 느낌의 갈색 텍스트
        marginTop: 4,
    },
    
    postStats: {
        flexDirection: 'row',
        marginTop: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    statText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#555',
    },
    floatingButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#FFDE59', // 🚀 파스텔 노란색 버튼
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FBBF24', // 부드러운 그림자 효과 추가
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#555',
    },
});