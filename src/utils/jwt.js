// src/utils/jwt.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = import.meta.env.JWT_SECRET || 'fallback-secret-change-in-production';

/**
 * Generate JWT token for event QR code
 * @param {string} eventId - Unique event identifier
 * @param {string} eventName - Name of the event
 * @param {Date} expiresAt - When the token should expire
 * @returns {string} JWT token
 */
export function generateEventToken(eventId, eventName, expiresAt) {
  const payload = {
    event_id: eventId,
    event_name: eventName,
    type: 'attendance'
  };

  const options = {
    expiresIn: Math.floor((expiresAt.getTime() - Date.now()) / 1000), // seconds until expiration
    issuer: 'umak-certificate-system'
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verify and decode JWT token from QR code
 * @param {string} token - JWT token to verify
 * @returns {object|null} Decoded payload or null if invalid
 */
export function verifyEventToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'umak-certificate-system'
    });
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

/**
 * Generate attendance URL for QR code
 * @param {string} token - JWT token
 * @returns {string} Full URL for attendance page
 */
export function generateAttendanceUrl(token) {
  const baseUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';
  return `${baseUrl}/event/attend?token=${token}`;
}