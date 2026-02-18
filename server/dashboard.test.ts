import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

describe('Dashboard Router', () => {
  const adminUser = {
    id: 1,
    openId: 'admin-user-123',
    email: 'admin@example.com',
    name: 'Admin User',
    loginMethod: 'google',
    role: 'admin' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const regularUser = {
    id: 2,
    openId: 'regular-user-123',
    email: 'user@example.com',
    name: 'Regular User',
    loginMethod: 'google',
    role: 'user' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  function createContext(user: typeof adminUser | typeof regularUser): TrpcContext {
    return {
      user,
      req: {
        protocol: 'https',
        headers: {},
      } as TrpcContext['req'],
      res: {} as TrpcContext['res'],
    };
  }

  describe('getStats', () => {
    it('should return dashboard stats for admin', async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const stats = await caller.dashboard.getStats();

      expect(stats).toBeDefined();
      expect(stats.totalContributions).toBeGreaterThanOrEqual(0);
      expect(stats.totalTransactions).toBeGreaterThanOrEqual(0);
      expect(stats.averageContribution).toBeGreaterThanOrEqual(0);
    });

    it('should reject non-admin users', async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dashboard.getStats();
        expect.fail('Should have thrown FORBIDDEN error');
      } catch (error: any) {
        expect(error.code).toBe('FORBIDDEN');
      }
    });
  });

  describe('getTransactions', () => {
    it('should return transactions for admin', async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const transactions = await caller.dashboard.getTransactions({ limit: 10, offset: 0 });

      expect(Array.isArray(transactions)).toBe(true);
    });

    it('should reject non-admin users', async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dashboard.getTransactions({ limit: 10, offset: 0 });
        expect.fail('Should have thrown FORBIDDEN error');
      } catch (error: any) {
        expect(error.code).toBe('FORBIDDEN');
      }
    });
  });

  describe('getMonthlyStats', () => {
    it('should return monthly stats for admin', async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const monthlyStats = await caller.dashboard.getMonthlyStats();

      expect(Array.isArray(monthlyStats)).toBe(true);
    });

    it('should reject non-admin users', async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dashboard.getMonthlyStats();
        expect.fail('Should have thrown FORBIDDEN error');
      } catch (error: any) {
        expect(error.code).toBe('FORBIDDEN');
      }
    });
  });

  describe('getPaymentInfo', () => {
    it('should return payment info for admin', async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const paymentInfo = await caller.dashboard.getPaymentInfo();

      expect(paymentInfo === undefined || typeof paymentInfo === 'object').toBe(true);
    });

    it('should reject non-admin users', async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dashboard.getPaymentInfo();
        expect.fail('Should have thrown FORBIDDEN error');
      } catch (error: any) {
        expect(error.code).toBe('FORBIDDEN');
      }
    });
  });

  describe('updatePaymentInfo', () => {
    it('should update payment info for admin', async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.dashboard.updatePaymentInfo({
        bankName: 'Test Bank',
        accountType: 'checking',
        accountHolder: 'Test User',
        accountNumber: '123456-7',
        routingNumber: '001',
      });

      expect(result).toBeDefined();
      expect(result.bankName).toBe('Test Bank');
    });

    it('should reject non-admin users', async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dashboard.updatePaymentInfo({
          bankName: 'Test Bank',
        });
        expect.fail('Should have thrown FORBIDDEN error');
      } catch (error: any) {
        expect(error.code).toBe('FORBIDDEN');
      }
    });
  });
});
