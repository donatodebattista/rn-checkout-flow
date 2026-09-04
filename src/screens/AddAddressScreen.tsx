import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Modal,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../theme';
import { useCartStore } from '../store';
import { BillingType } from '../types';

const AVAILABLE_CITIES = [
  'Clausthal-Zellerfeld',
  'Berlin',
  'Munich',
  'Frankfurt',
  'Hamburg',
  'Cologne',
  'Stuttgart',
  'Düsseldorf',
];

const AVAILABLE_COUNTIES = [
  'Germany',
  'Austria',
  'Switzerland',
  'United Kingdom',
  'France',
  'Spain',
  'Italy',
];

const COUNTRY_PREFIXES = [
  { flag: '🇩🇪', code: '+49', name: 'Germany' },
  { flag: '🇺🇸', code: '+1', name: 'USA' },
  { flag: '🇪🇸', code: '+34', name: 'Spain' },
  { flag: '🇬🇧', code: '+44', name: 'UK' },
  { flag: '🇫🇷', code: '+33', name: 'France' },
  { flag: '🇹🇷', code: '+90', name: 'Turkey' },
];

export default function AddAddressScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { shippingAddress, setShippingAddress } = useCartStore();

  // Local state for all fields (prefill if editing existing address)
  const [fullName, setFullName] = useState(shippingAddress?.fullName || '');
  const [phonePrefix, setPhonePrefix] = useState(shippingAddress?.phonePrefix || '+49');
  const [phoneFlag, setPhoneFlag] = useState('🇩🇪');
  const [phone, setPhone] = useState(shippingAddress?.phone || '');
  const [email, setEmail] = useState(shippingAddress?.email || '');

  const [addressTitle, setAddressTitle] = useState(shippingAddress?.addressTitle || '');
  const [streetAddress, setStreetAddress] = useState(shippingAddress?.streetAddress || '');
  const [streetAddress2, setStreetAddress2] = useState(shippingAddress?.streetAddress2 || '');
  const [showAddress2, setShowAddress2] = useState(Boolean(shippingAddress?.streetAddress2));
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [county, setCounty] = useState(shippingAddress?.county || '');

  const [sameAsDelivery, setSameAsDelivery] = useState(
    shippingAddress?.sameAsDelivery ?? true
  );
  const [billingType, setBillingType] = useState<BillingType>(
    shippingAddress?.billingType || 'Personal'
  );

  // Modal pickers
  const [pickerType, setPickerType] = useState<'prefix' | 'city' | 'county' | null>(null);

  // Validation
  const isFormValid =
    fullName.trim().length > 0 &&
    phone.trim().length > 0 &&
    email.trim().length > 0 &&
    streetAddress.trim().length > 0 &&
    city.trim().length > 0 &&
    county.trim().length > 0;

  const handleSave = () => {
    if (!isFormValid) return;

    setShippingAddress({
      fullName: fullName.trim(),
      phonePrefix,
      phone: phone.trim(),
      email: email.trim(),
      addressTitle: addressTitle.trim() || undefined,
      streetAddress: streetAddress.trim(),
      streetAddress2: showAddress2 ? streetAddress2.trim() || undefined : undefined,
      city: city.trim(),
      county: county.trim(),
      sameAsDelivery,
      billingType,
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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

        <Text style={styles.headerTitle}>Add Address</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.requiredFieldsText}>*Required fields.</Text>

        {/* ================= SECTION 1: RECIPIENTS INFORMATION ================= */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>1</Text>
          </View>
          <Text style={styles.sectionTitle}>Recipients Information</Text>
        </View>

        {/* Name and Surname* */}
        <View style={styles.inputCard}>
          {fullName.length > 0 && (
            <Text style={styles.floatingLabel}>Name and Surname*</Text>
          )}
          <TextInput
            style={styles.textInput}
            placeholder="Name and Surname*"
            placeholderTextColor={theme.colors.textMuted}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </View>

        {/* Phone row: Prefix Box + Phone Number* */}
        <View style={styles.phoneRow}>
          <TouchableOpacity
            style={styles.prefixSelector}
            onPress={() => setPickerType('prefix')}
            activeOpacity={0.7}
          >
            <Text style={styles.flagEmoji}>{phoneFlag}</Text>
            <Text style={styles.prefixText}>{phonePrefix}</Text>
          </TouchableOpacity>

          <View style={[styles.inputCard, styles.phoneInputCard]}>
            {phone.length > 0 && (
              <Text style={styles.floatingLabel}>Phone Number*</Text>
            )}
            <TextInput
              style={styles.textInput}
              placeholder="Phone Number*"
              placeholderTextColor={theme.colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <Text style={styles.helperText}>For shipping related questions only.</Text>

        {/* E-mail Address* */}
        <View style={styles.inputCard}>
          {email.length > 0 && (
            <Text style={styles.floatingLabel}>E-mail Address*</Text>
          )}
          <TextInput
            style={styles.textInput}
            placeholder="E-mail Address*"
            placeholderTextColor={theme.colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <Text style={styles.helperText}>
          This address will be used to send you order and bill details.
        </Text>

        {/* ================= SECTION 2: SHIPPING ADDRESS ================= */}
        <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>2</Text>
          </View>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
        </View>

        {/* Address Title (Optional) */}
        <View style={styles.inputCard}>
          {addressTitle.length > 0 && (
            <Text style={styles.floatingLabel}>Address Title (Optional)</Text>
          )}
          <TextInput
            style={styles.textInput}
            placeholder="Address Title (Optional)"
            placeholderTextColor={theme.colors.textMuted}
            value={addressTitle}
            onChangeText={setAddressTitle}
          />
        </View>
        <Text style={styles.helperText}>
          For estimating if the place is opened or closed on the weekends.
        </Text>

        {/* Address* with GPS Icon */}
        <View style={[styles.inputCard, styles.addressInputRow]}>
          <View style={styles.addressTextWrapper}>
            {streetAddress.length > 0 ? (
              <>
                <Text style={styles.floatingLabel}>Adress*</Text>
                <TextInput
                  style={styles.textInput}
                  value={streetAddress}
                  onChangeText={setStreetAddress}
                />
              </>
            ) : (
              <>
                <Text style={styles.emptyAddressTitle}>Adress*</Text>
                <TextInput
                  style={styles.subtextInput}
                  placeholder="Street, apartment name etc."
                  placeholderTextColor={theme.colors.textMuted}
                  value={streetAddress}
                  onChangeText={setStreetAddress}
                />
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.locationButton}
            activeOpacity={0.7}
            onPress={() => {
              setStreetAddress('Leibnizstraße 16, Wohnheim 6, No: 8X');
              setCity('Clausthal-Zellerfeld');
              setCounty('Germany');
            }}
          >
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* + Street Address 2 (Optional) */}
        {!showAddress2 ? (
          <TouchableOpacity
            style={styles.addAddress2Button}
            onPress={() => setShowAddress2(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={18} color={theme.colors.primary} />
            <Text style={styles.addAddress2Text}>Street Address 2 (Optional)</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.inputCard, { marginTop: 10 }]}>
            {streetAddress2.length > 0 && (
              <Text style={styles.floatingLabel}>Street Address 2 (Optional)</Text>
            )}
            <TextInput
              style={styles.textInput}
              placeholder="Street Address 2 (Optional)"
              placeholderTextColor={theme.colors.textMuted}
              value={streetAddress2}
              onChangeText={setStreetAddress2}
            />
          </View>
        )}

        {/* City* Dropdown */}
        <TouchableOpacity
          style={styles.dropdownCard}
          onPress={() => setPickerType('city')}
          activeOpacity={0.7}
        >
          <View style={styles.dropdownTextCol}>
            {city.length > 0 ? (
              <>
                <Text style={styles.floatingLabel}>City*</Text>
                <Text style={styles.dropdownValueText}>{city}</Text>
              </>
            ) : (
              <Text style={styles.dropdownPlaceholderText}>City*</Text>
            )}
          </View>
          <Ionicons name="chevron-down" size={20} color={theme.colors.primary} />
        </TouchableOpacity>

        {/* County* Dropdown */}
        <TouchableOpacity
          style={styles.dropdownCard}
          onPress={() => setPickerType('county')}
          activeOpacity={0.7}
        >
          <View style={styles.dropdownTextCol}>
            {county.length > 0 ? (
              <>
                <Text style={styles.floatingLabel}>County*</Text>
                <Text style={styles.dropdownValueText}>{county}</Text>
              </>
            ) : (
              <Text style={styles.dropdownPlaceholderText}>County*</Text>
            )}
          </View>
          <Ionicons name="chevron-down" size={20} color={theme.colors.primary} />
        </TouchableOpacity>

        {/* ================= SECTION 3: BILLING INFORMATION ================= */}
        <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>3</Text>
          </View>
          <Text style={styles.sectionTitle}>Billing Information</Text>
        </View>

        <Text style={styles.subSectionTitle}>Billing Address*</Text>

        {/* Checkbox: Same as delivery address */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setSameAsDelivery(!sameAsDelivery)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, sameAsDelivery && styles.checkboxActive]}>
            {sameAsDelivery && <Ionicons name="checkmark" size={16} color="#ffffff" />}
          </View>
          <Text style={styles.checkboxLabel}>Same as delivery address.</Text>
        </TouchableOpacity>

        <Text style={[styles.subSectionTitle, { marginTop: 18 }]}>Billing Type*</Text>

        {/* Radio buttons: Personal / Commercial */}
        <View style={styles.radioGroupRow}>
          {/* Personal */}
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setBillingType('Personal')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.radioCircle,
                billingType === 'Personal' && styles.radioCircleActive,
              ]}
            />
            <Text style={styles.radioLabel}>Personal</Text>
          </TouchableOpacity>

          {/* Commercial */}
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setBillingType('Commercial')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.radioCircle,
                billingType === 'Commercial' && styles.radioCircleActive,
              ]}
            />
            <Text style={styles.radioLabel}>Commercial</Text>
          </TouchableOpacity>
        </View>

        {/* ================= BOTTOM BUTTONS ================= */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: isFormValid
                  ? theme.colors.primary
                  : theme.colors.buttonDisabled,
              },
            ]}
            onPress={handleSave}
            disabled={!isFormValid}
            activeOpacity={isFormValid ? 0.85 : 1}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Picker for Prefix, City or County */}
      <Modal
        visible={pickerType !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerType(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPickerType(null)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {pickerType === 'prefix'
                  ? 'Select Country Code'
                  : pickerType === 'city'
                  ? 'Select City'
                  : 'Select County / Country'}
              </Text>
              <TouchableOpacity onPress={() => setPickerType(null)}>
                <Ionicons name="close" size={22} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            {pickerType === 'prefix' && (
              <FlatList
                data={COUNTRY_PREFIXES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => {
                  const isSelected = phonePrefix === item.code;
                  return (
                    <TouchableOpacity
                      style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                      onPress={() => {
                        setPhonePrefix(item.code);
                        setPhoneFlag(item.flag);
                        setPickerType(null);
                      }}
                    >
                      <View style={styles.prefixOptionLeft}>
                        <Text style={styles.flagEmoji}>{item.flag}</Text>
                        <Text style={styles.modalOptionText}>
                          {item.name} ({item.code})
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            {pickerType === 'city' && (
              <FlatList
                data={AVAILABLE_CITIES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const isSelected = city === item;
                  return (
                    <TouchableOpacity
                      style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                      onPress={() => {
                        setCity(item);
                        setPickerType(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            {pickerType === 'county' && (
              <FlatList
                data={AVAILABLE_COUNTIES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const isSelected = county === item;
                  return (
                    <TouchableOpacity
                      style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                      onPress={() => {
                        setCounty(item);
                        setPickerType(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
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
  requiredFieldsText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.8,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepBadgeText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  inputCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: '#e2e2e7',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 52,
    justifyContent: 'center',
    marginBottom: 4,
  },
  floatingLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  textInput: {
    fontSize: 15,
    color: theme.colors.textDark,
    fontWeight: theme.typography.weights.medium,
    padding: 0,
  },
  subtextInput: {
    fontSize: 12,
    color: theme.colors.textMuted,
    padding: 0,
    marginTop: 2,
  },
  emptyAddressTitle: {
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textDark,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  prefixSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: '#e2e2e7',
    borderRadius: theme.borderRadius.md,
    width: 96,
    height: 52,
    marginRight: 10,
    gap: 6,
  },
  flagEmoji: {
    fontSize: 20,
  },
  prefixText: {
    fontSize: 15,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textDark,
  },
  phoneInputCard: {
    flex: 1,
    marginBottom: 0,
  },
  helperText: {
    fontSize: 11.5,
    color: theme.colors.textMuted,
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 15,
  },
  addressInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  addressTextWrapper: {
    flex: 1,
  },
  locationButton: {
    padding: 4,
  },
  addAddress2Button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 4,
  },
  addAddress2Text: {
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  dropdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: '#e2e2e7',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 12,
  },
  dropdownTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  dropdownValueText: {
    fontSize: 15,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textDark,
  },
  dropdownPlaceholderText: {
    fontSize: 15,
    color: theme.colors.textMuted,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
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
    fontSize: 14,
    color: theme.colors.textDark,
  },
  radioGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
    gap: 32,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d1d1d6',
    backgroundColor: theme.colors.white,
    marginRight: 8,
  },
  radioCircleActive: {
    borderColor: theme.colors.primary,
    borderWidth: 6,
  },
  radioLabel: {
    fontSize: 14,
    color: theme.colors.textDark,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    maxHeight: 380,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f5',
  },
  modalOptionSelected: {
    backgroundColor: '#f0f8ff',
    borderRadius: theme.borderRadius.sm,
  },
  modalOptionText: {
    fontSize: 15,
    color: theme.colors.textDark,
  },
  modalOptionTextSelected: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  prefixOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
