import { AlertTriangle, X } from 'lucide-react-native';
import React from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { STYLES } from '../../constants/theme';

interface MysteryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MysteryModal({ isOpen, onClose }: MysteryModalProps) {
    return (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Scanlines placeholder */}
                    <View style={styles.scanlines} />

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X color="#00FF00" strokeWidth={3} />
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <View style={styles.header}>
                            <AlertTriangle size={48} color="#00FF00" style={styles.icon} />
                            <Text style={styles.title}>Hyperlocal Secret</Text>
                            <Text style={styles.location}>Location: TUC Food Court</Text>
                        </View>

                        <View style={styles.secretBox}>
                            <Text style={styles.secretText}>"Find the hidden rubber duck near the piano. First to scan QR code wins $20."</Text>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.timer}>09:42</Text>
                            <TouchableOpacity style={styles.button} activeOpacity={0.8}>
                                <Text style={styles.buttonText}>I'm There</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    container: {
        ...STYLES.card,
        width: '100%',
        maxWidth: 380,
        backgroundColor: 'black',
        borderWidth: 4,
        borderColor: '#00FF00',
        shadowColor: '#00FF00',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    scanlines: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        backgroundColor: 'transparent', // Placeholder for scanline gradient
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 20,
    },
    content: {
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        color: '#00FF00',
        fontSize: 24,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: -1,
        marginBottom: 8,
        textAlign: 'center',
    },
    location: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    secretBox: {
        borderWidth: 2,
        borderColor: '#00FF00',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        padding: 16,
        marginBottom: 24,
    },
    secretText: {
        color: '#00FF00',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    footer: {
        alignItems: 'center',
    },
    timer: {
        color: '#00FF00',
        fontSize: 36,
        fontWeight: '900',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        marginBottom: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#00FF00',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
});
