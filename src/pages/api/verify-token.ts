import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';

const JWT_SECRET = import.meta.env.JWT_SECRET || 'fallback-secret-change-in-production';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return new Response(
        JSON.stringify({ 
          valid: false,
          error: 'Token is required' 
        }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    console.log('✅ Token verified:', decoded);

    return new Response(
      JSON.stringify({ 
        valid: true,
        data: decoded
      }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Token verification failed:', error);
    
    let errorMessage = 'Invalid token';
    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'Token has expired';
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = 'Invalid token format';
    }

    return new Response(
      JSON.stringify({ 
        valid: false,
        error: errorMessage
      }), 
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};