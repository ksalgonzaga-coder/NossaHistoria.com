import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

type CoupleUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: CoupleUser = {
    id: 1,
    openId: 'sample-user',
    email: 'sample@example.com',
    name: 'Sample User',
    loginMethod: 'manus',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext['res'],
  };

  return { ctx, clearedCookies };
}

describe('Admin Authentication', () => {
  it('should allow admin to setup credentials', async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.adminAuth.setupAdmin({
        email: `admin-${Date.now()}@test.com`,
        password: 'testPassword123',
      });

      expect(result).toBeDefined();
      expect(result.email).toContain('admin-');
      expect(result.isActive).toBe(true);
    } catch (error: any) {
      expect(error.message).toContain('Admin already set up');
    }
  });

  it('should reject non-admin users', async () => {
    const { ctx } = createAuthContext();
    ctx.user.role = 'user';
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.adminAuth.setupAdmin({
        email: 'admin@test.com',
        password: 'testPassword123',
      });
      expect.fail('Should have thrown FORBIDDEN error');
    } catch (error: any) {
      expect(error.code).toBe('FORBIDDEN');
    }
  });
});
