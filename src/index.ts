import { ClientIdClaim, UserInfoEndpoint } from "./cognito";
import { createMatcher, getClaimsUnsafe } from "./helpers";

const handleUserInfoRequest: NonNullable<ExportedHandler<Env>["fetch"]> = async (
  request,
  env,
  ctx
) => {
  // bypass worker
  const pResponse = fetch(request);
  const token = request.headers.get("authorization")?.split("Bearer ")[1];
  if (!token) return pResponse;
  const claims = getClaimsUnsafe(token);
  const matcher = createMatcher({
    includes: env.USERINFO_FIX_CLIENTS || "",
    excludes: env.USERINFO_FIX_EXCLUDES || "",
  });
  if (!matcher(claims[ClientIdClaim] || "")) return pResponse;
  const response = await pResponse;

  if (!(response.headers.get("content-type") || "").startsWith("application/json")) return response;
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
};

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const u = new URL(request.url);
    if (u.pathname === UserInfoEndpoint) {
      return handleUserInfoRequest(request, env, ctx);
    }
    return fetch(request);
  },
} satisfies ExportedHandler<Env>;
