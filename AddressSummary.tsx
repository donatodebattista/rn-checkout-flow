import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './theme';
import { AddressInfo } from './store';

interface AddressSummaryProps {
  address: AddressInfo;
  onPress?: () => void;
}

export const AddressSummary: React.FC<AddressSummaryProps> = ({ address, onPress }) => {
  const [sameAsBilling, setSameAsBilling] = useState(address.sameAsDelivery ?? true);

  return (
    <View style={styles.container}>
      {/* Main Address Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.detailsCol}>
          <Text style={styles.nameText}>{address.fullName}</Text>
          <Text style={styles.infoText}>{address.email}</Text>
          <Text style={[styles.infoText, styles.phoneText]}>
            {address.phonePrefix} {address.phone}
          </Text>
          <Text style={[styles.infoText, styles.addressFirstLine]}>
            {address.streetAddress}
          </Text>
          {address.streetAddress2 ? (
            <Text style={styles.infoText}>{address.streetAddress2}</Text>
          ) : null}
          <Text style={styles.infoText}>
            {address.city}, {address.county}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* Checkbox: Billing and delivery addresses are same */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setSameAsBilling(!sameAsBilling)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, sameAsBilling && styles.checkboxActive]}>
          {sameAsBilling && <Ionicons name="checkmark" size={14} color="#ffffff" />}
        </View>
        <Text style={styles.checkboxLabel}>
          Billing and delivery addresses are same.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
  },
  detailsCol: {
    flex: 1,
    paddingRight: 10,
  },
  nameText: {
    fontSize: 15,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: theme.colors.textDark,
    lineHeight: 18,
  },
  phoneText: {
    marginBottom: 6,
  },
  addressFirstLine: {
    marginTop: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#d1d1d6',
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxLabel: {
    fontSize: 13.5,
    color: theme.colors.textDark,
    fontWeight: theme.typography.weights.regular,
  },
});
