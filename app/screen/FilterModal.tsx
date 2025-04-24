import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from '@expo/vector-icons/Ionicons';

type FilterOption = {
    id: string;
    label: string;
    selected?: boolean;
};

type FilterSection = {
    title: string;
    options: FilterOption[];
    multiSelect?: boolean;
};

type Props = {
    isVisible: boolean;
    onClose: () => void;
    onApplyFilters: (filters: Record<string, string[]>) => void;
    onApplyFilterReset: (sortOption: string) => void;
};

const FilterModal: React.FC<Props> = ({ isVisible, onClose, onApplyFilters, onApplyFilterReset }) => {
    // Initial filter state
    const [filterSections, setFilterSections] = useState<FilterSection[]>([
        {
            title: 'FARBE',
            options: [
                { id: 'White', label: 'White', selected: false },
                { id: 'Red', label: 'Red', selected: false },
                { id: 'Green', label: 'Green', selected: false },
                { id: 'Blue', label: 'Blue', selected: false },
                { id: 'Grey', label: 'Grey', selected: false },
                { id: 'Yello', label: 'Yellow', selected: false },
            ],
            multiSelect: true,
        },
        {
            title: 'PREIS',
            options: [
                { id: 'under_50', label: 'Unter 50€', selected: false },
                { id: '50_100', label: '50€ - 100€', selected: false },
                { id: 'above_100', label: 'Über 100€', selected: false },
            ],
            multiSelect: false, // Only allow one price range at a time
        }
    ]);

    // Calculate selected filters count
    const selectedFiltersCount = filterSections
        .flatMap(section => section.options)
        .filter(option => option.selected).length;

    // Toggle filter selection
    const toggleFilter = (sectionIndex: number, optionId: string) => {
        setFilterSections(prev => {
            const newSections = [...prev];
            const section = newSections[sectionIndex];

            if (!section.multiSelect) {
                // For single select sections, toggle the selected option
                section.options.forEach(option => {
                    option.selected = option.id === optionId ? !option.selected : false;
                });
            } else {
                // For multi-select sections, just toggle the clicked option
                const option = section.options.find(opt => opt.id === optionId);
                if (option) {
                    option.selected = !option.selected;
                }
            }

            return newSections;
        });
    };

    const handleApplyFilters = () => {
        const appliedFilters: Record<string, string[]> = {};

        filterSections.forEach(section => {
            const selectedOptions = section.options
                .filter(option => option.selected)
                .map(option => option.id);

            if (selectedOptions.length > 0) {
                appliedFilters[section.title.toLowerCase()] = selectedOptions;
            }
        });

        onApplyFilters(appliedFilters);
        onClose();
    };
    // Reset all filters
    const resetFilters = () => {
        setFilterSections(prev =>
            prev.map(section => ({
                ...section,
                options: section.options.map(option => ({
                    ...option,
                    selected: false,
                })),
            }))
        );
        onApplyFilterReset("popular");
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onSwipeComplete={handleApplyFilters}
            swipeDirection="down"
            style={styles.modal}
            backdropOpacity={0.5}
            onDismiss={handleApplyFilters}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.dragHandle} />
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Filter</Text>
                        <Text style={styles.selectedCount}>{selectedFiltersCount} ausgewählt</Text>
                    </View>
                </View>

                <ScrollView style={styles.scrollContainer}>
                    {filterSections.map((section, sectionIndex) => (
                        <View key={section.title} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>

                            <View style={styles.optionsContainer}>
                                {section.options.map(option => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.option,
                                            option.selected && styles.selectedOption,
                                        ]}
                                        onPress={() => toggleFilter(sectionIndex, option.id)}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            option.selected && styles.selectedOptionText,
                                        ]}>
                                            {option.label}
                                        </Text>
                                        {option.selected && (
                                            <Ionicons name="checkmark-outline" size={20} color="#000" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                        <Text style={styles.resetButtonText}>Zurücksetzen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
                        <Text style={styles.applyButtonText}>Anwenden</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
        marginBottom: 50
    },
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '80%',
    },
    header: {
        alignItems: 'center',
        paddingTop: 16,
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
    headerContent: {
        width: '100%',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    selectedCount: {
        fontSize: 14,
        color: '#666',
    },
    scrollContainer: {
        paddingHorizontal: 16,
    },
    section: {
        marginTop: 24,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    selectedOption: {
        borderColor: '#000',
        backgroundColor: '#f5f5f5',
    },
    optionText: {
        fontSize: 14,
        marginRight: 4,
    },
    selectedOptionText: {
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    resetButton: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 8,
        marginRight: 8,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    applyButton: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 8,
        marginLeft: 8,
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default FilterModal;