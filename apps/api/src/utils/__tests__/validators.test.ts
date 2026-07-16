// apps/api/src/utils/__tests__/validators.test.ts
/**
 * Unit tests for validator utility functions
 * Run with: npm test
 */

import {
  validateEmail,
  validatePhone,
  validateDate,
  sanitizeInput,
  generateSlug,
} from '../validators';

describe('Validators', () => {
  describe('validateEmail()', () => {
    it('should validate correct email format', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('john.doe@company.co.uk')).toBe(true);
      expect(validateEmail('veterinaria@lacodorniz.com')).toBe(true);
    });

    it('should reject invalid email format', () => {
      expect(validateEmail('invalid.email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePhone()', () => {
    it('should validate valid phone numbers', () => {
      expect(validatePhone('1234567')).toBe(true);
      expect(validatePhone('+1-555-123-4567')).toBe(true);
      expect(validatePhone('(555) 123-4567')).toBe(true);
      expect(validatePhone('+525551234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abcdefg')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });
  });

  describe('validateDate()', () => {
    it('should validate future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      expect(validateDate(futureDate.toISOString())).toBe(true);
    });

    it('should reject past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(validateDate(pastDate.toISOString())).toBe(false);
    });

    it('should reject invalid dates', () => {
      expect(validateDate('not-a-date')).toBe(false);
      expect(validateDate('')).toBe(false);
    });
  });

  describe('sanitizeInput()', () => {
    it('should remove HTML-like characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        'scriptalert("xss")/script'
      );
      expect(sanitizeInput('Normal <input> text')).toBe('Normal input text');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });
  });

  describe('generateSlug()', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('Veterinaria La Codorniz')).toBe(
        'veterinaria-la-codorniz'
      );
      expect(generateSlug('Test 123')).toBe('test-123');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Hello@World#123')).toBe('helloworld123');
      expect(generateSlug('Test & Demo')).toBe('test-demo');
    });
  });
});
