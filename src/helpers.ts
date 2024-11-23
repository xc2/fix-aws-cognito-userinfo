export function getClaimsUnsafe(token: string) {
  const [, payload] = token.split(".");
  return JSON.parse(atob(payload)) as any;
}

export function createMatcher({
  includes: includesString,
  excludes: excludesString,
}: { includes: string; excludes: string }) {
  const includes = includesString
    .split(/[,; ]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const excludes = excludesString
    .split(/[,; ]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const matches = Object.create(null);
  const defaults = includes.length === 0;
  for (const inc of includes) {
    matches[inc] = true;
  }
  for (const exc of excludes) {
    matches[exc] = false;
  }
  return (item: string) => {
    return matches[item] ?? defaults;
  };
}
