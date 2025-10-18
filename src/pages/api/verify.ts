import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
  const sessionToken = cookies.get("session")?.value;

  if (sessionToken) {
    // In production, verify token against database or JWT
    return new Response(
      JSON.stringify({
        authenticated: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } else {
    return new Response(
      JSON.stringify({
        authenticated: false,
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
