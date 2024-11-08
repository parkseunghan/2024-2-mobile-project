import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export default function CommunityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>커뮤니티 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  text: {
    ...typography.body,
    color: colors.text.secondary,
  },
}); 