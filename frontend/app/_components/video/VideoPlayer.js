import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { colors } from '@app/_styles/colors';

/**
 * 비디오 플레이어 컴포넌트
 * - 웹과 네이티브 플랫폼에서 각각 다른 플레이어 사용
 * - 웹: iframe 사용
 * - 네이티브: react-native-youtube-iframe 사용
 */

// 16:9 비율을 유지하면서 화면 너비에 맞춤
const PLAYER_HEIGHT = Math.min(
    Dimensions.get('window').width * (9 / 16),
    450
);

/**
 * @param {string} videoId - YouTube 비디오 ID
 * @param {Function} onStateChange - 비디오 상태 변경 핸들러 (네이티브 전용)
 */
export const VideoPlayer = ({ videoId, onStateChange }) => {
    // 웹 플랫폼용 렌더링
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

    // 네이티브 플랫폼용 렌더링
    const YoutubePlayer = require('react-native-youtube-iframe').default;
    return (
        <YoutubePlayer
            height={PLAYER_HEIGHT}
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