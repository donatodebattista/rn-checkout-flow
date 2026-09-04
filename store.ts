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

export type BillingType = 'Personal' | 'Commercial';

export interface AddressInfo {
  fullName: string;
  phonePrefix: string;
  phone: string;
  email: string;
  addressTitle?: string;
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  county: string;
  sameAsDelivery: boolean;
  billingType: BillingType;
}

export type ShippingAddress = AddressInfo;

export interface SavedAddress {
  id: string;
  title: string;
  fullName: string;
  phonePrefix: string;
  phone: string;
  email: string;
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  county: string;
  sameAsDelivery: boolean;
  billingType: BillingType;
}

export interface PaymentMethod {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardType: 'credit' | 'debit';
  cardLabel?: string;
}

interface CartStore {
  items: CartItemType[];
  shippingAddress: ShippingAddress | null;
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null;
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
  setSelectedAddress: (id: string) => void;
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

const initialSavedAddresses: SavedAddress[] = [
  {
    id: '1',
    title: 'My Office',
    fullName: 'Banu Elson',
    phonePrefix: '+49',
    phone: '179 111 1010',
    email: 'orders@banuelson.com',
    streetAddress: 'Altenauer Str., 35',
    city: 'Clausthal-Zellerfeld',
    county: 'Germany',
    sameAsDelivery: true,
    billingType: 'Personal',
  },
  {
    id: '2',
    title: "Mum's House",
    fullName: 'Alice Elson',
    phonePrefix: '+49',
    phone: '179 222 2020',
    email: 'alice@elson.com',
    streetAddress: 'Erzstrasse Str., 9',
    city: 'Clausthal-Zellerfeld',
    county: 'Germany',
    sameAsDelivery: true,
    billingType: 'Personal',
  },
];

export const useCartStore = create<CartStore>((set, get) => ({
  items: initialCartItems,
  savedAddresses: initialSavedAddresses,
  selectedAddressId: '1',
  shippingAddress: initialSavedAddresses[0],
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
  setSelectedAddress: (id: string) => {
    const address = get().savedAddresses.find((a) => a.id === id);
    if (address) {
      set({ selectedAddressId: id, shippingAddress: address });
    }
  },
  setPaymentMethod: (paymentMethod) => set({ paymentMethod, paymentInfo: paymentMethod }),
  setPaymentInfo: (paymentInfo) => set({ paymentMethod: paymentInfo, paymentInfo }),
  resetCart: () =>
    set({
      items: initialCartItems,
      shippingAddress: initialSavedAddresses[0],
      selectedAddressId: '1',
      paymentMethod: null,
      paymentInfo: null,
    }),
}));
