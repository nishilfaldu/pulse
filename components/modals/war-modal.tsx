import { useRouter } from 'expo-router';
import { Bomb, Flame, Swords, X, Zap } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WAR_DATA } from '../../constants/data';
import { STYLES } from '../../constants/theme';

interface WarModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WarModal({ isOpen, onClose }: WarModalProps) {
    const router = useRouter();
    const [warMode, setWarMode] = React.useState<'spectate' | 'choose' | 'attack'>('spectate');
    const [mySide, setMySide] = React.useState<'left' | 'right' | null>(null);
    const [attackText, setAttackText] = React.useState('');

    React.useEffect(() => {
        if (isOpen) {
            setWarMode('spectate');
            setMySide(null);
            setAttackText('');
        }
    }, [isOpen]);

    const handleFire = () => {
        onClose();
        router.push('/war-room');
    };

    return (
        <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.pattern} />
                        <View style={styles.headerTitle}>
                            <Swords color="white" size={24} />
                            <Text style={styles.headerText}>Content War</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <X color="white" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>

                    {/* MODE: SPECTATE */}
                    {warMode === 'spectate' && (
                        <>
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

                            <ScrollView style={styles.feed}>
                                <View style={styles.feedHeader}>
                                    <View style={styles.feedTitleRow}>
                                        <Bomb size={18} color="black" />
                                        <Text style={styles.feedTitle}>Top Attacks</Text>
                                    </View>
                                    <View style={styles.timerBadge}>
                                        <Text style={styles.timerText}>Ends in 4h</Text>
                                    </View>
                                </View>

                                <View style={styles.postsList}>
                                    {WAR_DATA.posts.map((post, index) => (
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
                            </ScrollView>

                            <View style={styles.footer}>
                                <TouchableOpacity
                                    style={[STYLES.button, styles.joinButton]}
                                    onPress={() => setWarMode('choose')}
                                >
                                    <Swords size={18} color="white" />
                                    <Text style={STYLES.buttonText}>Join the Fight</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    {/* MODE: CHOOSE */}
                    {warMode === 'choose' && (
                        <View style={styles.chooseContainer}>
                            <View style={styles.chooseHeader}>
                                <Text style={styles.chooseTitle}>Choose Your Faction</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.factionCard, { backgroundColor: WAR_DATA.left.color }]}
                                onPress={() => { setMySide('left'); setWarMode('attack'); }}
                            >
                                <Text style={styles.factionEmoji}>🌮</Text>
                                <Text style={styles.factionName}>{WAR_DATA.left.name}</Text>
                                <Text style={styles.factionSub}>Join the crunchy side</Text>
                            </TouchableOpacity>

                            <View style={styles.vsBadge}>
                                <Text style={styles.vsBadgeText}>VS</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.factionCard, { backgroundColor: WAR_DATA.right.color }]}
                                onPress={() => { setMySide('right'); setWarMode('attack'); }}
                            >
                                <Text style={styles.factionEmoji}>🥞</Text>
                                <Text style={[styles.factionName, { color: 'black' }]}>{WAR_DATA.right.name}</Text>
                                <Text style={[styles.factionSub, { color: 'rgba(0,0,0,0.7)' }]}>Team Hashbrowns</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* MODE: ATTACK */}
                    {warMode === 'attack' && (
                        <View style={styles.attackContainer}>
                            <View style={styles.attackHeader}>
                                <TouchableOpacity onPress={() => setWarMode('choose')}>
                                    <Text style={styles.backText}>{'< BACK'}</Text>
                                </TouchableOpacity>
                                <View style={styles.deployingBadge}>
                                    <Text style={styles.deployingLabel}>Deploying for:</Text>
                                    <View style={[styles.deployingTag, {
                                        backgroundColor: mySide === 'left' ? WAR_DATA.left.color : WAR_DATA.right.color
                                    }]}>
                                        <Text style={[styles.deployingText, { color: mySide === 'right' ? 'black' : 'white' }]}>
                                            {mySide === 'left' ? WAR_DATA.left.name : WAR_DATA.right.name}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ width: 40 }} />
                            </View>

                            <View style={styles.attackContent}>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.attackInput}
                                        placeholder="Write your attack here... (Be savage but safe)"
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        value={attackText}
                                        onChangeText={setAttackText}
                                        autoFocus
                                    />
                                    <Text style={styles.charCount}>{attackText.length}/140</Text>
                                </View>

                                <TouchableOpacity style={styles.uploadButton}>
                                    <Text style={styles.uploadText}>+ Add War Meme (Optional)</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[STYLES.button, styles.fireButton, !attackText.trim() && styles.disabledButton]}
                                    onPress={handleFire}
                                    disabled={!attackText.trim()}
                                >
                                    <Bomb size={24} color="white" />
                                    <Text style={[STYLES.buttonText, { fontSize: 20 }]}>FIRE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    container: {
        ...STYLES.card,
        width: '100%',
        maxWidth: 380,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 24,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: 'black',
        padding: 16,
        borderBottomWidth: 3,
        borderBottomColor: 'rgba(255,255,255,0.2)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    pattern: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        backgroundColor: '#333', // Placeholder for striped pattern
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
        padding: 16,
        backgroundColor: '#F9FAFB',
        minHeight: 300,
    },
    feedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
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
    footer: {
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 3,
        borderTopColor: 'black',
    },
    joinButton: {
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
    },
    chooseContainer: {
        width: '100%',
        backgroundColor: 'black',
        minHeight: 500,
    },
    chooseHeader: {
        padding: 8,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
    },
    chooseTitle: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    factionCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    factionEmoji: {
        fontSize: 64,
        marginBottom: 8,
    },
    factionName: {
        color: 'white',
        fontSize: 32,
        fontWeight: '900',
        textTransform: 'uppercase',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    factionSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: 'bold',
    },
    vsBadge: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -24 }, { translateY: -10 }],
        width: 48,
        height: 48,
        backgroundColor: 'black',
        borderRadius: 999,
        borderWidth: 3,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    vsBadgeText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 16,
    },
    attackContainer: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        minHeight: 500,
    },
    attackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 3,
        borderBottomColor: 'black',
    },
    backText: {
        color: '#9CA3AF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    deployingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    deployingLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    deployingTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'black',
    },
    deployingText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    attackContent: {
        padding: 24,
        flex: 1,
    },
    inputWrapper: {
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        height: 140,
        position: 'relative',
    },
    attackInput: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        height: '100%',
        textAlignVertical: 'top',
    },
    charCount: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#D1D5DB',
    },
    uploadButton: {
        width: '100%',
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 'auto',
        backgroundColor: 'white',
    },
    uploadText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: '#9CA3AF',
    },
    fireButton: {
        backgroundColor: '#FF4444',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        marginTop: 16,
    },
    disabledButton: {
        backgroundColor: '#D1D5DB',
        borderColor: '#9CA3AF',
    },
});
