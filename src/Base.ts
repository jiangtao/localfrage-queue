import localforage  from 'localforage';

localforage.setDriver([localforage.INDEXEDDB, localforage.LOCALSTORAGE, localforage.WEBSQL]);
export default class BaseLocalForage {
    public storageInstance: LocalForage;
    safeRemaining: number = 5 * 1024 * 1024;
    constructor(name: string) {
        this.storageInstance = localforage.createInstance({
            name,
        });
    }

    public async getRemaining (): Promise<number | boolean> {
        if (navigator.storage && navigator.storage.estimate) {
            const quota = await navigator.storage.estimate();
            if (typeof quota.quota === 'number' && typeof quota.usage === 'number'){
                return quota.quota - quota.usage;
            }

        }
        console.warn('navigator.storage.estimate not supported')
        return false
    }

    public isQuotaExceededError(err: any) {
        return err && err.name === 'QuotaExceededError'
    }

    public async isUnSafeRemain () {
        const remaining = await this.getRemaining()
        if (remaining === false) {
            return false
        }
        if (typeof remaining == 'number') {
            return remaining <= this.safeRemaining
        }
    }
}
