export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function withBasePath(path?: string): string {
  if (!path) return '';
  if (/^(https?:|\/\/|data:)/i.test(path)) {
    return path;
  }
  if (!basePath) {
    return path;
  }
  if (path === basePath || path.startsWith(`${basePath}/`)) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
