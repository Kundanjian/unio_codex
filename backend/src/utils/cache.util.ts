import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default TTL
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false
});

export const cacheUtil = {
  get<T>(key: string): T | undefined {
    return cache.get<T>(key);
  },

  set<T>(key: string, value: T, ttl?: number): boolean {
    return cache.set(key, value, ttl ?? 300);
  },

  del(key: string): number {
    return cache.del(key);
  },

  delByPattern(pattern: string): void {
    const keys = cache.keys();
    const matchingKeys = keys.filter((key) => key.includes(pattern));
    if (matchingKeys.length > 0) {
      cache.del(matchingKeys);
    }
  },

  flushAll(): void {
    cache.flushAll();
  },

  getStats() {
    return cache.getStats();
  }
};
