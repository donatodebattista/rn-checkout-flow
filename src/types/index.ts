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
