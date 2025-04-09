import { pgTable, text, serial, integer, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: doublePrecision("price").notNull(),
  rating: doublePrecision("rating").notNull().default(0),
  imageUrl: text("image_url"),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  category: true,
  price: true,
  rating: true,
  imageUrl: true,
});

export const updateProductSchema = insertProductSchema.partial();

export const profileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
});

export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const productFilterSchema = z.object({
  category: z.string().optional(),
  priceRange: z.string().optional(),
  rating: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
