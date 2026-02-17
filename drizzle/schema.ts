import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, longtext } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table for wedding registry items
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 255 }),
  category: varchar("category", { length: 100 }),
  quantity: int("quantity").default(1).notNull(),
  quantitySold: int("quantitySold").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Carousel photos table for couple photos
 */
export const carouselPhotos = mysqlTable("carouselPhotos", {
  id: int("id").autoincrement().primaryKey(),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 255 }),
  caption: varchar("caption", { length: 255 }),
  order: int("order").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CarouselPhoto = typeof carouselPhotos.$inferSelect;
export type InsertCarouselPhoto = typeof carouselPhotos.$inferInsert;

/**
 * Posts table for guest messages and photos
 */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  guestName: varchar("guestName", { length: 255 }).notNull(),
  guestEmail: varchar("guestEmail", { length: 320 }),
  message: longtext("message"),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 255 }),
  isApproved: boolean("isApproved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * Transactions table for tracking contributions
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).unique(),
  guestName: varchar("guestName", { length: 255 }).notNull(),
  guestEmail: varchar("guestEmail", { length: 320 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  productId: int("productId"),
  quantity: int("quantity").default(1).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  stripeResponse: longtext("stripeResponse"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Wedding info table for storing couple information
 */
export const weddingInfo = mysqlTable("weddingInfo", {
  id: int("id").autoincrement().primaryKey(),
  groomName: varchar("groomName", { length: 255 }),
  brideName: varchar("brideName", { length: 255 }),
  weddingDate: timestamp("weddingDate"),
  description: text("description"),
  bankAccountName: varchar("bankAccountName", { length: 255 }),
  bankAccountNumber: varchar("bankAccountNumber", { length: 255 }),
  bankCode: varchar("bankCode", { length: 50 }),
  pixKey: varchar("pixKey", { length: 255 }),
  stripeAccountId: varchar("stripeAccountId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WeddingInfo = typeof weddingInfo.$inferSelect;
export type InsertWeddingInfo = typeof weddingInfo.$inferInsert;


/**
 * Event gallery photos table for post-event photos
 */
export const eventGalleryPhotos = mysqlTable("eventGalleryPhotos", {
  id: int("id").autoincrement().primaryKey(),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 255 }),
  caption: text("caption"),
  likes: int("likes").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EventGalleryPhoto = typeof eventGalleryPhotos.$inferSelect;
export type InsertEventGalleryPhoto = typeof eventGalleryPhotos.$inferInsert;

/**
 * Event gallery comments table
 */
export const eventGalleryComments = mysqlTable("eventGalleryComments", {
  id: int("id").autoincrement().primaryKey(),
  photoId: int("photoId").notNull(),
  guestName: varchar("guestName", { length: 255 }).notNull(),
  guestEmail: varchar("guestEmail", { length: 320 }),
  comment: text("comment").notNull(),
  isApproved: boolean("isApproved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EventGalleryComment = typeof eventGalleryComments.$inferSelect;
export type InsertEventGalleryComment = typeof eventGalleryComments.$inferInsert;

/**
 * Event gallery likes table
 */
export const eventGalleryLikes = mysqlTable("eventGalleryLikes", {
  id: int("id").autoincrement().primaryKey(),
  photoId: int("photoId").notNull(),
  guestEmail: varchar("guestEmail", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventGalleryLike = typeof eventGalleryLikes.$inferSelect;
export type InsertEventGalleryLike = typeof eventGalleryLikes.$inferInsert;
