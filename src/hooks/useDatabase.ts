import { useEffect, useState } from 'react';

import { getDatabase } from '@/db/database';

/** Hook that initializes the database on mount. Returns true when ready. */
export function useDatabase(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getDatabase()
      .then(() => setReady(true))
      .catch((err) => console.error('Database init failed:', err));
  }, []);

  return ready;
}
