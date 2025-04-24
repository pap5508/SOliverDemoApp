import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

type SortOption = {
    id: string;
    label: string;
};

type Props = {
    isVisible: boolean;
    onClose: () => void;
    onSelectSort: (option: string) => void;
    selectedSort: string;
};

const SortModal: React.FC<Props> = ({ isVisible, onClose, onSelectSort, selectedSort }) => {
    const sortOptions: SortOption[] = [
        { id: 'popular', label: 'Beliebteste' },
        // { id: 'newest', label: 'Neuheiten' },
        { id: 'price-asc', label: 'Preis aufsteigend' },
        { id: 'price-desc', label: 'Preis absteigend' },
    ];

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection="down"
            style={styles.modal}
            backdropOpacity={0.5}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.dragHandle} />
                    <Text style={styles.title}>Sortieren</Text>
                </View>

                <View style={styles.optionsContainer}>
                    {sortOptions.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.option,
                                selectedSort === option.id && styles.selectedOption,
                            ]}
                            onPress={() => {
                                onSelectSort(option.id);
                                onClose();
                            }}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    selectedSort === option.id && styles.selectedOptionText,
                                ]}
                            >
                                {option.label}
                            </Text>
                            {selectedSort === option.id && (
                                <Text style={styles.checkmark}>✓</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 16,
        paddingBottom: 32,
        maxHeight: '60%',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    optionsContainer: {
        marginTop: 16,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedOption: {
        backgroundColor: '#f8f8f8',
    },
    optionText: {
        fontSize: 16,
    },
    selectedOptionText: {
        fontWeight: 'bold',
        color: '#000',
    },
    checkmark: {
        color: 'green',
        fontSize: 16,
    },
});

export default SortModal;