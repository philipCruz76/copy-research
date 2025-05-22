import { DocumentChunk, DocumentData, Document } from "@prisma/client";

// Document cache implementation
const documentCache = new Map<
  string,
  {
    document: Document & {
      chunks: DocumentChunk[];
      documentData: DocumentData[];
    };
    timestamp: number;
    expiresIn: number;
  }
>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL by default

// Cache statistics
const cacheStats = {
  hits: 0,
  misses: 0,
  size: () => documentCache.size,
};

export const getDocumentFromCache = (documentId: string) => {
  const cached = documentCache.get(documentId);

  if (!cached) {
    cacheStats.misses++;
    return null;
  }

  // Check if cache has expired
  if (Date.now() > cached.timestamp + cached.expiresIn) {
    documentCache.delete(documentId);
    cacheStats.misses++;
    return null;
  }

  cacheStats.hits++;
  return cached.document;
};

export const storeDocumentInCache = (
  documentId: string,
  document: Document & {
    chunks: DocumentChunk[];
    documentData: DocumentData[];
  },
  ttl: number = CACHE_TTL,
) => {
  documentCache.set(documentId, {
    document,
    timestamp: Date.now(),
    expiresIn: ttl,
  });

  return document;
};

export const clearExpiredCache = () => {
  const now = Date.now();
  let cleared = 0;

  for (const [key, value] of documentCache.entries()) {
    if (now > value.timestamp + value.expiresIn) {
      documentCache.delete(key);
      cleared++;
    }
  }

  return { cleared, remaining: documentCache.size };
};

export const getCacheStats = () => {
  return {
    ...cacheStats,
    size: cacheStats.size(),
    hitRate:
      cacheStats.hits + cacheStats.misses > 0
        ? cacheStats.hits / (cacheStats.hits + cacheStats.misses)
        : 0,
  };
};

// Auto-cleanup expired cache entries every 15 minutes
if (typeof setInterval !== "undefined") {
  setInterval(clearExpiredCache, 15 * 60 * 1000);
}
