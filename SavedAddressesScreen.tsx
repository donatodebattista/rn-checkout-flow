import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from './theme';
import { useCartStore } from './store';

export default function SavedAddressesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { savedAddresses, selectedAddressId, setSelectedAddress } = useCartStore();

  const handleSave = () => {
    router.back();
  };

  const handleEditAddress = (addressId: string) => {
    setSelectedAddress(addressId);
    router.push('/address' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Screen Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color={theme.colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Addresses</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Title */}
        <Text style={styles.sectionTitle}>Choose an Adress</Text>

        {/* Saved Addresses List */}
        {savedAddresses.map((address) => {
          const isSelected = selectedAddressId === address.id;

          return (
            <TouchableOpacity
              key={address.id}
              style={styles.addressRow}
              onPress={() => setSelectedAddress(address.id)}
              activeOpacity={0.8}
            >
              {/* Radio Button */}
              <View
                style={[
                  styles.radioButton,
                  isSelected && styles.radioButtonSelected,
                ]}
              />

              {/* Address Card */}
              <View style={styles.addressCard}>
                {/* Header inside Card: Title + Edit Pencil */}
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.addressTitle}>{address.title}</Text>
                  <TouchableOpacity
                    onPress={() => handleEditAddress(address.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="pencil-outline"
                      size={20}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Recipient Name */}
                <Text style={styles.recipientName}>{address.fullName}</Text>

                {/* Street Address */}
                <Text style={styles.addressLine}>{address.streetAddress}</Text>

                {/* City and County */}
                <Text style={styles.addressLine}>
                  {address.city}, {address.county}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sticky Bottom Save Button */}
      <View
        style={[
          styles.footerContainer,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    letterSpacing: -0.3,
  },
  headerRightSpacer: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    marginBottom: 16,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e2e7',
    backgroundColor: theme.colors.white,
  },
  radioButtonSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 6,
  },
  addressCard: {
    flex: 1,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginLeft: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressTitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.medium,
  },
  recipientName: {
    fontSize: 15,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    marginTop: 6,
    marginBottom: 2,
  },
  addressLine: {
    fontSize: 13,
    color: theme.colors.textDark,
    lineHeight: 18,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  saveButton: {
    height: 50,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
});
