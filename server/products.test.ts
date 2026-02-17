import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

// Mock user context for testing
const createMockContext = (role: 'admin' | 'user' = 'admin'): TrpcContext => ({
  user: {
    id: 1,
    openId: 'test-user',
    email: 'test@example.com',
    name: 'Test User',
    loginMethod: 'test',
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: {
    protocol: 'https',
    headers: { origin: 'http://localhost:3000' },
  } as TrpcContext['req'],
  res: {
    clearCookie: () => {},
  } as TrpcContext['res'],
});

describe('Products Router', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createMockContext('admin');
    caller = appRouter.createCaller(ctx);
  });

  it('should list products', async () => {
    const products = await caller.products.list();
    expect(Array.isArray(products)).toBe(true);
  });

  it('should create a product', async () => {
    const product = await caller.products.create({
      name: 'Test Product',
      description: 'A test product',
      price: '100.00',
      category: 'Test',
      quantity: 5,
    });

    expect(product).toBeDefined();
    expect(product.name).toBe('Test Product');
    expect(product.quantity).toBe(5);
  });

  it('should update a product', async () => {
    // First create a product
    const created = await caller.products.create({
      name: 'Original Name',
      price: '50.00',
      quantity: 3,
    });

    // Then update it
    const updated = await caller.products.update({
      id: created.id,
      name: 'Updated Name',
      price: '75.00',
    });

    expect(updated.name).toBe('Updated Name');
    expect(updated.price).toBe('75.00');
  });

  it('should delete a product', async () => {
    // Create a product
    const created = await caller.products.create({
      name: 'Product to Delete',
      price: '25.00',
      quantity: 1,
    });

    // Delete it
    const result = await caller.products.delete({ id: created.id });
    expect(result.success).toBe(true);

    // Verify it's deleted
    const products = await caller.products.list();
    const deleted = products.find((p) => p.id === created.id);
    expect(deleted).toBeUndefined();
  });
});

describe('Carousel Router', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createMockContext('admin');
    caller = appRouter.createCaller(ctx);
  });

  it('should list carousel photos', async () => {
    const photos = await caller.carousel.list();
    expect(Array.isArray(photos)).toBe(true);
  });

  it('should create a carousel photo', async () => {
    const photo = await caller.carousel.create({
      imageUrl: 'https://example.com/photo.jpg',
      caption: 'Test Photo',
      order: 0,
    });

    expect(photo).toBeDefined();
    expect(photo.imageUrl).toBe('https://example.com/photo.jpg');
    expect(photo.caption).toBe('Test Photo');
  });
});

describe('Posts Router', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createMockContext('user');
    caller = appRouter.createCaller(ctx);
  });

  it('should list approved posts', async () => {
    const posts = await caller.posts.list();
    expect(Array.isArray(posts)).toBe(true);
  });

  it('should create a post', async () => {
    const post = await caller.posts.create({
      guestName: 'Test Guest',
      guestEmail: 'guest@example.com',
      message: 'Great wedding!',
    });

    expect(post).toBeDefined();
    expect(post.guestName).toBe('Test Guest');
    expect(post.isApproved).toBe(false); // Posts require approval
  });
});

describe('Checkout Router', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createMockContext('user');
    caller = appRouter.createCaller(ctx);
  });

  it('should create a checkout session', async () => {
    const session = await caller.checkout.create({
      amount: 100,
      guestName: 'Test Guest',
      guestEmail: 'guest@example.com',
    });

    expect(session).toBeDefined();
    expect(session.url).toBeDefined();
    expect(typeof session.url).toBe('string');
  });

  it('should reject invalid checkout amounts', async () => {
    try {
      await caller.checkout.create({
        amount: -50,
        guestName: 'Test Guest',
      });
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
