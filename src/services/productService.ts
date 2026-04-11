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
    purity: "22K" | "18K" | "24K";
    makingCharge: number;
  };
}

const API_BASE_URL = "http://localhost:8080/api";

export const productService = {
  // Get all products (only published ones for shop)
  async getPublishedProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`);
    const allProducts = await response.json();
    // Filter only published products for shop
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
  }
};