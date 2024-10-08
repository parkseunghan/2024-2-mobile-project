import React, { useState } from 'react';
import { View, Text, Button, FlatList, Image, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';

const YouTubeSearch = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('React Native');
  const [nextPageToken, setNextPageToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const videosPerPage = 10; // 한 페이지에 표시할 비디오 수

  const searchYouTube = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/search_youtube?query=${encodeURIComponent(searchTerm)}&pageToken=${nextPageToken}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setVideos(prevVideos => [...prevVideos, ...data.items]);
      setNextPageToken(data.nextPageToken || '');
      setTotalPages(Math.ceil(data.items.length / videosPerPage));
    } catch (error) {
      setError('Error fetching YouTube data: ' + error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreVideos = () => {
    if (nextPageToken && currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
      searchYouTube(currentPage + 1);
    }
  };

  const handleSearch = () => {
    setVideos([]); // 이전 결과 초기화
    setCurrentPage(1); // 현재 페이지를 1로 초기화
    searchYouTube(); // 새로운 검색
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <TextInput
        placeholder="Enter search term"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{ marginBottom: 10, borderColor: 'gray', borderWidth: 1, padding: 5 }}
      />
      <Button title="Search YouTube" onPress={handleSearch} />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 10 }} />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <FlatList
        data={videos.slice(0, currentPage * videosPerPage)} // 현재 페이지에 맞는 비디오만 표시
        keyExtractor={(item) => item.videoUrl}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('VideoDetail', { video: item })}>
            <View style={{ marginBottom: 20 }}>
              <Image source={{ uri: item.thumbnail }} style={{ width: 320, height: 180 }} />
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text>{item.channelTitle}</Text>
              <Text>{item.viewCount} views</Text>
              <Text>{item.subscriberCount} subscribers</Text>
              <Text>{item.publishedAt}</Text>
              <Text>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={loadMoreVideos} // 스크롤 끝에 도달했을 때 추가 비디오 로드
        onEndReachedThreshold={0.5} // 스크롤이 끝에 도달하기 전 임계값
      />
    </View>
  );
};

export default YouTubeSearch;
