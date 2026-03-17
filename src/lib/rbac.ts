// Role-based access control utilities

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  DESIGNER = 'DESIGNER',
  USER = 'USER',
}

export enum Permission {
  // User permissions
  READ_USERS = 'READ_USERS',
  WRITE_USERS = 'WRITE_USERS',
  DELETE_USERS = 'DELETE_USERS',
  
  // Project permissions
  READ_PROJECTS = 'READ_PROJECTS',
  WRITE_PROJECTS = 'WRITE_PROJECTS',
  DELETE_PROJECTS = 'DELETE_PROJECTS',
  
  // Client permissions
  READ_CLIENTS = 'READ_CLIENTS',
  WRITE_CLIENTS = 'WRITE_CLIENTS',
  DELETE_CLIENTS = 'DELETE_CLIENTS',
  
  // Booking permissions
  READ_BOOKINGS = 'READ_BOOKINGS',
  WRITE_BOOKINGS = 'WRITE_BOOKINGS',
  DELETE_BOOKINGS = 'DELETE_BOOKINGS',
  
  // Lead permissions
  READ_LEADS = 'READ_LEADS',
  WRITE_LEADS = 'WRITE_LEADS',
  DELETE_LEADS = 'DELETE_LEADS',
  
  // Financial permissions
  READ_INVOICES = 'READ_INVOICES',
  WRITE_INVOICES = 'WRITE_INVOICES',
  DELETE_INVOICES = 'DELETE_INVOICES',
  
  // Analytics permissions
  READ_ANALYTICS = 'READ_ANALYTICS',
}

// Role to permissions mapping
const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission), // Admin has all permissions
  [Role.MANAGER]: [
    Permission.READ_USERS,
    Permission.READ_PROJECTS,
    Permission.WRITE_PROJECTS,
    Permission.READ_CLIENTS,
    Permission.WRITE_CLIENTS,
    Permission.READ_BOOKINGS,
    Permission.WRITE_BOOKINGS,
    Permission.READ_LEADS,
    Permission.WRITE_LEADS,
    Permission.READ_INVOICES,
    Permission.WRITE_INVOICES,
    Permission.READ_ANALYTICS,
  ],
  [Role.DESIGNER]: [
    Permission.READ_PROJECTS,
    Permission.WRITE_PROJECTS,
    Permission.READ_CLIENTS,
    Permission.READ_BOOKINGS,
    Permission.WRITE_BOOKINGS,
    Permission.READ_LEADS,
  ],
  [Role.USER]: [
    Permission.READ_PROJECTS,
    Permission.READ_CLIENTS,
  ],
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role | string, permission: Permission): boolean {
  const roleEnum = role as Role
  const permissions = rolePermissions[roleEnum]
  return permissions ? permissions.includes(permission) : false
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: Role | string, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: Role | string, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role | string): Permission[] {
  const roleEnum = role as Role
  return rolePermissions[roleEnum] || []
}

/**
 * Check if a user can access a resource
 */
export function canAccess(userRole: string, requiredPermission: Permission): boolean {
  return hasPermission(userRole as Role, requiredPermission)
}

/**
 * Middleware helper to require specific permissions
 */
export function requirePermission(permission: Permission) {
  return (userRole: string): boolean => {
    return hasPermission(userRole as Role, permission)
  }
}

/**
 * Middleware helper to require any of the specified permissions
 */
export function requireAnyPermission(permissions: Permission[]) {
  return (userRole: string): boolean => {
    return hasAnyPermission(userRole as Role, permissions)
  }
}

/**
 * Middleware helper to require all of the specified permissions
 */
export function requireAllPermissions(permissions: Permission[]) {
  return (userRole: string): boolean => {
    return hasAllPermissions(userRole as Role, permissions)
  }
}
