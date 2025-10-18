import type { APIRoute } from 'astro';

// ✅ Secure credentials (In production, use environment variables)
const VALID_CREDENTIALS = {
  email: 'admin@umak.edu.ph',
  password: 'UMak2024!', // In production, use bcrypt hashed password
  name: 'Administrator'
};

// ✅ Generate secure session token
function generateSessionToken(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `${timestamp}-${random}`;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email and password are required'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check credentials
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
      // Generate session token
      const sessionToken = generateSessionToken();
      
      // Set httpOnly cookie (secure, cannot be accessed by JavaScript)
      cookies.set('session', sessionToken, {
        httpOnly: true,
        secure: true, // Only sent over HTTPS
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Login successful',
          user: {
            email: VALID_CREDENTIALS.email,
            name: VALID_CREDENTIALS.name
          }
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      // Invalid credentials
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid email or password'
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Server error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};