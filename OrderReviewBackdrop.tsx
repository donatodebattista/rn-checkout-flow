import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './theme';
import { useCartStore } from './store';

interface OrderReviewBackdropProps {
  visible: boolean;
  onClose: () => void;
  onPayNow: () => void;
  isPayEnabled: boolean;
}

export const OrderReviewBackdrop: React.FC<OrderReviewBackdropProps> = ({
  visible,
  onClose,
  onPayNow,
  isPayEnabled,
}) => {
  const insets = useSafeAreaInsets();
  const { items, getSubtotal } = useCartStore();

  const total = getSubtotal();
  const formattedTotal = total.toFixed(2).replace('.', ',');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop touchable to close */}
        <Pressable style={styles.backdropTouchArea} onPress={onClose} />

        {/* Bottom Sheet Card */}
        <View style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Order Review</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-down" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Products List */}
          <ScrollView
            style={styles.itemsScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.itemsScrollContent}
          >
            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                {/* Product Image Thumbnail */}
                <View style={styles.imageWrapper}>
                  <Image source={item.image} style={styles.productImage} resizeMode="contain" />
                </View>

                {/* Product Info */}
                <View style={styles.detailsCol}>
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

            {/* Financial Breakdown */}
            <View style={styles.breakdownContainer}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Subtotal</Text>
                <Text style={styles.breakdownAmount}>${formattedTotal}</Text>
              </View>

              <View style={[styles.breakdownRow, { marginTop: 10 }]}>
                <Text style={styles.breakdownLabel}>Shipping</Text>
                <Text style={styles.breakdownAmount}>$0,00</Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Total & Pay Now Section */}
          <View style={styles.footerSection}>
            <View style={styles.footerMainRow}>
              {/* Total preview with chevron down */}
              <TouchableOpacity
                style={styles.totalSection}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.primary}
                  style={styles.chevronIcon}
                />
                <View style={styles.totalTextCol}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalAmount}>${formattedTotal}</Text>
                </View>
              </TouchableOpacity>

              {/* Pay Now button */}
              <TouchableOpacity
                style={[
                  styles.payNowButton,
                  {
                    backgroundColor: isPayEnabled
                      ? theme.colors.primary
                      : theme.colors.buttonDisabled,
                  },
                ]}
                activeOpacity={isPayEnabled ? 0.85 : 1}
                onPress={() => {
                  onClose();
                  onPayNow();
                }}
                disabled={!isPayEnabled}
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  backdropTouchArea: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '82%',
    paddingTop: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    letterSpacing: -0.3,
  },
  itemsScroll: {
    paddingHorizontal: 20,
  },
  itemsScrollContent: {
    paddingTop: 8,
    paddingBottom: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    width: 82,
    height: 82,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    marginRight: 14,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  detailsCol: {
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
  breakdownContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f2f2f5',
    paddingTop: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 15,
    color: theme.colors.textDark,
    fontWeight: theme.typography.weights.regular,
  },
  breakdownAmount: {
    fontSize: 15,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 14,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
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
  chevronIcon: {
    marginRight: 10,
    paddingVertical: 4,
  },
  totalTextCol: {
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
