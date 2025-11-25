import { useRouter } from 'expo-router';
import {
    ArrowLeft, Award, Book, Bug, Camera, CircleHelp, Coffee, Compass, Crown,
    Dumbbell, Eye, Flame, Ghost, GraduationCap, Heart,
    Map, Medal,
    MessageSquare, Mic, Moon, Music, PaintBucket, PenTool, Pizza,
    Share2, Shield, Skull, Smartphone, Sparkles, Star, Sunrise, Swords,
    Tent, Ticket, Timer, TrendingUp, Unlock, Users, Utensils,
    Zap
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    earned: boolean;
}

const BADGES: Badge[] = [
    // --- TIER 1: BASICS ---
    { id: '1', name: 'Early Bird', description: 'Opened app before 8am.', icon: Sunrise, color: '#FFD700', earned: true },
    { id: '2', name: 'Night Owl', description: 'Active after 2am.', icon: Moon, color: '#9B51E0', earned: false },
    { id: '3', name: 'Verified', description: 'Confirmed email.', icon: Shield, color: '#4A90E2', earned: true },
    { id: '4', name: 'OG', description: 'Joined in the first month.', icon: Star, color: '#F8E71C', earned: true },

    // --- TIER 2: SOCIAL ---
    { id: '5', name: 'Socialite', description: 'Attended 10 events.', icon: Users, color: '#FF7E47', earned: false },
    { id: '6', name: 'Influencer', description: '1000 profile views.', icon: TrendingUp, color: '#FF4444', earned: false },
    { id: '7', name: 'Critic', description: 'Commented on 50 posts.', icon: MessageSquare, color: '#50E3C2', earned: true },
    { id: '8', name: 'Lurker', description: 'Viewed 100 posts silently.', icon: Ghost, color: '#E5E7EB', earned: false },
    { id: '9', name: 'Radio Host', description: 'Spoke in a voice channel.', icon: Mic, color: '#BD10E0', earned: false },

    // --- TIER 3: CITY LIFE ---
    { id: '10', name: 'Bookworm', description: 'Checked into library 20x.', icon: Book, color: '#8B572A', earned: true },
    { id: '11', name: 'Gym Rat', description: 'Checked into gym 20x.', icon: Dumbbell, color: '#417505', earned: false },
    { id: '12', name: 'Caffeine Addict', description: 'Visited 5 coffee spots.', icon: Coffee, color: '#D2691E', earned: true },
    { id: '13', name: 'Foodie', description: 'Rated 10 dining halls.', icon: Utensils, color: '#F5A623', earned: false },
    { id: '14', name: 'Party Animal', description: 'Active Fri/Sat 10pm-4am.', icon: Music, color: '#FF0080', earned: false },
    { id: '15', name: 'Dean\'s List', description: '4.0 GPA (Just kidding).', icon: GraduationCap, color: '#000000', earned: false },

    // --- TIER 4: CONTENT ---
    { id: '16', name: 'Paparazzi', description: 'Uploaded 50 clips.', icon: Camera, color: '#9013FE', earned: false },
    { id: '17', name: 'Trendsetter', description: 'Created a viral trend.', icon: Sparkles, color: '#B8E986', earned: false },
    { id: '18', name: 'Watcher', description: 'Watched 1 hour of clips.', icon: Eye, color: '#4A90E2', earned: true },
    { id: '19', name: 'Sharer', description: 'Shared 10 posts.', icon: Share2, color: '#50E3C2', earned: true },

    // --- TIER 5: LEGENDARY ---
    { id: '20', name: 'Warlord', description: 'Won a content war.', icon: Crown, color: '#F8E71C', earned: true },
    { id: '21', name: 'Streak Master', description: '30 day streak.', icon: Flame, color: '#FF4444', earned: true },
    { id: '22', name: 'Glitch Hunter', description: 'Submitted a cheat code.', icon: Zap, color: '#F8E71C', earned: false },
    { id: '23', name: 'Cartographer', description: 'Unlocked all city zones.', icon: Map, color: '#7ED321', earned: false },
    { id: '24', name: 'Beta Tester', description: 'Reported a bug.', icon: Bug, color: '#D0021B', earned: false },
    { id: '25', name: 'Vibe Curator', description: 'Voted on 100 cheats.', icon: Award, color: '#BD10E0', earned: false },
    { id: '26', name: 'Explorer', description: 'Walked 50 miles on map.', icon: Compass, color: '#4A90E2', earned: true },
    { id: '27', name: 'VIP', description: 'Bought a premium ticket.', icon: Ticket, color: '#F5A623', earned: false },
    { id: '28', name: 'Speedster', description: 'Replied in < 10s.', icon: Timer, color: '#FF0080', earned: false },
    { id: '29', name: 'Artist', description: 'Drew on the map.', icon: PenTool, color: '#9013FE', earned: false },
    { id: '30', name: 'Dropout', description: 'Deleted account once.', icon: Skull, color: '#000000', earned: false },

    // --- TIER 6: APP MASTERY ---
    { id: '31', name: 'Vault Breaker', description: 'Unlocked the City Vault.', icon: Unlock, color: '#F8E71C', earned: false },
    { id: '32', name: 'Detective', description: 'Solved a Mystery.', icon: CircleHelp, color: '#9013FE', earned: false },
    { id: '33', name: 'Daredevil', description: 'Completed a Group Dare.', icon: Swords, color: '#FF4444', earned: false },
    { id: '34', name: 'Lunch Buddy', description: 'Found a lunch match.', icon: Pizza, color: '#F5A623', earned: true },
    { id: '35', name: 'Serendipity', description: 'Used "Oops" feature.', icon: Sparkles, color: '#50E3C2', earned: true },
    { id: '36', name: 'Veteran', description: 'Voted in the War Room.', icon: Shield, color: '#4A90E2', earned: true },
    { id: '37', name: 'Daily Ritual', description: 'Completed Daily Swipe.', icon: Smartphone, color: '#BD10E0', earned: true },
    { id: '38', name: 'Expo Star', description: 'Visited Social Expo.', icon: Tent, color: '#FF7E47', earned: false },
    { id: '39', name: 'Clip Curator', description: 'Liked 50 clips.', icon: Heart, color: '#FF0080', earned: false },
    { id: '40', name: 'Map Painter', description: 'Colored a map zone.', icon: PaintBucket, color: '#7ED321', earned: false },
];

export default function BadgesScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="black" strokeWidth={3} />
                </TouchableOpacity>

                <View style={styles.headerTitle}>
                    <Medal size={24} color="black" />
                    <Text style={styles.headerText}>Trophy Case</Text>
                </View>

                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <View style={styles.grid}>
                    {BADGES.map((badge) => (
                        <View key={badge.id} style={[styles.badgeCard, !badge.earned && styles.badgeUnearned]}>
                            <View style={[styles.badgeIcon, { backgroundColor: badge.earned ? badge.color : '#E5E7EB' }]}>
                                <badge.icon size={24} color="black" />
                            </View>
                            <Text style={styles.badgeName}>{badge.name}</Text>
                            <Text style={styles.badgeDesc}>{badge.description}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 3,
        borderBottomColor: 'black',
        backgroundColor: '#FFF8F0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerText: {
        color: 'black',
        fontSize: 20,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
    },
    badgeCard: {
        width: '47%', // 2 columns with gap
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        marginBottom: 8,
    },
    badgeUnearned: {
        backgroundColor: '#F3F4F6',
        borderColor: '#9CA3AF',
        borderStyle: 'dashed',
        shadowOpacity: 0,
        opacity: 0.7,
    },
    badgeIcon: {
        width: 56,
        height: 56,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    badgeName: {
        fontSize: 14,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    badgeDesc: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
