import { useRouter } from 'expo-router';
import { Activity, Camera, ChevronRight, Eye, Film, Globe, Heart, Share2, Skull, Swords } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CLIPS, GLOBAL_TRENDS, PEEPER_POSTS, PULSE_DATA } from '../../constants/data';
import { STYLES } from '../../constants/theme';
import { ClipStory } from '../clip-story';
import { GlobalTrendModal } from '../modals/global-trend-modal';
import { PulseModal } from '../modals/pulse-modal';
import { WarModal } from '../modals/war-modal';
import { TrendCard } from '../trend-card';

export function PeeperView() {
    const router = useRouter();
    const [posts, setPosts] = useState(PEEPER_POSTS);
    const [showWar, setShowWar] = useState(false);
    const [showPulse, setShowPulse] = useState(false);
    const [selectedTrend, setSelectedTrend] = useState<any>(null);

    const handleReact = (id: number, type: 'watch' | 'dead' | 'love') => {
        setPosts(posts.map(post => {
            if (post.id === id) {
                return { ...post, reactions: { ...post.reactions, [type]: post.reactions[type] + 1 } };
            }
            return post;
        }));
    };

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* War Banner */}
            <TouchableOpacity onPress={() => setShowWar(true)} activeOpacity={0.9} style={styles.warBanner}>
                <View style={styles.warPattern} />
                <View style={styles.warContent}>
                    <View>
                        <View style={styles.warBadgeRow}>
                            <View style={styles.liveBadge}>
                                <Text style={styles.liveBadgeText}>Live War</Text>
                            </View>
                            <Text style={styles.warTimer}>Ends 4h</Text>
                        </View>
                        <Text style={styles.warTitle}>Daily Duel</Text>
                        <Text style={styles.warSubtitle}>Taco Bell vs. Waffle House</Text>
                    </View>
                    <View style={styles.warIconCircle}>
                        <Swords size={24} color="black" />
                    </View>
                </View>
            </TouchableOpacity>

            {/* Pulse Dashboard Banner */}
            <TouchableOpacity onPress={() => setShowPulse(true)} activeOpacity={0.9} style={styles.pulseBanner}>
                <View style={styles.pulseHeader}>
                    <View style={styles.pulseTitleRow}>
                        <Activity size={20} color="#4A90E2" />
                        <Text style={styles.pulseTitle}>City Pulse</Text>
                    </View>
                    <View style={styles.liveDataBadge}>
                        <Text style={styles.liveDataText}>Live Data</Text>
                    </View>
                </View>
                <Text numberOfLines={2} style={styles.pulseText}>"{PULSE_DATA.text}"</Text>
                <View style={styles.pulseBar}>
                    {PULSE_DATA.stats.building.map((b, i) => (
                        <View key={i} style={[styles.pulseSegment, { width: `${b.val}%`, backgroundColor: b.color }]} />
                    ))}
                </View>
                <Text style={styles.pulseHint}>tap to add context</Text>
            </TouchableOpacity>

            {/* Global Signals */}
            <View style={styles.section}>
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => router.push('/global-signals')}
                    activeOpacity={0.7}
                >
                    <View style={styles.headerLeft}>
                        <Globe size={20} color="#1A1A1A" />
                        <Text style={styles.sectionTitle}>Global Signals</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.viewAllText}>Tap In</Text>
                        <ChevronRight size={16} color="#9CA3AF" />
                    </View>
                </TouchableOpacity>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                    {GLOBAL_TRENDS.map(trend => (
                        <TrendCard key={trend.id} trend={trend} onClick={setSelectedTrend} />
                    ))}
                </ScrollView>
            </View>

            {/* Serendipity Clips */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <View style={styles.headerLeft}>
                        <Film size={20} color="#1A1A1A" />
                        <Text style={styles.sectionTitle}>City Clips</Text>
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                    {/* Add New Clip Button */}
                    <View style={styles.addClipContainer}>
                        <TouchableOpacity style={styles.addClipButton}>
                            <View style={styles.cameraIconCircle}>
                                <Camera size={16} color="white" />
                            </View>
                            <Text style={styles.addClipText}>Post Clip</Text>
                        </TouchableOpacity>
                    </View>

                    {CLIPS.map((clip, index) => (
                        <ClipStory
                            key={clip.id}
                            clip={clip}
                            onPress={() => router.push({
                                pathname: '/clips-feed',
                                params: { index }
                            })}
                        />
                    ))}
                </ScrollView>
            </View>

            <Text style={styles.feedHeaderTitle}>Live Feed</Text>

            {posts.map((post) => (
                <View key={post.id} style={[STYLES.flatCard, styles.postCard]}>
                    <View style={styles.postHeader}>
                        <View style={styles.postUser}>
                            <View style={[styles.userDot, { backgroundColor: post.id % 2 === 0 ? '#4A90E2' : '#FF7E47' }]} />
                            <Text style={styles.userName}>Anonymous</Text>
                        </View>
                        <View style={styles.metaBadge}>
                            <Text style={styles.metaText}>{post.location} • {post.time}</Text>
                        </View>
                    </View>

                    <Text style={styles.postContent}>{post.text}</Text>

                    <View style={styles.reactionsRow}>
                        <TouchableOpacity onPress={() => handleReact(post.id, 'watch')} style={styles.reactionBtn}>
                            <Eye size={16} color="black" />
                            <Text style={styles.reactionCount}>{post.reactions.watch}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleReact(post.id, 'dead')} style={styles.reactionBtn}>
                            <Skull size={16} color="black" />
                            <Text style={styles.reactionCount}>{post.reactions.dead}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleReact(post.id, 'love')} style={styles.reactionBtn}>
                            <Heart size={16} color="black" />
                            <Text style={styles.reactionCount}>{post.reactions.love}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.reactionBtn, styles.shareBtn]}>
                            <Share2 size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            <WarModal isOpen={showWar} onClose={() => setShowWar(false)} />
            <PulseModal isOpen={showPulse} onClose={() => setShowPulse(false)} />
            <GlobalTrendModal trend={selectedTrend} isOpen={!!selectedTrend} onClose={() => setSelectedTrend(null)} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    warBanner: {
        width: '100%',
        backgroundColor: 'black',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 3,
        borderColor: 'black',
        position: 'relative',
        overflow: 'hidden',
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    warPattern: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.2,
        backgroundColor: '#333', // Placeholder
    },
    warContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    warBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    liveBadge: {
        backgroundColor: '#FF4444',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    liveBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    warTimer: {
        color: '#9CA3AF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    warTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '900',
        textTransform: 'uppercase',
        fontStyle: 'italic',
        lineHeight: 20,
    },
    warSubtitle: {
        color: '#D1D5DB',
        fontSize: 12,
        fontWeight: 'bold',
    },
    warIconCircle: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'white',
    },
    pulseBanner: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
        borderWidth: 3,
        borderColor: 'black',
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    pulseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    pulseTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pulseTitle: {
        fontWeight: '900',
        fontSize: 18,
        textTransform: 'uppercase',
    },
    liveDataBadge: {
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#4A90E2',
    },
    liveDataText: {
        color: '#4A90E2',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    pulseText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
        lineHeight: 24,
    },
    pulseBar: {
        flexDirection: 'row',
        height: 4,
        borderRadius: 999,
        overflow: 'hidden',
        gap: 2,
    },
    pulseSegment: {
        height: '100%',
    },
    pulseHint: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9CA3AF',
        textAlign: 'right',
        marginTop: 4,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
    },
    horizontalScroll: {
        paddingRight: 16,
    },
    addClipContainer: {
        marginRight: 12,
        width: 96,
    },
    addClipButton: {
        width: 96,
        height: 160,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: 'black',
        borderStyle: 'dashed',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 999,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    addClipText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    feedHeaderTitle: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 16,
    },
    postCard: {
        padding: 16,
        marginBottom: 16,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    postUser: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    userDot: {
        width: 24,
        height: 24,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'black',
    },
    userName: {
        fontSize: 12,
        fontWeight: '900',
        color: '#6B7280',
        textTransform: 'uppercase',
    },
    metaBadge: {
        backgroundColor: '#FFF8F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'black',
    },
    metaText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    postContent: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 16,
        lineHeight: 24,
    },
    reactionsRow: {
        flexDirection: 'row',
        gap: 16,
        borderTopWidth: 2,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    reactionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    reactionCount: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    shareBtn: {
        marginLeft: 'auto',
    },
});
