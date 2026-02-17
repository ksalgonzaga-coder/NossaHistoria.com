import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCarouselPhotos,
  createCarouselPhoto,
  updateCarouselPhoto,
  deleteCarouselPhoto,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  createTransaction,
  getTransactionByStripeId,
  updateTransaction,
  getWeddingInfo,
  updateWeddingInfo,
} from "./db";
import { TRPCError } from "@trpc/server";
import { createCheckoutSession } from "./stripe-checkout";

// Helper to check if user is admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Products router
  products: router({
    list: publicProcedure.query(async () => {
      return getProducts();
    }),
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getProductById(input.id);
      }),
    create: adminProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          price: z.string(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          category: z.string().optional(),
          quantity: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createProduct({
          name: input.name,
          description: input.description,
          price: input.price,
          imageUrl: input.imageUrl,
          imageKey: input.imageKey,
          category: input.category,
          quantity: input.quantity || 1,
        });
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.string().optional(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          category: z.string().optional(),
          quantity: z.number().optional(),
          quantitySold: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateProduct(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteProduct(input.id);
      }),
  }),

  // Carousel photos router
  carousel: router({
    list: publicProcedure.query(async () => {
      return getCarouselPhotos();
    }),
    create: adminProcedure
      .input(
        z.object({
          imageUrl: z.string(),
          imageKey: z.string().optional(),
          caption: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createCarouselPhoto({
          imageUrl: input.imageUrl,
          imageKey: input.imageKey,
          caption: input.caption,
          order: input.order || 0,
        });
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          caption: z.string().optional(),
          order: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateCarouselPhoto(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteCarouselPhoto(input.id);
      }),
  }),

  // Posts (mural) router
  posts: router({
    list: publicProcedure.query(async () => {
      return getPosts(true);
    }),
    listAll: adminProcedure.query(async () => {
      return getPosts(false);
    }),
    create: publicProcedure
      .input(
        z.object({
          guestName: z.string(),
          guestEmail: z.string().email().optional(),
          message: z.string().optional(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createPost({
          guestName: input.guestName,
          guestEmail: input.guestEmail,
          message: input.message,
          imageUrl: input.imageUrl,
          imageKey: input.imageKey,
          isApproved: false,
        });
      }),
    approve: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return updatePost(input.id, { isApproved: true });
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deletePost(input.id);
      }),
  }),

  // Checkout router
  checkout: router({
    create: publicProcedure
      .input(
        z.object({
          amount: z.number().positive(),
          guestName: z.string(),
          guestEmail: z.string().email().optional(),
          productId: z.number().optional(),
          quantity: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const session = await createCheckoutSession({
            amount: input.amount,
            guestName: input.guestName,
            guestEmail: input.guestEmail,
            productId: input.productId,
            quantity: input.quantity || 1,
            origin: ctx.req.headers.origin || 'http://localhost:3000',
            userId: ctx.user?.id.toString(),
          });
          return { url: session.url };
        } catch (error) {
          console.error('Checkout error:', error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        }
      }),
  }),

  // Transactions router
  transactions: router({
    create: publicProcedure
      .input(
        z.object({
          guestName: z.string(),
          guestEmail: z.string().email().optional(),
          amount: z.string(),
          productId: z.number().optional(),
          quantity: z.number().optional(),
          paymentMethod: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createTransaction({
          guestName: input.guestName,
          guestEmail: input.guestEmail,
          amount: input.amount,
          productId: input.productId,
          quantity: input.quantity || 1,
          paymentMethod: input.paymentMethod,
          status: "pending",
        });
      }),
    updateByStripeId: adminProcedure
      .input(
        z.object({
          stripePaymentIntentId: z.string(),
          status: z.enum(["pending", "completed", "failed", "refunded"]),
          stripeResponse: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const transaction = await getTransactionByStripeId(input.stripePaymentIntentId);
        if (!transaction) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return updateTransaction(transaction.id, {
          status: input.status,
          stripeResponse: input.stripeResponse,
        });
      }),
  }),

  // Wedding info router
  wedding: router({
    get: publicProcedure.query(async () => {
      const info = await getWeddingInfo();
      // Return empty object if no wedding info exists yet
      return info || {
        id: 1,
        groomName: null,
        brideName: null,
        weddingDate: null,
        description: null,
        bankAccountName: null,
        bankAccountNumber: null,
        bankCode: null,
        pixKey: null,
        stripeAccountId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
    update: adminProcedure
      .input(
        z.object({
          groomName: z.string().optional(),
          brideName: z.string().optional(),
          weddingDate: z.date().optional(),
          description: z.string().optional(),
          bankAccountName: z.string().optional(),
          bankAccountNumber: z.string().optional(),
          bankCode: z.string().optional(),
          pixKey: z.string().optional(),
          stripeAccountId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return updateWeddingInfo(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Export checkout router for webhook handling
export { createCheckoutSession };
