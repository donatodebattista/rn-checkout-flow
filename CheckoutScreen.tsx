import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from './theme';
import { useCartStore } from './store';

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, getSubtotal, getItemCount, setPaymentInfo, shippingAddress } = useCartStore();

  // Local states for credit card inputs
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [cvv, setCvv] = useState('');

  const total = getSubtotal();
  const itemCount = getItemCount();
  const formattedTotal = total.toFixed(2).replace('.', ',');

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted);
  };

  const handleMonthChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 2);
    setMonth(cleaned);
  };

  const handleYearChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    setYear(cleaned);
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    setCvv(cleaned);
  };

  // Validation: Pay Now button is enabled only when all required fields are filled
  const rawCardDigits = cardNumber.replace(/\s+/g, '');
  const isFormValid =
    cardHolder.trim().length > 0 &&
    rawCardDigits.length >= 13 &&
    month.trim().length > 0 &&
    year.trim().length > 0 &&
    cvv.trim().length >= 3;

  const handlePayNow = () => {
    if (!isFormValid) return;

    // Save payment information in Zustand store
    setPaymentInfo({
      cardHolder: cardHolder.trim(),
      cardNumber: rawCardDigits,
      expiry: `${month}/${year}`,
      cvv: cvv.trim(),
      cardType: 'credit',
    });

    Alert.alert(
      'Payment Information Saved',
      'Your card details have been securely recorded in the checkout store.',
      [{ text: 'OK' }]
    );
  };

  const handleAddAddress = () => {
    router.push('/address' as any);
  };

  const isMastercard = rawCardDigits.startsWith('5');

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

        <Text style={styles.headerTitle}>Secure Payment</Text>

        {/* Secure SSL Encryption Badge */}
        <View style={styles.secureBadge}>
          <MaterialCommunityIcons
            name="shield-check"
            size={24}
            color={theme.colors.badgeGreen}
            style={styles.shieldIcon}
          />
          <View style={styles.secureBadgeTextCol}>
            <Text style={styles.secureBadgeTitle}>SECURE</Text>
            <Text style={styles.secureBadgeSubtitle}>SSL ENCRYPTION</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 140 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Shipping Section */}
        <View style={styles.shippingHeaderRow}>
          <Text style={styles.sectionTitle}>Shipping</Text>
          {shippingAddress && (
            <TouchableOpacity onPress={handleAddAddress} activeOpacity={0.7}>
              <Text style={styles.addEditButtonText}>Add / Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {!shippingAddress ? (
          <TouchableOpacity
            style={styles.shippingCard}
            onPress={handleAddAddress}
            activeOpacity={0.7}
          >
            <View style={styles.shippingLeft}>
              <MaterialCommunityIcons
                name="truck-delivery-outline"
                size={22}
                color={theme.colors.textDark}
              />
              <Text style={styles.shippingButtonText}>Add Address</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.savedAddressContainer}>
            <TouchableOpacity
              style={styles.savedAddressCard}
              onPress={handleAddAddress}
              activeOpacity={0.7}
            >
              <View style={styles.savedAddressDetails}>
                <Text style={styles.savedAddressName}>{shippingAddress.fullName}</Text>
                <Text style={styles.savedAddressText}>{shippingAddress.email}</Text>
                <Text style={styles.savedAddressText}>
                  {shippingAddress.phonePrefix} {shippingAddress.phone}
                </Text>
                <Text style={[styles.savedAddressText, { marginTop: 6 }]}>
                  {shippingAddress.streetAddress}
                </Text>
                <Text style={styles.savedAddressText}>
                  {shippingAddress.city}, {shippingAddress.county}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
            </TouchableOpacity>

            {/* Checkbox: Billing and delivery addresses are same */}
            <View style={styles.sameAddressCheckboxRow}>
              <View style={styles.sameAddressCheckbox}>
                <Ionicons name="checkmark" size={14} color="#ffffff" />
              </View>
              <Text style={styles.sameAddressCheckboxLabel}>
                Billing and delivery addresses are same.
              </Text>
            </View>
          </View>
        )}

        {/* Gray Section Divider */}
        <View style={styles.sectionDivider} />

        {/* Payment Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Payment</Text>
        </View>

        <View style={styles.paymentCard}>
          {/* Card Type Header */}
          <View style={styles.paymentCardHeader}>
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={22}
              color={theme.colors.textDark}
            />
            <Text style={styles.paymentCardHeaderText}>Add Credit / Debit Card</Text>
          </View>

          {/* Input: Card Holder's Name */}
          <View style={styles.inputContainer}>
            {cardHolder.length > 0 && (
              <Text style={styles.floatingLabel}>Card Holder's Name</Text>
            )}
            <TextInput
              style={styles.textInput}
              placeholder="Card Holder's Name"
              placeholderTextColor={theme.colors.textMuted}
              value={cardHolder}
              onChangeText={setCardHolder}
              autoCapitalize="words"
            />
          </View>

          {/* Input: Card Number */}
          <View style={[styles.inputContainer, styles.cardNumberRow]}>
            <View style={styles.cardNumberInputWrapper}>
              {cardNumber.length > 0 && (
                <Text style={styles.floatingLabel}>Card Number</Text>
              )}
              <TextInput
                style={styles.textInput}
                placeholder="Card Number"
                placeholderTextColor={theme.colors.textMuted}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>

            {/* Franchise Logo (e.g. Mastercard) */}
            {isMastercard && (
              <View style={styles.mastercardLogo}>
                <View style={[styles.mcCircle, styles.mcRed]} />
                <View style={[styles.mcCircle, styles.mcOrange]} />
              </View>
            )}
          </View>

          {/* Expire Date Section */}
          <Text style={styles.expireDateLabel}>Expire Date</Text>
          <View style={styles.expireDateRow}>
            {/* Month */}
            <View style={[styles.inputContainer, styles.halfInput]}>
              {month.length > 0 && <Text style={styles.floatingLabel}>Month</Text>}
              <TextInput
                style={styles.textInput}
                placeholder="Month"
                placeholderTextColor={theme.colors.textMuted}
                value={month}
                onChangeText={handleMonthChange}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>

            {/* Year */}
            <View style={[styles.inputContainer, styles.halfInput]}>
              {year.length > 0 && <Text style={styles.floatingLabel}>Year</Text>}
              <TextInput
                style={styles.textInput}
                placeholder="Year"
                placeholderTextColor={theme.colors.textMuted}
                value={year}
                onChangeText={handleYearChange}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
          </View>

          {/* Security Code Row */}
          <View style={styles.securityCodeRow}>
            <View style={[styles.inputContainer, styles.securityCodeInput]}>
              {cvv.length > 0 && <Text style={styles.floatingLabel}>Security Code</Text>}
              <TextInput
                style={styles.textInput}
                placeholder="Security Code"
                placeholderTextColor={theme.colors.textMuted}
                value={cvv}
                onChangeText={handleCvvChange}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry={false}
              />
            </View>

            {/* Information Icon */}
            <TouchableOpacity
              style={styles.infoButton}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  'Security Code',
                  'The 3 or 4 digit CVV/CVC code located on the back of your card.'
                )
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gray Section Divider */}
        <View style={styles.sectionDivider} />

        {/* Items Summary & Carousel */}
        <View style={styles.itemsSummaryHeader}>
          <Text style={styles.itemsCountText}>{itemCount} items</Text>
          <View style={styles.arrivalBadge}>
            <Text style={styles.arrivalBadgeText}>Arrives by April 3 to April 9th</Text>
          </View>
        </View>

        {/* Horizontal Items Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        >
          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemImageWrapper}>
                <Image
                  source={item.image}
                  style={styles.itemImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.itemDetails}>
                <View>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemVariant}>Color: {item.selectedColor}</Text>
                  <Text style={styles.itemVariant}>Size: {item.selectedSize}</Text>
                </View>

                <View style={styles.itemBottomRow}>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  <Text style={styles.itemPrice}>
                    ${item.price % 1 === 0 ? item.price : item.price.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Floating Bottom Footer */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.footerMainRow}>
          {/* Total Preview */}
          <View style={styles.totalSection}>
            <TouchableOpacity style={styles.chevronButton} activeOpacity={0.6}>
              <Ionicons name="chevron-up" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <View style={styles.totalTextContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${formattedTotal}</Text>
            </View>
          </View>

          {/* Pay Now Button */}
          <TouchableOpacity
            style={[
              styles.payNowButton,
              {
                backgroundColor: isFormValid
                  ? theme.colors.primary
                  : theme.colors.buttonDisabled,
              },
            ]}
            activeOpacity={isFormValid ? 0.85 : 1}
            onPress={handlePayNow}
            disabled={!isFormValid}
          >
            <Text style={styles.payNowButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>

        {/* Legal Disclaimer Subtext */}
        <Text style={styles.footerDisclaimer}>
          This is the final step, after you touching{' '}
          <Text style={styles.boldDisclaimer}>Pay Now</Text> button, the payment will
          be transaction
        </Text>
      </View>
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
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldIcon: {
    marginRight: 4,
  },
  secureBadgeTextCol: {
    justifyContent: 'center',
  },
  secureBadgeTitle: {
    fontSize: 10.5,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    letterSpacing: 0.4,
    lineHeight: 12,
  },
  secureBadgeSubtitle: {
    fontSize: 7.5,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textMuted,
    letterSpacing: 0.2,
    lineHeight: 9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  sectionHeaderRow: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  shippingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  addEditButtonText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
  },
  savedAddressContainer: {
    marginHorizontal: 16,
  },
  savedAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
  },
  savedAddressDetails: {
    flex: 1,
    paddingRight: 10,
  },
  savedAddressName: {
    fontSize: 15,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    marginBottom: 6,
  },
  savedAddressText: {
    fontSize: 13,
    color: theme.colors.textDark,
    lineHeight: 18,
  },
  sameAddressCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  sameAddressCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sameAddressCheckboxLabel: {
    fontSize: 13.5,
    color: theme.colors.textDark,
    fontWeight: theme.typography.weights.regular,
  },
  shippingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardBg,
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.lg,
  },
  shippingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shippingButtonText: {
    fontSize: 15,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textDark,
    marginLeft: 12,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: theme.colors.backgroundAlt,
    marginTop: 20,
  },
  paymentCard: {
    backgroundColor: theme.colors.cardBg,
    marginHorizontal: 16,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentCardHeaderText: {
    fontSize: 15,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textDark,
    marginLeft: 10,
  },
  inputContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 52,
    justifyContent: 'center',
    marginBottom: 12,
  },
  floatingLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.regular,
    marginBottom: 2,
  },
  textInput: {
    fontSize: 15,
    color: theme.colors.textDark,
    fontWeight: theme.typography.weights.medium,
    padding: 0,
  },
  cardNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardNumberInputWrapper: {
    flex: 1,
  },
  mastercardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  mcCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  mcRed: {
    backgroundColor: '#eb001b',
    marginRight: -6,
    zIndex: 1,
  },
  mcOrange: {
    backgroundColor: '#f79e1b',
  },
  expireDateLabel: {
    fontSize: 13,
    fontWeight: theme.typography.weights.medium,
    color: '#4a4a4a',
    marginTop: 2,
    marginBottom: 8,
  },
  expireDateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  securityCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityCodeInput: {
    flex: 0.48,
    marginBottom: 0,
  },
  infoButton: {
    marginLeft: 12,
    padding: 4,
  },
  itemsSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 14,
  },
  itemsCountText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textDark,
  },
  arrivalBadge: {
    backgroundColor: theme.colors.highlightBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  arrivalBadgeText: {
    fontSize: 12,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.highlightText,
  },
  carouselContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  itemCard: {
    flexDirection: 'row',
    width: 290,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: 10,
    marginRight: 12,
  },
  itemImageWrapper: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    marginRight: 12,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  itemVariant: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  itemQuantity: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 14,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 -3px 12px rgba(0,0,0,0.05)',
      },
    }),
  },
  footerMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronButton: {
    paddingRight: 10,
    paddingVertical: 4,
  },
  totalTextContainer: {
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textDark,
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    letterSpacing: -0.5,
  },
  payNowButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
  },
  footerDisclaimer: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 10,
    lineHeight: 15,
  },
  boldDisclaimer: {
    fontWeight: theme.typography.weights.bold,
    color: '#666',
  },
});
