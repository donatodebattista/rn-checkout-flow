import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { PaymentMethod } from '../../types';

interface PaymentMethodSummaryProps {
  payment: PaymentMethod;
  onPress?: () => void;
}

export const PaymentMethodSummary: React.FC<PaymentMethodSummaryProps> = ({
  payment,
  onPress,
}) => {
  // Extract last 4 digits (default to 8553 if not yet populated or shorter)
  const cleanDigits = payment.cardNumber.replace(/\D/g, '');
  const last4 = cleanDigits.length >= 4 ? cleanDigits.slice(-4) : cleanDigits || '8553';
  const label = payment.cardLabel || 'My Virtual Debit Card';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftRow}>
        {/* Mastercard Logo */}
        <View style={styles.mcWrapper}>
          <View style={styles.mcCircles}>
            <View style={[styles.mcCircle, styles.mcRed]} />
            <View style={[styles.mcCircle, styles.mcOrange]} />
          </View>
          <Text style={styles.mcText}>mastercard</Text>
        </View>

        {/* Card Details */}
        <View style={styles.detailsCol}>
          <Text style={styles.cardLabel}>{label}</Text>
          <View style={styles.numberRow}>
            <View style={styles.dotsRow}>
              <View style={styles.bulletDot} />
              <View style={styles.bulletDot} />
              <View style={styles.bulletDot} />
            </View>
            <Text style={styles.last4Text}>{last4}</Text>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardBg,
    marginHorizontal: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.lg,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
  },
  mcCircles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcCircle: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
  },
  mcRed: {
    backgroundColor: '#eb001b',
    marginRight: -6,
    zIndex: 1,
  },
  mcOrange: {
    backgroundColor: '#f79e1b',
  },
  mcText: {
    fontSize: 6,
    fontWeight: '700',
    color: '#333333',
    letterSpacing: -0.2,
    marginTop: 1,
  },
  detailsCol: {
    marginLeft: 14,
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 11.5,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    gap: 4,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.textDark,
  },
  last4Text: {
    fontSize: 15,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    letterSpacing: 0.5,
  },
});
