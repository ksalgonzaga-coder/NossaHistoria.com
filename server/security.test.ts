import { describe, it, expect, beforeEach } from 'vitest';
import { encryptData, decryptData, isEncrypted } from './encryption';
import { checkRateLimit, resetRateLimit } from './rate-limit';

describe('Security Features', () => {
  describe('Encryption (AES-256-GCM)', () => {
    it('should encrypt and decrypt data correctly', () => {
      const originalData = 'sensitive@email.com';
      const encrypted = encryptData(originalData);
      
      expect(encrypted).not.toBe(originalData);
      expect(isEncrypted(encrypted)).toBe(true);
      
      const decrypted = decryptData(encrypted);
      expect(decrypted).toBe(originalData);
    });

    it('should produce different ciphertexts for same plaintext (due to random IV)', () => {
      const data = 'test@example.com';
      const encrypted1 = encryptData(data);
      const encrypted2 = encryptData(data);
      
      expect(encrypted1).not.toBe(encrypted2);
      
      // But both should decrypt to same value
      expect(decryptData(encrypted1)).toBe(data);
      expect(decryptData(encrypted2)).toBe(data);
    });

    it('should handle special characters in encryption', () => {
      const specialData = 'test!@#$%^&*()_+-=[]{}|;:,.<>?';
      const encrypted = encryptData(specialData);
      const decrypted = decryptData(encrypted);
      
      expect(decrypted).toBe(specialData);
    });

    it('should throw error on invalid encrypted data', () => {
      expect(() => decryptData('invalid:data')).toThrow();
      expect(() => decryptData('single')).toThrow();
    });
  });

  describe('Rate Limiting', () => {
    beforeEach(() => {
      resetRateLimit('test@example.com');
    });

    it('should allow requests within limit', () => {
      const key = 'test@example.com';
      
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(key, 5, 60000);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(4 - i);
      }
    });

    it('should block requests exceeding limit', () => {
      const key = 'test@example.com';
      
      // Make 5 allowed requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit(key, 5, 60000);
      }
      
      // 6th request should be blocked
      const result = checkRateLimit(key, 5, 60000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after time window expires', (done) => {
      const key = 'test@example.com';
      const windowMs = 100; // 100ms for testing
      
      // Make 5 requests (max)
      for (let i = 0; i < 5; i++) {
        checkRateLimit(key, 5, windowMs);
      }
      
      // Should be blocked
      let result = checkRateLimit(key, 5, windowMs);
      expect(result.allowed).toBe(false);
      
      // Wait for window to expire
      setTimeout(() => {
        result = checkRateLimit(key, 5, windowMs);
        expect(result.allowed).toBe(true);
        done();
      }, 150);
    });

    it('should track different keys separately', () => {
      const key1 = 'user1@example.com';
      const key2 = 'user2@example.com';
      
      // Max out key1
      for (let i = 0; i < 5; i++) {
        checkRateLimit(key1, 5, 60000);
      }
      
      // key1 should be blocked
      expect(checkRateLimit(key1, 5, 60000).allowed).toBe(false);
      
      // key2 should still be allowed
      expect(checkRateLimit(key2, 5, 60000).allowed).toBe(true);
    });

    it('should return reset time', () => {
      const key = 'test@example.com';
      const result = checkRateLimit(key, 5, 60000);
      
      expect(result.resetTime).toBeGreaterThan(Date.now());
      expect(result.resetTime - Date.now()).toBeLessThanOrEqual(60000);
    });
  });
});
