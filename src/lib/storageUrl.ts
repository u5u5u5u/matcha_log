function parseUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export function isVercelBlobStorageUrl(url: string): boolean {
  const parsed = parseUrl(url);
  return parsed?.hostname.endsWith("blob.vercel-storage.com") ?? false;
}

export function isSupabaseStorageObjectUrl(url: string): boolean {
  const parsed = parseUrl(url);
  if (!parsed) {
    return false;
  }

  return (
    parsed.hostname.endsWith(".supabase.co") &&
    parsed.pathname.startsWith("/storage/v1/object/")
  );
}

export function isSupportedRemoteStorageUrl(url: string): boolean {
  return isVercelBlobStorageUrl(url) || isSupabaseStorageObjectUrl(url);
}
