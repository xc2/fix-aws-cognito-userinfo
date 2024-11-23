export default {
  async fetch(request, env, ctx): Promise<Response> {
    const u = new URL(request.url);
    if (u.pathname === "/oauth2/userInfo") {
      // bypass worker
      const response = await fetch(request);
      if ((response.headers.get("content-type") || "").startsWith("application/json")) {
        const j = (await response.json()) as any;
        if (typeof j.email_verified === "string") {
          j.email_verified = j.email_verified === "true";
        }
        if (typeof j.phone_verified === "string") {
          j.phone_verified = j.phone_verified === "true";
        }
        const headers = new Headers(response.headers);
        headers.delete("content-length");
        headers.delete("content-encoding");
        return new Response(JSON.stringify(j), {
          headers,
          status: response.status,
          statusText: response.statusText,
        });
      }
      return response;
    }
    return fetch(request);
  },
} satisfies ExportedHandler<Env>;
