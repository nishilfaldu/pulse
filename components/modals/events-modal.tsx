import { MapPin, X } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EVENTS } from '../../constants/data';
import { STYLES } from '../../constants/theme';

interface EventsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EventsModal({ isOpen, onClose }: EventsModalProps) {
    return (
        <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Live Events</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color="white" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <Text style={styles.helperText}>Exclusive drops. Small buy-in to filter flakes.</Text>

                        <View style={styles.eventsList}>
                            {EVENTS.map((event) => (
                                <View key={event.id} style={styles.eventCard}>
                                    {/* Left Stub */}
                                    <View style={[styles.stub, { backgroundColor: event.color }]}>
                                        <event.icon size={32} color="black" style={{ opacity: 0.5, marginBottom: 8 }} />
                                        <Text style={styles.price}>{event.price}</Text>
                                    </View>

                                    {/* Right Details */}
                                    <View style={styles.details}>
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                        <View style={styles.locationRow}>
                                            <MapPin size={12} color="#6B7280" />
                                            <Text style={styles.locationText}>{event.location}</Text>
                                        </View>
                                        <View style={styles.metaRow}>
                                            <View style={styles.timeBadge}>
                                                <Text style={styles.timeText}>{event.time}</Text>
                                            </View>
                                            <Text style={[styles.spotsText, { color: event.spots === 'Sold Out' ? '#EF4444' : '#16A34A' }]}>
                                                {event.spots}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Perforation Circles */}
                                    <View style={[styles.perforation, styles.perforationTop]} />
                                    <View style={[styles.perforation, styles.perforationBottom]} />
                                </View>
                            ))}
                        </View>
                    </ScrollView>
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
        backgroundColor: '#9B51E0',
        padding: 16,
        borderBottomWidth: 3,
        borderBottomColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 20,
        textTransform: 'uppercase',
    },
    content: {
        padding: 24,
        backgroundColor: '#F9FAFB',
    },
    helperText: {
        textAlign: 'center',
        color: '#6B7280',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 24,
    },
    eventsList: {
        gap: 16,
    },
    eventCard: {
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 12,
        overflow: 'hidden',
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        position: 'relative',
    },
    stub: {
        width: 96,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 3,
        borderRightColor: 'black',
        borderStyle: 'dashed', // Note: dashed border style support varies in RN
        padding: 8,
    },
    price: {
        fontWeight: '900',
        fontSize: 20,
    },
    details: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    eventTitle: {
        fontWeight: '900',
        fontSize: 18,
        marginBottom: 4,
        lineHeight: 20,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    locationText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6B7280',
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeBadge: {
        backgroundColor: 'black',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    timeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    spotsText: {
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    perforation: {
        position: 'absolute',
        left: 93, // 96 (stub width) - 3 (border) / 2... approx
        width: 16,
        height: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 999,
        borderWidth: 3,
        borderColor: 'black',
        zIndex: 10,
    },
    perforationTop: {
        top: -8,
    },
    perforationBottom: {
        bottom: -8,
    },
});
