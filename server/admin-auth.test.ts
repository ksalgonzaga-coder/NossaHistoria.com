import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, authenticateAdmin } from './admin-auth';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

describe('Admin Authentication', () => {
  describe('Password Hashing', () => {
    it('should hash a password', () => {
      const password = 'testPassword123';
      const hash = hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).toContain(':');
      expect(hash.split(':').length).toBe(2);
    });

    it('should verify a correct password', () => {
      const password = 'testPassword123';
      const hash = hashPassword(password);
      
      const isValid = verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hash = hashPassword(password);
      
      const isValid = verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should generate different hashes for the same password', () => {
      const password = 'testPassword123';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
      expect(verifyPassword(password, hash1)).toBe(true);
      expect(verifyPassword(password, hash2)).toBe(true);
    });
  });

  describe('Admin Setup', () => {
    it('should setup admin credentials for authenticated user', async () => {
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

      const ctx: TrpcContext = {
        user: adminUser,
        req: {
          protocol: 'https',
          headers: {},
        } as TrpcContext['req'],
        res: {} as TrpcContext['res'],
      };

      const caller = appRouter.createCaller(ctx);

      // Setup admin credentials
      const result = await caller.adminAuth.setupAdmin({
        email: 'admin@wedding.com',
        password: 'securePassword123',
      });

      expect(result).toBeDefined();
      expect(result.email).toBe('admin@wedding.com');
      expect(result.userId).toBe(adminUser.id);
      expect(result.isActive).toBe(true);
    });

    it('should reject setup for non-admin users', async () => {
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

      const ctx: TrpcContext = {
        user: regularUser,
        req: {
          protocol: 'https',
          headers: {},
        } as TrpcContext['req'],
        res: {} as TrpcContext['res'],
      };

      const caller = appRouter.createCaller(ctx);

      try {
        await caller.adminAuth.setupAdmin({
          email: 'admin@wedding.com',
          password: 'securePassword123',
        });
        expect.fail('Should have thrown FORBIDDEN error');
      } catch (error: any) {
        expect(error.code).toBe('FORBIDDEN');
      }
    });
  });
});
