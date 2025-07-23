// ========== USER TYPES ==========
export interface User {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  role: string;
}

// ========== AUTH TYPES ==========
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  token?: string;
  username?: string;
  role?: string;
}

// ========== PRODUCT TYPES ==========
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  category?: string;
  imageUrl?: string;
}

// ========== ORDER TYPES ==========
export interface OrderItem {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface Order {
  id: number;
  userId: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  paymentMethod?: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  orderDetails: OrderItem[];
}

export interface CreateOrderRequest {
  productId: number;
  quantity: number;
  paymentMethod?: string;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
}

// ========== CART TYPES ==========
export interface CartItem {
  product: Product;
  quantity: number;
}

// ========== API RESPONSE TYPES ==========
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface ProfileResponse {
  status: 'success' | 'error';
  profile?: {
    id: number;
    username: string;
    fullName: string;
    email?: string;
    phone?: string;
    address?: string;
    role: string;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

// ========== FORM TYPES ==========
export interface ContactInfo {
  name: string;
  phone: string;
  address: string;
} 