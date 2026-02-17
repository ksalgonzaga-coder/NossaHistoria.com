/**
 * Stripe products and prices configuration for the wedding registry
 * These are used to create checkout sessions for gift contributions
 */

export const STRIPE_PRODUCTS = {
  WEDDING_GIFT: {
    name: 'Wedding Gift Contribution',
    description: 'Contribute to the wedding gift registry',
  },
};

export const createStripeLineItem = (amount: number, quantity: number = 1) => {
  return {
    price_data: {
      currency: 'brl',
      unit_amount: Math.round(amount * 100), // Convert to cents
      product_data: {
        name: STRIPE_PRODUCTS.WEDDING_GIFT.name,
        description: STRIPE_PRODUCTS.WEDDING_GIFT.description,
      },
    },
    quantity,
  };
};
