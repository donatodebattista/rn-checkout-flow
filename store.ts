import { create } from 'zustand';

export interface CartItemType {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: any;
  selectedColor: string;
  availableColors: string[];
  selectedSize: string;
  availableSizes: string[];
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  sameAsBilling: boolean;
}

export interface PaymentMethod {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardType: 'credit' | 'debit';
}

interface CartStore {
  items: CartItemType[];
  shippingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethod | null;
  paymentInfo: PaymentMethod | null;
  
  // Actions
  updateItemVariant: (id: string, variant: { color?: string; size?: string }) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  
  // Helpers
  getSubtotal: () => number;
  getItemCount: () => number;
  
  // Future checkout steps
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (payment: PaymentMethod) => void;
  setPaymentInfo: (payment: PaymentMethod) => void;
  resetCart: () => void;
}

const initialCartItems: CartItemType[] = [
  {
    id: 'nike-court-lite-2',
    name: 'NikeCourt Lite 2',
    subtitle: 'Women’s Hard Court Tennis Shoe',
    price: 67.0,
    image: require('./assets/images/nike-shoe.png'),
    selectedColor: 'Blue',
    availableColors: ['Blue', 'White', 'Black', 'Pink'],
    selectedSize: '38 EU',
    availableSizes: ['36 EU', '37 EU', '38 EU', '39 EU', '40 EU', '41 EU'],
    quantity: 1,
  },
  {
    id: 'wilson-hammer-53',
    name: 'Wilson Hammer 5.3',
    subtitle: 'Adult Tennis Racket',
    price: 80.45,
    originalPrice: 99.95,
    image: require('./assets/images/wilson-racket.png'),
    selectedColor: 'Black',
    availableColors: ['Black', 'White', 'Gold', 'Red'],
    selectedSize: '2 -1/4',
    availableSizes: ['1 -1/8', '2 -1/4', '3 -3/8', '4 -1/2'],
    quantity: 1,
  },
];

export const useCartStore = create<CartStore>((set, get) => ({
  items: initialCartItems,
  shippingAddress: null,
  paymentMethod: null,
  paymentInfo: null,

  updateItemVariant: (id: string, variant: { color?: string; size?: string }) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              selectedColor: variant.color !== undefined ? variant.color : item.selectedColor,
              selectedSize: variant.size !== undefined ? variant.size : item.selectedSize,
            }
          : item
      ),
    }));
  },

  updateItemQuantity: (id: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  setShippingAddress: (shippingAddress) => set({ shippingAddress }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod, paymentInfo: paymentMethod }),
  setPaymentInfo: (paymentInfo) => set({ paymentMethod: paymentInfo, paymentInfo }),
  resetCart: () => set({ items: initialCartItems, shippingAddress: null, paymentMethod: null, paymentInfo: null }),
}));
