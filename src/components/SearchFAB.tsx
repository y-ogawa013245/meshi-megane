import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface SearchFABProps {
    onPress: () => void;
}

export const SearchFAB: React.FC<SearchFABProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
            <FontAwesomeIcon icon={faSearch as IconProp} color="#000" size={24} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 40,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FF9800',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});
