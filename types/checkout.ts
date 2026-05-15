// Types
export interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    slug: string;
}

export interface Address {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface PaymentDetails {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
}

export interface OrderSummary {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    couponCode?: string;
}