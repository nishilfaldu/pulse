import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type BootState = 'loading' | 'authenticated' | 'unauthenticated';

interface BootSplashProps {
    state: BootState;
    onComplete: () => void;
}

const BOOT_LOGS = [
    "> ESTABLISHING UPLINK...",
    "> VERIFYING AGENT ID...",
    "> SYNCING GLOBAL CLOCK...",
    "> CHECKING LOCAL REALITY..."
];

export function BootSplash({ state, onComplete }: BootSplashProps) {
    const [logIndex, setLogIndex] = useState(0);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Heartbeat Animation
    useEffect(() => {
        const heartbeat = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.delay(800), // Rest between beats
            ])
        );
        heartbeat.start();

        return () => heartbeat.stop();
    }, []);

    // Log Cycling
    useEffect(() => {
        if (state !== 'loading') return;

        const interval = setInterval(() => {
            setLogIndex(prev => (prev + 1) % BOOT_LOGS.length);
        }, 200);

        return () => clearInterval(interval);
    }, [state]);

    const [visibleState, setVisibleState] = useState<BootState>('loading');
    const minTimeElapsed = useRef(false);
    const pendingState = useRef<BootState | null>(null);

    // Minimum Duration Timer
    useEffect(() => {
        const timer = setTimeout(() => {
            minTimeElapsed.current = true;
            if (pendingState.current) {
                transitionToFinalState(pendingState.current);
            }
        }, 2500); // 2.5s minimum "boot" time

        return () => clearTimeout(timer);
    }, []);

    const transitionToFinalState = (finalState: BootState) => {
        setVisibleState(finalState);
        // Show the final message for a moment before completing
        setTimeout(() => {
            onComplete();
        }, 1000);
    };

    // Handle Prop State Changes
    useEffect(() => {
        if (state !== 'loading') {
            if (minTimeElapsed.current) {
                transitionToFinalState(state);
            } else {
                pendingState.current = state;
            }
        }
    }, [state]);

    const getStatusText = () => {
        if (visibleState === 'authenticated') return "> ACCESS GRANTED.";
        if (visibleState === 'unauthenticated') return "> NO AGENT FOUND.";
        return BOOT_LOGS[logIndex];
    };

    const getStatusColor = () => {
        if (visibleState === 'authenticated') return '#00FF00'; // Green
        if (visibleState === 'unauthenticated') return '#FF4444'; // Red
        return '#F8E71C'; // Hazard Yellow
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.content}>
                {/* Centered Logo */}
                <View style={styles.centerContainer}>
                    <Animated.Text
                        style={[
                            styles.logoText,
                            { transform: [{ scale: scaleAnim }] }
                        ]}
                    >
                        IRL
                    </Animated.Text>
                </View>

                {/* Bottom Terminal Log */}
                <View style={styles.logContainer}>
                    <Text style={[styles.logText, { color: getStatusColor() }]}>
                        {getStatusText()}
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        color: 'white',
        fontSize: 48,
        fontWeight: '900',
        letterSpacing: 2,
        fontFamily: 'System', // Bold Sans-Serif
    },
    logContainer: {
        paddingBottom: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    logText: {
        fontFamily: 'Courier', // Monospace
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
