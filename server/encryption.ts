import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * Encryption key - should be stored in environment variable
 * For production, use a proper key management service
 */
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'wedding-registry-encryption-key-32-chars-long!!!';

// Ensure key is 32 bytes for AES-256
const key = Buffer.from(ENCRYPTION_KEY.padEnd(32, '!').substring(0, 32));

/**
 * Encrypt sensitive data using AES-256-GCM
 * Returns: iv:encryptedData:authTag (all in hex)
 */
export function encryptData(data: string): string {
  try {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Return IV:encrypted:authTag in hex format
    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  } catch (error) {
    console.error('[Encryption] Error encrypting data:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt sensitive data using AES-256-GCM
 * Input format: iv:encryptedData:authTag (all in hex)
 */
export function decryptData(encryptedData: string): string {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const [ivHex, encryptedHex, authTagHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('[Encryption] Error decrypting data:', error);
    throw new Error('Decryption failed');
  }
}

/**
 * Check if data is encrypted (has the format iv:encrypted:authTag)
 */
export function isEncrypted(data: string): boolean {
  return typeof data === 'string' && data.includes(':') && data.split(':').length === 3;
}
