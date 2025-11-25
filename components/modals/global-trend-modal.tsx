import { Flame, Globe, MapPin, Swords, X } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { STYLES } from '../../constants/theme';

interface GlobalTrendModalProps {
    trend: any;
    isOpen: boolean;
    onClose: () => void;
}

export function GlobalTrendModal({ trend, isOpen, onClose }: GlobalTrendModalProps) {
    if (!trend) return null;

    return (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={[styles.header, { backgroundColor: trend.color }]}>
                        <View style={styles.headerTitle}>
                            <Globe size={20} color="white" />
                            <Text style={styles.headerText}>Global Import</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <X color="white" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <View style={styles.hero}>
                            <Text style={styles.heroIcon}>{trend.icon}</Text>
                            <Text style={styles.heroTitle}>{trend.title}</Text>
                            <Text style={styles.heroSource}>Viral on {trend.source}</Text>
                            <View style={styles.quoteBox}>
                                <Text style={styles.quoteText}>"{trend.desc}"</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>How to localize this?</Text>

                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                                <View style={[styles.actionIcon, { backgroundColor: '#FF4444' }]}>
                                    <Flame size={18} color="white" />
                                </View>
                                <View>
                                    <Text style={styles.actionTitle}>Launch Challenge</Text>
                                    <Text style={styles.actionDesc}>Start a city-wide dare</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                                <View style={[styles.actionIcon, { backgroundColor: '#F8E71C' }]}>
                                    <Swords size={18} color="black" />
                                </View>
                                <View>
                                    <Text style={styles.actionTitle}>Start Debate</Text>
                                    <Text style={styles.actionDesc}>Cringe or Based?</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                                <View style={[styles.actionIcon, { backgroundColor: '#4A90E2' }]}>
                                    <MapPin size={18} color="white" />
                                </View>
                                <View>
                                    <Text style={styles.actionTitle}>Tag Location</Text>
                                    <Text style={styles.actionDesc}>Where is this happening?</Text>
                                </View>
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
        ...STYLES.card, // Use shared shadow styles
        width: '100%',
        maxWidth: 380,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 24,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 3,
        borderBottomColor: 'black',
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 18,
        textTransform: 'uppercase',
    },
    content: {
        padding: 24,
        backgroundColor: '#F9FAFB',
    },
    hero: {
        alignItems: 'center',
        marginBottom: 24,
    },
    heroIcon: {
        fontSize: 64,
        marginBottom: 8,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 8,
        color: '#1A1A1A',
    },
    heroSource: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6B7280',
    },
    quoteBox: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 12,
        padding: 12,
        marginTop: 16,
        width: '100%',
    },
    quoteText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1A1A1A',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: '#9CA3AF',
        marginBottom: 12,
        textAlign: 'center',
    },
    actions: {
        gap: 12,
        paddingBottom: 24,
    },
    actionButton: {
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionIcon: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'black',
    },
    actionTitle: {
        fontWeight: '900',
        fontSize: 14,
        color: '#1A1A1A',
    },
    actionDesc: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#6B7280',
    },
});
