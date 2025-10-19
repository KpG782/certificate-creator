import type { APIRoute } from "astro";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  import.meta.env.JWT_SECRET || "fallback-secret-change-in-production";

export const POST: APIRoute = async ({ request }) => {
  // Set CORS headers for development
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid JSON in request body",
        }),
        { status: 400, headers }
      );
    }

    const { eventId, eventName, registrationEnd } = body;

    // Validate required fields
    if (!eventId || !eventName || !registrationEnd) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          required: ["eventId", "eventName", "registrationEnd"],
          received: { eventId, eventName, registrationEnd },
        }),
        { status: 400, headers }
      );
    }

    // Calculate expiration time
    const expiresAt = new Date(registrationEnd);
    const now = new Date();
    const expiresInSeconds = Math.floor(
      (expiresAt.getTime() - now.getTime()) / 1000
    );

    if (expiresInSeconds <= 0) {
      return new Response(
        JSON.stringify({
          error: "Registration end date must be in the future",
          registrationEnd,
          currentTime: now.toISOString(),
        }),
        { status: 400, headers }
      );
    }

    // Generate JWT token
    const payload = {
      event_id: eventId,
      event_name: eventName,
      type: "attendance",
      iss: "umak-certificate-system",
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: expiresInSeconds,
    });

    // Generate attendance URL
    const baseUrl = import.meta.env.PUBLIC_SITE_URL || "http://localhost:4321";
    const attendanceUrl = `${baseUrl}/event/attend?token=${token}`;

    console.log("✅ JWT generated successfully:", {
      eventId,
      eventName,
      expiresIn: `${Math.floor(expiresInSeconds / 3600)} hours`,
      baseUrl,
    });

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
    console.error("❌ Token generation failed:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate token",
        details: error instanceof Error ? error.message : "Unknown error",
        stack:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.stack
              : undefined
            : undefined,
      }),
      { status: 500, headers }
    );
  }
};

// Handle OPTIONS for CORS preflight
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
