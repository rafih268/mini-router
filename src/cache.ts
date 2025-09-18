const { RedisCache } = require('redis-caching-manager');

export const cacheManager = new RedisCache();

(async () => {
  await cacheManager.connect({
    url: 'redis://localhost:6379',
    ttl: 3600,
    prefix: "auth",
    enable: true,
  });
})();