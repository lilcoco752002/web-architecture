import { z } from 'zod'

// ============================================
// COMMON VALIDATION SCHEMAS
// ============================================

export const emailSchema = z.string().email('Invalid email address')

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .optional()

export const urlSchema = z.string().url('Invalid URL').optional()

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['ADMIN', 'STAFF']).optional(),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// ============================================
// CLIENT SCHEMAS
// ============================================

export const createClientSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().optional(),
  website: urlSchema,
  source: z.enum([
    'WEBSITE',
    'REFERRAL',
    'SOCIAL_MEDIA',
    'ADVERTISING',
    'COLD_OUTREACH',
    'PARTNER',
    'OTHER',
  ]),
  status: z
    .enum([
      'NEW',
      'CONTACTED',
      'QUALIFIED',
      'PROPOSAL_SENT',
      'NEGOTIATING',
      'ACTIVE',
      'COMPLETED',
      'INACTIVE',
      'LOST',
    ])
    .default('NEW'),
  priority: z.number().int().min(1).max(3).default(3),
  country: z.string().optional(),
  city: z.string().optional(),
  industry: z.string().optional(),
  budget: z.number().positive().optional(),
})

export const updateClientSchema = createClientSchema.partial()

export const clientNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
  isPrivate: z.boolean().default(false),
})

// ============================================
// LEAD SCHEMAS
// ============================================

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().optional(),
  website: urlSchema,
  source: z.enum([
    'WEBSITE',
    'REFERRAL',
    'SOCIAL_MEDIA',
    'ADVERTISING',
    'COLD_OUTREACH',
    'PARTNER',
    'OTHER',
  ]),
  interestedIn: z.string().optional(),
  message: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
})

export const updateLeadSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED', 'LOST']),
  priority: z.number().int().min(1).max(3).optional(),
})

// ============================================
// PROJECT SCHEMAS
// ============================================

export const createProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  type: z.enum([
    'WEB_DESIGN',
    'WEB_DEVELOPMENT',
    'MOBILE_APP',
    'BRANDING',
    'SEO',
    'CONSULTING',
    'OTHER',
  ]),
  status: z
    .enum(['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'])
    .default('PLANNING'),
  clientId: z.string().cuid(),
  budget: z.number().positive().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  featuredImage: z.string().url().optional(),
  websiteUrl: urlSchema,
  tags: z.array(z.string()).default([]),
  serviceIds: z.array(z.string().cuid()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
})

export const updateProjectSchema = createProjectSchema.partial()

export const projectImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  altText: z.string().optional(),
  caption: z.string().optional(),
  order: z.number().int().default(0),
})

// ============================================
// SERVICE SCHEMAS
// ============================================

export const createServiceSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().url().optional(),
  startingPrice: z.number().positive().optional(),
  pricingNote: z.string().optional(),
  features: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
})

export const updateServiceSchema = createServiceSchema.partial()

// ============================================
// BLOG SCHEMAS
// ============================================

export const createBlogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  excerpt: z.string().optional(),
  featuredImage: z.string().url().optional(),
  imageAlt: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
})

export const updateBlogPostSchema = createBlogPostSchema.partial()

// ============================================
// TESTIMONIAL SCHEMAS
// ============================================

export const createTestimonialSchema = z.object({
  clientName: z.string().min(2, 'Client name is required'),
  clientRole: z.string().optional(),
  clientCompany: z.string().optional(),
  clientAvatar: z.string().url().optional(),
  content: z.string().min(10, 'Testimonial must be at least 10 characters'),
  rating: z.number().int().min(1).max(5).default(5),
  projectId: z.string().cuid().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
})

export const updateTestimonialSchema = createTestimonialSchema.partial()

// ============================================
// BOOKING SCHEMAS
// ============================================

export const createBookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().optional(),
  type: z.enum(['CONSULTATION', 'PROJECT_INQUIRY', 'SUPPORT', 'OTHER']),
  interestedIn: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  preferredDate: z.coerce.date().optional(),
  preferredTime: z.string().optional(),
})

export const updateBookingSchema = z.object({
  status: z.enum([
    'PENDING',
    'REVIEWED',
    'CONTACTED',
    'QUOTED',
    'ACCEPTED',
    'REJECTED',
    'CANCELLED',
  ]),
  notes: z.string().optional(),
})

// ============================================
// QUOTATION SCHEMAS
// ============================================

export const quotationItemSchema = z.object({
  service: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  rate: z.number().positive(),
  amount: z.number().positive(),
})

export const createQuotationSchema = z.object({
  clientId: z.string().cuid(),
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  items: z.array(quotationItemSchema).min(1, 'At least one item is required'),
  subtotal: z.number().positive(),
  tax: z.number().nonnegative().optional(),
  discount: z.number().nonnegative().optional(),
  total: z.number().positive(),
  currency: z.string().default('USD'),
  validUntil: z.coerce.date(),
  terms: z.string().optional(),
  notes: z.string().optional(),
})

export const updateQuotationSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CONVERTED']),
})

// ============================================
// TEAM MEMBER SCHEMAS
// ============================================

export const createTeamMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  email: emailSchema.optional(),
  linkedIn: urlSchema,
  twitter: urlSchema,
  github: urlSchema,
  order: z.number().int().default(0),
  published: z.boolean().default(true),
})

export const updateTeamMemberSchema = createTeamMemberSchema.partial()

// ============================================
// TYPE EXPORTS
// ============================================

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>
export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>
export type CreateQuotationInput = z.infer<typeof createQuotationSchema>
export type UpdateQuotationInput = z.infer<typeof updateQuotationSchema>
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>
