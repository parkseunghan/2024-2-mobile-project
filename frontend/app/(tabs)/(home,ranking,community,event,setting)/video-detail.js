import VideoDetailScreen from '@app/_screens/home/VideoDetailScreen';
import { useLocalSearchParams } from 'expo-router';

/**
 * 비디오 상세 화면 컴포넌트
 * - VideoDetailScreen을 렌더링
 * - URL 파라미터에서 videoId를 추출하여 전달
 */
export default function VideoDetail() {
    const { videoId } = useLocalSearchParams();
    return <VideoDetailScreen videoId={videoId} />;
} 