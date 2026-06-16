import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Check } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function LobbyScreen() {
    const router = useRouter();
    const submission = useQuery(api.submissions.getMySubmission);

    // Background Video Player
    const player = useVideoPlayer('https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', player => {
        player.loop = true;
        player.play();
        player.muted = true;
    });

    // Animations
    const buttonScale = useSharedValue(1);

    useEffect(() => {
        buttonScale.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: buttonScale.value }],
        };
    });

    return (
        <View style={styles.container}>
            {/* Background - Lightly Blurred Feed */}
            <VideoView
                style={styles.background}
                player={player}
                nativeControls={false}
                contentFit="cover"
            />
            <BlurView
                intensity={20}
                tint="dark"
                style={styles.absolute}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    {/* Status Card */}
                    <View style={styles.statusCard}>
                        <View style={styles.statusHeader}>
                            <Text style={styles.statusText}>STATUS: COMPLETED</Text>
                        </View>

                        <View style={styles.stampContainer}>
                            <View style={styles.stampCircle}>
                                <Check size={48} color="#00FF00" strokeWidth={4} />
                            </View>
                            <Text style={styles.stampText}>PROOF VERIFIED</Text>
                        </View>

                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={{ fontSize: 24 }}>💀</Text>
                                <Text style={styles.statValue}>{submission?.reactions?.skull ?? 0}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={{ fontSize: 24 }}>🫡</Text>
                                <Text style={styles.statValue}>{submission?.reactions?.salute ?? 0}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={{ fontSize: 24 }}>🔥</Text>
                                <Text style={styles.statValue}>{submission?.reactions?.fire ?? 0}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={{ fontSize: 24 }}>👀</Text>
                                <Text style={styles.statValue}>{submission?.reactions?.eye ?? 0}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Animated.View style={animatedButtonStyle}>
                            <TouchableOpacity
                                style={styles.enterButton}
                                onPress={() => router.push('/feed')}
                                activeOpacity={0.9}
                            >
                                <Text style={styles.enterButtonText}>ENTER FEED</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <TouchableOpacity
                            style={styles.viewSubmissionButton}
                            onPress={() => router.push('/submission')}
                        >
                            <Text style={styles.viewSubmissionText}>View My Submission</Text>
                        </TouchableOpacity>
                    </View>
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
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        gap: 40,
    },
    statusCard: {
        width: '100%',
        backgroundColor: 'black',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
        alignItems: 'center',
        paddingBottom: 32,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    statusHeader: {
        width: '100%',
        backgroundColor: '#00FF00',
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 32,
    },
    statusText: {
        color: 'black',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 2,
    },
    stampContainer: {
        alignItems: 'center',
        gap: 16,
        marginBottom: 32,
        transform: [{ rotate: '-5deg' }],
    },
    stampCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#00FF00',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
    },
    stampText: {
        color: '#00FF00',
        fontWeight: '900',
        fontSize: 20,
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 255, 0, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 32,
    },
    statItem: {
        alignItems: 'center',
        gap: 8,
    },
    statValue: {
        color: 'white',
        fontSize: 24,
        fontWeight: '900',
    },
    actions: {
        width: '100%',
        alignItems: 'center',
        gap: 24,
    },
    enterButton: {
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 100,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
    },
    enterButtonText: {
        color: 'black',
        fontWeight: '900',
        fontSize: 18,
        letterSpacing: 1,
    },
    viewSubmissionButton: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.5)',
        paddingBottom: 2,
    },
    viewSubmissionText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: '500',
    },
});
