import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Place } from '../../constants/city-builder-data';
import { COLORS, STYLES } from '../../constants/theme';

interface CreatePlaceModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (placeData: Partial<Place>) => void;
    coordinates: { x: number; y: number } | null;
}

export function CreatePlaceModal({ visible, onClose, onCreate, coordinates }: CreatePlaceModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedType, setSelectedType] = useState<Place['type']>('restaurant');

    const types: Place['type'][] = ['restaurant', 'park', 'shop', 'landmark', 'hidden-gem', 'other'];

    const handleCreate = () => {
        if (!name) return;
        onCreate({
            name,
            story: description,
            type: selectedType,
            vibeTags: ['new'], // Default tag
        });
        setName('');
        setDescription('');
        setSelectedType('restaurant');
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Found a Place</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color={COLORS.text} size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.label}>Coordinates</Text>
                        <Text style={styles.coordsText}>Grid: {coordinates?.x}, {coordinates?.y}</Text>

                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={STYLES.input}
                            placeholder="e.g. The Old Coffee Shop"
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={styles.label}>Type</Text>
                        <View style={styles.typeContainer}>
                            {types.map(t => (
                                <TouchableOpacity
                                    key={t}
                                    style={[
                                        styles.typeChip,
                                        selectedType === t && styles.activeTypeChip
                                    ]}
                                    onPress={() => setSelectedType(t)}
                                >
                                    <Text style={[
                                        styles.typeText,
                                        selectedType === t && styles.activeTypeText
                                    ]}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Story / Description</Text>
                        <TextInput
                            style={[STYLES.input, { height: 100, textAlignVertical: 'top' }]}
                            placeholder="What makes this place special?"
                            multiline
                            value={description}
                            onChangeText={setDescription}
                        />

                        <TouchableOpacity style={[STYLES.button, styles.createButton]} onPress={handleCreate}>
                            <Text style={STYLES.buttonText}>Found Place</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.bg,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderColor: COLORS.border,
        height: '80%',
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.text,
    },
    content: {
        gap: 16,
        paddingBottom: 40,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: COLORS.text,
    },
    coordsText: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: COLORS.border,
        backgroundColor: 'white',
    },
    activeTypeChip: {
        backgroundColor: COLORS.primary.black,
    },
    typeText: {
        fontWeight: 'bold',
        color: COLORS.text,
        textTransform: 'capitalize',
    },
    activeTypeText: {
        color: 'white',
    },
    createButton: {
        backgroundColor: COLORS.primary.green,
        marginTop: 16,
    }
});
