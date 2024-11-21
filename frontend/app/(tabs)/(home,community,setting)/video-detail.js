import VideoDetailScreen from '@app/_screens/VideoDetailScreen';
import { useLocalSearchParams } from 'expo-router';

export default function VideoDetail() {
    const { videoId } = useLocalSearchParams();
    return <VideoDetailScreen videoId={videoId} />;
} 