import { useRouter } from 'expo-router';
import { ArrowLeft, Key, Plus, ThumbsDown, ThumbsUp, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CheatCode {
    id: string;
    title: string;
    code: string;
    votes: number;
    userVote?: 'up' | 'down';
}

const INITIAL_CHEATS: CheatCode[] = [
    {
        id: '1',
        title: 'Infinite Vending Glitch',
        code: '4th floor vending machine is broken, press C4 twice to get the item.',
        votes: 420,
    },
    {
        id: '2',
        title: 'Library Nap Zone',
        code: '3rd floor behind the archives. Zero foot traffic. Best nap spot.',
        votes: 128,
    },
    {
        id: '3',
        title: 'Free Coffee Hack',
        code: 'Show up at the cafe at 4:55pm. They give away the pots before closing.',
        votes: 89,
    },
    {
        id: '4',
        title: 'Gym Peak Hours Skip',
        code: 'Go at 11:15 AM. Exactly between classes. Empty racks.',
        votes: 256,
    },
];

export default function CheatCodesScreen() {
    const router = useRouter();
    const [cheats, setCheats] = useState(INITIAL_CHEATS);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCode, setNewCode] = useState('');

    const handleAddCheat = () => {
        if (!newTitle.trim() || !newCode.trim()) return;

        const newCheat: CheatCode = {
            id: Date.now().toString(),
            title: newTitle,
            code: newCode,
            votes: 0,
            userVote: 'up', // Auto-upvote own post
        };

        setCheats([newCheat, ...cheats]);
        setNewTitle('');
        setNewCode('');
        setModalVisible(false);
    };

    const handleVote = (id: string, type: 'up' | 'down') => {
        setCheats(prev => prev.map(cheat => {
            if (cheat.id !== id) return cheat;

            let newVotes = cheat.votes;
            let newUserVote = cheat.userVote;

            if (cheat.userVote === type) {
                // Toggle off
                newVotes = type === 'up' ? newVotes - 1 : newVotes + 1; // Downvote subtracts visually? usually downvote decrements score. 
                // Let's assume score = upvotes - downvotes. 
                // If I upvoted (+1) and toggle off, score - 1.
                // If I downvoted (-1) and toggle off, score + 1.
                newUserVote = undefined;
            } else {
                // Changing vote or new vote
                if (cheat.userVote === 'up') {
                    // Was up (+1), now down (-1) -> net -2
                    newVotes -= 2;
                } else if (cheat.userVote === 'down') {
                    // Was down (-1), now up (+1) -> net +2
                    newVotes += 2;
                } else {
                    // Was undefined, now vote
                    newVotes = type === 'up' ? newVotes + 1 : newVotes - 1;
                }
                newUserVote = type;
            }

            return { ...cheat, votes: newVotes, userVote: newUserVote };
        }));
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#00FF00" strokeWidth={3} />
                </TouchableOpacity>

                <View style={styles.headerTitle}>
                    <Key size={24} color="#00FF00" />
                    <Text style={styles.headerText}>Cheat Codes</Text>
                </View>

                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                    <Plus size={24} color="#00FF00" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.introText}>
                    Glitches in the matrix. Use at your own risk.
                </Text>

                {cheats.map((item) => (
                    <View key={item.id} style={styles.cheatItem}>
                        <View style={styles.cheatHeader}>
                            <Text style={styles.cheatTitle}>{item.title}</Text>
                        </View>
                        <Text style={styles.cheatCode}>{item.code}</Text>
                        <View style={styles.cheatFooter}>
                            <View style={styles.voteContainer}>
                                <TouchableOpacity
                                    onPress={() => handleVote(item.id, 'up')}
                                >
                                    <ThumbsUp
                                        size={20}
                                        color={item.userVote === 'up' ? '#00FF00' : 'rgba(0, 255, 0, 0.4)'}
                                        fill={item.userVote === 'up' ? '#00FF00' : 'transparent'}
                                    />
                                </TouchableOpacity>

                                <Text style={styles.voteCount}>{item.votes}</Text>

                                <TouchableOpacity
                                    onPress={() => handleVote(item.id, 'down')}
                                >
                                    <ThumbsDown
                                        size={20}
                                        color={item.userVote === 'down' ? '#00FF00' : 'rgba(0, 255, 0, 0.4)'}
                                        fill={item.userVote === 'down' ? '#00FF00' : 'transparent'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Add Cheat Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Share a Glitch</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color="#00FF00" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Infinite Vending Glitch"
                            placeholderTextColor="rgba(0, 255, 0, 0.3)"
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />

                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="How does it work?"
                            placeholderTextColor="rgba(0, 255, 0, 0.3)"
                            value={newCode}
                            onChangeText={setNewCode}
                            multiline
                            numberOfLines={4}
                        />

                        <TouchableOpacity style={styles.submitButton} onPress={handleAddCheat}>
                            <Text style={styles.submitButtonText}>SUBMIT GLITCH</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#00FF00',
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
        color: '#00FF00',
        fontSize: 18,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    introText: {
        color: 'rgba(0, 255, 0, 0.8)',
        fontSize: 14,
        marginBottom: 24,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    cheatItem: {
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#00FF00',
        padding: 16,
        backgroundColor: 'rgba(0, 255, 0, 0.05)',
    },
    cheatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cheatTitle: {
        color: '#00FF00',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Courier', // Restoring font family if it was there or just keeping it consistent with "glitch" vibe
    },
    cheatCode: {
        color: 'white',
        fontSize: 16,
        marginBottom: 16,
        lineHeight: 24,
        fontFamily: 'Courier',
    },
    cheatFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 255, 0, 0.3)',
        paddingTop: 12,
    },
    voteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    voteCount: {
        color: '#00FF00',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Courier',
    },
    addButton: {
        padding: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        padding: 16,
    },
    modalContent: {
        backgroundColor: 'black',
        borderWidth: 2,
        borderColor: '#00FF00',
        padding: 24,
        borderRadius: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        color: '#00FF00',
        fontSize: 20,
        fontWeight: '900',
        textTransform: 'uppercase',
        fontFamily: 'Courier',
    },
    inputLabel: {
        color: '#00FF00',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'uppercase',
        fontFamily: 'Courier',
    },
    input: {
        borderWidth: 1,
        borderColor: '#00FF00',
        borderRadius: 8,
        padding: 12,
        color: 'white',
        marginBottom: 16,
        fontFamily: 'Courier',
        fontSize: 14,
        backgroundColor: 'rgba(0, 255, 0, 0.05)',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#00FF00',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: 'black',
        fontWeight: '900',
        fontSize: 16,
        textTransform: 'uppercase',
        fontFamily: 'Courier',
    },
});
