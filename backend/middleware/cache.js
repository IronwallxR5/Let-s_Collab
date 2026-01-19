const { cache } = require('../config/redis');

// Cache middleware for GET requests
const cacheMiddleware = (keyPrefix, ttl = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      // Generate cache key from route and params/query/user
      let cacheKey;
      
      // Include user ID in cache key for authenticated routes
      const userId = req.user?.id || req.user?.userId;
      
      if (req.params.id || req.params.boardId) {
        cacheKey = `${keyPrefix}:${req.params.id || req.params.boardId}${userId ? `:user:${userId}` : ''}`;
      } else if (req.query.userId) {
        cacheKey = `${keyPrefix}:${req.query.userId}`;
      } else if (userId) {
        // For routes like /users/me, include the user ID
        cacheKey = `${keyPrefix}:${userId}`;
      } else {
        cacheKey = `${keyPrefix}:default`;
      }
      
      console.log(`[Cache] Checking: ${cacheKey}`);
      
      // Try to get cached data
      const cachedData = await cache.get(cacheKey);
      
      if (cachedData) {
        console.log(`Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }

      console.log(`Cache MISS: ${cacheKey}`);
      
      // Store original res.json function
      const originalJson = res.json.bind(res);
      
      // Override res.json to cache the response
      res.json = (data) => {
        // Cache the response data
        cache.set(cacheKey, data, ttl).then(() => {
          console.log(`💾 Cached: ${cacheKey} (TTL: ${ttl}s)`);
        }).catch(err => {
          console.error('Failed to cache response:', err.message);
        });
        
        // Send the response
        return originalJson(data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Middleware to invalidate cache
const invalidateCache = (patterns) => {
  return async (req, res, next) => {
    try {
      // Delete cache patterns after response is sent
      res.on('finish', async () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const userId = req.user?.id || req.user?.userId;
          console.log(`[Cache Invalidation] Status: ${res.statusCode}, User: ${userId || 'none'}`);
          
          for (const pattern of patterns) {
            // Build cache pattern - handle wildcards properly
            let cachePattern;
            if (pattern.includes('*')) {
              // Pattern already has wildcard, just use it
              cachePattern = pattern;
            } else {
              // Replace specific placeholders
              cachePattern = pattern
                .replace('{id}', req.params?.id || '*')
                .replace('{boardId}', req.params?.boardId || '*')
                .replace('{userId}', userId || req.body?.userId || req.params?.userId || req.query?.userId || '*');
            }
            
            await cache.delPattern(cachePattern);
            console.log(`🗑️  Cache invalidated: ${cachePattern}`);
          }
        }
      });
      
      next();
    } catch (error) {
      console.error('Cache invalidation error:', error);
      next();
    }
  };
};

module.exports = {
  cacheMiddleware,
  invalidateCache
};
