// Type definitions for Prisma enums and models
// These mirror the Prisma schema but as TypeScript types

export type UserRole = 'ADMIN' | 'STAFF'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export type ClientSource = 
  | 'WEBSITE'
  | 'REFERRAL'
  | 'SOCIAL_MEDIA'
  | 'ADVERTISING'
  | 'COLD_OUTREACH'
  | 'PARTNER'
  | 'OTHER'

export type ClientStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'INACTIVE'
  | 'LOST'

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'UNQUALIFIED'
  | 'CONVERTED'
  | 'LOST'

export type BookingStatus =
  | 'PENDING'
  | 'CONTACTED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'

export type ProjectType =
  | 'WEBSITE'
  | 'WEB_APP'
  | 'MOBILE_APP'
  | 'ECOMMERCE'
  | 'BRANDING'
  | 'MARKETING'
  | 'OTHER'

export type ProjectStatus =
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'CANCELLED'

export type QuotationStatus =
  | 'DRAFT'
  | 'SENT'
  | 'VIEWED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'

export type ActivityType =
  | 'CLIENT_CREATED'
  | 'CLIENT_UPDATED'
  | 'CLIENT_STATUS_CHANGED'
  | 'LEAD_CREATED'
  | 'LEAD_UPDATED'
  | 'LEAD_CONVERTED'
  | 'LEAD_STATUS_CHANGED'
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_STATUS_CHANGED'
  | 'BOOKING_CREATED'
  | 'BOOKING_UPDATED'
  | 'BOOKING_STATUS_CHANGED'
  | 'QUOTATION_CREATED'
  | 'QUOTATION_SENT'
  | 'QUOTATION_VIEWED'
  | 'QUOTATION_ACCEPTED'
  | 'QUOTATION_REJECTED'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'NOTE_ADDED'
  | 'FILE_UPLOADED'
  | 'EMAIL_SENT'
  | 'SYSTEM_EVENT'

export type BlogPostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
