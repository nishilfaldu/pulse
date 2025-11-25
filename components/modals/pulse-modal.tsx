import { Activity, Hash, MapPin, X, Zap } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PULSE_DATA } from '../../constants/data';
import { STYLES } from '../../constants/theme';

interface PulseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PulseModal({ isOpen, onClose }: PulseModalProps) {
    return (
        <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <Activity color="white" size={24} />
                            <Text style={styles.headerText}>Trend Dashboard</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <X color="white" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {/* Pulse Text */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Today's Daily Pulse</Text>
                            <View style={styles.pulseBox}>
                                <Text style={styles.pulseText}>"{PULSE_DATA.text}"</Text>
                            </View>
                            <Text style={styles.author}>Submitted by {PULSE_DATA.author} (Random Pick)</Text>
                        </View>

                        {/* Viz */}
                        <View style={styles.vizContainer}>
                            {/* Location */}
                            <View>
                                <View style={styles.vizHeader}>
                                    <MapPin size={16} color="black" />
                                    <Text style={styles.vizTitle}>Where is this?</Text>
                                </View>
                                <View style={styles.barChart}>
                                    {PULSE_DATA.stats.building.map((item, idx) => (
                                        <View
                                            key={idx}
                                            style={[styles.barSegment, { width: `${item.val}%`, backgroundColor: item.color }]}
                                        >
                                            <Text style={styles.barLabel}>{item.label}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Mood */}
                            <View>
                                <View style={styles.vizHeader}>
                                    <Zap size={16} color="black" />
                                    <Text style={styles.vizTitle}>What's the vibe?</Text>
                                </View>
                                <View style={styles.moodList}>
                                    {PULSE_DATA.stats.mood.map((item, idx) => (
                                        <View key={idx} style={styles.moodRow}>
                                            <View style={styles.moodBarContainer}>
                                                <View style={[styles.moodBarFill, { width: `${item.val}%`, backgroundColor: item.color }]} />
                                                <Text style={styles.moodLabel}>{item.label}</Text>
                                            </View>
                                            <Text style={styles.moodValue}>{item.val}%</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* Action */}
                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                            <Hash size={18} color="white" />
                            <Text style={styles.actionButtonText}>Add Your Tag</Text>
                        </TouchableOpacity>
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
        ...STYLES.card,
        width: '100%',
        maxWidth: 380,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 24,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#4A90E2',
        padding: 16,
        borderBottomWidth: 3,
        borderBottomColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 20,
        textTransform: 'uppercase',
    },
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    pulseBox: {
        backgroundColor: '#FEFCE8',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
    },
    pulseText: {
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 28,
    },
    author: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
        marginTop: 8,
    },
    vizContainer: {
        gap: 24,
        marginBottom: 32,
    },
    vizHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    vizTitle: {
        fontWeight: '900',
        fontSize: 14,
    },
    barChart: {
        flexDirection: 'row',
        height: 48,
        gap: 8,
    },
    barSegment: {
        height: '100%',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    barLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: 'white',
    },
    moodList: {
        gap: 8,
    },
    moodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    moodBarContainer: {
        flex: 1,
        height: 32,
        backgroundColor: '#F3F4F6',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'black',
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
    },
    moodBarFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
    },
    moodLabel: {
        position: 'absolute',
        left: 12,
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(0,0,0,0.7)',
        textTransform: 'uppercase',
        zIndex: 10,
    },
    moodValue: {
        fontSize: 12,
        fontWeight: 'bold',
        width: 32,
    },
    actionButton: {
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    actionButtonText: {
        color: 'white',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
