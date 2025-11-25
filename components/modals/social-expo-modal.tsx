import { Camera, Ghost, Heart, X } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PROOFS } from '../../constants/data';
import { STYLES } from '../../constants/theme';

interface SocialExpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SocialExpModal({ isOpen, onClose }: SocialExpModalProps) {
    return (
        <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Social Experiment</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color="white" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <View style={styles.challengeBox}>
                            <View style={styles.activeBadge}>
                                <Text style={styles.activeBadgeText}>Active Now</Text>
                            </View>
                            <Text style={styles.challengeLabel}>Daily Micro-Challenge</Text>
                            <Text style={styles.challengeText}>"High-five a stranger wearing red."</Text>
                            <Text style={styles.expiryText}>Expires in 4h 20m</Text>
                        </View>

                        <TouchableOpacity style={[STYLES.button, styles.uploadButton]}>
                            <Camera size={20} color="white" />
                            <Text style={STYLES.buttonText}>Upload Proof</Text>
                        </TouchableOpacity>

                        <View style={styles.feedSection}>
                            <View style={styles.feedHeader}>
                                <Text style={styles.feedTitle}>Live Proofs</Text>
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>142 Submitted</Text>
                                </View>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.proofsList}>
                                {PROOFS.map((proof) => (
                                    <TouchableOpacity key={proof.id} style={styles.proofItem} activeOpacity={0.8}>
                                        <View style={[styles.proofCard, { backgroundColor: '#F3F4F6' }]}>
                                            <View style={[styles.proofOverlay, { backgroundColor: proof.color }]} />
                                            <View style={styles.proofIcon}>
                                                <Ghost size={32} color="rgba(0,0,0,0.2)" />
                                            </View>
                                            <View style={styles.likeBadge}>
                                                <Heart size={10} color="#EF4444" fill="#EF4444" />
                                                <Text style={styles.likeCount}>{proof.likes}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.proofUser}>{proof.user}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
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
        backgroundColor: '#FF5E7D',
        padding: 16,
        borderBottomWidth: 3,
        borderBottomColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    challengeBox: {
        backgroundColor: '#FEFCE8',
        padding: 24,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: 'black',
        marginBottom: 24,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    activeBadge: {
        position: 'absolute',
        top: 8,
        right: -8,
        backgroundColor: '#F8E71C',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: 'black',
        transform: [{ rotate: '12deg' }],
    },
    activeBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    challengeLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    challengeText: {
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        color: '#1A1A1A',
        marginBottom: 8,
        lineHeight: 28,
    },
    expiryText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
    },
    uploadButton: {
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 32,
    },
    feedSection: {
        borderTopWidth: 3,
        borderTopColor: '#F3F4F6',
        paddingTop: 24,
    },
    feedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    feedTitle: {
        fontSize: 18,
        fontWeight: '900',
    },
    countBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    countText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    proofsList: {
        gap: 12,
        paddingBottom: 16,
    },
    proofItem: {
        width: 128,
    },
    proofCard: {
        width: 128,
        height: 128,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: 'black',
        marginBottom: 8,
        position: 'relative',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    proofOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.2,
    },
    proofIcon: {
        opacity: 0.2,
    },
    likeBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    likeCount: {
        fontSize: 10,
        fontWeight: '900',
    },
    proofUser: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#9CA3AF',
    },
});
