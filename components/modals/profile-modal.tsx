import { useRouter } from 'expo-router';
import { ArrowRight, Crown, Flame, Ghost, Medal, TrendingUp, X } from 'lucide-react-native';
import React from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const router = useRouter();

    const handleOpenTrophyCase = () => {
        onClose();
        router.push('/badges');
    };

    return (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        {/* Pattern placeholder */}
                        <View style={styles.pattern} />

                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="white" strokeWidth={3} />
                        </TouchableOpacity>

                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <View style={styles.statusDot} />
                            </View>
                        </View>
                        <Text style={styles.username}>Anonymous</Text>
                        <Text style={styles.userId}>ID: 8X92-CLOUT</Text>
                    </View>

                    <ScrollView style={styles.content}>
                        {/* Vibe Stats */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <TrendingUp size={16} color="#9CA3AF" />
                                <Text style={styles.sectionTitle}>Vibe Check</Text>
                            </View>

                            <View style={styles.statsList}>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Chaos</Text>
                                    <View style={styles.statBarTrack}>
                                        <View style={[styles.statBarFill, { width: '85%', backgroundColor: '#FF4444' }]} />
                                    </View>
                                    <Text style={styles.statValue}>85%</Text>
                                </View>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Social</Text>
                                    <View style={styles.statBarTrack}>
                                        <View style={[styles.statBarFill, { width: '42%', backgroundColor: '#4A90E2' }]} />
                                    </View>
                                    <Text style={styles.statValue}>42%</Text>
                                </View>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Secret</Text>
                                    <View style={styles.statBarTrack}>
                                        <View style={[styles.statBarFill, { width: '65%', backgroundColor: '#9B51E0' }]} />
                                    </View>
                                    <Text style={styles.statValue}>65%</Text>
                                </View>
                            </View>
                        </View>

                        {/* Badges */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Medal size={16} color="#9CA3AF" />
                                <Text style={styles.sectionTitle}>Street Cred</Text>
                            </View>

                            <View style={styles.badgeGrid}>
                                <View style={styles.badgeCard}>
                                    <View style={[styles.badgeIcon, { backgroundColor: '#F8E71C' }]}>
                                        <Crown size={16} color="black" />
                                    </View>
                                    <Text style={styles.badgeText}>Warlord</Text>
                                </View>
                                <View style={styles.badgeCard}>
                                    <View style={[styles.badgeIcon, { backgroundColor: '#FF7E47' }]}>
                                        <Flame size={16} color="black" fill="black" />
                                    </View>
                                    <Text style={styles.badgeText}>10 Day Streak</Text>
                                </View>
                                <View style={[styles.badgeCard, styles.badgeCardInactive]}>
                                    <View style={[styles.badgeIcon, { backgroundColor: '#E5E7EB' }]}>
                                        <Ghost size={16} color="black" />
                                    </View>
                                    <Text style={styles.badgeText}>Lurker</Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={handleOpenTrophyCase} style={styles.viewAllButton}>
                                <Text style={styles.viewAllText}>Open Trophy Case</Text>
                                <ArrowRight size={16} color="black" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    container: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#FFF8F0',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: 'black',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 8,
    },
    header: {
        backgroundColor: '#1A1A1A',
        padding: 24,
        alignItems: 'center',
        position: 'relative',
    },
    pattern: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.2,
        backgroundColor: '#1A1A1A', // Placeholder for radial gradient
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 999,
        backgroundColor: '#F8E71C',
        borderWidth: 4,
        borderColor: 'white',
        position: 'relative',
    },
    statusDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 999,
        backgroundColor: '#7ED321',
        borderWidth: 3,
        borderColor: 'white',
    },
    username: {
        fontSize: 30,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
        fontStyle: 'italic',
    },
    userId: {
        color: '#9CA3AF',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 12,
    },
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: '#9CA3AF',
    },
    statsList: {
        gap: 12,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statLabel: {
        width: 64,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    statBarTrack: {
        flex: 1,
        height: 12,
        backgroundColor: '#E5E7EB',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'black',
        overflow: 'hidden',
    },
    statBarFill: {
        height: '100%',
    },
    statValue: {
        width: 32,
        fontSize: 12,
        fontWeight: '900',
    },
    badgeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    badgeCard: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    badgeCardInactive: {
        backgroundColor: '#F3F4F6',
        borderStyle: 'dashed',
        borderColor: '#D1D5DB',
        opacity: 0.5,
        shadowOpacity: 0,
    },
    badgeIcon: {
        padding: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 12,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
        padding: 12,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 12,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
});
