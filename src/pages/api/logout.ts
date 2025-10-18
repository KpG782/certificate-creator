import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies }) => {
  // Clear session cookie
  cookies.delete("session", {
    path: "/",
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: "Logged out successfully",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
