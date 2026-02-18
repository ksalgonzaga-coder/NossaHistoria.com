import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, InsertProduct, carouselPhotos, InsertCarouselPhoto, posts, InsertPost, transactions, InsertTransaction, weddingInfo, InsertWeddingInfo, eventGalleryPhotos, InsertEventGalleryPhoto, eventGalleryComments, InsertEventGalleryComment, eventGalleryLikes, InsertEventGalleryLike, adminCredentials, InsertAdminCredential, couplePaymentInfo, InsertCouplePaymentInfo } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Products queries
export async function getProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.isActive, true)).orderBy(products.createdAt);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  // Get the newly created product by fetching the last one
  const created = await db.select().from(products).orderBy(desc(products.id)).limit(1);
  return created[0];
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(data).where(eq(products.id, id));
  // Get the updated product
  const result = await db.select().from(products).where(eq(products.id, id));
  return result[0];
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
  return { success: true };
}

// Carousel photos queries
export async function getCarouselPhotos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(carouselPhotos).where(eq(carouselPhotos.isActive, true)).orderBy(carouselPhotos.order);
}

export async function createCarouselPhoto(data: InsertCarouselPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(carouselPhotos).values(data);
  const result = await db.select().from(carouselPhotos).orderBy(carouselPhotos.id).limit(1);
  return result[0];
}

export async function updateCarouselPhoto(id: number, data: Partial<InsertCarouselPhoto>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(carouselPhotos).set(data).where(eq(carouselPhotos.id, id));
  const result = await db.select().from(carouselPhotos).where(eq(carouselPhotos.id, id));
  return result[0];
}

export async function deleteCarouselPhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(carouselPhotos).where(eq(carouselPhotos.id, id));
  return { success: true };
}

// Posts queries
export async function getPosts(approved = true) {
  const db = await getDb();
  if (!db) return [];
  if (approved) {
    return db.select().from(posts).where(eq(posts.isApproved, true)).orderBy(posts.createdAt);
  }
  return db.select().from(posts).orderBy(posts.createdAt);
}

export async function createPost(data: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(posts).values(data);
  const result = await db.select().from(posts).orderBy(desc(posts.id)).limit(1);
  return result[0];
}

export async function updatePost(id: number, data: Partial<InsertPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(posts).set(data).where(eq(posts.id, id));
  const result = await db.select().from(posts).where(eq(posts.id, id));
  return result[0];
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(posts).where(eq(posts.id, id));
}

// Transactions queries
export async function createTransaction(data: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(transactions).values(data);
}

export async function getTransactionByStripeId(stripeId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(transactions).where(eq(transactions.stripePaymentIntentId, stripeId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateTransaction(id: number, data: Partial<InsertTransaction>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(transactions).set(data).where(eq(transactions.id, id));
}

// Wedding info queries
export async function getWeddingInfo() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(weddingInfo).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateWeddingInfo(data: Partial<InsertWeddingInfo>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getWeddingInfo();
  if (existing) {
    return db.update(weddingInfo).set(data).where(eq(weddingInfo.id, existing.id));
  } else {
    return db.insert(weddingInfo).values(data);
  }
}


// Event gallery queries
export async function getEventGalleryPhotos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(eventGalleryPhotos).where(eq(eventGalleryPhotos.isActive, true)).orderBy(desc(eventGalleryPhotos.createdAt));
}

export async function createEventGalleryPhoto(data: InsertEventGalleryPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(eventGalleryPhotos).values(data);
  const result = await db.select().from(eventGalleryPhotos).orderBy(desc(eventGalleryPhotos.id)).limit(1);
  return result[0];
}

export async function deleteEventGalleryPhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(eventGalleryPhotos).where(eq(eventGalleryPhotos.id, id));
  return { success: true };
}

export async function getEventGalleryComments(photoId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(eventGalleryComments).where(eq(eventGalleryComments.photoId, photoId)).orderBy(desc(eventGalleryComments.createdAt));
}

export async function createEventGalleryComment(data: InsertEventGalleryComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(eventGalleryComments).values(data);
  const result = await db.select().from(eventGalleryComments).orderBy(desc(eventGalleryComments.id)).limit(1);
  return result[0];
}

export async function deleteEventGalleryComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(eventGalleryComments).where(eq(eventGalleryComments.id, id));
  return { success: true };
}

export async function addEventGalleryLike(photoId: number, guestEmail: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(eventGalleryLikes).where(and(eq(eventGalleryLikes.photoId, photoId), eq(eventGalleryLikes.guestEmail, guestEmail)));
  if (existing.length > 0) {
    return { success: false, message: "Already liked" };
  }
  
  await db.insert(eventGalleryLikes).values({ photoId, guestEmail });
  
  const likes = await db.select().from(eventGalleryLikes).where(eq(eventGalleryLikes.photoId, photoId));
  await db.update(eventGalleryPhotos).set({ likes: likes.length }).where(eq(eventGalleryPhotos.id, photoId));
  
  return { success: true };
}

export async function removeEventGalleryLike(photoId: number, guestEmail: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(eventGalleryLikes).where(and(eq(eventGalleryLikes.photoId, photoId), eq(eventGalleryLikes.guestEmail, guestEmail)));
  
  const likes = await db.select().from(eventGalleryLikes).where(eq(eventGalleryLikes.photoId, photoId));
  await db.update(eventGalleryPhotos).set({ likes: likes.length }).where(eq(eventGalleryPhotos.id, photoId));
  
  return { success: true };
}


// Admin credentials queries
export async function createAdminCredential(data: InsertAdminCredential) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(adminCredentials).values(data);
  const result = await db.select().from(adminCredentials).orderBy(desc(adminCredentials.id)).limit(1);
  return result[0];
}

export async function getAdminByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(adminCredentials).where(eq(adminCredentials.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAdminByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(adminCredentials).where(eq(adminCredentials.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAdminLastLogin(adminId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(adminCredentials).set({ lastLogin: new Date() }).where(eq(adminCredentials.id, adminId));
}

export async function updateAdminPassword(adminId: number, passwordHash: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(adminCredentials).set({ passwordHash }).where(eq(adminCredentials.id, adminId));
}


// Couple payment info queries
export async function getCouplePaymentInfo() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(couplePaymentInfo).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertCouplePaymentInfo(data: InsertCouplePaymentInfo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getCouplePaymentInfo();
  if (existing) {
    await db.update(couplePaymentInfo).set(data).where(eq(couplePaymentInfo.id, existing.id));
    return { ...existing, ...data };
  } else {
    await db.insert(couplePaymentInfo).values(data);
    const result = await db.select().from(couplePaymentInfo).orderBy(desc(couplePaymentInfo.id)).limit(1);
    return result[0];
  }
}

// Dashboard queries
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { totalContributions: 0, totalTransactions: 0, averageContribution: 0 };
  
  const allTransactions = await db.select().from(transactions);
  const totalTransactions = allTransactions.length;
  const totalContributions = allTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const averageContribution = totalTransactions > 0 ? totalContributions / totalTransactions : 0;
  
  return {
    totalContributions,
    totalTransactions,
    averageContribution,
  };
}

export async function getDashboardTransactions(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(transactions)
    .orderBy(desc(transactions.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getTransactionsByMonth() {
  const db = await getDb();
  if (!db) return [];
  
  const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  
  // Group by month
  const monthlyData: Record<string, number> = {};
  allTransactions.forEach(t => {
    const date = new Date(t.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + parseFloat(t.amount);
  });
  
  return Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }));
}

export async function getProductContributionStats() {
  const db = await getDb();
  if (!db) return [];
  
  const allProducts = await db.select().from(products);
  return allProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    sold: p.quantitySold,
    total: p.quantity,
    revenue: parseFloat(p.price) * p.quantitySold,
  }));
}
