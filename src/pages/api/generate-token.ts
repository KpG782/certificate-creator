import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';

const JWT_SECRET = import.meta.env.JWT_SECRET || 'fallback-secret-change-in-production';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { eventId, eventName, registrationEnd } = body;

    if (!eventId || !eventName || !registrationEnd) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: eventId, eventName, registrationEnd' 
        }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Calculate expiration time
    const expiresAt = new Date(registrationEnd);
    const now = new Date();
    const expiresInSeconds = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);

    if (expiresInSeconds <= 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Registration end date must be in the future' 
        }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate JWT token
    const payload = {
      event_id: eventId,
      event_name: eventName,
      type: 'attendance',
      iss: 'umak-certificate-system',
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: expiresInSeconds,
    });

    // Generate attendance URL
    const baseUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';
    const attendanceUrl = `${baseUrl}/event/attend?token=${token}`;

    console.log('✅ JWT generated:', {
      eventId,
      eventName,
      expiresIn: `${Math.floor(expiresInSeconds / 3600)} hours`,
    });

    return new Response(
      JSON.stringify({ 
        token, 
        attendanceUrl,
        expiresAt: expiresAt.toISOString(),
      }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Token generation failed:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate token',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};