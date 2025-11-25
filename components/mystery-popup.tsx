import { AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface MysteryPopupProps {
    onOpen: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = 200; // Approximate width
const CARD_HEIGHT = 100; // Approximate height

export function MysteryPopup({ onOpen }: MysteryPopupProps) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const context = useSharedValue({ x: 0, y: 0 });

    const pan = Gesture.Pan()
        .onStart(() => {
            context.value = { x: translateX.value, y: translateY.value };
        })
        .onUpdate((event) => {
            translateX.value = context.value.x + event.translationX;
            translateY.value = context.value.y + event.translationY;
        })
        .onEnd(() => {
            // Optional: Snap to edges logic could go here
            // For now, just free drag with a little spring to feel "alive"
            translateX.value = withSpring(translateX.value, { damping: 15 });
            translateY.value = withSpring(translateY.value, { damping: 15 });
        });

    const tap = Gesture.Tap()
        .runOnJS(true)
        .onEnd(onOpen);

    // Compose gestures: Pan takes precedence if movement happens?
    // Actually, if we just want to drag, we can use the Pan.
    // If we want to click, we use Tap.
    // Race them? Or Simultaneous?
    // Usually, if Pan activates, Tap fails.
    const gesture = Gesture.Race(pan, tap);

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        };
    });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.container, rStyle]}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <AlertTriangle size={16} color="#00FF00" />
                        <Text style={styles.headerText}>Secret Active</Text>
                    </View>
                    <Text style={styles.description}>Mystery Challenge at TUC. 10 mins left.</Text>
                    <View style={styles.progressTrack}>
                        <View style={styles.progressBar} />
                    </View>
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
        right: 16,
        zIndex: 40,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderWidth: 3,
        borderColor: '#00FF00',
        borderRadius: 12,
        padding: 12,
        width: 200,
        shadowColor: '#00FF00',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    headerText: {
        color: '#00FF00',
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    description: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        lineHeight: 16,
    },
    progressTrack: {
        height: 4,
        width: '100%',
        backgroundColor: '#333',
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        width: '60%',
        backgroundColor: '#00FF00',
    },
});
