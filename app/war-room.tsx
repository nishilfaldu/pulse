import { WAR_DATA } from '@/constants/data';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bomb, Flame, Swords, Zap } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock full feed data for now, or use WAR_DATA.posts repeated
const FULL_WAR_FEED = [
    ...WAR_DATA.posts,
    ...WAR_DATA.posts.map(p => ({ ...p, id: p.id + '2', time: '5m ago' })),
    ...WAR_DATA.posts.map(p => ({ ...p, id: p.id + '3', time: '10m ago' })),
];

export default function WarFeedView() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.pattern} />

                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="white" strokeWidth={3} />
                </TouchableOpacity>

                <View style={styles.headerTitle}>
                    <Swords color="white" size={24} />
                    <Text style={styles.headerText}>Content War</Text>
                </View>

                <View style={{ width: 40 }} />
            </View>

            {/* Topic Section - Sticky */}
            <View style={styles.topicSection}>
                <Text style={styles.topicLabel}>Today's Battlefield</Text>
                <Text style={styles.topicTitle}>{WAR_DATA.topic}</Text>

                <View style={styles.tugOfWarBar}>
                    <View style={[styles.barSide, { width: `${WAR_DATA.left.score}%`, backgroundColor: WAR_DATA.left.color, alignItems: 'flex-start', paddingLeft: 12 }]}>
                        <Text style={styles.scoreText}>{WAR_DATA.left.score}%</Text>
                    </View>
                    <View style={[styles.barSide, { width: `${WAR_DATA.right.score}%`, backgroundColor: WAR_DATA.right.color, alignItems: 'flex-end', paddingRight: 12 }]}>
                        <Text style={[styles.scoreText, { color: 'black' }]}>{WAR_DATA.right.score}%</Text>
                    </View>
                    <View style={styles.lightningIcon}>
                        <Zap size={12} color="white" fill="white" />
                    </View>
                </View>

                <View style={styles.vsRow}>
                    <Text style={[styles.teamName, { color: WAR_DATA.left.color }]}>{WAR_DATA.left.name}</Text>
                    <Text style={styles.vsText}>vs</Text>
                    <Text style={[styles.teamName, { color: '#D97706' }]}>{WAR_DATA.right.name}</Text>
                </View>
            </View>

            <ScrollView style={styles.feed} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Feed Header */}
                <View style={styles.feedHeader}>
                    <View style={styles.feedTitleRow}>
                        <Bomb size={18} color="black" />
                        <Text style={styles.feedTitle}>Top Attacks</Text>
                    </View>
                    <View style={styles.timerBadge}>
                        <Text style={styles.timerText}>Ends in 4h</Text>
                    </View>
                </View>

                {/* Posts List */}
                <View style={styles.postsList}>
                    {FULL_WAR_FEED.map((post, index) => (
                        <View key={post.id} style={styles.postCard}>
                            {index === 0 && (
                                <View style={styles.rankBadge}>
                                    <Text style={styles.rankText}>WARLORD</Text>
                                </View>
                            )}
                            <View style={styles.postHeader}>
                                <View style={styles.userInfo}>
                                    <View style={[styles.sideIndicator, {
                                        backgroundColor: post.side === 'left' ? WAR_DATA.left.color : WAR_DATA.right.color
                                    }]}>
                                        <Text style={[styles.sideText, { color: post.side === 'right' ? 'black' : 'white' }]}>
                                            {post.side === 'left' ? 'L' : 'R'}
                                        </Text>
                                    </View>
                                    <Text style={styles.username}>{post.user}</Text>
                                </View>
                                <View style={styles.damageBadge}>
                                    <Flame size={14} color="#FF4444" fill="#FF4444" />
                                    <Text style={styles.damageText}>{post.damage}</Text>
                                </View>
                            </View>
                            <Text style={styles.postText}>{post.text}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.endOfFeed}>
                    <Text style={styles.endText}>End of Signals</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        backgroundColor: 'black',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 20,
    },
    pattern: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        backgroundColor: '#333',
    },
    backButton: {
        zIndex: 10,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 20,
        textTransform: 'uppercase',
    },
    topicSection: {
        backgroundColor: '#F3F4F6',
        padding: 24,
        borderBottomWidth: 3,
        borderBottomColor: 'black',
        alignItems: 'center',
        marginBottom: 16,
    },
    topicLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    topicTitle: {
        fontSize: 30,
        fontWeight: '900',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 30,
    },
    tugOfWarBar: {
        height: 32,
        width: '100%',
        borderRadius: 999,
        borderWidth: 3,
        borderColor: 'black',
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 8,
    },
    barSide: {
        height: '100%',
        justifyContent: 'center',
    },
    scoreText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 12,
    },
    lightningIcon: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: [{ translateX: -10 }, { translateY: -10 }],
        backgroundColor: 'black',
        padding: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'white',
    },
    vsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    teamName: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    vsText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
    },
    feed: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    feedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    feedTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    feedTitle: {
        fontSize: 18,
        fontWeight: '900',
    },
    timerBadge: {
        backgroundColor: 'black',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    timerText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    postsList: {
        gap: 12,
        paddingHorizontal: 16,
    },
    postCard: {
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 12,
        padding: 12,
        position: 'relative',
        overflow: 'hidden',
    },
    rankBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#F8E71C',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomLeftRadius: 8,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'black',
        zIndex: 10,
    },
    rankText: {
        fontSize: 10,
        fontWeight: '900',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sideIndicator: {
        width: 24,
        height: 24,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sideText: {
        fontSize: 10,
        fontWeight: '900',
    },
    username: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6B7280',
    },
    damageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    damageText: {
        color: '#FF4444',
        fontSize: 14,
        fontWeight: '900',
    },
    postText: {
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 20,
    },
    endOfFeed: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    endText: {
        color: '#6B7280',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        opacity: 0.5,
    },
});
