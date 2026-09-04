import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from './theme';
import { useCartStore } from './store';

export default function ConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, getSubtotal, shippingAddress, resetCart } = useCartStore();

  const total = getSubtotal();
  const formattedTotal = total.toFixed(2).replace('.', ',');

  // Fallback recipient info if not set
  const recipientName = shippingAddress?.fullName || 'Banu Elson';
  const recipientEmail = shippingAddress?.email || 'orders@banuelson.com';
  const recipientPhone = shippingAddress
    ? `${shippingAddress.phonePrefix} ${shippingAddress.phone}`
    : '+49 179 111 1010';
  const recipientStreet =
    shippingAddress?.streetAddress || 'Leibnizstraße 16, Wohnheim 6, No: 8X';
  const recipientCityCounty = shippingAddress
    ? `${shippingAddress.city}, ${shippingAddress.county}`
    : 'Clausthal-Zellerfeld, Germany';

  const handleBackToShopping = () => {
    resetCart();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color={theme.colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Order Confirmation</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Banner */}
        <View style={styles.successRow}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark" size={32} color="#ffffff" />
          </View>
          <View style={styles.successTextCol}>
            <Text style={styles.successTitle}>Thank you!</Text>
            <Text style={styles.successSubtitle}>
              Your order #BE12345 has been placed.
            </Text>
          </View>
        </View>

        {/* Email Explanatory Note */}
        <Text style={styles.emailExplText}>
          We sent an email to <Text style={styles.boldEmail}>{recipientEmail}</Text> with
          your order confirmation and bill.
        </Text>

        {/* Timestamp */}
        <Text style={styles.timestampText}>
          Time placed: 17/02/2020 12:45 CEST
        </Text>

        {/* Shipping Section */}
        <Text style={styles.sectionTitle}>Shipping</Text>
        <View style={styles.infoCard}>
          <Text style={styles.cardName}>{recipientName}</Text>
          <Text style={styles.cardLine}>{recipientEmail}</Text>
          <Text style={[styles.cardLine, styles.cardPhone]}>{recipientPhone}</Text>
          <Text style={styles.cardLine}>{recipientStreet}</Text>
          <Text style={styles.cardLine}>{recipientCityCounty}</Text>
        </View>

        {/* Billing Section */}
        <Text style={styles.sectionTitle}>Billing</Text>
        <View style={styles.infoCard}>
          <Text style={styles.cardName}>{recipientName}</Text>
          <Text style={styles.cardLine}>{recipientEmail}</Text>
          <Text style={[styles.cardLine, styles.cardPhone]}>{recipientPhone}</Text>
          <Text style={styles.cardLine}>{recipientStreet}</Text>
          <Text style={styles.cardLine}>{recipientCityCounty}</Text>
        </View>

        {/* Order Items Section */}
        <Text style={styles.sectionTitle}>Order Items</Text>

        {/* Yellow Arrival Banner */}
        <View style={styles.arrivalBanner}>
          <MaterialCommunityIcons
            name="truck-delivery-outline"
            size={22}
            color={theme.colors.highlightText}
            style={styles.arrivalIcon}
          />
          <Text style={styles.arrivalText}>Arrives by April 3 to April 9th</Text>
        </View>

        {/* Items List */}
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemImageWrapper}>
              <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
            </View>

            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemVariant}>Color: {item.selectedColor}</Text>
              <Text style={styles.itemVariant}>Size: {item.selectedSize}</Text>

              <View style={styles.qtyPriceRow}>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>

                <View style={styles.priceCol}>
                  {item.originalPrice ? (
                    <Text style={styles.originalPrice}>
                      $ {item.originalPrice.toFixed(2).replace('.', ',')}
                    </Text>
                  ) : null}
                  <Text style={styles.currentPrice}>
                    ${item.price % 1 === 0 ? item.price : item.price.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Order Summary Section */}
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Order Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${formattedTotal}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>$0,00</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${formattedTotal}</Text>
        </View>

        {/* Back to Shopping Button */}
        <TouchableOpacity
          style={styles.backToShoppingButton}
          onPress={handleBackToShopping}
          activeOpacity={0.85}
        >
          <Text style={styles.backToShoppingText}>Back to Shopping</Text>
        </TouchableOpacity>
      </ScrollView>
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
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  successIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#34a853',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  successTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  successSubtitle: {
    fontSize: 14,
    color: theme.colors.textDark,
    marginTop: 2,
    lineHeight: 18,
  },
  emailExplText: {
    fontSize: 13,
    color: '#4a4a4a',
    lineHeight: 18,
    marginBottom: 12,
  },
  boldEmail: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  timestampText: {
    fontSize: 13,
    color: '#4a4a4a',
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginBottom: 20,
  },
  cardName: {
    fontSize: 15,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    marginBottom: 6,
  },
  cardLine: {
    fontSize: 13,
    color: theme.colors.textDark,
    lineHeight: 18,
  },
  cardPhone: {
    marginBottom: 6,
  },
  arrivalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.highlightBg,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 16,
  },
  arrivalIcon: {
    marginRight: 10,
  },
  arrivalText: {
    fontSize: 13,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.highlightText,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImageWrapper: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    marginRight: 14,
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
  qtyPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  itemQty: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textDecorationLine: 'line-through',
    marginBottom: 1,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: theme.colors.textDark,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  totalRow: {
    marginTop: 6,
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  backToShoppingButton: {
    height: 50,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  backToShoppingText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
});
