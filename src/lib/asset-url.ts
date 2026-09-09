const LOVABLE_ASSET_ORIGIN = "https://weddingjessicaerillan.lovable.app";

export function assetUrl(url: string) {
  return url.startsWith("/__l5e/") ? `${LOVABLE_ASSET_ORIGIN}${url}` : url;
}
