import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../theme';
import { useCartStore } from '../store';
import { CartItem } from '../components/checkout';

export default function ShoppingCartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, getSubtotal, getItemCount, resetCart } = useCartStore();

  const total = getSubtotal();
  const itemCount = getItemCount();

  const formattedTotal = total.toFixed(2).replace('.', ',');

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      <StatusBar style="dark" />

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.headerSubtitle}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'} - Total {formattedTotal}€
        </Text>
      </View>

      {/* Arrives Banner */}
      <View style={styles.banner}>
        <MaterialCommunityIcons
          name="truck-delivery-outline"
          size={22}
          color={theme.colors.highlightText}
          style={styles.bannerIcon}
        />
        <Text style={styles.bannerText}>Arrives by April 3 to April 9th</Text>
      </View>

      {/* Cart Items List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color={theme.colors.textMuted} />
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptySubtitle}>
              You have removed all items from your shopping cart.
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetCart} activeOpacity={0.8}>
              <Text style={styles.resetButtonText}>Reset Demo Items</Text>
            </TouchableOpacity>
          </View>
        ) : (
          items.map((item, index) => (
            <React.Fragment key={item.id}>
              <CartItem item={item} />
              {index < items.length - 1 && <View style={styles.itemSeparator} />}
            </React.Fragment>
          ))
        )}
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.totalSection}>
          <TouchableOpacity style={styles.chevronButton} activeOpacity={0.6}>
            <Ionicons name="chevron-up" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <View style={styles.totalTextContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${formattedTotal}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          activeOpacity={0.85}
          onPress={() => {
            router.push('/checkout' as any);
          }}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.regular,
    marginTop: 4,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.highlightBg,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  bannerIcon: {
    marginRight: 10,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.highlightText,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  itemSeparator: {
    height: 8,
    backgroundColor: theme.colors.backgroundAlt,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
  color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.md,
  },
  resetButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 14,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 42,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
  },
});
