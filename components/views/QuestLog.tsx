import { Calendar, ChevronRight, Trophy, X } from 'lucide-react-native';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock Data for Past Quests
const PAST_QUESTS = [
    { id: '004', title: 'High Five a Stranger', date: 'Yesterday', winner: 'sarah_j', color: '#FF4444' },
    { id: '003', title: 'Find a Red Balloon', date: 'Nov 23', winner: 'mike_t', color: '#4444FF' },
    { id: '002', title: 'Dance in Public', date: 'Nov 22', winner: 'jess_dance', color: '#44FF44' },
    { id: '001', title: 'Pet a Dog', date: 'Nov 21', winner: 'dog_lover', color: '#FFFF44' },
];

interface QuestLogProps {
    onClose: () => void;
    onSelectQuest: (questId: string) => void;
}

export function QuestLog({ onClose, onSelectQuest }: QuestLogProps) {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Calendar size={24} color="white" />
                        <Text style={styles.headerTitle}>QUEST LOG</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.sectionTitle}>ARCHIVE</Text>

                    {PAST_QUESTS.map((quest) => (
                        <TouchableOpacity
                            key={quest.id}
                            style={styles.questItem}
                            onPress={() => onSelectQuest(quest.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.questInfo}>
                                <View style={styles.questHeader}>
                                    <Text style={[styles.questId, { color: quest.color }]}>QUEST #{quest.id}</Text>
                                    <Text style={styles.questDate}>{quest.date}</Text>
                                </View>
                                <Text style={styles.questTitle}>{quest.title}</Text>
                                <View style={styles.winnerRow}>
                                    <Trophy size={12} color="#FFD700" />
                                    <Text style={styles.winnerName}>Winner: @{quest.winner}</Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color="#666" />
                        </TouchableOpacity>
                    ))}

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Only the Daily Wraps survive.</Text>
                        <Text style={styles.footerText}>Raw feeds are archived after 48h.</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 2,
    },
    closeButton: {
        padding: 8,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
    },
    scrollContent: {
        padding: 20,
    },
    sectionTitle: {
        color: '#666',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 16,
        letterSpacing: 1,
    },
    questItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#111',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#222',
    },
    questInfo: {
        flex: 1,
    },
    questHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        paddingRight: 12,
    },
    questId: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },
    questDate: {
        color: '#666',
        fontSize: 12,
    },
    questTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    winnerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    winnerName: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
        gap: 4,
    },
    footerText: {
        color: '#333',
        fontSize: 12,
        fontStyle: 'italic',
    },
});
