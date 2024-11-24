import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export default function SettingScreen() {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showAccountDeletion, setShowAccountDeletion] = useState(false);

  const handlePasswordChangePress = () => {
    setShowPasswordChange(true);
  };

  const handleAccountDeletionPress = () => {
    setShowAccountDeletion(true);
  };

  const handleBackPress = () => {
    setShowPasswordChange(false);
    setShowAccountDeletion(false);
  };

  const handleAccountDeletionConfirm = () => {
    Alert.alert('탈퇴 하시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: () => Alert.alert('탈퇴 되었습니다'),
      },
    ]);
  };

  if (showPasswordChange) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>비밀번호 변경</Text>
        <TextInput style={styles.input} placeholder="새 비밀번호" secureTextEntry />
        <TextInput style={styles.input} placeholder="새 비밀번호 확인" secureTextEntry />
        <TextInput style={styles.input} placeholder="현재 비밀번호" secureTextEntry />
        <Text style={styles.noticeText}>※ 혹시 타인에게 계정을 양도하려고 하시나요?
에버타임 이용약관에서는 타인에게 계정 판매, 양도 및 대여 등을 엄격하게 금지하고 있습니다.
모니터링 시스템에 의해 계정 양도가 적발될 경우 해당 계정은 영구 정지, 탈퇴 등의 조치가 가해지며, 계정 양도로 인해 사기, 불법 행위가 발생할 경우 관련 법에 따라 법적 책임을 지게 될 수 있습니다.</Text>
        <Text style={styles.noticeText}>※ 타인에 의한 계정 사용이 의심되시나요?
개인정보 보호를 위해 비밀번호를 변경하여 주시기 바랍니다. 비밀번호를 변경하면 모든 디바이스(앱, 브라우저 등)에서 즉시 로그아웃 처리됩니다.</Text>
        <TouchableOpacity style={styles.changePasswordButton}>
          <Text style={styles.changePasswordButtonText}>비밀번호 변경</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showAccountDeletion) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>회원 탈퇴</Text>
        <TextInput style={styles.input} placeholder="계정 비밀번호" secureTextEntry />
        <Text style={styles.noticeText}>※ 탈퇴 및 가입을 반복할 경우, 서비스 악용 방지를 위해 재가입이 제한됩니다. 최초 탈퇴 시에는 가입 시점을 기준으로 1일간 제한되며, 2회 이상 탈퇴를 반복할 경우 30일간 제한됩니다.</Text>
        <Text style={styles.noticeText}>※ 탈퇴 후 개인정보, 시간표 등의 데이터가 삭제되며, 복구할 수 없습니다.
※ 다시 가입하더라도, 게시판 등 이용 제한 기록은 초기화되지 않습니다.
※ 작성한 게시물은 삭제되지 않으며, (알수없음)으로 닉네임이 표시됩니다.
※ 자세한 내용은 개인정보처리방침을 확인해주세요.</Text>
        <TouchableOpacity style={styles.deleteAccountButton} onPress={handleAccountDeletionConfirm}>
          <Text style={styles.deleteAccountButtonText}>회원 탈퇴</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>계정</Text>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>아이디</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer} onPress={handlePasswordChangePress}><Text style={styles.itemText}>비밀번호 변경</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>이메일 변경</Text></TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>커뮤니티</Text>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>이용 제한 내역</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>관심 키워드 설정</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>커뮤니티 이용규칙</Text></TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>앱 설정</Text>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>다크 모드</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>알림 설정</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>암호/지문 잠금</Text></TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>이용 안내</Text>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>앱 버전</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>문의하기</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>공지사항</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>서비스 이용약관</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>개인정보 처리방침</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>청소년 보호정책</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>오픈소스 라이선스</Text></TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>기타</Text>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>정보 동의 설정</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer} onPress={handleAccountDeletionPress}><Text style={styles.itemText}>회원 탈퇴</Text></TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer}><Text style={styles.itemText}>로그아웃</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  sectionContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  itemContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
    borderRadius: spacing.xs,
  },
  itemText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  input: {
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: spacing.xs,
    ...typography.body,
    color: colors.text.primary,
  },
  noticeText: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  changePasswordButton: {
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: spacing.xs,
    alignItems: 'center',
  },
  changePasswordButtonText: {
    ...typography.button,
    color: colors.text.onPrimary,
  },
  deleteAccountButton: {
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: spacing.xs,
    alignItems: 'center',
  },
  deleteAccountButtonText: {
    ...typography.button,
    color: colors.text.onPrimary,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  backButtonText: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
