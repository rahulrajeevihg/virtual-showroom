# ERPNext API Integration Guide for LED World

## Overview
This guide will help you create a REST API in ERPNext to fetch Zone Products data for the LED World showroom application.

## Prerequisites
- ERPNext installed and running
- DocType "Zone Products" created with fields:
  - `zone` (Select field: A, B, C, D, E)
  - `item_code` (Link to Item)
  - `disable` (Check field)

---

## Step 1: Create API Method in ERPNext

### 1.1 Create a Python file for your API
Navigate to your app folder and create: `your_app/your_app/api/zone_products.py`

```python
# your_app/your_app/api/zone_products.py

import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_zone_products(zone=None):
    """
    Fetch products by zone with item details
    Args:
        zone: Optional zone filter (A, B, C, D, E)
    Returns:
        List of products with zone, item_code, brand, category, price (RRP), and stock
    """
    try:
        # Build SQL query to fetch all data in one go
        conditions = "zp.disable = 0"
        if zone:
            conditions += f" AND zp.zone = '{frappe.db.escape(zone.upper())}'"
        
        query = f"""
            SELECT 
                zp.zone,
                zp.item_code,
                i.brand,
                i.item_group as category,
                ip.price_list_rate as price,
                COALESCE(SUM(b.actual_qty), 0) as total_stock
            FROM 
                `tabZone Products` zp
            LEFT JOIN 
                `tabItem` i ON zp.item_code = i.name
            LEFT JOIN 
                `tabItem Price` ip ON zp.item_code = ip.item_code 
                AND ip.price_list = 'RRP'
            LEFT JOIN 
                `tabBin` b ON zp.item_code = b.item_code
            WHERE 
                {conditions}
            GROUP BY 
                zp.zone, zp.item_code, i.brand, i.item_group, ip.price_list_rate
            ORDER BY 
                zp.zone, zp.item_code
        """
        
        products = frappe.db.sql(query, as_dict=True)
        
        # Format the response
        formatted_products = []
        for product in products:
            formatted_products.append({
                "zone": product.get("zone"),
                "item_code": product.get("item_code"),
                "brand": product.get("brand") or "",
                "category": product.get("category") or "",
                "price": float(product.get("price") or 0),
                "total_stock": float(product.get("total_stock") or 0),
                "in_stock": float(product.get("total_stock") or 0) > 0
            })
        
        return {
            "success": True,
            "data": formatted_products,
            "count": len(formatted_products),
            "zone": zone or "All"
        }
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Zone Products API Error"))
        return {
            "success": False,
            "error": str(e),
            "message": "Failed to fetch products"
        }


@frappe.whitelist(allow_guest=True)
def get_product_details(item_code):
    """
    Fetch detailed information for a specific product
    Args:
        item_code: Item Code
    Returns:
        Detailed product information with all fields
    """
    try:
        if not item_code:
            return {
                "success": False,
                "message": "Item code is required"
            }
        
        # Fetch detailed product information
        query = """
            SELECT 
                i.name as item_code,
                i.item_name,
                i.description,
                i.brand,
                i.item_group as category,
                i.image,
                zp.zone,
                ip.price_list_rate as price,
                COALESCE(SUM(b.actual_qty), 0) as total_stock
            FROM 
                `tabItem` i
            LEFT JOIN 
                `tabZone Products` zp ON i.name = zp.item_code AND zp.disable = 0
            LEFT JOIN 
                `tabItem Price` ip ON i.name = ip.item_code AND ip.price_list = 'RRP'
            LEFT JOIN 
                `tabBin` b ON i.name = b.item_code
            WHERE 
                i.name = %s
            GROUP BY 
                i.name, i.item_name, i.description, i.brand, i.item_group, 
                i.image, zp.zone, ip.price_list_rate
        """
        
        result = frappe.db.sql(query, (item_code,), as_dict=True)
        
        if not result:
            return {
                "success": False,
                "message": "Product not found"
            }
        
        product = result[0]
        
        # Get item document for custom fields
        item_doc = frappe.get_doc("Item", item_code)
        
        return {
            "success": True,
            "data": {
                "item_code": product.get("item_code"),
                "item_name": product.get("item_name"),
                "description": product.get("description") or "",
                "brand": product.get("brand") or "",
                "category": product.get("category") or "",
                "zone": product.get("zone") or "",
                "price": float(product.get("price") or 0),
                "total_stock": float(product.get("total_stock") or 0),
                "in_stock": float(product.get("total_stock") or 0) > 0,
                "image": product.get("image") or "",
                # Custom fields (add these to Item DocType if needed)
                "brightness": item_doc.get("brightness") or 0,
                "wattage": item_doc.get("wattage") or 0,
                "color_temperature": item_doc.get("color_temperature") or "",
                "warranty_period": item_doc.get("warranty_period") or "",
                "specifications": item_doc.get("specifications") or "",
                "features": [
                    item_doc.get("feature_1"),
                    item_doc.get("feature_2"),
                    item_doc.get("feature_3"),
                    item_doc.get("feature_4")
                ] if hasattr(item_doc, "feature_1") else []
            }
        }
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Product Details API Error"))
        return {
            "success": False,
            "error": str(e),
            "message": "Failed to fetch product details"
        }


@frappe.whitelist(allow_guest=True)
def get_all_zones():
    """
    Fetch all zones with product counts
    Returns:
        List of zones with metadata
    """
    try:
        zones = ["A", "B", "C", "D", "E"]
        zone_data = []
        
        for zone in zones:
            count = frappe.db.count(
                "Zone Products",
                {"zone": zone, "disable": 0}
            )
            
            zone_data.append({
                "id": zone,
                "name": f"Zone {zone}",
                "productCount": count
            })
        
        return {
            "success": True,
            "data": zone_data
        }
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Get Zones API Error"))
        return {
            "success": False,
            "error": str(e)
        }



```

---

## Step 2: Ensure Required Data Exists

### 2.1 Item Price Setup
Make sure you have Item Price records with:
- **price_list** = "RRP" (Recommended Retail Price)
- Link to your items

To create RRP Price List:
1. Go to: **Selling → Price List → New**
2. Price List Name: "RRP"
3. Save

### 2.2 Stock/Bin Table
- Stock is automatically maintained in `tabBin` by ERPNext
- Ensure you have stock entries for your items

### 2.3 Zone Products Setup
- Create records in "Zone Products" DocType
- Fields: zone (A/B/C/D/E), item_code (link to Item), disable (unchecked)

---

## Step 3: Add Custom Fields to Item DocType (Optional)

If you want to store LED-specific information for API 2, add these custom fields to the Item DocType:

1. Go to: **Customize Form** → Select **Item**
2. Add these fields:

| Field Label | Field Name | Field Type | Description |
|-------------|-----------|------------|-------------|
| Brightness | brightness | Int | Brightness in lumens |
| Wattage | wattage | Int | Power consumption |
| Color Temperature | color_temperature | Data | e.g., "Warm White 3000K" |
| Feature 1 | feature_1 | Data | First feature |
| Feature 2 | feature_2 | Data | Second feature |
| Feature 3 | feature_3 | Data | Third feature |
| Feature 4 | feature_4 | Data | Fourth feature |
| Warranty Period | warranty_period | Data | Warranty information |
| Specifications | specifications | Text Editor | Detailed specifications |

---

## Step 4: Configure API Permissions

### 3.1 For Guest Access (Public API)
The APIs are already marked with `allow_guest=True`, but ensure CORS is enabled:

```python
# In your site_config.json or hooks.py
allow_cors = "*"
cors_allowed_origins = ["http://localhost:3000", "https://your-domain.com"]
```

### 3.2 For Authenticated Access
If you want authenticated access, remove `allow_guest=True` and use:
```python
@frappe.whitelist()
```

---

## Step 5: API Endpoints

Once deployed, your APIs will be available at:

### API 1: Get Products by Zone (Listing API)
```
GET/POST: https://your-erpnext-site.com/api/method/your_app.api.zone_products.get_zone_products

Parameters:
- zone (optional): A, B, C, D, or E

Returns:
- zone (from Zone Products)
- item_code (from Zone Products)
- brand (from Item)
- category (from Item.item_group)
- price (from Item Price where price_list = 'RRP')
- total_stock (sum from tabBin)
- in_stock (boolean based on total_stock)

Example:
curl -X GET "https://your-site.com/api/method/your_app.api.zone_products.get_zone_products?zone=A"
```

### API 2: Get Product Details
```
GET/POST: https://your-erpnext-site.com/api/method/your_app.api.zone_products.get_product_details

Parameters:
- item_code (required): Item code

Returns:
- All fields from API 1 plus:
- item_name
- description
- image
- Custom fields (brightness, wattage, color_temperature, etc.)

Example:
curl -X GET "https://your-site.com/api/method/your_app.api.zone_products.get_product_details?item_code=LED-001"
```

### Get All Zones
```
GET/POST: https://your-erpnext-site.com/api/method/your_app.api.zone_products.get_all_zones

Example:
curl -X GET "https://your-site.com/api/method/your_app.api.zone_products.get_all_zones"
```

---

## Step 6: Test Your API

### Using cURL:
```bash
# API 1: Get all products (listing)
curl -X GET "http://localhost:8000/api/method/your_app.api.zone_products.get_zone_products"

# API 1: Get products in Zone A
curl -X GET "http://localhost:8000/api/method/your_app.api.zone_products.get_zone_products?zone=A"

# API 2: Get detailed product information
curl -X GET "http://localhost:8000/api/method/your_app.api.zone_products.get_product_details?item_code=LED-001"

# Get all zones
curl -X GET "http://localhost:8000/api/method/your_app.api.zone_products.get_all_zones"
```

### Using Postman:
1. Create a new GET request
2. URL: `http://localhost:8000/api/method/your_app.api.zone_products.get_zone_products`
3. Add query parameter: `zone` = `A`
4. Send request

---

## Step 7: Integrate with Next.js Application

### 6.1 Create API Service File

Create `lib/erpnext-api.ts`:

```typescript
// lib/erpnext-api.ts

const ERPNEXT_BASE_URL = process.env.NEXT_PUBLIC_ERPNEXT_URL || 'http://localhost:8000';

export async function fetchZoneProducts(zone?: string) {
  try {
    const url = zone 
      ? `${ERPNEXT_BASE_URL}/api/method/your_app.api.zone_products.get_zone_products?zone=${zone}`
      : `${ERPNEXT_BASE_URL}/api/method/your_app.api.zone_products.get_zone_products`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.message && data.message.success) {
      return data.message.data;
    }
    throw new Error(data.message?.error || 'Failed to fetch products');
  } catch (error) {
    console.error('Error fetching zone products:', error);
    return [];
  }
}

export async function fetchAllZones() {
  try {
    const response = await fetch(
      `${ERPNEXT_BASE_URL}/api/method/your_app.api.zone_products.get_all_zones`
    );
    const data = await response.json();
    
    if (data.message && data.message.success) {
      return data.message.data;
    }
    throw new Error('Failed to fetch zones');
  } catch (error) {
    console.error('Error fetching zones:', error);
    return [];
  }
}

export async function fetchProductDetails(itemCode: string) {
  try {
    const response = await fetch(
      `${ERPNEXT_BASE_URL}/api/method/your_app.api.zone_products.get_product_details?item_code=${itemCode}`
    );
    const data = await response.json();
    
    if (data.message && data.message.success) {
      return data.message.data;
    }
    throw new Error('Failed to fetch product details');
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}
```

### 6.2 Add Environment Variable

Create `.env.local`:
```env
NEXT_PUBLIC_ERPNEXT_URL=http://your-erpnext-site.com
```

### 6.3 Update Your Data File

Update `lib/data.ts` to fetch from ERPNext:

```typescript
import { fetchZoneProducts, fetchAllZones } from './erpnext-api';

export const getProductsByZone = async (zoneId: string) => {
  const products = await fetchZoneProducts(zoneId);
  return products;
};

export const zones = async () => {
  const zonesData = await fetchAllZones();
  return zonesData;
};
```

---

## Step 8: Enable CORS in ERPNext

Add to `site_config.json`:
```json
{
  "allow_cors": "*",
  "cors_allowed_origins": [
    "http://localhost:3000",
    "https://your-production-domain.com"
  ]
}
```

Or add to `hooks.py`:
```python
# hooks.py
app_include_js = []
app_include_css = []

# CORS Configuration
override_whitelisted_methods = {
    "your_app.api.zone_products.get_zone_products": "your_app.api.zone_products.get_zone_products",
    "your_app.api.zone_products.get_all_zones": "your_app.api.zone_products.get_all_zones",
    "your_app.api.zone_products.get_product_details": "your_app.api.zone_products.get_product_details",
}
```

---

## API Response Format

### API 1: Listing API Response
```json
{
  "message": {
    "success": true,
    "data": [
      {
        "zone": "A",
        "item_code": "LED-001",
        "brand": "Philips",
        "category": "Panel Lights",
        "price": 89.99,
        "total_stock": 50.0,
        "in_stock": true
      },
      {
        "zone": "A",
        "item_code": "LED-002",
        "brand": "Osram",
        "category": "Strip Lights",
        "price": 45.99,
        "total_stock": 0.0,
        "in_stock": false
      }
    ],
    "count": 2,
    "zone": "A"
  }
}
```

### API 2: Product Details Response
```json
{
  "message": {
    "success": true,
    "data": {
      "item_code": "LED-001",
      "item_name": "Premium LED Panel Light",
      "description": "Ultra-slim design with uniform light distribution",
      "brand": "Philips",
      "category": "Panel Lights",
      "zone": "A",
      "price": 89.99,
      "total_stock": 50.0,
      "in_stock": true,
      "image": "/files/led-panel.jpg",
      "brightness": 4000,
      "wattage": 40,
      "color_temperature": "Cool White 6500K",
      "warranty_period": "5 Years",
      "specifications": "Detailed specifications here",
      "features": ["Energy Efficient", "Long Lifespan", "Flicker-Free", "Easy Installation"]
    }
  }
}
```

### Error Response:
```json
{
  "message": {
    "success": false,
    "error": "Error message",
    "message": "Failed to fetch products"
  }
}
```

---

## Troubleshooting

### 1. API Not Found (404)
- Ensure the Python file is in the correct path
- Run `bench migrate` to update
- Restart bench: `bench restart`

### 2. Permission Denied
- Check if `allow_guest=True` is set
- Verify CORS settings
- Check DocType permissions

### 3. Empty Response
- Verify Zone Products records exist
- Check if items are linked correctly
- Ensure `disable` field is unchecked

### 4. CORS Error in Browser
- Add your frontend URL to `cors_allowed_origins`
- Clear browser cache
- Check ERPNext logs: `bench logs`

---

## Security Best Practices

1. **Use Authentication** for production:
   ```python
   @frappe.whitelist()  # Remove allow_guest
   ```

2. **Rate Limiting**: Implement rate limiting for public APIs

3. **Input Validation**: Always validate and sanitize inputs

4. **Error Handling**: Never expose sensitive error details in production

5. **HTTPS**: Always use HTTPS in production

---

## Next Steps

1. Create sample Zone Products records in ERPNext
2. Add sample Items with prices
3. Test APIs using curl or Postman
4. Integrate with Next.js frontend
5. Add authentication if needed
6. Deploy to production

---

## Support

For ERPNext specific issues:
- ERPNext Documentation: https://docs.erpnext.com
- ERPNext Forum: https://discuss.erpnext.com

For API development:
- Frappe Framework Docs: https://frappeframework.com/docs
