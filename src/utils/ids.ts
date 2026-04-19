import { v4 as uuidv4 } from 'uuid';

/** Generate a new UUID for database records */
export function generateId(): string {
  return uuidv4();
}
