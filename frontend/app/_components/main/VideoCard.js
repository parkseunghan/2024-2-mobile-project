import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { Ionicons } from '@expo/vector-icons';
import api from '@app/_utils/api';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { useRouter } from 'expo-router';

const router = useRouter();
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
  const { user } = useAuth();
  const [showSummary, setShowSummary] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [creator, setCreator] = useState(null);
  const [hasSummary, setHasSummary] = useState(false);
  
  useEffect(() => {
    const checkSummary = async () => {
      if (!video) return;

      try {
        setInitialLoading(true);
        const videoId = video.id?.videoId || video.id;
        console.log('Checking summary for video:', videoId);
        
        const response = await api.get(`/youtube/summary/${videoId}`);
        console.log('Summary response:', response.data);
        
        if (response.data?.summary) {
          const formattedSummary = formatSummaryText(response.data.summary);
          setSummaryText(formattedSummary);
          setFromCache(true);
          setCreator(response.data.creator);
          setHasSummary(true);
          console.log('Summary found, setting hasSummary to true');
        } else {
          setSummaryText('');
          setHasSummary(false);
          console.log('No summary found, setting hasSummary to false');
        }
      } catch (error) {
        console.log('Summary check error:', error.response?.status);
        if (error.response?.status !== 404) {
          console.error('요약 확인 에러:', error);
        }
        setSummaryText('');
        setHasSummary(false);
      } finally {
        setInitialLoading(false);
      }
    };
    
    checkSummary();
  }, [video]);

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

  const handleSummaryPress = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      setSummaryText('로그인이 필요한 기능입니다.');
      setShowSummary(true);
      return;
    }
    
    if (!showSummary && !hasSummary) {
      try {
        setLoading(true);
        setSummaryText('요약 중...');
        
        const videoId = video.id?.videoId || video.id;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        const response = await api.post('/youtube/summarize', { videoUrl });
        
        if (response.data.summary) {
          const formattedSummary = formatSummaryText(response.data.summary);
          setSummaryText(formattedSummary);
          setFromCache(response.data.fromCache);
          setCreator(response.data.creator);
          setHasSummary(true);
        } else {
          setSummaryText('요약 생성에 실패했습니다.');
          setHasSummary(false);
        }
      } catch (error) {
        console.error('요약 에러:', error);
        setSummaryText(error.response?.data?.error || '요약을 가져오는데 실패했습니다.');
        setHasSummary(false);
      } finally {
        setLoading(false);
      }
    }
    
    setShowSummary(!showSummary);
  };

  const renderSummaryButton = () => (
    <Pressable 
      style={[
        styles.summaryButton,
        showSummary && styles.summaryButtonActive,
        loading && styles.summaryButtonLoading
      ]}
      onPress={handleSummaryPress}
      disabled={loading || initialLoading}
    >
      <View style={styles.summaryTextContainer}>
        <Text style={styles.summaryTextTop}>요약</Text>
        {loading ? (
          <Text style={styles.summaryTextBottom}>중</Text>
        ) : (
          <Text style={styles.summaryTextBottom}>
            {hasSummary ? '보기' : '하기'}
          </Text>
        )}
      </View>
      <Ionicons 
        name={showSummary ? "chevron-up" : "chevron-down"} 
        size={16} 
        color={colors.primary}
      />
    </Pressable>
  );

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
        {renderSummaryButton()}
      </View>
      
      {showSummary && (
        <View style={styles.summaryContainer}>
          {summaryText.startsWith('🔑') ? (
            <>
              {summaryText.split('\n\n').map((section, index) => {
                if (section.startsWith('🔑 주요 키워드')) {
                  const keywords = section.replace('🔑 주요 키워드\n', '').split(' • ');
                  return (
                    <View key={`section-${index}`} style={styles.summarySection}>
                      <Text style={styles.summaryTitle}>
                        <Text style={styles.sectionIcon}>🔑</Text>
                        주요 키워드
                      </Text>
                      <View style={styles.keywordSection}>
                        {keywords.map((keyword, kidx) => (
                          <View key={`keyword-${kidx}`} style={styles.keyword}>
                            <Text style={styles.keywordText}>{keyword}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                } else if (section.startsWith('📝 요약')) {
                  const paragraphs = section.replace('📝 요약\n', '').split('\n');
                  return (
                    <View key={`section-${index}`} style={styles.summarySection}>
                      <Text style={styles.summaryTitle}>
                        <Text style={styles.sectionIcon}>📝</Text>
                        요약
                      </Text>
                      {paragraphs.map((paragraph, pidx) => {
                        const words = paragraph.trim().split(' ');
                        return (
                          <Text key={`paragraph-${pidx}`} style={styles.summaryParagraph}>
                            {words.map((word, widx) => (
                              <Text key={`word-${widx}`} style={
                                word.length >= 2 && /[가-힣]+/.test(word) ? 
                                styles.highlightText : null
                              }>
                                {word}{' '}
                              </Text>
                            ))}
                          </Text>
                        );
                      })}
                    </View>
                  );
                }
                return null;
              })}
            </>
          ) : (
            <Text style={styles.summaryContent}>{summaryText}</Text>
          )}
          {creator && fromCache && (
            <Text style={styles.summaryInfo}>
              ✍️ {creator}님이 생성한 요약입니다
            </Text>
          )}
          {!user && (
            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.loginPrompt}>
                🔒 더 많은 영상 요약을 보려면 로그인하세요
              </Text>
            </Pressable>
          )}
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
    marginTop: spacing.xs,
  },
  summaryTextTop: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
  },
  summaryTextBottom: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 2,
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
    elevation: 1,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
}); 