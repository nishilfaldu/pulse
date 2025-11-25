import { Ghost, Send, ShieldAlert, Timer, X } from 'lucide-react-native';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CHAT_MESSAGES } from '../../constants/data';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
    return (
        <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.avatar}>
                                <Ghost size={20} color="black" />
                            </View>
                            <View>
                                <Text style={styles.headerTitle}>Match #928</Text>
                                <View style={styles.timerContainer}>
                                    <Timer size={10} color="#FF4444" />
                                    <Text style={styles.timerText}>09:42 remaining</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <X color="white" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>

                    {/* Messages */}
                    <ScrollView style={styles.messagesArea} contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
                        <View style={styles.icebreaker}>
                            <Text style={styles.icebreakerText}>Icebreaker: "Say hi in exactly 7 words."</Text>
                        </View>

                        {CHAT_MESSAGES.map(msg => (
                            <View key={msg.id} style={[styles.messageRow, msg.sender === 'me' ? styles.myMessageRow : styles.theirMessageRow]}>
                                <View style={[styles.messageBubble, msg.sender === 'me' ? styles.myMessageBubble : styles.theirMessageBubble]}>
                                    <Text style={[styles.messageText, msg.sender === 'me' ? styles.myMessageText : styles.theirMessageText]}>{msg.text}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Input Area */}
                    <View style={styles.inputArea}>
                        <View style={styles.controls}>
                            <TouchableOpacity style={styles.reportButton}>
                                <ShieldAlert size={12} color="#9CA3AF" />
                                <Text style={styles.reportText}>Report</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.extendButton}>
                                <Text style={styles.extendText}>Extend Time</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputRow}>
                            <TextInput
                                placeholder="Type a message..."
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                            />
                            <TouchableOpacity style={styles.sendButton}>
                                <Send size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
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
        width: '100%',
        height: 500,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 24,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: 'black',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: '#FFF8F0',
        borderWidth: 2,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: 'white',
        fontWeight: '900',
        fontSize: 18,
        lineHeight: 20,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timerText: {
        color: '#FF4444',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    messagesArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 16,
    },
    icebreaker: {
        backgroundColor: '#FEF3C7',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
    },
    icebreakerText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.6)',
        textAlign: 'center',
    },
    messageRow: {
        flexDirection: 'row',
        width: '100%',
    },
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    theirMessageRow: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'black',
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    myMessageBubble: {
        backgroundColor: '#FF7E47',
    },
    theirMessageBubble: {
        backgroundColor: 'white',
    },
    messageText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    myMessageText: {
        color: 'white',
    },
    theirMessageText: {
        color: 'black',
    },
    inputArea: {
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 2,
        borderTopColor: '#E5E7EB',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    reportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    reportText: {
        color: '#9CA3AF',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    extendButton: {
        backgroundColor: '#7ED321',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'black',
    },
    extendText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    inputRow: {
        flexDirection: 'row',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontWeight: 'bold',
        fontSize: 14,
    },
    sendButton: {
        backgroundColor: 'black',
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'black',
    },
});
