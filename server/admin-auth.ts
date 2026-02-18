import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { getAdminByEmail, updateAdminLastLogin } from './db';

/**
 * Hash a password using scrypt
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

/**
 * Verify a password against a hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const [saltHex, hashHex] = hash.split(':');
  if (!saltHex || !hashHex) return false;
  
  const salt = Buffer.from(saltHex, 'hex');
  const storedHash = Buffer.from(hashHex, 'hex');
  
  try {
    const computedHash = scryptSync(password, salt, 64);
    return timingSafeEqual(computedHash, storedHash);
  } catch {
    return false;
  }
}

/**
 * Authenticate admin with email and password
 */
export async function authenticateAdmin(email: string, password: string) {
  const admin = await getAdminByEmail(email);
  
  if (!admin || !admin.isActive) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  const isValid = verifyPassword(password, admin.passwordHash);
  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  // Update last login
  await updateAdminLastLogin(admin.id);
  
  return { 
    success: true, 
    admin: {
      id: admin.id,
      userId: admin.userId,
      email: admin.email,
    }
  };
}
