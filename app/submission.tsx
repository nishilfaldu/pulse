import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubmissionScreen() {
    const router = useRouter();
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    // Data Fetching
    const submission = useQuery(api.submissions.getMySubmission);
    const deleteSubmission = useMutation(api.submissions.deleteSubmission);

    // Video Player
    const player = useVideoPlayer(submission?.playbackUrl ?? null, player => {
        player.loop = true;
        player.muted = false;
        if (submission?.playbackUrl) {
            player.play();
        }
    });

    // Ensure video plays when loaded
    useEffect(() => {
        if (submission?.playbackUrl && player) {
            player.replace(submission.playbackUrl);
            player.loop = true;
            player.play();
        }
    }, [submission?.playbackUrl, player]);

    const handleDelete = () => {
        setShowDeleteAlert(true);
    };

    const confirmDelete = async () => {
        if (!submission) return;

        try {
            await deleteSubmission({ submissionId: submission._id });
            setShowDeleteAlert(false);
            router.back();
        } catch (error) {
            console.error("Failed to delete submission:", error);
            // TODO: Show error toast
        }
    };

    if (submission === undefined) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    if (submission === null) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>No submission found.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, padding: 10, backgroundColor: 'white' }}>
                    <Text style={{ fontWeight: 'bold' }}>GO BACK</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => router.back()} />

            <View style={styles.card}>
                {/* Video Section */}
                <View style={styles.videoSection}>
                    <VideoView
                        style={styles.video}
                        player={player}
                        nativeControls={false}
                        contentFit="cover"
                    />
                    <View style={styles.tagContainer}>
                        <Text style={styles.tagText}>QUEST #{String(submission.quest.count).padStart(3, '0')} COMPLETED</Text>
                    </View>
                </View>

                {/* Control Panel */}
                <View style={styles.controlPanel}>
                    {/* Row A: Reaction Matrix */}
                    <View style={styles.reactionMatrix}>
                        <View style={styles.matrixRow}>
                            <View style={[styles.matrixCell, { borderRightWidth: 2 }]}>
                                <Text style={styles.emoji}>💀</Text>
                                <Text style={styles.statValue}>{submission.reactions.skull}</Text>
                            </View>
                            <View style={styles.matrixCell}>
                                <Text style={styles.emoji}>🫡</Text>
                                <Text style={styles.statValue}>{submission.reactions.salute}</Text>
                            </View>
                        </View>
                        <View style={[styles.matrixRow, { borderTopWidth: 2 }]}>
                            <View style={[styles.matrixCell, { borderRightWidth: 2 }]}>
                                <Text style={styles.emoji}>🔥</Text>
                                <Text style={styles.statValue}>{submission.reactions.fire}</Text>
                            </View>
                            <View style={styles.matrixCell}>
                                <Text style={styles.emoji}>👀</Text>
                                <Text style={styles.statValue}>{submission.reactions.eye}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Row B: Action Block */}
                    <View style={styles.actionBlock}>
                        <TouchableOpacity style={styles.exportButton}>
                            <Text style={styles.exportText}>EXPORT TO IG STORY ↗</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Trash2 size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Custom Delete Alert */}
            {showDeleteAlert && (
                <View style={styles.alertOverlay}>
                    <View style={styles.alertCard}>
                        <View style={styles.alertHeader}>
                            <Text style={styles.alertHeaderText}>WARNING</Text>
                        </View>
                        <View style={styles.alertBody}>
                            <Text style={styles.alertTitle}>ARE YOU SURE?</Text>
                            <Text style={styles.alertMessage}>THIS QUEST WILL BE FAILED.</Text>
                        </View>
                        <View style={styles.alertActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowDeleteAlert(false)}>
                                <Text style={styles.cancelButtonText}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.failButton} onPress={confirmDelete}>
                                <Text style={styles.failButtonText}>FAIL QUEST</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    card: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderWidth: 4,
        borderColor: 'white',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    videoSection: {
        width: '100%',
        aspectRatio: 9 / 16,
        backgroundColor: 'black',
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    tagContainer: {
        position: 'absolute',
        top: 16,
        left: 0,
        backgroundColor: '#FFD700', // Brand Yellow
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    tagText: {
        color: 'black',
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 1,
    },
    controlPanel: {
        backgroundColor: 'white',
        padding: 4,
        gap: 4,
    },
    reactionMatrix: {
        borderWidth: 2,
        borderColor: 'black',
    },
    matrixRow: {
        flexDirection: 'row',
        height: 60,
    },
    matrixCell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderColor: 'black',
    },
    emoji: {
        fontSize: 24,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '900',
        color: 'black',
    },
    actionBlock: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    exportButton: {
        flex: 1,
        backgroundColor: '#FF8C00', // Brand Orange
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    exportText: {
        color: 'black',
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 1,
    },
    deleteButton: {
        width: 60,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Alert Styles
    alertOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    alertCard: {
        width: '80%',
        backgroundColor: 'white',
        borderWidth: 4,
        borderColor: 'black',
        shadowColor: 'black',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10,
    },
    alertHeader: {
        backgroundColor: '#FFD700',
        padding: 12,
        borderBottomWidth: 4,
        borderBottomColor: 'black',
    },
    alertHeaderText: {
        color: 'black',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1,
        textAlign: 'center',
    },
    alertBody: {
        padding: 24,
        alignItems: 'center',
        gap: 8,
    },
    alertTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: 'black',
        textAlign: 'center',
    },
    alertMessage: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'center',
    },
    alertActions: {
        flexDirection: 'row',
        borderTopWidth: 4,
        borderTopColor: 'black',
    },
    cancelButton: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        borderRightWidth: 4,
        borderRightColor: 'black',
        backgroundColor: 'white',
    },
    cancelButtonText: {
        fontWeight: '900',
        fontSize: 14,
    },
    failButton: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        backgroundColor: 'black',
    },
    failButtonText: {
        color: '#FF4444',
        fontWeight: '900',
        fontSize: 14,
    },
});
