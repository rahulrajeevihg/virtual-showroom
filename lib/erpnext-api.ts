// ERPNext API integration

const ERPNEXT_URL = 'https://erp.ihgind.com';
const API_TOKEN = '5a58f74d3a6048c:b76e8329ac883ff';

export interface ZoneProduct {
  zone: string;
  item_code: string;
  item_name: string;
  brand: string;
  category_list: string;
  disable: number;
  stock_in_zone: number;
  total_stock_all_warehouses: number;
  uom: string;
  image: string;
  primary_barcode: string;
  all_barcodes: string[];
  price: number;
}

export interface CategorySummary {
  category: string;
  productCount: number;
  brands: string[];
}

export interface BrandSummary {
  brand: string;
  productCount: number;
}

/**
 * Fetch all zone products from ERPNext
 */
export async function fetchZoneProducts(): Promise<ZoneProduct[]> {
  try {
    const response = await fetch(
      `${ERPNEXT_URL}/api/method/qcshr.controller.api.zone_products_list`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.message || [];
  } catch (error) {
    console.error('Error fetching zone products:', error);
    return [];
  }
}

/**
 * Get products by zone
 */
export async function getProductsByZone(zone: string): Promise<ZoneProduct[]> {
  const allProducts = await fetchZoneProducts();
  return allProducts.filter(p => p.zone === zone && p.disable === 0);
}

/**
 * Get category summary for a zone
 */
export async function getCategoriesByZone(zone: string): Promise<CategorySummary[]> {
  const products = await getProductsByZone(zone);
  
  // Group by category
  const categoryMap = new Map<string, Set<string>>();
  
  products.forEach(product => {
    const category = product.category_list || 'Uncategorized';
    
    if (!categoryMap.has(category)) {
      categoryMap.set(category, new Set());
    }
    categoryMap.get(category)!.add(product.brand);
  });

  // Convert to array
  const categories: CategorySummary[] = [];
  categoryMap.forEach((brands, category) => {
    const categoryProducts = products.filter(p => 
      (p.category_list || 'Uncategorized') === category
    );
    
    categories.push({
      category,
      productCount: categoryProducts.length,
      brands: Array.from(brands).filter(b => b), // Remove empty brands
    });
  });

  return categories.sort((a, b) => b.productCount - a.productCount);
}

/**
 * Get brands for a specific zone and category
 */
export async function getBrandsByZoneAndCategory(
  zone: string, 
  category: string
): Promise<BrandSummary[]> {
  const products = await getProductsByZone(zone);
  const categoryProducts = products.filter(p => 
    (p.category_list || 'Uncategorized') === category
  );

  // Group by brand
  const brandMap = new Map<string, number>();
  
  categoryProducts.forEach(product => {
    const brand = product.brand || 'No Brand';
    brandMap.set(brand, (brandMap.get(brand) || 0) + 1);
  });

  // Convert to array
  const brands: BrandSummary[] = [];
  brandMap.forEach((count, brand) => {
    brands.push({ brand, productCount: count });
  });

  return brands.sort((a, b) => b.productCount - a.productCount);
}

/**
 * Get products by zone, category, and brand
 */
export async function getProductsByZoneCategoryBrand(
  zone: string,
  category: string,
  brand: string
): Promise<ZoneProduct[]> {
  const products = await getProductsByZone(zone);
  
  return products.filter(p => {
    const matchCategory = (p.category_list || 'Uncategorized') === category;
    const matchBrand = (p.brand || 'No Brand') === brand;
    return matchCategory && matchBrand;
  });
}

/**
 * Fix image URL - convert relative path to absolute URL
 */
export function getFullImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `${ERPNEXT_URL}/${cleanPath}`;
}

export interface ZoneStock {
  zone: string;
  stock_in_zone: number;
}

export interface RelatedItem {
  item_code: string;
  item_name: string;
  brand: string;
  image: string;
  price: number;
  type: string;
}

export interface ItemFullDetails {
  item_code: string;
  item_name: string;
  brand: string;
  category_list: string;
  description: string;
  total_stock_all_warehouses: number;
  stock_uom: string;
  image: string;
  primary_barcode: string;
  all_barcodes: string[];
  selling_price: number;
  zones_available: ZoneStock[];
  related_items: RelatedItem[];
}

/**
 * Get full details of a specific item
 */
export async function getItemFullDetails(item_code: string): Promise<ItemFullDetails | null> {
  try {
    const response = await fetch(
      `${ERPNEXT_URL}/api/method/qcshr.controller.api.get_item_full_details?item_code=${encodeURIComponent(item_code)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.message && data.message.error) {
      console.error('Item details error:', data.message.error);
      return null;
    }

    const details = data.message;

    // Fix image URLs for main item and related items
    if (details.image) {
      details.image = getFullImageUrl(details.image);
    }
    
    if (details.related_items) {
      details.related_items = details.related_items.map((item: RelatedItem) => ({
        ...item,
        image: getFullImageUrl(item.image),
      }));
    }

    return details;
  } catch (error) {
    console.error('Error fetching item details:', error);
    return null;
  }
}
