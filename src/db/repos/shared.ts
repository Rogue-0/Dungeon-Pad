/** ISO 8601 timestamp for created_at / updated_at columns. */
export function nowIso(): string {
  return new Date().toISOString();
}
