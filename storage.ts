import { users, products, type User, type InsertUser, type Product, type InsertProduct, type UpdateProduct, type ProfileUpdate } from "@shared/schema";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { pool } from "./db";

const PostgresSessionStore = connectPgSimple(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(id: number, data: ProfileUpdate): Promise<User>;
  updateUserPassword(id: number, password: string): Promise<void>;
  
  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByUserId(userId: number | undefined): Promise<Product[]>;
  createProduct(product: InsertProduct & { userId: number }): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserProfile(id: number, data: ProfileUpdate): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  async updateUserPassword(id: number, password: string): Promise<void> {
    const result = await db
      .update(users)
      .set({ password })
      .where(eq(users.id, id));
    
    if (!result) {
      throw new Error("User not found");
    }
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByUserId(userId: number | undefined): Promise<Product[]> {
    if (!userId) return [];
    return db.select().from(products).where(eq(products.userId, userId));
  }

  async createProduct(productData: InsertProduct & { userId: number }): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    
    if (!updatedProduct) {
      throw new Error("Product not found");
    }
    
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
}

export const storage = new DatabaseStorage();
