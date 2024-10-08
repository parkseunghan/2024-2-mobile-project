import React from 'react';
import { View, Text, Image, StyleSheet, Linking } from 'react-native';

const VideoDetail = ({ route }) => {
  const { video } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{video.title}</Text>
      <Text style={styles.channelTitle}>Channel: {video.channelTitle}</Text>
      <Text style={styles.info}>{video.viewCount} views</Text>
      <Text style={styles.info}>{video.subscriberCount} subscribers</Text>
      <Text style={styles.info}>Published on: {video.publishedAt}</Text>
      <Text style={styles.description}>{video.description}</Text>
      <Text style={styles.link} onPress={() => Linking.openURL(video.videoUrl)}>
        Watch on YouTube
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
  },
  channelTitle: {
    fontSize: 16,
    marginVertical: 5,
  },
  info: {
    fontSize: 14,
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    marginVertical: 10,
  },
  link: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default VideoDetail;
