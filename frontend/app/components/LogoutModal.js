import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';

const LogoutModal = ({ slideAnim, onClose }) => {
    return (
        <Animated.View style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}>
            <Text style={styles.text}>로그아웃 하시겠습니까?</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={() => alert('로그아웃')}>
                <Text style={styles.buttonText}>로그아웃</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.buttonText}>닫기</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: 'black',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default LogoutModal;