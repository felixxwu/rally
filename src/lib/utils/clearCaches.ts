import { caches } from '../../refs';

export function clearCaches() {
  caches.forEach(cache => {
    cache.current = cache.initial;
  });
}
