import { X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { STYLES } from '../../constants/theme';

interface GroupDareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GroupDareModal({ isOpen, onClose }: GroupDareModalProps) {
    const [gameStep, setGameStep] = useState<'input' | 'shuffling' | 'result'>('input');
    const [myDare, setMyDare] = useState('');
    const [result, setResult] = useState<{ text: string; author: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            setGameStep('input');
            setMyDare('');
            setResult(null);
        }
    }, [isOpen]);

    const handleStart = () => {
        if (!myDare.trim()) return;
        setGameStep('shuffling');

        setTimeout(() => {
            const mockDares = [
                { text: myDare, author: 'You' },
                { text: "Text your ex 'I miss our cat'.", author: 'User_92' },
                { text: "Lick the floor.", author: 'Chaos_King' },
                { text: "Do 10 pushups right here.", author: 'GymRat' }
            ];
            const randomPick = mockDares[Math.floor(Math.random() * mockDares.length)];
            setResult(randomPick);
            setGameStep('result');
        }, 2000);
    };

    return (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Group Dare Mode</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color="white" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        {gameStep === 'input' && (
                            <View style={styles.stepContainer}>
                                <View style={styles.playerAvatars}>
                                    {[1, 2, 3, 4].map((i) => (
                                        <View key={i} style={styles.avatar}>
                                            <Text style={styles.avatarText}>{i === 1 ? 'YOU' : '?'}</Text>
                                        </View>
                                    ))}
                                </View>
                                <Text style={styles.title}>Gather your crew</Text>
                                <Text style={styles.subtitle}>Everyone submits one dare. One person does it.</Text>

                                <TextInput
                                    placeholder="Type a chaotic dare..."
                                    style={[STYLES.input, styles.input]}
                                    value={myDare}
                                    onChangeText={setMyDare}
                                    autoFocus
                                />

                                <TouchableOpacity
                                    onPress={handleStart}
                                    disabled={!myDare.trim()}
                                    style={[STYLES.button, styles.submitButton, !myDare.trim() && styles.disabledButton]}
                                >
                                    <Text style={STYLES.buttonText}>Throw in Pot</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {gameStep === 'shuffling' && (
                            <View style={styles.stepContainer}>
                                <ActivityIndicator size="large" color="#FF4444" style={styles.spinner} />
                                <Text style={styles.title}>Mixing Dares...</Text>
                                <Text style={styles.subtitle}>Pray it's not yours.</Text>
                            </View>
                        )}

                        {gameStep === 'result' && result && (
                            <View style={styles.stepContainer}>
                                <Text style={styles.label}>The Chosen Dare</Text>
                                <View style={styles.resultCard}>
                                    <Text style={styles.resultText}>{result.text}</Text>
                                    <Text style={styles.resultAuthor}>Submitted by {result.author}</Text>
                                </View>

                                <View style={styles.victimSection}>
                                    <Text style={styles.label}>Who has to do it?</Text>
                                    <View style={styles.victimBadge}>
                                        <Text style={styles.victimText}>{Math.random() > 0.5 ? 'YOU' : 'PLAYER 3'}</Text>
                                    </View>
                                </View>

                                <View style={styles.actions}>
                                    <TouchableOpacity onPress={onClose} style={styles.skipButton}>
                                        <Text style={styles.skipText}>Skip</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[STYLES.button, styles.uploadButton]}>
                                        <Text style={STYLES.buttonText}>Upload Proof</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
        backgroundColor: '#FF4444',
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
        minHeight: 320,
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
    },
    stepContainer: {
        alignItems: 'center',
        width: '100%',
    },
    playerAvatars: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
        gap: -12, // Overlap
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    avatarText: {
        fontSize: 10,
        fontWeight: '900',
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6B7280',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: '#FF4444',
        width: '100%',
    },
    disabledButton: {
        opacity: 0.5,
    },
    spinner: {
        marginBottom: 24,
        transform: [{ scale: 2 }],
    },
    label: {
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: '#9CA3AF',
        marginBottom: 8,
    },
    resultCard: {
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        marginBottom: 24,
        transform: [{ rotate: '1deg' }],
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    resultText: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 8,
        lineHeight: 28,
    },
    resultAuthor: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF4444',
    },
    victimSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    victimBadge: {
        backgroundColor: 'black',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 999,
        marginTop: 4,
    },
    victimText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 18,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    skipButton: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        paddingVertical: 12,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    skipText: {
        fontWeight: 'bold',
        color: 'black',
    },
    uploadButton: {
        flex: 1,
        backgroundColor: '#FF4444',
    },
});
