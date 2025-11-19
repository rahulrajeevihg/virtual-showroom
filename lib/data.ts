import { Product, Zone } from '@/types';

// Mock product data - replace with API calls later
export const mockProducts: Product[] = [
  // Zone 1 Products
  {
    id: 'a1',
    name: 'Premium LED Panel Light',
    description: 'Ultra-slim design with uniform light distribution. Perfect for modern offices and commercial spaces.',
    price: 89.99,
    image: '/products/panel-light.jpg',
    category: 'Panel Lights',
    zone: '1',
    brightness: 4000,
    wattage: 40,
    colorTemperature: 'Cool White 6500K',
    inStock: true,
    rating: 4.8,
    reviews: 124,
    features: ['Energy Efficient', 'Long Lifespan', 'Flicker-Free', 'Easy Installation']
  },
  {
    id: 'a2',
    name: 'LED Strip Light RGB',
    description: 'Color-changing LED strip with remote control. Create the perfect ambiance for any occasion.',
    price: 45.99,
    image: '/products/strip-light.jpg',
    category: 'Strip Lights',
    zone: '1',
    brightness: 1200,
    wattage: 24,
    colorTemperature: 'RGB Multi-Color',
    inStock: true,
    rating: 4.6,
    reviews: 89,
    features: ['16 Million Colors', 'Remote Control', 'Waterproof', 'Cuttable']
  },
  // Zone 2 Products
  {
    id: 'b1',
    name: 'Industrial High Bay Light',
    description: 'Heavy-duty LED lighting for warehouses and industrial facilities. Superior brightness and durability.',
    price: 199.99,
    image: '/products/high-bay.jpg',
    category: 'Industrial',
    zone: '2',
    brightness: 20000,
    wattage: 150,
    colorTemperature: 'Daylight 5000K',
    inStock: true,
    rating: 4.9,
    reviews: 67,
    features: ['IP65 Rated', 'High Output', 'Heat Dissipation', '5 Year Warranty']
  },
  {
    id: 'b2',
    name: 'LED Flood Light',
    description: 'Powerful outdoor lighting solution for security and landscape illumination.',
    price: 129.99,
    image: '/products/flood-light.jpg',
    category: 'Outdoor',
    zone: '2',
    brightness: 12000,
    wattage: 100,
    colorTemperature: 'Natural White 4000K',
    inStock: true,
    rating: 4.7,
    reviews: 156,
    features: ['Weatherproof', 'Motion Sensor', 'Adjustable Bracket', 'Energy Star']
  },
  // Zone 3 Products
  {
    id: 'c1',
    name: 'Smart LED Bulb',
    description: 'Wi-Fi enabled smart bulb compatible with Alexa and Google Home. Control from anywhere.',
    price: 24.99,
    image: '/products/smart-bulb.jpg',
    category: 'Smart Lighting',
    zone: '3',
    brightness: 800,
    wattage: 9,
    colorTemperature: 'Tunable White',
    inStock: true,
    rating: 4.5,
    reviews: 234,
    features: ['Voice Control', 'App Control', 'Scheduling', 'Dimmable']
  },
  {
    id: 'c2',
    name: 'LED Desk Lamp',
    description: 'Adjustable LED desk lamp with touch control and USB charging port.',
    price: 39.99,
    image: '/products/desk-lamp.jpg',
    category: 'Task Lighting',
    zone: '3',
    brightness: 600,
    wattage: 12,
    colorTemperature: 'Adjustable 3000K-6500K',
    inStock: false,
    rating: 4.6,
    reviews: 78,
    features: ['Touch Control', 'USB Port', '5 Brightness Levels', 'Eye Protection']
  },
  // Zone 4 Products
  {
    id: 'd1',
    name: 'LED Downlight Recessed',
    description: 'Sleek recessed downlight for residential and commercial applications.',
    price: 34.99,
    image: '/products/downlight.jpg',
    category: 'Recessed',
    zone: '4',
    brightness: 1000,
    wattage: 15,
    colorTemperature: 'Warm White 3000K',
    inStock: true,
    rating: 4.7,
    reviews: 145,
    features: ['Retrofit Compatible', 'Slim Profile', 'Dimmable', 'UL Listed']
  },
  {
    id: 'd2',
    name: 'Track Lighting System',
    description: 'Flexible track lighting system with adjustable LED spots.',
    price: 149.99,
    image: '/products/track-light.jpg',
    category: 'Track Lighting',
    zone: '4',
    brightness: 3000,
    wattage: 45,
    colorTemperature: 'Neutral White 4000K',
    inStock: true,
    rating: 4.8,
    reviews: 92,
    features: ['360° Rotation', '4 Light Heads', 'Modern Design', 'Easy Install']
  },
  // Zone 5 Products
  {
    id: 'e1',
    name: 'LED Chandelier Modern',
    description: 'Contemporary LED chandelier with crystal accents. Statement piece for any room.',
    price: 299.99,
    image: '/products/chandelier.jpg',
    category: 'Decorative',
    zone: '5',
    brightness: 5000,
    wattage: 60,
    colorTemperature: 'Warm White 2700K',
    inStock: true,
    rating: 4.9,
    reviews: 54,
    features: ['Crystal Glass', 'Remote Dimmable', 'Premium Finish', 'Height Adjustable']
  },
  {
    id: 'e2',
    name: 'LED Wall Sconce',
    description: 'Elegant wall-mounted LED fixture for hallways and bedrooms.',
    price: 59.99,
    image: '/products/wall-sconce.jpg',
    category: 'Wall Lights',
    zone: '5',
    brightness: 700,
    wattage: 10,
    colorTemperature: 'Soft White 2700K',
    inStock: true,
    rating: 4.6,
    reviews: 112,
    features: ['Hardwired', 'Up/Down Light', 'Metal Body', 'Modern Style']
  }
];

export const zones: Zone[] = [
  {
    id: '1',
    name: 'Zone 1',
    description: 'Commercial & Panel Lighting Solutions',
    productCount: mockProducts.filter(p => p.zone === '1').length,
    featured: ['a1', 'a2']
  },
  {
    id: '2',
    name: 'Zone 2',
    description: 'Industrial & Outdoor Lighting',
    productCount: mockProducts.filter(p => p.zone === '2').length,
    featured: ['b1', 'b2']
  },
  {
    id: '3',
    name: 'Zone 3',
    description: 'Smart & Task Lighting',
    productCount: mockProducts.filter(p => p.zone === '3').length,
    featured: ['c1', 'c2']
  },
  {
    id: '4',
    name: 'Zone 4',
    description: 'Recessed & Track Lighting',
    productCount: mockProducts.filter(p => p.zone === '4').length,
    featured: ['d1', 'd2']
  },
  {
    id: '5',
    name: 'Zone 5',
    description: 'Decorative & Designer Lighting',
    productCount: mockProducts.filter(p => p.zone === '5').length,
    featured: ['e1', 'e2']
  }
];

export const getProductsByZone = (zoneId: string): Product[] => {
  return mockProducts.filter(p => p.zone === zoneId);
};

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id);
};

export const getFeaturedProducts = (limit: number = 6): Product[] => {
  return mockProducts
    .filter(p => p.rating >= 4.7)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};
