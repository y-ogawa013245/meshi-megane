import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView, Switch } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { SearchFilters, GENRES, DISTANCES, LIMITS, INITIAL_FILTERS } from '../constants/searchConstants';

interface SearchModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: SearchFilters) => void;
    currentFilters: SearchFilters;
}

export const SearchModal: React.FC<SearchModalProps> = ({
    visible,
    onClose,
    onApply,
    currentFilters,
}) => {
    const [tempFilters, setTempFilters] = useState<SearchFilters>(currentFilters);

    const resetFilters = () => setTempFilters(INITIAL_FILTERS);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>検索条件</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <FontAwesomeIcon icon={faTimes as IconProp} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body}>
                        <Text style={styles.label}>ジャンル</Text>
                        <View style={styles.chipContainer}>
                            {GENRES.map((g) => (
                                <TouchableOpacity
                                    key={g}
                                    style={[styles.chip, tempFilters.genre === g && styles.activeChip]}
                                    onPress={() => setTempFilters({ ...tempFilters, genre: g })}
                                >
                                    <Text style={[styles.chipText, tempFilters.genre === g && styles.activeChipText]}>
                                        {g}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>検索距離</Text>
                        <View style={styles.chipContainer}>
                            {DISTANCES.map((d) => (
                                <TouchableOpacity
                                    key={d.value}
                                    style={[styles.chip, tempFilters.distance === d.value && styles.activeChip]}
                                    onPress={() => setTempFilters({ ...tempFilters, distance: d.value })}
                                >
                                    <Text style={[styles.chipText, tempFilters.distance === d.value && styles.activeChipText]}>
                                        {d.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.switchRow}>
                            <Text style={styles.label}>現在営業中</Text>
                            <Switch
                                value={tempFilters.onlyOpen}
                                onValueChange={(val) => setTempFilters({ ...tempFilters, onlyOpen: val })}
                                trackColor={{ false: '#333', true: '#FF9800' }}
                            />
                        </View>

                        <View style={styles.switchRow}>
                            <Text style={styles.label}>評価なし店舗を含める</Text>
                            <Switch
                                value={tempFilters.includeNoRating}
                                onValueChange={(val) => setTempFilters({ ...tempFilters, includeNoRating: val })}
                                trackColor={{ false: '#333', true: '#FF9800' }}
                            />
                        </View>

                        <Text style={styles.label}>表示件数</Text>
                        <View style={styles.chipContainer}>
                            {LIMITS.map((l) => (
                                <TouchableOpacity
                                    key={l}
                                    style={[styles.chip, tempFilters.limit === l && styles.activeChip]}
                                    onPress={() => setTempFilters({ ...tempFilters, limit: l })}
                                >
                                    <Text style={[styles.chipText, tempFilters.limit === l && styles.activeChipText]}>
                                        {l}件
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
                            <FontAwesomeIcon icon={faTrash as IconProp} color="#AAA" size={18} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onApply(tempFilters)}
                            style={styles.applyButton}
                        >
                            <FontAwesomeIcon icon={faSearch as IconProp} color="#000" size={16} />
                            <Text style={styles.applyButtonText}>この条件で探す</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    closeButton: {
        padding: 8,
    },
    body: {
        flex: 1,
    },
    label: {
        color: '#AAA',
        fontSize: 14,
        marginTop: 16,
        marginBottom: 8,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        backgroundColor: '#333',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    activeChip: {
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        borderColor: '#FF9800',
    },
    chipText: {
        color: '#EEE',
        fontSize: 12,
    },
    activeChipText: {
        color: '#FF9800',
        fontWeight: 'bold',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    footer: {
        flexDirection: 'row',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    resetButton: {
        width: 60,
        height: 50,
        backgroundColor: '#333',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    applyButton: {
        flex: 1,
        height: 50,
        backgroundColor: '#FF9800',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
