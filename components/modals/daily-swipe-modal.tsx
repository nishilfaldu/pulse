import { Sparkles } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DAILY_LOOP_CONTENT } from '../../constants/data';

interface DailySwipeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DailySwipeModal({ isOpen, onClose }: DailySwipeModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
            setIsComplete(false);
        }
    }, [isOpen]);

    const handleNext = () => {
        if (currentIndex < DAILY_LOOP_CONTENT.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handlePrev = () => {
        if (isComplete) {
            setIsComplete(false);
        } else if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleClose = () => {
        setIsComplete(false);
        setCurrentIndex(0);
        onClose();
    };

    const currentCard = DAILY_LOOP_CONTENT[currentIndex];

    return (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Close Button */}
                    {/* <TouchableOpacity onPress={handleClose} style={[styles.closeButton, { top: 12 + insets.top }]}>
                        <X size={32} color="rgba(255,255,255,0.5)" strokeWidth={3} />
                    </TouchableOpacity> */}

                    {/* Progress Bar */}
                    <View style={[styles.progressContainer, { top: insets.top }]}>
                        {!isComplete && DAILY_LOOP_CONTENT.map((_, idx) => (
                            <View key={idx} style={styles.progressTrack}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        { width: idx <= currentIndex ? '100%' : '0%' }
                                    ]}
                                />
                            </View>
                        ))}
                    </View>

                    {/* Main Content */}
                    <View style={styles.contentArea}>
                        {/* Navigation Zones */}
                        <View style={styles.navigationOverlay}>
                            <Pressable onPress={handlePrev} style={styles.leftZone} />
                            <Pressable onPress={handleNext} style={styles.rightZone} />
                        </View>

                        {!isComplete ? (
                            <View style={[styles.card, { backgroundColor: currentCard.bg }]}>
                                {/* Pattern placeholder */}
                                <View style={styles.pattern} />

                                <View style={styles.cardContent}>
                                    <View style={styles.iconWrapper}>
                                        <currentCard.icon size={80} color={currentCard.text} strokeWidth={1.5} />
                                    </View>

                                    <View style={[styles.labelBadge, { borderColor: currentCard.text }]}>
                                        <Text style={[styles.labelText, { color: currentCard.text }]}>{currentCard.label}</Text>
                                    </View>

                                    <Text style={[styles.cardText, { color: currentCard.text }]}>"{currentCard.content}"</Text>

                                    <Text style={styles.tapHint}>Tap to continue</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.completeState}>
                                <View style={styles.sparkleWrapper}>
                                    <Sparkles size={48} color="black" strokeWidth={3} />
                                </View>
                                <Text style={styles.completeTitle}>You're Caught Up!</Text>
                                <Text style={styles.completeDesc}>That's your 20 seconds of serendipity. See you tomorrow.</Text>
                                <TouchableOpacity onPress={handleClose} style={styles.closeLoopButton}>
                                    <Text style={styles.closeLoopText}>Close Loop</Text>
                                </TouchableOpacity>
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
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    container: {
        flex: 1,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 48,
        right: 24,
        zIndex: 20,
    },
    progressContainer: {
        position: 'absolute',
        top: 24,
        left: 16,
        right: 16,
        flexDirection: 'row',
        gap: 4,
        zIndex: 20,
    },
    progressTrack: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'white',
    },
    contentArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        position: 'relative',
    },
    navigationOverlay: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        zIndex: 10,
    },
    leftZone: {
        width: '30%',
        height: '100%',
    },
    rightZone: {
        width: '70%',
        height: '100%',
    },
    card: {
        width: '100%',
        aspectRatio: 3 / 4,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: 'white',
        overflow: 'hidden',
        position: 'relative',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
        elevation: 10,
    },
    pattern: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        backgroundColor: 'black', // Placeholder
    },
    cardContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    iconWrapper: {
        marginBottom: 32,
    },
    labelBadge: {
        borderWidth: 2,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        marginBottom: 16,
    },
    labelText: {
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    cardText: {
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 32,
    },
    tapHint: {
        position: 'absolute',
        bottom: 32,
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: 'bold',
    },
    completeState: {
        alignItems: 'center',
        padding: 32,
    },
    sparkleWrapper: {
        width: 96,
        height: 96,
        backgroundColor: '#7ED321',
        borderRadius: 999,
        borderWidth: 4,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    completeTitle: {
        fontSize: 30,
        fontWeight: '900',
        color: 'white',
        marginBottom: 8,
    },
    completeDesc: {
        color: 'rgba(255,255,255,0.7)',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 32,
        maxWidth: 250,
    },
    closeLoopButton: {
        backgroundColor: 'white',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 999,
        shadowColor: '#7ED321',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        zIndex: 20,
    },
    closeLoopText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '900',
    },
});
