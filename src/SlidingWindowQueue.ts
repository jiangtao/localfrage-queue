import localforage from 'localforage';

localforage.setDriver([localforage.INDEXEDDB, localforage.LOCALSTORAGE, localforage.WEBSQL]);

export class SlidingWindowQueue {
    private size: number;
    private storageInstance: LocalForage;
    private defaultItems: unknown[] = [];

    /**
     * 构造函数
     * @param size 队列的最大长度
     * @param name 用于创建 localforage 实例的名称
     */
    constructor(size: number, name: string) {
        this.size = size;
        this.storageInstance = localforage.createInstance({
            name,
        });
    }

    /**
     * 初始化方法，用于在 localforage 中创建一个新的队列（如果它还不存在）
     * @param key 用于在 localforage 中存储队列的键
     */
    async init(key: string): Promise<void> {
        try {
            const items = await this.storageInstance.getItem(key);
            if (!items) {
                await this.storageInstance.setItem(key, this.defaultItems);
            }
        } catch (error) {
            console.error('Failed to initialize the queue:', error);
        }
    }

    /**
     * 入队方法，将一个新的元素添加到队列的末尾
     * 如果队列已满（即达到了设定的最大长度），则会先移除队列头部的元素
     * @param item 要添加到队列的元素
     * @param key 用于在 localforage 中存储队列的键
     */
    async enqueue(key: string, item: any): Promise<void> {
        try {
            const items: any[] = await this.storageInstance.getItem(key) || this.defaultItems;

            if (items.length >= this.size) {
                items.shift();
            }
            items.push(item);
            await this.storageInstance.setItem(key, items);
        } catch (error) {
            console.error('Failed to enqueue item:', error);
            throw error;
        }
    }

    async getHead (key: string) {
        try {
            const items = await this.getItems(key);
            return items[0]
        } catch (error) {
            console.error('Failed to enqueue item:', error);
            throw error;
        }
    }

    async getTail (key: string) {
        try {
            const items = await this.getItems(key);
            return items[items.length - 1]
        } catch (error) {
            console.error('Failed to enqueue item:', error);
            throw error;
        }
    }

    async pushHead(key: string, item: any): Promise<void> {
        try {
            const items: any[] = await this.storageInstance.getItem(key) || this.defaultItems;

            if (items.length >= this.size) {
                items.pop();
            }
            items.unshift(item);
            await this.storageInstance.setItem(key, items);
        } catch (error) {
            console.error('Failed to enqueue item:', error);
            throw error;
        }
    }

    /**
     * 出队方法，移除队列头部的元素
     * @param key 用于在 localforage 中存储队列的键
     */
    async dequeue(key: string): Promise<void> {
        try {
            const items: any[] = await this.storageInstance.getItem(key) || this.defaultItems
            if (items.length > 0) {
                items.shift();
                await this.storageInstance.setItem(key, items);
            }
        } catch (error) {
            console.error('Failed to dequeue item:', error);
            throw error;
        }
    }

    /**
     * 获取队列中的所有元素
     * @param key 用于在 localforage 中存储队列的键
     * @return 队列中的所有元素组成的数组
     */
    async getItems(key: string): Promise<any[]> {
        try {
            return await this.storageInstance.getItem(key) || this.defaultItems;
        } catch (error) {
            console.error('Failed to get items:', error);
            throw error;
        }
    }
}
