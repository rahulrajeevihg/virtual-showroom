// Types for products, cart, and zones
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  zone: string;
  brightness: number; // in lumens
  wattage: number;
  colorTemperature: string; // e.g., "Warm White 3000K"
  inStock: boolean;
  rating: number;
  reviews: number;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  productCount: number;
  featured: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  wishlist: string[];
  orderHistory: Order[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

export interface FilterOptions {
  priceRange: [number, number];
  brightness: number[];
  wattage: number[];
  inStock: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'name';
}
