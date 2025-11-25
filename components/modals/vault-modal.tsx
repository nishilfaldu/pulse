import { Lock, X } from 'lucide-react-native';
import React from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VaultModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function VaultModal({ isOpen, onClose }: VaultModalProps) {
    return (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Background Grid Pattern - Simplified for RN */}
                    <View style={styles.gridPattern} />

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color="#F8E71C" strokeWidth={3} />
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <View style={styles.iconWrapper}>
                            <View style={styles.iconCircle}>
                                <Lock size={40} color="#F8E71C" />
                            </View>
                        </View>

                        <Text style={styles.title}>The Vault</Text>
                        <Text style={styles.subtitle}>Community Goal: 84% Complete</Text>

                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <Text style={styles.progressText}>LOADING...</Text>
                            </View>
                        </View>
                        <Text style={styles.helperText}>Every post, like, and match contributes.</Text>

                        {/* Reward Preview */}
                        <View style={styles.rewardBox}>
                            <Text style={styles.rewardLabel}>Locked Reward</Text>
                            <Text style={styles.rewardTitle}>Flash: 50% Off @ Woody's</Text>
                            <Text style={styles.rewardSub}>Unlocks at 100%</Text>
                        </View>

                        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
                            <Text style={styles.buttonText}>Contribute Vibes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    container: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#1A1A1A',
        borderWidth: 4,
        borderColor: '#F8E71C',
        overflow: 'hidden',
        position: 'relative',
    },
    gridPattern: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        backgroundColor: '#1A1A1A', // Placeholder for complex grid gradient
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 20,
    },
    content: {
        padding: 32,
        alignItems: 'center',
        zIndex: 10,
    },
    iconWrapper: {
        marginBottom: 16,
        alignItems: 'center',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 999,
        borderWidth: 4,
        borderColor: '#F8E71C',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#F8E71C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    subtitle: {
        color: '#F8E71C',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 32,
    },
    progressContainer: {
        height: 24,
        width: '100%',
        backgroundColor: '#333',
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#F8E71C',
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        width: '84%',
        backgroundColor: '#F8E71C',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 8,
    },
    progressText: {
        fontSize: 10,
        fontWeight: '900',
        color: 'black',
    },
    helperText: {
        color: '#9CA3AF',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 32,
    },
    rewardBox: {
        backgroundColor: 'rgba(248, 231, 28, 0.1)',
        borderWidth: 1,
        borderColor: '#F8E71C',
        borderRadius: 12,
        padding: 16,
        width: '100%',
        marginBottom: 24,
    },
    rewardLabel: {
        color: '#F8E71C',
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    rewardTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: 'white',
        marginBottom: 4,
    },
    rewardSub: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    button: {
        width: '100%',
        backgroundColor: '#F8E71C',
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'black',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
});
