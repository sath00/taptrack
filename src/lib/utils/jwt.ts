/**
 * Decode a JWT token without verification
 */
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Check if a JWT token is expired
 * @param token - JWT token string
 * @param bufferSeconds - Add buffer time before actual expiry (default: 60s)
 */
export function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) {
    return true // Consider invalid tokens as expired
  }

  const currentTime = Math.floor(Date.now() / 1000)
  return decoded.exp - bufferSeconds < currentTime
}

/**
 * Get token expiration time in seconds
 */
export function getTokenExpiration(token: string): number | null {
  const decoded = decodeJWT(token)
  return decoded?.exp || null
}