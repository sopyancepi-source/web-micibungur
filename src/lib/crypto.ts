/**
 * Simple cryptographic helper using Web Crypto API.
 * Runs entirely in the browser with no dependencies.
 */

export async function hashPin(pin: string): Promise<string> {
  if (!pin) return '';
  const msgBuffer = new TextEncoder().encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
