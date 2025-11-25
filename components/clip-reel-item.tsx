import { Heart, MessageCircle, MoreHorizontal, Share2, Volume2 } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface ClipReelItemProps {
    clip: any;
    isActive: boolean;
}

export function ClipReelItem({ clip, isActive }: ClipReelItemProps) {
    return (
        <View style={styles.container}>
            {/* Mock Video Background */}
            <View style={[styles.videoPlaceholder, { backgroundColor: clip.color }]} />

            <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
                {/* Right Side Actions */}
                <View style={styles.rightActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Heart size={24} color="black" />
                        <Text style={styles.actionText}>1.2k</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <MessageCircle size={24} color="black" />
                        <Text style={styles.actionText}>45</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Share2 size={24} color="black" />
                        <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <MoreHorizontal size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Bottom Info */}
                <View style={styles.bottomInfo}>
                    <View style={styles.userRow}>
                        <View style={styles.avatar} />
                        <Text style={styles.username}>@campus_legend</Text>
                        <TouchableOpacity style={styles.followButton}>
                            <Text style={styles.followText}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.description}>{clip.title}</Text>
                    <View style={styles.audioRow}>
                        <Volume2 size={14} color="white" />
                        <Text style={styles.audioText}>Original Audio • Trending</Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: 'black',
        position: 'relative',
    },
    videoPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 16,
    },
    rightActions: {
        position: 'absolute',
        right: 16,
        bottom: 100,
        alignItems: 'center',
        gap: 16,
    },
    actionButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'black',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    actionText: {
        position: 'absolute',
        bottom: -20,
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        width: 60,
        textAlign: 'center',
    },
    bottomInfo: {
        width: '80%',
        marginBottom: 20,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
    },
    username: {
        color: 'white',
        fontWeight: '900',
        fontSize: 16,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    followButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 8,
    },
    followText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    description: {
        color: 'white',
        fontSize: 16,
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    audioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    audioText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
