import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel} // Android geri tuşu
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
              <Text style={styles.buttonText}>Hayır</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}>
              <Text style={styles.buttonText}>Evet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: { fontSize: 18, color: '#E2E8F0', fontWeight: '700', marginBottom: 8 },
  message: { fontSize: 14, color: '#CBD5E1', marginBottom: 20, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  button: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancel: { backgroundColor: '#475569' } as ViewStyle,
  confirm: { backgroundColor: '#2563EB' } as ViewStyle,
  buttonText: { color: '#F8FAFC', fontWeight: '600', fontSize: 14 },
});
