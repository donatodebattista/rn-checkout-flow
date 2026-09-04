import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useCartStore } from '../../store';
import { CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateItemQuantity, removeItem, updateItemVariant } = useCartStore();

  // State for picker modals
  const [activePicker, setActivePicker] = useState<'color' | 'size' | null>(null);

  const handleDecreaseQuantity = () => {
    if (item.quantity <= 1) {
      removeItem(item.id);
    } else {
      updateItemQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    updateItemQuantity(item.id, item.quantity + 1);
  };

  const formatPrice = (price: number) => {
    return price % 1 === 0
      ? `$${price}`
      : `$${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <View style={styles.cardContainer}>
      {/* Header: Title & Subtitle on Left, Price on Right */}
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.productSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>

        <View style={styles.priceColumn}>
          {item.originalPrice ? (
            <Text style={styles.originalPrice}>
              $ {item.originalPrice.toFixed(2).replace('.', ',')}
            </Text>
          ) : null}
          <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
        </View>
      </View>

      {/* Main Body: Image on Left, Controls on Right */}
      <View style={styles.bodyRow}>
        {/* Product Image Container */}
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.productImage} resizeMode="contain" />
        </View>

        {/* Controls Column */}
        <View style={styles.controlsColumn}>
          {/* Color Row */}
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Color</Text>
            {item.id === 'nike-court-lite-2' ? (
              <TouchableOpacity
                style={styles.textSelectorBtn}
                onPress={() => setActivePicker('color')}
                activeOpacity={0.7}
              >
                <Text style={styles.plainColorText}>{item.selectedColor}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setActivePicker('color')}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownText}>{item.selectedColor}</Text>
                <Ionicons
                  name="chevron-down"
                  size={15}
                  color={theme.colors.primary}
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Size Row */}
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Size</Text>
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => setActivePicker('size')}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownText}>{item.selectedSize}</Text>
              <Ionicons
                name="chevron-down"
                size={15}
                color={theme.colors.primary}
                style={styles.chevronIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Quantity Row */}
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Qty</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={handleDecreaseQuantity}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.6}
              >
                {item.quantity <= 1 ? (
                  <Ionicons name="trash-outline" size={17} color={theme.colors.destructive} />
                ) : (
                  <Ionicons name="remove" size={17} color={theme.colors.textDark} />
                )}
              </TouchableOpacity>

              <Text style={styles.quantityText}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={handleIncreaseQuantity}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.6}
              >
                <Ionicons name="add" size={18} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Modal for selecting Color or Size */}
      <Modal
        visible={activePicker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActivePicker(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActivePicker(null)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {activePicker === 'color' ? 'Select Color' : 'Select Size'}
              </Text>
              <TouchableOpacity onPress={() => setActivePicker(null)}>
                <Ionicons name="close" size={22} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={activePicker === 'color' ? item.availableColors : item.availableSizes}
              keyExtractor={(opt) => opt}
              renderItem={({ item: option }) => {
                const isSelected =
                  activePicker === 'color'
                    ? item.selectedColor === option
                    : item.selectedSize === option;

                return (
                  <TouchableOpacity
                    style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                    onPress={() => {
                      if (activePicker === 'color') {
                        updateItemVariant(item.id, { color: option });
                      } else {
                        updateItemVariant(item.id, { size: option });
                      }
                      setActivePicker(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  titleColumn: {
    flex: 1,
    paddingRight: 10,
  },
  productName: {
    fontSize: 17,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
    letterSpacing: -0.2,
  },
  productSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weights.regular,
    marginTop: 3,
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textDecorationLine: 'line-through',
    marginBottom: 1,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textDark,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 155,
    height: 140,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  controlsColumn: {
    flex: 1,
    paddingLeft: 22,
    justifyContent: 'space-between',
    height: 135,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlLabel: {
    fontSize: 15,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textDark,
  },
  textSelectorBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  plainColorText: {
    fontSize: 14,
    color: theme.colors.textDark,
    fontWeight: theme.typography.weights.medium,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 98,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: '#e2e2e7',
    borderRadius: theme.borderRadius.md,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textDark,
  },
  chevronIcon: {
    marginLeft: 6,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 98,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: '#e2e2e7',
    borderRadius: theme.borderRadius.md,
  },
  quantityBtn: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textDark,
    minWidth: 20,
    textAlign: 'center',
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
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    maxHeight: 360,
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
});
