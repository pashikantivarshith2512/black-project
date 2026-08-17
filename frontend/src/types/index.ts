export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  category?: Category;
  availability: boolean;
  isSpecialty: boolean;
  image: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialNotes?: string;
}

export type DeliveryOption = 'DINE_IN' | 'KERBSIDE_PICKUP' | 'NO_CONTACT_DELIVERY';
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderItemData {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  price: number;
  specialNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryOption: DeliveryOption;
  address?: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: string;
  specialInstructions?: string;
  createdAt: string;
  items: OrderItemData[];
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Reservation {
  id: string;
  reservationNumber: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'AMBIENCE' | 'FOOD' | 'COFFEE' | 'EVENTS' | 'CUSTOMER_MOMENTS';
  imageUrl: string;
  createdAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  points: number;
  type: 'EARNED' | 'REDEEMED';
  description: string;
  createdAt: string;
}

export interface LoyaltyAccount {
  id: string;
  userId: string;
  points: number;
  totalEarned: number;
  history: LoyaltyTransaction[];
}

export interface AdminStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalReservations: number;
  pendingReservations: number;
  pendingReviews: number;
  totalMenuItems: number;
}
