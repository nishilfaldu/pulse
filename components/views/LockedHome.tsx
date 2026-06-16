import { authClient } from '@/lib/auth-client';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { Clock, Play } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalFeed } from './GlobalFeed';

export default function LockedHome() {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const quest = useQuery(api.quests.getActiveQuest);
    const hasCompleted = useQuery(
        api.quests.hasCompletedQuest,
        quest?._id ? { questId: quest._id } : "skip"
    );

    const [timeLeft] = useState("02:14:59");
    const [tutorialDismissed, setTutorialDismissed] = useState(false);

    // If user has completed current quest, show GlobalFeed
    if (hasCompleted) {
        return <GlobalFeed />;
    }

    const user = session?.user as any;

    // ... existing code

    return (
        <View style={styles.containerBlack}>
            <SafeAreaView style={styles.safeArea}>
                {/* ... existing content ... */}
                <View style={styles.topHeader}>
                    <View />
                    <TouchableOpacity
                        style={styles.archiveButton}
                        onPress={() => router.push('/archive')}
                    >
                        <Clock size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.centerContent}>
                    <Clock size={48} color="#333" style={{ marginBottom: 24 }} />
                    <Text style={styles.loadingText}>LOADING WORLD...</Text>
                    <Text style={styles.timerText}>{timeLeft}</Text>
                    <Text style={styles.subText}>Next quest drops in [Timer]</Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.wrapButton}
                        onPress={() => router.push('/wrap')}
                    >
                        <Play size={16} color="white" />
                        <Text style={styles.wrapButtonText}>Watch Yesterday&apos;s Wrap</Text>
                    </TouchableOpacity>

                    {/* DEV BUTTONS */}
                    <View style={{ gap: 8, alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.devButton}
                            onPress={() => router.push('/gate')}
                        >
                            <Text style={styles.devButtonText}>DEV: Go to Gate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.devButton}
                            onPress={() => router.push('/lobby')}
                        >
                            <Text style={styles.devButtonText}>DEV: Go to Lobby</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            {/* Tutorial Overlay */}
            {user && !tutorialDismissed && (
                <View style={styles.tutorialOverlay}>
                    <View style={styles.stickyNote}>
                        <Text style={styles.noteText}>You are active. Wait for the signal.</Text>
                        <TouchableOpacity onPress={() => setTutorialDismissed(true)}>
                            <Text style={styles.noteButton}>GOT IT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    containerBlack: {
        flex: 1,
        backgroundColor: '#050505',
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 24,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#666',
        fontSize: 12,
        letterSpacing: 4,
        fontWeight: '900',
        marginBottom: 16,
    },
    timerText: {
        color: 'white',
        fontSize: 48,
        fontWeight: '900',
        fontVariant: ['tabular-nums'],
        marginBottom: 8,
    },
    subText: {
        color: '#444',
        fontSize: 14,
    },
    wrapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 100,
        gap: 8,
        marginBottom: 20,
    },
    wrapButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    footer: {
        alignItems: 'center',
        marginBottom: 40,
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
        backgroundColor: 'rgba(255, 68, 68, 0.2)',
        borderRadius: 8,
    },
    devButtonText: {
        color: '#FF4444',
        fontSize: 12,
        fontWeight: 'bold',
    },
    tutorialOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    stickyNote: {
        backgroundColor: '#F8E71C', // Hazard Yellow
        padding: 24,
        width: 200,
        transform: [{ rotate: '-2deg' }],
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 0,
    },
    noteText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 16,
        color: 'black',
    },
    noteButton: {
        fontWeight: '900',
        fontSize: 18,
        textDecorationLine: 'underline',
        color: 'black',
    },
});
