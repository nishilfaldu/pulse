import { api } from '@/convex/_generated/api';
import { useMutation, usePaginatedQuery } from 'convex/react';

// ... (existing imports)

// ... (existing imports)
import { FunctionReturnType } from 'convex/server';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Play, Share2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

type FeedSubmission = FunctionReturnType<typeof api.submissions.getFeedSubmissions>['page'][number];

interface FeedItemProps {
    item: FeedSubmission;
    isActive: boolean;
}

function FeedItem({ item, isActive }: FeedItemProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const reactMutation = useMutation(api.submissions.reactToSubmission);

    // Optimistic state
    const [myReactions, setMyReactions] = useState(new Set(item.myReactions || []));
    const [counts, setCounts] = useState(item.reactions);

    // Sync with props when they change (e.g. from real backend update)
    useEffect(() => {
        setMyReactions(new Set(item.myReactions || []));
        setCounts(item.reactions);
    }, [item.myReactions, item.reactions]);

    const player = useVideoPlayer(item.playbackUrl, player => {
        player.loop = true;
    });

    useEffect(() => {
        if (isActive && isPlaying) {
            player.play();
        } else {
            player.pause();
        }
    }, [isActive, isPlaying, player]);

    // Reset play state when becoming active
    useEffect(() => {
        if (isActive) {
            setIsPlaying(true);
        }
    }, [isActive]);

    const togglePlay = () => {
        setIsPlaying(prev => !prev);
    };

    const handleReaction = async (type: "skull" | "salute" | "fire" | "eye") => {
        // Optimistic update
        const isActive = myReactions.has(type);
        const newReactions = new Set(myReactions);
        const newCounts = { ...counts };

        if (isActive) {
            newReactions.delete(type);
            newCounts[type] = Math.max(0, newCounts[type] - 1);
        } else {
            newReactions.add(type);
            newCounts[type] = newCounts[type] + 1;
        }

        setMyReactions(newReactions);
        setCounts(newCounts);

        try {
            await reactMutation({ submissionId: item._id, type });
        } catch (error) {
            // Revert on error
            console.error("Reaction failed", error);
            setMyReactions(new Set(item.myReactions || []));
            setCounts(item.reactions);
        }
    };

    const renderReactionButton = (emoji: string, type: "skull" | "salute" | "fire" | "eye") => {
        const isActive = myReactions.has(type);
        return (
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleReaction(type)}
            >
                <View style={[styles.emojiCircle, isActive && styles.activeEmojiCircle]}>
                    <Text style={styles.emoji}>{emoji}</Text>
                </View>
                <Text style={[styles.actionText, isActive && styles.activeActionText]}>
                    {counts[type]}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity activeOpacity={1} onPress={togglePlay} style={styles.videoContainer}>
                <VideoView
                    style={styles.video}
                    player={player}
                    nativeControls={false}
                    contentFit="cover"
                />
                {!isPlaying && (
                    <View style={styles.pauseOverlay}>
                        <Play size={64} color="rgba(255,255,255,0.5)" fill="rgba(255,255,255,0.5)" />
                    </View>
                )}
            </TouchableOpacity>

            {/* Overlay */}
            <SafeAreaView style={styles.overlay} pointerEvents="box-none">
                {/* Right Side Actions */}
                <View style={styles.rightActions}>
                    {renderReactionButton("💀", "skull")}
                    {renderReactionButton("🫡", "salute")}
                    {renderReactionButton("🔥", "fire")}
                    {renderReactionButton("👀", "eye")}

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.emojiCircle}>
                            <Share2 size={24} color="black" />
                        </View>
                        <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Info */}
                <View style={styles.bottomInfo}>
                    <View style={styles.questTag}>
                        <Text style={styles.questText}>QUEST #{String(item.quest?.count || 0).padStart(3, '0')}</Text>
                    </View>
                    <Text style={styles.username}>@{item.user?.username || 'anonymous'}</Text>
                    <Text style={styles.description}>{item.quest?.title || 'Quest'} completed!</Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

export function GlobalFeed() {
    const { results, status, loadMore } = usePaginatedQuery(
        api.submissions.getFeedSubmissions,
        {},
        { initialNumItems: 10 }
    );
    const [activeId, setActiveId] = useState<string | null>(null);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
        if (viewableItems.length > 0) {
            setActiveId(viewableItems[0].item._id);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const handleEndReached = () => {
        if (status === 'CanLoadMore') {
            loadMore(10);
        }
    };

    if (!results || results.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white', textAlign: 'center' }}>No submissions yet</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={results}
                renderItem={({ item }) => <FeedItem item={item} isActive={item._id === activeId} />}
                keyExtractor={item => item._id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={height}
                snapToAlignment="start"
                decelerationRate="fast"
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                windowSize={3}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    itemContainer: {
        width: width,
        height: height,
        backgroundColor: 'black',
    },
    videoContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    video: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    pauseOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 20,
    },
    rightActions: {
        position: 'absolute',
        right: 16,
        bottom: 100,
        alignItems: 'center',
        gap: 20,
    },
    actionButton: {
        alignItems: 'center',
    },
    emojiCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        borderWidth: 3,
        borderColor: 'black',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    emoji: {
        fontSize: 24,
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        textAlign: 'center',
        width: 60,
    },
    divider: {
        width: 20,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginVertical: 4,
    },
    bottomInfo: {
        marginBottom: 40,
        maxWidth: '80%',
    },
    questTag: {
        backgroundColor: '#FF4444',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
    },
    questText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    username: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    description: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        lineHeight: 20,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    activeEmojiCircle: {
        backgroundColor: '#FFD700', // Brand Yellow
        borderColor: '#FFD700',
    },
    activeActionText: {
        color: '#FFD700',
    },
});
