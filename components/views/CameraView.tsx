import { api } from '@/convex/_generated/api';
import { FunctionReturnType } from 'convex/server';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ArrowLeft, ArrowUp, FlipHorizontal, RefreshCw } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface CameraViewProps {
    onClose: () => void;
    quest: FunctionReturnType<typeof api.quests.getActiveQuest> | undefined;
}

export function CameraView({ onClose, quest }: CameraViewProps) {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'back' | 'front'>('back');
    const [isRecording, setIsRecording] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const cameraRef = useRef<ExpoCameraView>(null);

    // Video Player for Verify State
    const player = useVideoPlayer(recordedVideo, player => {
        player.loop = true;
        player.muted = true;
        player.play();
    });

    // Ensure video plays when source changes
    useEffect(() => {
        if (recordedVideo && player) {
            player.loop = true;
            player.muted = true;
            player.play();
        }
    }, [recordedVideo, player]);

    // Format quest number to always show 3 digits
    const questNumber = quest?.count ? String(quest.count).padStart(3, '0') : '000';

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', color: 'white', marginBottom: 20 }}>
                    We need your permission to show the camera
                </Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Text style={styles.permissionText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
        setIsCameraReady(false);
    };

    const handleRecordToggle = () => {
        if (!isCameraReady) {
            console.warn('Camera not ready');
            return;
        }

        if (isRecording) {
            cameraRef.current?.stopRecording();
            setIsRecording(false);
        } else {
            setIsRecording(true);
            cameraRef.current?.recordAsync({
                maxDuration: 30,
            }).then((video) => {
                setIsRecording(false);
                if (video) {
                    setRecordedVideo(video.uri);
                }
            }).catch((error) => {
                console.error('Recording failed:', error);
                setIsRecording(false);
            });
        }
    };

    const handleRetry = () => {
        setRecordedVideo(null);
        setCaption('');
    };

    const handleConfirm = () => {
        if (recordedVideo && quest) {
            router.push({
                pathname: '/uploading',
                params: {
                    videoUri: recordedVideo,
                    questId: quest._id,
                    duration: 30000, // TODO: Get actual duration
                    caption: caption,
                }
            });
        }
    };

    // VERIFY STATE
    if (recordedVideo) {
        return (
            <View style={styles.container}>
                {/* Video Loop with Scanline */}
                <View style={styles.videoContainer}>
                    <VideoView
                        style={styles.video}
                        player={player}
                        contentFit="cover"
                        nativeControls={false}
                    />
                    <View style={styles.scanline} pointerEvents="none" />
                </View>

                <SafeAreaView style={styles.uiContainer}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1, justifyContent: 'space-between' }}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                {/* Header */}
                                <View style={styles.header}>
                                    <TouchableOpacity onPress={handleRetry} style={styles.iconButton}>
                                        <ArrowLeft size={24} color="white" />
                                    </TouchableOpacity>
                                    <View style={styles.questTag}>
                                        <Text style={styles.questText}>VERIFY FOOTAGE</Text>
                                    </View>
                                    <View style={{ width: 44 }} />
                                </View>

                                {/* Footer Controls */}
                                <View style={styles.footer}>
                                    {/* Caption Input */}
                                    <View style={styles.captionContainer}>
                                        <TextInput
                                            style={styles.captionInput}
                                            placeholder="Add context... (optional)"
                                            placeholderTextColor="rgba(255,255,255,0.5)"
                                            value={caption}
                                            onChangeText={setCaption}
                                            maxLength={40}
                                            returnKeyType="done"
                                        />
                                    </View>

                                    {/* Decision Deck */}
                                    <View style={styles.decisionDeck}>
                                        <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
                                            <RefreshCw size={24} color="white" />
                                            <Text style={styles.retryText}>RETRY</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                                            <ArrowUp size={24} color="black" />
                                            <Text style={styles.confirmText}>CONFIRM</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        );
    }

    // CAMERA STATE
    return (
        <View style={styles.container}>
            <ExpoCameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
                mode="video"
                onCameraReady={() => setIsCameraReady(true)}
            >
                <SafeAreaView style={styles.uiContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View style={styles.questTag}>
                            <Text style={styles.questText}>QUEST #{questNumber}</Text>
                        </View>
                        <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
                            <FlipHorizontal size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Footer / Controls */}
                    <View style={styles.footer}>
                        <Text style={styles.instructionText}>
                            {isRecording ? "Recording..." : "Tap to Record"}
                        </Text>
                        <TouchableOpacity
                            onPress={handleRecordToggle}
                            style={[styles.recordButton, isRecording && styles.recording]}
                            disabled={!isCameraReady}
                        >
                            <View style={[styles.recordInner, isRecording && styles.recordingInner]} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ExpoCameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    permissionButton: {
        backgroundColor: '#FF4444',
        padding: 16,
        borderRadius: 8,
    },
    permissionText: {
        color: 'white',
        fontWeight: 'bold',
    },
    camera: {
        flex: 1,
    },
    videoContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    video: {
        flex: 1,
    },
    scanline: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 255, 0, 0.05)', // Subtle green tint
        // In a real app, use an image pattern or repeated view for scanlines
    },
    uiContainer: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    questTag: {
        backgroundColor: 'rgba(255, 68, 68, 0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },
    questText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 1,
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    instructionText: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 24,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    recordButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 6,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recording: {
        borderColor: '#FF4444',
    },
    recordInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FF4444',
    },
    recordingInner: {
        width: 32,
        height: 32,
        borderRadius: 4,
    },
    // Verify UI Styles
    captionContainer: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    captionInput: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    decisionDeck: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 16,
    },
    retryButton: {
        flex: 1,
        height: 60,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    retryText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1,
    },
    confirmButton: {
        flex: 1,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#F8E71C', // Hazard Yellow
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#F8E71C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    confirmText: {
        color: 'black',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1,
    },
});
