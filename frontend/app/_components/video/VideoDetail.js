import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { VideoPlayer } from './VideoPlayer';
import { VideoInfo } from './VideoInfo';

export const VideoDetail = ({ videoId, videoDetails, playing, onStateChange, onPlayPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.playerWrapper}>
        <View style={styles.playerContainer}>
          <VideoPlayer
            videoId={videoId}
            playing={playing}
            onStateChange={onStateChange}
          />
        </View>
      </View>
      
      {videoDetails && (
        <View style={styles.infoWrapper}>
          <VideoInfo 
            videoDetails={videoDetails} 
            playing={playing}
            onPlayPress={onPlayPress}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerWrapper: {
    backgroundColor: colors.black,
    paddingVertical: spacing.sm,
  },
  playerContainer: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    backgroundColor: colors.black,
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    } : {
      elevation: 2,
    }),
  },
  infoWrapper: {
    flex: 1,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
}); 