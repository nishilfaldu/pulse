import { MessageSquare, X, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { STYLES } from '../../constants/theme';

interface LunchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenChat: () => void;
}

export function LunchModal({ isOpen, onClose, onOpenChat }: LunchModalProps) {
    const [step, setStep] = useState<'searching' | 'found'>('searching');

    useEffect(() => {
        if (isOpen) {
            setStep('searching');
            const timer = setTimeout(() => setStep('found'), 2500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Lunch Roulette</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color="white" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        {step === 'searching' ? (
                            <>
                                <ActivityIndicator size="large" color="#7ED321" style={styles.spinner} />
                                <Text style={styles.title}>Checking Tables...</Text>
                                <Text style={styles.subtitle}>Finding hungry people nearby</Text>
                            </>
                        ) : (
                            <>
                                <View style={styles.matchAnimation}>
                                    <View style={[styles.avatar, { backgroundColor: '#F8E71C' }]}>
                                        <Text style={styles.avatarText}>?</Text>
                                    </View>
                                    <Zap size={32} color="#7ED321" />
                                    <View style={[styles.avatar, { backgroundColor: '#FF7E47' }]}>
                                        <Text style={styles.avatarText}>?</Text>
                                    </View>
                                </View>
                                <Text style={styles.title}>Lunch Buddy Found!</Text>
                                <Text style={styles.subtitle}>Match is 2 mins away.</Text>

                                <View style={styles.icebreakerBox}>
                                    <Text style={styles.icebreakerLabel}>Icebreaker</Text>
                                    <Text style={styles.icebreakerText}>"Tacos or Pizza? You have 10 seconds."</Text>
                                </View>

                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        onPress={() => { onClose(); onOpenChat(); }}
                                        style={[STYLES.button, styles.chatButton]}
                                    >
                                        <MessageSquare size={18} color="white" />
                                        <Text style={STYLES.buttonText}>Chat</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[STYLES.button, styles.mapButton]}>
                                        <Text style={[STYLES.buttonText, { color: 'black' }]}>Map</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
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
        backgroundColor: '#7ED321',
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
        padding: 32,
        alignItems: 'center',
        minHeight: 300,
        justifyContent: 'center',
    },
    spinner: {
        marginBottom: 24,
        transform: [{ scale: 2 }],
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 8,
        color: '#1A1A1A',
    },
    subtitle: {
        color: '#6B7280',
        fontWeight: 'bold',
        marginBottom: 24,
    },
    matchAnimation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 999,
        borderWidth: 3,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '900',
    },
    icebreakerBox: {
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'black',
        width: '100%',
        marginBottom: 24,
    },
    icebreakerLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    icebreakerText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1A1A1A',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    chatButton: {
        flex: 1,
        backgroundColor: '#7ED321',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    mapButton: {
        flex: 1,
        backgroundColor: 'white',
    },
});
