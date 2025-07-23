import axios from 'axios';

// Backend context path là /api, chạy Docker trên port 8082
const API_BASE_URL = 'http://localhost:8082/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========== API INTERFACES ==========
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
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

export interface CreateOrderRequest {
  productId: number;
  quantity: number;
  paymentMethod?: string;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// ========== API METHODS ==========
const api = {
  // ========== AUTH ENDPOINTS ==========
  login: async (data: LoginRequest) => {
    // Backend expects FormData, not JSON
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    const response = await apiClient.post('/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data; // {status, message, token, username, role}
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post('/v1/auth/register', data);
    return response.data; // {status, message, token, username, role}
  },

  logout: async () => {
    const response = await apiClient.post('/v1/auth/logout');
    return response.data;
  },

  // ========== USER ENDPOINTS ==========
  getProfile: async () => {
    const response = await apiClient.get('/v1/user/profile');
    return response.data; // {status, profile}
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    // Backend expects FormData, not JSON
    const formData = new URLSearchParams();
    if (data.fullName) formData.append('fullName', data.fullName);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', data.address);
    
    const response = await apiClient.put('/v1/user/profile', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  getProfileStatus: async () => {
    const response = await apiClient.get('/v1/user/profile/status');
    return response.data; // {status, profileComplete, hasAddress, hasPhone, message}
  },

  // ========== PRODUCT ENDPOINTS (Public) ==========
  getProducts: async (params?: { search?: string; category?: string; sort?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get('/v1/products/view', { params });
    return response.data; // Array of products
  },

  getProduct: async (id: number) => {
    const response = await apiClient.get(`/v1/products/view/${id}`);
    return response.data; // Product object
  },

  // ========== PRODUCT MANAGEMENT (Admin Only) ==========
  createProduct: async (data: CreateProductRequest) => {
    const response = await apiClient.post('/v1/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: UpdateProductRequest) => {
    const response = await apiClient.put(`/v1/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await apiClient.delete(`/v1/products/${id}`);
    return response.data; // {message}
  },

  // ========== ORDER ENDPOINTS ==========
  createOrder: async (data: CreateOrderRequest) => {
    const response = await apiClient.post('/v1/orders', data);
    return response.data; // Order object
  },

  getMyOrders: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/v1/orders/my', { params });
    return response.data; // Array of orders
  },

  getOrder: async (id: number) => {
    const response = await apiClient.get(`/v1/orders/${id}`);
    return response.data; // Order object
  },

  cancelOrder: async (id: number) => {
    const response = await apiClient.patch(`/v1/orders/${id}/cancel`);
    return response.data;
  },

  // ========== ADMIN ENDPOINTS ==========
  getAllUsers: async () => {
    const response = await apiClient.get('/v1/admin/users');
    return response.data; // {status, users, total}
  },

  updateUserRole: async (userId: number, role: 'ADMIN' | 'USER') => {
    const formData = new URLSearchParams();
    formData.append('role', role);
    
    const response = await apiClient.put(`/v1/admin/users/${userId}/role`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data; // {status, message, username, role}
  },

  deleteUser: async (userId: number) => {
    const response = await apiClient.delete(`/v1/admin/users/${userId}`);
    return response.data; // {status, message}
  },

  getAllOrders: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/v1/admin/orders', { params });
    return response.data; // Array of orders
  },

  getAdminOrder: async (id: number) => {
    const response = await apiClient.get(`/v1/admin/orders/${id}`);
    return response.data; // Order object
  },

  updateOrderStatus: async (id: number, data: UpdateOrderStatusRequest) => {
    const response = await apiClient.patch(`/v1/admin/orders/${id}/status`, data);
    return response.data;
  },

  deleteOrder: async (id: number) => {
    const response = await apiClient.delete(`/v1/admin/orders/${id}`);
    return response.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get('/v1/admin/dashboard');
    return response.data; // {status, stats}
  },
};

export default api; 