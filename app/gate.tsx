import { SlotCounter } from '@/components/ui/SlotCounter';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Camera, Clock, Lock } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const AGENT_COUNT_START = 12403;

export default function GateScreen() {
    const router = useRouter();
    const quest = useQuery(api.quests.getActiveQuest);
    const [agentCount, setAgentCount] = useState(AGENT_COUNT_START);

    // Format quest count to always show 3 digits (e.g., 5 -> "005")
    const questNumber = quest?.count ? String(quest.count).padStart(3, '0') : '000';

    // Rolling counter effect
    useEffect(() => {
        const interval = setInterval(() => {
            setAgentCount(prev => prev + Math.floor(Math.random() * 3));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Background Video Player
    const player = useVideoPlayer('https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', player => {
        player.loop = true;
        player.play();
        player.muted = true;
    });

    // Animations
    const blurIntensity = useSharedValue(80);
    const buttonScale = useSharedValue(1);

    // Continuous Pulse Animation
    useEffect(() => {
        buttonScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1, // Infinite
            true // Reverse
        );
    }, [buttonScale]);

    const animatedBlurProps = useAnimatedProps(() => {
        return {
            intensity: blurIntensity.value,
        };
    });

    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: buttonScale.value }],
        };
    });

    const handlePressIn = () => {
        blurIntensity.value = withTiming(40, { duration: 300 });
    };

    const handlePressOut = () => {
        blurIntensity.value = withTiming(80, { duration: 300 });
    };

    const handleCapture = () => {
        router.push('/camera');
    };

    return (
        <View style={styles.container}>
            {/* Background - Simulated Blurred Feed */}
            <VideoView
                style={styles.background}
                player={player}
                nativeControls={false}
                contentFit="cover"
            />
            <AnimatedBlurView
                tint="dark"
                style={styles.absolute}
                animatedProps={animatedBlurProps}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header with Archive Icon */}
                <View style={styles.topHeader}>
                    <View />
                    <TouchableOpacity
                        style={styles.archiveButton}
                        onPress={() => router.push('/archive')}
                    >
                        <Clock size={20} color="rgba(255,255,255,0.5)" />
                    </TouchableOpacity>
                </View>

                {/* Mission Card */}
                <View style={styles.missionCard}>
                    <View style={styles.cardHeader}>
                        <Lock size={16} color="#FF4444" />
                        <Text style={styles.questLabel}>QUEST #{questNumber}</Text>
                    </View>
                    <Text style={styles.questTitle}>{quest?.title}</Text>
                    <Text style={styles.questDescription}>{quest?.description}</Text>
                    <View style={styles.agentRow}>
                        <View style={styles.liveDot} />
                        <SlotCounter value={agentCount} style={styles.agentCount} />
                        <Text style={styles.agentCountLabel}> people have unlocked the feed</Text>
                    </View>
                </View>

                {/* Capture Button */}
                <View style={styles.footer}>
                    <Animated.View style={animatedButtonStyle}>
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={handleCapture}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            activeOpacity={0.9}
                        >
                            <View style={styles.captureInner}>
                                <Camera size={32} color="black" />
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                    <Text style={styles.captureLabel}>CAPTURE TO UNLOCK</Text>


                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 24,
    },
    // Gate Styles
    missionCard: {
        backgroundColor: '#FFF8F0', // Cream
        padding: 32,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: 'black',
        alignItems: 'center',
        marginTop: 60,
        shadowColor: 'black',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },
    questLabel: {
        color: '#FF4444',
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 1,
    },
    questTitle: {
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        color: 'black',
        lineHeight: 36,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    questDescription: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#666',
        marginBottom: 24,
    },
    agentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00FF00',
    },
    agentCount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        fontVariant: ['tabular-nums'],
    },
    agentCountLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    footer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    captureInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FF4444',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
    },
    captureLabel: {
        color: 'white',
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 2,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 4,
    },
    archiveButton: {
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    devButton: {
        marginTop: 12,
        padding: 8,
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderRadius: 8,
    },
    devButtonText: {
        color: '#00FF00',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
