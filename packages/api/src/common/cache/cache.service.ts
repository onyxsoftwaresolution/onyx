import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cache: Cache) { }

    async set(key: string, value: any, ttl?: number): Promise<any> {
        return this.cache.set(key, value, ttl);
    }

    async get(key: string): Promise<any> {
        return this.cache.get(key);
    }

    async delete(key: string): Promise<any> {
        return this.cache.del(key);
    }
}
