const { z } = require('zod');

const orderSchema = z.object({
  llcName: z.string().trim().min(2).max(200),
  jurisdictionStatus: z.enum(['Domestic', 'Foreign']).default('Domestic'),
  county: z.string().trim().min(2).max(80),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().min(7).max(30),
  discountCode: z.string().trim().max(40).optional().default(''),
});

const priceUpsertSchema = z.object({
  county: z.string().trim().min(2).max(80),
  price: z.number().min(0).max(100000),
  priceForeign: z.number().min(0).max(100000).nullable().optional(),
  isActive: z.boolean().optional(),
});

const articleSchema = z.object({
  slug: z.string().trim().toLowerCase().min(2).max(160).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(4).max(220),
  excerpt: z.string().trim().min(10).max(2000),
  tag: z.string().trim().max(60).optional().default('Service'),
  contentHtml: z.string().min(20),
  readingTime: z.string().max(40).optional().default('8 minutes'),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  featured: z.boolean().optional().default(false),
});

function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const err = new Error('Validation failed');
      err.status = 400;
      err.details = parsed.error.flatten();
      return next(err);
    }
    req.body = parsed.data;
    next();
  };
}

module.exports = { orderSchema, priceUpsertSchema, articleSchema, validate };
