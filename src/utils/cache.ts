// Simple cache utility using sessionStorage
// Cache persists across page navigations within the same browser session

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cache = {
    set: <T>(key: string, data: T): void => {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now()
        };
        sessionStorage.setItem(key, JSON.stringify(entry));
    },

    get: <T>(key: string): T | null => {
        const item = sessionStorage.getItem(key);
        if (!item) return null;

        try {
            const entry: CacheEntry<T> = JSON.parse(item);
            const age = Date.now() - entry.timestamp;

            // Return cached data if it's still fresh
            if (age < CACHE_DURATION) {
                return entry.data;
            }

            // Cache expired, remove it
            sessionStorage.removeItem(key);
            return null;
        } catch {
            return null;
        }
    },

    invalidate: (key: string): void => {
        sessionStorage.removeItem(key);
    },

    clear: (): void => {
        sessionStorage.clear();
    }
};
