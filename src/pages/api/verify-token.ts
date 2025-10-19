// src/pages/api/verify-token.ts
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const jwt = await import("jsonwebtoken");
  const JWT_SECRET =
    import.meta.env.JWT_SECRET || "fallback-secret-change-in-production";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return new Response(
        JSON.stringify({ valid: false, error: "Token is required" }),
        { status: 400, headers }
      );
    }

    // Verify token
    const verify = jwt.default?.verify || jwt.verify;
    const decoded = verify(token, JWT_SECRET, {
      issuer: "umak-certificate-system",
    });

    console.log("✅ Token verified:", decoded);

    return new Response(JSON.stringify({ valid: true, data: decoded }), {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("❌ Token verification failed:", error);

    let errorMessage = "Invalid token";
    if (error?.name === "TokenExpiredError") {
      errorMessage = "Token has expired";
    } else if (error?.name === "JsonWebTokenError") {
      errorMessage = "Invalid token format";
    }

    return new Response(JSON.stringify({ valid: false, error: errorMessage }), {
      status: 401,
      headers,
    });
  }
};
