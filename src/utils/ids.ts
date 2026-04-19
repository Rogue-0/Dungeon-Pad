import * as Crypto from 'expo-crypto';

/** Generate a new UUID for database records */
export function generateId(): string {
  return Crypto.randomUUID();
}
