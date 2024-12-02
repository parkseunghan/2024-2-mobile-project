import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export function DashboardChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>데이터가 없습니다.</Text>
            </View>
        );
    }

    // 차트 데이터 포맷팅
    const chartData = {
        labels: data.map(item => {
            const date = new Date(item._id);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [{
            data: data.map(item => item.count)
        }]
    };

    return (
        <View style={styles.container}>
            <LineChart
                data={chartData}
                width={Dimensions.get('window').width - (spacing.md * 2)}
                height={220}
                chartConfig={{
                    backgroundColor: colors.white,
                    backgroundGradientFrom: colors.white,
                    backgroundGradientTo: colors.white,
                    decimalPlaces: 0,
                    color: (opacity = 1) => colors.primary,
                    style: {
                        borderRadius: 16,
                    },
                }}
                bezier
                style={styles.chart}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: spacing.md,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    chart: {
        marginVertical: spacing.md,
        borderRadius: 8,
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderRadius: 8,
    },
    emptyText: {
        ...typography.body,
        color: colors.text.secondary,
    },
}); 