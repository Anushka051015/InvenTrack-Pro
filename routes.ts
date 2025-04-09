import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import {
  insertProductSchema,
  updateProductSchema,
  productFilterSchema,
  ProductFilter
} from "@shared/schema";
import { ZodError } from "zod";

function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send("Unauthorized");
}

// Helper function to apply product filters
function applyProductFilters(filters: ProductFilter, products: any[]) {
  let filtered = [...products];
  
  // Apply search filter (name or description)
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(product => product.category === filters.category);
  }

  // Apply price range filter
  if (filters.priceRange && filters.priceRange !== 'all') {
    const [min, max] = filters.priceRange.split('-');
    if (min && max) {
      filtered = filtered.filter(product => 
        product.price >= Number(min) && product.price <= Number(max)
      );
    } else if (min) {
      filtered = filtered.filter(product => product.price >= Number(min));
    }
  }

  // Apply rating filter
  if (filters.rating && filters.rating !== 'all') {
    const minRating = parseFloat(filters.rating.replace('+', ''));
    filtered = filtered.filter(product => product.rating >= minRating);
  }

  // Apply sorting
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      switch(filters.sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }

  return filtered;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Product routes
  app.post("/api/products", isAuthenticated, async (req, res, next) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).send("User not authenticated");
      }
      
      const product = await storage.createProduct({
        ...productData,
        userId,
      });
      
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  });

  app.get("/api/products", isAuthenticated, async (req, res, next) => {
    try {
      const filters = productFilterSchema.parse(req.query);
      const products = await storage.getProductsByUserId(req.user?.id);
      
      const filteredProducts = applyProductFilters(filters, products);
      
      res.status(200).json(filteredProducts);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  });

  app.get("/api/products/:id", isAuthenticated, async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).send("Product not found");
      }
      
      // Verify product belongs to the current user
      if (product.userId !== req.user?.id) {
        return res.status(403).send("Forbidden");
      }
      
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/products/:id", isAuthenticated, async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const productData = updateProductSchema.parse(req.body);
      
      // Verify product exists and belongs to the current user
      const existingProduct = await storage.getProduct(productId);
      if (!existingProduct) {
        return res.status(404).send("Product not found");
      }
      
      if (existingProduct.userId !== req.user?.id) {
        return res.status(403).send("Forbidden");
      }
      
      const updatedProduct = await storage.updateProduct(productId, productData);
      
      res.status(200).json(updatedProduct);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  });

  app.delete("/api/products/:id", isAuthenticated, async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      
      // Verify product exists and belongs to the current user
      const existingProduct = await storage.getProduct(productId);
      if (!existingProduct) {
        return res.status(404).send("Product not found");
      }
      
      if (existingProduct.userId !== req.user?.id) {
        return res.status(403).send("Forbidden");
      }
      
      await storage.deleteProduct(productId);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
