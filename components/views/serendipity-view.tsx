import { useRouter } from 'expo-router';
import { ChevronRight, Flame, Ghost, Radio, Sparkles, Terminal, Ticket, Users, Utensils } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, STYLES } from '../../constants/theme';
import { GameCard } from '../game-card';
import { DailySwipeModal } from '../modals/daily-swipe-modal';
import { EventsModal } from '../modals/events-modal';
import { GroupDareModal } from '../modals/group-dare-modal';
import { LunchModal } from '../modals/lunch-modal';
import { OopsModal } from '../modals/oops-modal';
import { SocialExpModal } from '../modals/social-expo-modal';

interface SerendipityViewProps {
    onOpenChat: () => void;
}

export function SerendipityView({ onOpenChat }: SerendipityViewProps) {
    const router = useRouter();
    const [showOops, setShowOops] = useState(false);
    const [showLunch, setShowLunch] = useState(false);
    const [showSocialExp, setShowSocialExp] = useState(false);
    const [showEvents, setShowEvents] = useState(false);
    const [showGroupDare, setShowGroupDare] = useState(false);
    const [showDailySwipe, setShowDailySwipe] = useState(false);
    const [radarActive, setRadarActive] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* Daily Swipe Card */}
            <TouchableOpacity
                onPress={() => setShowDailySwipe(true)}
                activeOpacity={0.9}
                style={styles.swipeCard}
            >
                <View style={styles.swipeCardBg} />
                <View style={styles.swipeCardGradient} />
                <View style={styles.swipeCardContent}>
                    <View style={styles.swipeIconCircle}>
                        <Sparkles size={24} color="black" />
                    </View>
                    <Text style={styles.swipeTitle}>Serendipity Swipe</Text>
                    <Text style={styles.swipeSubtitle}>Daily City Secrets & Trends</Text>
                    <View style={styles.swipeBadge}>
                        <Text style={styles.swipeBadgeText}>20 Seconds</Text>
                        <ChevronRight size={12} color="black" />
                    </View>
                </View>
            </TouchableOpacity>



            {/* Cheat Codes Card */}
            <TouchableOpacity
                onPress={() => router.push('/cheat-codes')}
                activeOpacity={0.9}
                style={styles.cheatCard}
            >
                <View style={styles.cheatCardContent}>
                    <View style={styles.cheatHeader}>
                        <Terminal size={20} color="#00FF00" />
                        <Text style={styles.cheatTitle}>Cheat Codes</Text>
                    </View>
                    <Text style={styles.cheatBody}>
                        Infinite Vending Glitch: 4th floor vending machine is broken...
                    </Text>
                    <View style={styles.cheatFooter}>
                        <Text style={styles.cheatTap}>Tap to unlock</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Oops Card */}
            <GameCard
                title="Oops Game"
                description="Anonymous pairing. 200ft radius. Zero pressure fun."
                bannerColor={COLORS.primary.orange}
                icon={Users}
                label="Most Popular"
                onClick={() => setShowOops(true)}
            />

            {/* Serendipity Mode Card */}
            <View style={[STYLES.card, styles.radarCard]}>
                <View style={[styles.radarHeader, { backgroundColor: COLORS.primary.blue }]} />
                <View style={styles.radarContent}>
                    <View style={styles.radarLeft}>
                        <View style={styles.radarIconBox}>
                            <Radio size={24} color="#4A90E2" />
                        </View>
                        <View>
                            <Text style={styles.radarTitle}>Serendipity Mode</Text>
                            <Text style={styles.radarStatus}>{radarActive ? 'Active: Scanning...' : 'Passive Radar Off'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => setRadarActive(!radarActive)}
                        style={[styles.toggleSwitch, { backgroundColor: radarActive ? '#7ED321' : '#E5E7EB', alignItems: radarActive ? 'flex-end' : 'flex-start' }]}
                    >
                        <View style={styles.toggleKnob} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Group Games Card */}
            <GameCard
                title="Group Games"
                description="Start a Dare lobby. Everyone submits one. Fate picks one."
                bannerColor={COLORS.primary.red}
                icon={Flame}
                label="Multiplayer"
                onClick={() => setShowGroupDare(true)}
            />

            {/* Lunch Roulette Card */}
            <GameCard
                title="Lunch Roulette"
                description="Grab a tray. 15 minutes. Meet someone new."
                bannerColor={COLORS.primary.green}
                icon={Utensils}
                onClick={() => setShowLunch(true)}
            />

            {/* Live Events Card */}
            <GameCard
                title="Live Events"
                description="Exclusive pop-ups. Speed dating, scavenger hunts, & brand deals."
                bannerColor={COLORS.primary.purple}
                icon={Ticket}
                label="$1 to Join"
                onClick={() => setShowEvents(true)}
            />

            {/* Social Exp Card */}
            <GameCard
                title="Social Experiments"
                description="Daily micro-challenges. Do it. Prove it. Get famous."
                bannerColor={COLORS.primary.pink}
                icon={Ghost}
                label="Daily Challenge"
                onClick={() => setShowSocialExp(true)}
            />

            <OopsModal isOpen={showOops} onClose={() => setShowOops(false)} onOpenChat={onOpenChat} />
            <LunchModal isOpen={showLunch} onClose={() => setShowLunch(false)} onOpenChat={onOpenChat} />
            <SocialExpModal isOpen={showSocialExp} onClose={() => setShowSocialExp(false)} />
            <EventsModal isOpen={showEvents} onClose={() => setShowEvents(false)} />
            <GroupDareModal isOpen={showGroupDare} onClose={() => setShowGroupDare(false)} />
            <DailySwipeModal isOpen={showDailySwipe} onClose={() => setShowDailySwipe(false)} />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 100, // Space for bottom nav
    },
    swipeCard: {
        width: '100%',
        height: 192,
        borderRadius: 24,
        borderWidth: 3,
        borderColor: 'black',
        overflow: 'hidden',
        marginBottom: 32,
        position: 'relative',
        shadowColor: 'black',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
    },
    swipeCardBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
    },
    swipeCardGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FF7E47', // Placeholder for gradient
        opacity: 0.3,
    },
    swipeCardContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    swipeIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 999,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    cheatAction: {
        color: '#00FF00',
        fontWeight: '900',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    swipeTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    swipeSubtitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 12,
    },
    swipeBadge: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    swipeBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    radarCard: {
        marginBottom: 32,
        padding: 0,
        overflow: 'hidden',
    },
    radarHeader: {
        height: 16,
        borderBottomWidth: 3,
        borderBottomColor: 'black',
    },
    radarContent: {
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    radarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    radarIconBox: {
        backgroundColor: '#DBEAFE',
        padding: 12,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'black',
    },
    radarTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1A1A1A',
    },
    radarStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    toggleSwitch: {
        width: 64,
        height: 32,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    toggleKnob: {
        width: 24,
        height: 24,
        backgroundColor: 'white',
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'black',
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    cheatCard: {
        width: '100%',
        backgroundColor: 'black',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#00FF00',
        marginBottom: 32,
        overflow: 'hidden',
        shadowColor: '#00FF00',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 6,
    },
    cheatCardContent: {
        padding: 20,
    },
    cheatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 255, 0, 0.3)',
        paddingBottom: 8,
    },
    cheatTitle: {
        color: '#00FF00',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    cheatBody: {
        color: '#00FF00',
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    cheatFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cheatStatus: {
        color: 'rgba(0, 255, 0, 0.6)',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cheatTap: {
        color: '#00FF00',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
