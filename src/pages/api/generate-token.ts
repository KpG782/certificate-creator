// src/pages/api/generate-token.ts
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    // Dynamic import to avoid SSR issues
    const jwt = await import("jsonwebtoken");
    const JWT_SECRET =
      import.meta.env.JWT_SECRET || "fallback-secret-change-in-production";

    const body = await request.json();
    console.log("📥 Received:", body);

    const { eventId, eventName, registrationEnd } = body;

    if (!eventId || !eventName || !registrationEnd) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers }
      );
    }

    const expiresAt = new Date(registrationEnd);
    const now = new Date();
    const expiresInSeconds = Math.floor(
      (expiresAt.getTime() - now.getTime()) / 1000
    );

    if (expiresInSeconds <= 0) {
      return new Response(
        JSON.stringify({ error: "Registration end must be in the future" }),
        { status: 400, headers }
      );
    }

    const payload = {
      event_id: eventId,
      event_name: eventName,
      type: "attendance",
      iss: "umak-certificate-system",
    };

    // Handle both CommonJS and ES module exports
    const jwtSign = jwt.default?.sign || jwt.sign;

    if (typeof jwtSign !== "function") {
      throw new Error("JWT sign function not available");
    }

    const token = jwtSign(payload, JWT_SECRET, {
      expiresIn: expiresInSeconds,
    });

    const baseUrl =
      import.meta.env.PUBLIC_SITE_URL ||
      (import.meta.env.DEV
        ? "http://localhost:4321"
        : "https://certificate-creator-gules.vercel.app");
    const attendanceUrl = `${baseUrl}/event/attend?token=${token}`;

    console.log("✅ Token generated successfully");

    return new Response(
      JSON.stringify({
        success: true,
        token,
        attendanceUrl,
        expiresAt: expiresAt.toISOString(),
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
