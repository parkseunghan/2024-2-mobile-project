import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { colors } from '@app/_styles/colors';

const PLAYER_HEIGHT = Math.min(
  Dimensions.get('window').width * (9/16),
  250
);

export const VideoPlayer = ({ videoId, playing, onStateChange }) => {
  if (Platform.OS === 'web') {
    return (
      <iframe
        width="100%"
        height={PLAYER_HEIGHT}
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ backgroundColor: colors.black }}
      />
    );
  }

  const YoutubePlayer = require('react-native-youtube-iframe').default;
  return (
    <YoutubePlayer
      height={PLAYER_HEIGHT}
      play={playing}
      videoId={videoId}
      onChangeState={onStateChange}
      initialPlayerParams={{
        preventFullScreen: false,
        cc_lang_pref: "ko",
        showClosedCaptions: true,
        controls: true,
        modestbranding: true
      }}
    />
  );
}; 