import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { Ionicons } from '@expo/vector-icons';
import api from '@app/_utils/api';

const decodeHTMLEntities = (text) => {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
};

export const VideoCard = ({ video, style, onPress }) => {
  const [showSummary, setShowSummary] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (!video) {
    return null;
  }

  const thumbnailUrl = 
    video.snippet?.thumbnails?.medium?.url ||
    video.thumbnail ||
    'https://i.ytimg.com/vi/default/mqdefault.jpg';

  const title = video.snippet?.title || video.title || '제목 없음';
  const channelTitle = video.snippet?.channelTitle || video.channelTitle || '채널 정보 없음';

  const decodedTitle = decodeHTMLEntities(title);
  const decodedChannelTitle = decodeHTMLEntities(channelTitle);

  const handleSummaryPress = async (e) => {
    e.stopPropagation();
    
    if (!showSummary) {
        try {
            setLoading(true);
            setSummaryText('요약 중...');
            
            const videoId = video.id?.videoId || video.id;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            
            console.log('Requesting summary for:', videoUrl);
            
            const response = await api.post('/youtube/summarize', 
                { videoUrl },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Summary response:', response.data);
            
            if (response.data.requestId) {
                while (true) {
                    const summaryResponse = await api.get(`/youtube/summary/${response.data.requestId}`);
                    console.log('Summary status response:', summaryResponse.data);
                    
                    if (summaryResponse.data.status === 'done' && 
                        summaryResponse.data.data?.type === 'shortSummary') {
                        setSummaryText(summaryResponse.data.data.data.summary);
                        break;
                    }
                    
                    if (summaryResponse.data.status === 'error') {
                        setSummaryText('요약 생성에 실패했습니다.');
                        break;
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            } else {
                setSummaryText('요약 요청에 실패했습니다.');
            }
        } catch (error) {
            console.error('요약 에러:', error);
            setSummaryText('요약을 가져오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }
    
    setShowSummary(!showSummary);
  };

  return (
    <Pressable 
      style={[styles.container, style]}
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text 
            style={styles.title}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {decodedTitle}
          </Text>
          <Text 
            style={styles.channelTitle}
            numberOfLines={1}
          >
            {decodedChannelTitle}
          </Text>
        </View>
        <Pressable 
          style={[
            styles.summaryButton,
            showSummary && styles.summaryButtonActive,
            loading && styles.summaryButtonLoading
          ]}
          onPress={handleSummaryPress}
          disabled={loading}
        >
          <Text style={styles.summaryText}>{loading ? '요약중' : '요약'}</Text>
          <Ionicons 
            name={showSummary ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={colors.primary} 
          />
        </Pressable>
      </View>
      
      {showSummary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryContent}>
            {summaryText}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  contentContainer: {
    flexDirection: 'row',
    padding: spacing.sm,
    alignItems: 'center',
  },
  thumbnail: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: 55,
  },
  title: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  channelTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 12,
  },
  summaryButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    backgroundColor: `${colors.primary}10`,
    position: 'absolute',
    right: spacing.sm,
    top: '50%',
    transform: [{ translateY: -25 }],
    width: 45,
    height: 50,
    gap: 2,
  },
  summaryButtonActive: {
    backgroundColor: `${colors.primary}20`,
  },
  summaryButtonLoading: {
    opacity: 0.7,
  },
  summaryText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  summaryContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: `${colors.border}50`,
    backgroundColor: `${colors.primary}05`,
  },
  summaryContent: {
    ...typography.body,
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  buttonText: {
    color: '#2D3436',
    fontSize: 14,
    fontWeight: '600',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
}); 