import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

// 현재 월 가져오기
const currentMonth = new Date().toLocaleString('default', { month: 'long' });
const currentDate = new Date().toLocaleDateString();

// 예제 데이터
const data = [
  { rank: 1, nickname: "사용자1", monthlyPoints: 6810, totalPoints: 55310 },
  { rank: 2, nickname: "사용자2", monthlyPoints: 5410, totalPoints: 35410 },
  { rank: 3, nickname: "사용자3", monthlyPoints: 4950, totalPoints: 18410 },
  { rank: 4, nickname: "사용자4", monthlyPoints: 3950, totalPoints: 8250 },
  { rank: 5, nickname: "사용자5", monthlyPoints: 3800, totalPoints: 20900 },
  { rank: 6, nickname: "사용자6", monthlyPoints: 2700, totalPoints: 20000 },
  { rank: 7, nickname: "사용자7", monthlyPoints: 2600, totalPoints: 15000 },
  { rank: 8, nickname: "사용자8", monthlyPoints: 2400, totalPoints: 14000 },
  { rank: 9, nickname: "사용자9", monthlyPoints: 2300, totalPoints: 15000 },
  { rank: 10, nickname: "사용자10", monthlyPoints: 2300, totalPoints: 69400 },
];

// 로그인한 사용자 정보
const loggedInUser = {
  nickname: "사용자3", // 로그인한 사용자의 닉네임
};

export default function RankingScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text
        style={[
          styles.cell,
          item.nickname === loggedInUser.nickname && styles.highlightedText,
        ]}
      >
        {item.rank === 1
          ? "🥇"
          : item.rank === 2
          ? "🥈"
          : item.rank === 3
          ? "🥉"
          : item.rank}
      </Text>
      <Text
        style={[
          styles.cell,
          item.nickname === loggedInUser.nickname && styles.highlightedText,
        ]}
      >
        {item.nickname}
      </Text>
      <Text
        style={[
          styles.cell,
          item.nickname === loggedInUser.nickname && styles.highlightedText,
        ]}
      >
        {item.monthlyPoints}
      </Text>
      <Text
        style={[
          styles.cell,
          item.nickname === loggedInUser.nickname && styles.highlightedText,
        ]}
      >
        {item.totalPoints}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>랭킹 화면</Text>
      <Text style={styles.date}>{currentDate}</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.headerCell]}>순위</Text>
        <Text style={[styles.cell, styles.headerCell]}>닉네임</Text>
        <Text style={[styles.cell, styles.headerCell]}>{`${currentMonth} 적립 포인트`}</Text>
        <Text style={[styles.cell, styles.headerCell]}>총 적립 포인트</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.rank.toString()}
      />
      <View style={styles.userInfo}>
        <Text style={[styles.userText, styles.highlightedText]}>
          {loggedInUser.nickname}님의 순위는 {data.find((item) => item.nickname === loggedInUser.nickname)?.rank}위 입니다.
        </Text>
        <Text style={[styles.userText, styles.highlightedText]}>
          {currentMonth} 적립 포인트는 {data.find((item) => item.nickname === loggedInUser.nickname)?.monthlyPoints}포인트,
        </Text>
        <Text style={[styles.userText, styles.highlightedText]}>
          총 적립 포인트는 {data.find((item) => item.nickname === loggedInUser.nickname)?.totalPoints}포인트입니다.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50', // 헤더 배경색
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderTopLeftRadius: 10, // 왼쪽 상단 둥글게
    borderTopRightRadius: 10, // 오른쪽 상단 둥글게
  },
  headerCell: {
    color: '#fff', // 헤더 텍스트 색상
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  highlightedText: {
    color: '#FF5722', // 로그인한 사용자 텍스트 색상
    fontWeight: 'bold',
  },
  userInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
});
