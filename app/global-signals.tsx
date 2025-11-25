import { GlobalTrendModal } from '@/components/modals/global-trend-modal';
import { GLOBAL_TRENDS } from '@/constants/data';
import { useRouter } from 'expo-router';
import { ArrowDownToLine, ArrowLeft, Globe } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GlobalSignalsPage() {
    const router = useRouter();
    const [selectedTrend, setSelectedTrend] = useState<any>(null);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="white" strokeWidth={3} />
                </TouchableOpacity>
                <View style={styles.headerTitleRow}>
                    <Globe size={24} color="white" />
                    <Text style={styles.headerTitle}>Global Signals</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>

                {GLOBAL_TRENDS.map((trend) => (
                    <View key={trend.id} style={styles.card}>
                        <View style={[styles.cardHeader, { backgroundColor: trend.color }]}>
                            <Text style={styles.sourceText}>{trend.source}</Text>
                        </View>

                        <View style={styles.cardBody}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>{trend.icon}</Text>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.cardTitle}>{trend.title}</Text>
                                <Text style={styles.cardDesc}>{trend.desc}</Text>
                            </View>
                        </View>

                        <View style={styles.cardFooter}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => setSelectedTrend(trend)}
                            >
                                <Text style={styles.actionText}>{trend.action}</Text>
                                <ArrowDownToLine size={14} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <GlobalTrendModal
                trend={selectedTrend}
                isOpen={!!selectedTrend}
                onClose={() => setSelectedTrend(null)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: 'black',
    },
    backButton: {
        padding: 8,
        backgroundColor: '#333',
        borderRadius: 999,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    content: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    subtitle: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 3,
        borderColor: 'black',
        overflow: 'hidden',
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    cardHeader: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    sourceText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cardBody: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'black',
    },
    icon: {
        fontSize: 24,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6B7280',
        lineHeight: 16,
    },
    cardFooter: {
        padding: 12,
        borderTopWidth: 2,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FAFAFA',
    },
    actionButton: {
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 8,
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
});
