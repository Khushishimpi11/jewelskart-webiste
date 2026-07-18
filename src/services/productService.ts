// src/services/productService.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  purchasePrice: number;
  category: string;
  brand?: string;
  stock: number;
  description: string;
  images: string[];
  sku: string;
  tags: string[];
  status: "Published" | "Draft" | "Archived";
  featured?: boolean;
  bestSeller?: boolean;
  goldDetails?: {
    weight: number;
    purity: "9K" | "10K" | "14K" | "18K" | "21K" | "22K" | "23K" | "24K";
    makingCharge: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_URL || API_BASE_URL;

export const productService = {
  // Get all products (only published ones for shop)
  async getPublishedProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`);
    const allProducts = await response.json();
    return allProducts.filter((p: Product) => p.status === "Published");
  },

  // Get all products (for admin)
  async getAllProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`);
    return response.json();
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.json();
  },

  // Add product
  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return response.json();
  },

  // Update product
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/products/${id}`, { method: "DELETE" });
  },

  // Update stock
  async updateStock(id: string, stock: number, operation: string, note?: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock, operation, note }),
    });
    return response.json();
  },

  // ✅ Get available products for exchange
  async getAvailableProductsForExchange(token: string, category?: string, maxPrice?: number, excludeProductId?: string, search?: string): Promise<Product[]> {
    try {
      let url = `${API_BASE_URL}/returns/available-products`;
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (maxPrice) params.append('maxPrice', maxPrice.toString());
      if (excludeProductId) params.append('excludeProductId', excludeProductId);
      if (search) params.append('search', search);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        return data.products.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          price: p.price,
          purchasePrice: p.purchasePrice || 0,
          category: p.category,
          stock: p.stock,
          description: p.description || '',
          images: p.image ? [p.image] : (p.images || []),
          sku: p.sku || '',
          tags: p.tags || [],
          status: p.status || "Published",
          featured: p.featured,
          bestSeller: p.bestSeller,
          goldDetails: p.goldDetails
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching available products:', error);
      return [];
    }
  },

  // ✅ Get product by ID with token
  async getProductByIdWithToken(id: string, token: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.product) {
        const p = data.product;
        return {
          id: p._id,
          name: p.name,
          price: p.price,
          purchasePrice: p.purchasePrice || 0,
          category: p.category,
          stock: p.stock,
          description: p.description || '',
          images: p.images || [],
          sku: p.sku,
          tags: p.tags || [],
          status: p.status || "Published",
          featured: p.featured,
          bestSeller: p.bestSeller,
          goldDetails: p.goldDetails
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
};