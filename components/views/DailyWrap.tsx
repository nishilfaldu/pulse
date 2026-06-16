import { useVideoPlayer, VideoView } from 'expo-video';
import { Trophy, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Mock Data for Top Posts
const WRAP_ITEMS = [
    {
        id: '1',
        uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        user: 'dance_king',
        rank: 1,
        score: 9850
    },
    {
        id: '2',
        uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        user: 'speed_demon',
        rank: 2,
        score: 8400
    },
    {
        id: '3',
        uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        user: 'nature_lover',
        rank: 3,
        score: 7200
    },
    {
        id: '4',
        uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        user: 'ocean_vibes',
        rank: 4,
        score: 6500
    }
];

interface DailyWrapProps {
    onClose: () => void;
}

export function DailyWrap({ onClose }: DailyWrapProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentItem = WRAP_ITEMS[currentIndex];
    const [progress, setProgress] = useState(0);

    // Rank Styling
    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1: return { color: '#FFD700', icon: '👑', label: 'GOLD' };
            case 2: return { color: '#C0C0C0', icon: '🥈', label: 'SILVER' };
            case 3: return { color: '#CD7F32', icon: '🥉', label: 'BRONZE' };
            default: return { color: 'white', icon: `#${rank}`, label: 'TOP 20' };
        }
    };

    const rankStyle = getRankStyle(currentItem.rank);

    // Video Player
    const player = useVideoPlayer(currentItem.uri, player => {
        player.loop = false;
        player.play();
    });

    // Handle auto-advance and progress
    useEffect(() => {
        const subscription = player.addListener('playToEnd', () => {
            handleNext();
        });

        const interval = setInterval(() => {
            if (player.duration > 0) {
                setProgress(player.currentTime / player.duration);
            }
        }, 50); // Update every 50ms

        return () => {
            subscription.remove();
            clearInterval(interval);
        };
    }, [player, currentIndex]); // Re-run when player or index changes

    // Reset progress on index change
    useEffect(() => {
        setProgress(0);
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < WRAP_ITEMS.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose(); // Close at end
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // ... (Rank Styling remains the same)

    // ... (Render remains similar, update progress bar logic)

    return (
        <View style={styles.container}>
            <VideoView
                style={styles.video}
                player={player}
                nativeControls={false}
                contentFit="cover"
            />

            <SafeAreaView style={styles.overlay}>
                {/* Top Section */}
                <View>
                    {/* Progress Bars */}
                    <View style={styles.progressContainer}>
                        {WRAP_ITEMS.map((_, index) => (
                            <View key={index} style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            width: index < currentIndex ? '100%' : index === currentIndex ? `${progress * 100}%` : '0%',
                                            backgroundColor: index <= currentIndex ? 'white' : 'transparent'
                                        }
                                    ]}
                                />
                            </View>
                        ))}
                    </View>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.titleRow}>
                            <Trophy size={20} color={rankStyle.color} />
                            <Text style={[styles.rankLabel, { color: rankStyle.color }]}>
                                DAILY WRAP: {rankStyle.label}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Rank Overlay (Bottom Left) */}
                <View style={styles.rankOverlay}>
                    <Text style={styles.rankIcon}>{rankStyle.icon}</Text>
                    <View>
                        <Text style={styles.rankUser}>@{currentItem.user}</Text>
                        <Text style={styles.rankScore}>{currentItem.score} pts</Text>
                    </View>
                </View>

                {/* Tap Zones */}
                <View style={styles.tapZones}>
                    <TouchableOpacity style={styles.tapZoneLeft} onPress={handlePrev} />
                    <TouchableOpacity style={styles.tapZoneRight} onPress={handleNext} />
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
    video: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
    },
    progressContainer: {
        flexDirection: 'row',
        gap: 4,
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    progressBarBg: {
        flex: 1,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },
    rankLabel: {
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 1,
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
    rankOverlay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 24,
        paddingBottom: 48,
    },
    rankIcon: {
        fontSize: 48,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 8,
    },
    rankUser: {
        color: 'white',
        fontSize: 18,
        fontWeight: '900',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    rankScore: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    tapZones: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        zIndex: -1, // Behind other UI
    },
    tapZoneLeft: {
        flex: 1,
    },
    tapZoneRight: {
        flex: 1,
    },
});
