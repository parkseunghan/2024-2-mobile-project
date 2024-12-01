import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { Ionicons } from '@expo/vector-icons';
import { client } from '@app/_lib/api/client';
import { useAuth } from '@app/_lib/hooks';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const formatSummaryText = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  if (text.startsWith('📝 요약') || text.startsWith('🔑 주요 키워드')) {
    return text;
  }

  const boldTexts = text.match(/\*\*(.*?)\*\*/g) || [];
  const cleanBoldTexts = boldTexts
    .map(t => t.replace(/\*\*/g, ''))
    .filter(t => t.length >= 2);

  const keywordsSection = cleanBoldTexts.length > 0 
    ? `🔑 주요 키워드\n${cleanBoldTexts.map(k => `#${k}`).join('  ')}\n\n` 
    : '';

  let mainText = text
    .replace(/\*\*/g, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  const sentences = mainText.split(/(?<=\. )/g);
  const paragraphs = [];
  let currentParagraph = [];

  sentences.forEach(sentence => {
    currentParagraph.push(sentence.trim());
    
    if (currentParagraph.length >= 2 || sentence.endsWith('.')) {
      paragraphs.push(currentParagraph.join(' '));
      currentParagraph = [];
    }
  });

  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(' '));
  }

  const formattedParagraphs = paragraphs
    .map((p, i) => `  ${i === 0 ? '💡' : '•'} ${p}`)
    .join('\n\n');

  const summaryTitle = '📝 요약';
  const separator = '━━━━━━━━━━━━━━━';

  return `${summaryTitle}\n${separator}\n\n${keywordsSection}${formattedParagraphs}`;
};

export const VideoCard = ({ video, style, onPress }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [showSummary, setShowSummary] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [creator, setCreator] = useState(null);
  const [hasSummary, setHasSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    const checkSummary = async () => {
      if (!video?.id) return;
      
      try {
        setInitialLoading(true);
        const videoId = video.id?.videoId || video.id;
        const response = await client.get(`/youtube/summary/${videoId}`);
        
        console.log('Summary response:', response.data);
        
        if (response.data?.hasSummary === true && response.data?.summary) {
          const formattedSummary = formatSummaryText(response.data.summary);
          setSummaryText(formattedSummary);
          setHasSummary(true);
          setCreator(response.data.creator);
          setFromCache(response.data.fromCache);
        } else {
          setHasSummary(false);
          setSummaryText('');
          setCreator(null);
          setFromCache(false);
        }
      } catch (error) {
        console.error('요약 확인 에러:', error);
        setHasSummary(false);
        setSummaryText('');
        setCreator(null);
        setFromCache(false);
      } finally {
        setInitialLoading(false);
      }
    };

    checkSummary();
  }, [video]);

  const handleSummaryPress = async () => {
    if (!user) {
      Alert.alert(
        '로그인 필요',
        '요약 기능은 로그인한 사용자만 이용할 수 있습니다. 로그인 화면으로 이동하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { text: '로그인', onPress: () => router.push('/login') }
        ]
      );
      return;
    }

    if (hasSummary) {
      setShowSummary(!showSummary);
      return;
    }

    try {
      setIsGenerating(true);
      setLoading(true);
      const videoId = video.id?.videoId || video.id;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      const response = await client.post('/youtube/summarize', { 
        videoId,
        videoUrl
      });
      
      if (response.data?.summary) {
        const formattedSummary = formatSummaryText(response.data.summary);
        setSummaryText(formattedSummary);
        setHasSummary(true);
        setShowSummary(true);
        setCreator(response.data.creator);
        setFromCache(response.data.fromCache);
      } else {
        throw new Error('요약 생성에 실패했습니다.');
      }
    } catch (error) {
      handleSummaryError(error);
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const handleSummaryError = async (error) => {
    console.error('요약 생성 에러:', error);
    let errorMessage = '요약 생성에 실패했습니다. 잠시 후 다시 시도해주세요.';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = '요약 생성 시간이 초과되었습니다. 다시 시도해주세요.';
    } else if (error.response?.status === 401) {
      const currentToken = await AsyncStorage.getItem('token');
      if (!currentToken) {
        errorMessage = '로그인이 필요한 기능입니다.';
        router.push('/login');
      } else {
        errorMessage = '세션이 만료되었습니다. 다시 로그인해주세요.';
        await AsyncStorage.removeItem('token');
        router.push('/login');
      }
    }
    Alert.alert('오류', errorMessage);
  };

  const renderSummaryButton = () => {
    return (
      <Pressable 
        style={[
          styles.summaryButton,
          hasSummary && showSummary && styles.summaryButtonActive,
          loading && styles.summaryButtonLoading,
          !user && styles.summaryButtonDisabled,
          isGenerating && styles.summaryButtonGenerating
        ]}
        onPress={handleSummaryPress}
        disabled={loading || isGenerating}
      >
        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryTextTop}>요약</Text>
          <Text style={styles.summaryTextBottom}>
            {isGenerating ? '중...' : (hasSummary ? '보기' : '하기')}
          </Text>
        </View>
        {!isGenerating && hasSummary && (
          <Ionicons 
            name={showSummary ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={colors.primary}
          />
        )}
      </Pressable>
    );
  };

  const renderLoginPrompt = () => (
    <Pressable 
      style={styles.loginPromptContainer}
      onPress={() => router.push('/login')}
    >
      <Text style={styles.loginPrompt}>
        요약 내용을 확인하려면 로그인이 필요합니다.
        <Text style={styles.loginLink}> 로그인하기</Text>
      </Text>
    </Pressable>
  );

  const renderSummarySection = () => {
    if (!user) {
      return (
        <View style={styles.loginPromptContainer}>
          <Text style={styles.loginPrompt}>
            요약 기능을 이용하려면 {' '}
            <Text 
              style={styles.loginLink}
              onPress={() => router.push('/login')}
            >
              로그인
            </Text>
            이 필요합니다.
          </Text>
        </View>
      );
    }

    if (loading || initialLoading) {
      return (
        <View style={styles.summarySection}>
          <Text>요약을 불러오는 중...</Text>
        </View>
      );
    }

    if (showSummary && summaryText) {
      return (
        <View style={styles.summarySection}>
          <Text style={styles.summaryText}>{summaryText}</Text>
          {creator && (
            <Text style={styles.summaryInfo}>
              {fromCache ? '기존 요약' : '새로 생성된 요약'} by {creator}
            </Text>
          )}
        </View>
      );
    }

    return null;
  };

  if (initialLoading) {
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

  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
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
        {renderSummaryButton()}
      </View>
      
      {showSummary && !user && renderLoginPrompt()}
      {renderSummarySection()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
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
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  channelTitle: {
    ...typography.caption,
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  summaryButton: {
    position: 'absolute',
    right: spacing.sm,
    top: '50%',
    transform: [{ translateY: -28 }],
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: `${colors.primary}08`,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    padding: spacing.xs,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryButtonActive: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  summaryButtonLoading: {
    opacity: 0.7,
  },
  summaryTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTextTop: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 14,
    marginBottom: 2,
  },
  summaryTextBottom: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 14,
  },
  summaryIcon: {
    marginTop: 2,
  },
  summaryContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: `${colors.border}50`,
    backgroundColor: colors.background,
  },
  summaryContent: {
    ...typography.body,
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  keywordSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    backgroundColor: `${colors.primary}08`,
    padding: spacing.md,
    borderRadius: 12,
  },
  keyword: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  keywordText: {
    ...typography.caption,
    fontSize: 13,
    color: colors.background,
    fontWeight: '700',
  },
  summaryTitle: {
    ...typography.h2,
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryParagraph: {
    ...typography.body,
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: spacing.md,
    paddingLeft: spacing.sm,
    fontWeight: '400',
  },
  summaryInfo: {
    ...typography.caption,
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: spacing.lg,
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: `${colors.border}30`,
    paddingTop: spacing.md,
    textAlign: 'center',
    fontWeight: '500',
  },
  loginPrompt: {
    ...typography.body,
    fontSize: 14,
    color: colors.primary,
    marginTop: spacing.md,
    textAlign: 'center',
    backgroundColor: `${colors.primary}10`,
    padding: spacing.md,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: '600',
  },
  summarySection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  sectionIcon: {
    marginRight: spacing.xs,
    fontSize: 20,
  },
  highlightText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  loginPromptContainer: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  loginPrompt: {
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  summaryButtonDisabled: {
    opacity: 0.7,
    backgroundColor: `${colors.primary}05`,
  },
  summaryButtonGenerating: {
    backgroundColor: `${colors.primary}20`,
    opacity: 0.8,
  }
}); 